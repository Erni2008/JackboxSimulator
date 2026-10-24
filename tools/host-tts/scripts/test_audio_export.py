import tempfile
import unittest
import wave
from pathlib import Path
from audio_export import export_vorbis, probe


class AudioExportTest(unittest.TestCase):
    def test_real_vorbis_exports_and_existing_output_protection(self):
        # Codec fixture only: never installed as host narration or a voice reference.
        import math
        import struct
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            source = root/'fixture.wav'
            with wave.open(str(source), 'wb') as audio:
                audio.setnchannels(1)
                audio.setsampwidth(2)
                audio.setframerate(24000)
                audio.writeframes(b''.join(struct.pack('<h', int(4000*math.sin(i*.1))) for i in range(24000)))
            original = source.read_bytes()
            for bitrate in (64, 96, 128):
                target = root/f'{bitrate}.ogg'
                export_vorbis(source, target, bitrate)
                stream, duration = probe(target)
                self.assertEqual(stream['codec_name'], 'vorbis')
                self.assertEqual(stream['channels'], 1)
                self.assertEqual(int(stream['bit_rate']), bitrate*1000)
                self.assertAlmostEqual(duration, 1, places=2)
                with self.assertRaises(FileExistsError):
                    export_vorbis(source, target, bitrate)
            self.assertEqual(source.read_bytes(), original)
            with self.assertRaises(ValueError):
                export_vorbis(root/'96.ogg', root/'reencoded.ogg')
            with self.assertRaises(ValueError):
                export_vorbis(source, root/'invalid.ogg', 12)


if __name__ == '__main__':
    unittest.main()
