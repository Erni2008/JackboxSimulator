import * as esbuild from 'esbuild';
import {fileURLToPath} from 'node:url';
import {dirname} from 'node:path';
const root=dirname(fileURLToPath(import.meta.url));
const common={absWorkingDir:root,bundle:true,loader:{'.glsl':'text'},format:'esm',sourcemap:true,logLevel:'info'};
const contexts=await Promise.all([
  esbuild.context({...common,entryPoints:{app:'src/main.ts','audio-test':'src/audio-test.ts'},outdir:'../web/last-command-3d'}),
  // THE BROKEN ELEVATOR: engineer's manual test scene
  esbuild.context({...common,entryPoints:{app:'src/broken-elevator-manual.ts'},outdir:'../web/broken-elevator-manual',minify:true}),
  esbuild.context({...common,entryPoints:{app:'src/hell-cage-host.ts'},outdir:'../web/hell-cage-host',minify:true}),
]);
if(process.argv.some(x=>x.startsWith('--watch'))){await Promise.all(contexts.map(c=>c.watch()));await new Promise(()=>{});}else{try{await Promise.all(contexts.map(c=>c.rebuild()));}finally{await Promise.all(contexts.map(c=>c.dispose()));}}
