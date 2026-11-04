// Bakes the procedural leather and cage maps of THE BROKEN ELEVATOR into JPEGs so the game
// downloads them instead of compositing per pixel at start-up.
// URL=http://localhost:PORT/broken-elevator-manual/ PLAYWRIGHT_MODULE=... CHROME_PATH=... node tools/assets/bake_broken_elevator_textures.cjs
const fs=require('fs'),path=require('path');const {chromium}=require(process.env.PLAYWRIGHT_MODULE);
const out=path.join(__dirname,'../../web/broken-elevator-manual/textures/baked');
(async()=>{const b=await chromium.launch({executablePath:process.env.CHROME_PATH,args:['--use-angle=metal']});const p=await b.newPage();
await p.goto(process.env.URL+'?bake=1&quality=high');await p.waitForFunction(()=>window.__manual,null,{timeout:180000});
const maps=await p.evaluate(()=>Object.fromEntries(Object.entries(window.__bakedOut).map(([k,c])=>[k,c.toDataURL('image/jpeg',k.endsWith('normal')?.95:.9)])));
fs.mkdirSync(out,{recursive:true});for(const [k,d] of Object.entries(maps)){fs.writeFileSync(path.join(out,k+'.jpg'),Buffer.from(d.split(',')[1],'base64'));console.log('baked',k);}
await b.close();})();
