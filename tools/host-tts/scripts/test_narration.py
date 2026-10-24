import contextlib
import fcntl
import io
import json
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch

import narration


class NarrationTest(unittest.TestCase):
    def test_real_catalog_and_spoken_text_hash(self):
        entries = narration.catalog()
        questions = [e for e in entries if e['kind']=='questions']
        self.assertEqual(len(questions),12)
        self.assertEqual(questions[0]['id'],'solar-largest')
        self.assertEqual(len([e for e in entries if e['kind']=='events']),8)
        intro={e['id']:e for e in entries if e['kind']=='intro'}
        self.assertEqual(intro['intro_02_01']['spokenText'],'Точно.')
        self.assertEqual(intro['intro_02_01']['emotion'],'NEUTRAL')
        self.assertEqual(intro['intro_02_01b']['generation'],{'seed':3,'temperature':.8})
        original = questions[0]
        changed = dict(original,spokenText='Проверка произношения: Юпитер.')
        self.assertNotEqual(narration.content_hash(original,'voice-v1'),narration.content_hash(changed,'voice-v1'))
        self.assertNotEqual(narration.content_hash(original,'voice-v1'),narration.content_hash(original,'voice-v2'))

    def test_manifest_excludes_flagged_jobs_and_progress_does_not_take_gpu_lock(self):
        with tempfile.TemporaryDirectory() as directory:
            root=Path(directory);tool=root/'tools/host-tts';(tool/'config').mkdir(parents=True)
            with patch.object(narration,'ROOT',root),patch.object(narration,'TOOL',tool):
                db=narration.database()
                db.execute("INSERT INTO jobs(kind,id,hash,status,file,duration) VALUES('questions','q1','h1','ready','questions/q1.ogg',3)")
                db.execute("INSERT INTO jobs(kind,id,hash,status,file,duration) VALUES('questions','q2','h2','review','questions/q2.ogg',4)")
                db.execute("INSERT INTO jobs(kind,id,hash,status) VALUES('events','e1','h3','failed')")
                db.commit()
                narration.export_manifest(db,{'locale':'ru','voiceId':'approved-v1'},'profile')
                manifest=json.loads((root/'assets/audio/host/ru/manifest.json').read_text())
                self.assertEqual(list(manifest['questions']),['q1'])
                self.assertEqual(manifest['events'],{})
                self.assertFalse((root/'assets/audio/host/ru/manifest.json.tmp').exists())
                with (tool/'config/generation.lock').open('a') as lock:
                    fcntl.flock(lock,fcntl.LOCK_EX|fcntl.LOCK_NB)
                    output=io.StringIO()
                    with patch.object(narration,'catalog',return_value=[{},{},{}]),patch('sys.argv',['narration.py','progress']),contextlib.redirect_stdout(output):
                        narration.main()
                    result=json.loads(output.getvalue())
                    self.assertEqual(result,dict(total=3,completed=1,remaining=2,failed=1,flagged=1))
                db.close()


if __name__=='__main__':
    unittest.main()
