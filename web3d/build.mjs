import * as esbuild from 'esbuild';
import {fileURLToPath} from 'node:url';
import {dirname} from 'node:path';
const ctx=await esbuild.context({absWorkingDir:dirname(fileURLToPath(import.meta.url)),entryPoints:{app:'src/main.ts','audio-test':'src/audio-test.ts'},bundle:true,loader:{'.glsl':'text'},format:'esm',sourcemap:true,outdir:'../web/last-command-3d',logLevel:'info'});
if(process.argv.some(x=>x.startsWith('--watch'))){await ctx.watch();await new Promise(()=>{});}else{try{await ctx.rebuild();}finally{await ctx.dispose();}}
