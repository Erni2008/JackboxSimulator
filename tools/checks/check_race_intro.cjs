// Visual/behaviour QA: live 3D rules flyover, all four maps, narration, skip and unchanged gameplay clock.
const {chromium} = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const fs = require('node:fs');
const script=require('../../web3d/src/games/race/intro-script.json');
const duration=script.formats.DEATH_RUN.filmDuration;
const shift=duration-script.duration;
const sparkAt=script.beats.at(-1).at+shift+1;
const out = process.env.OUT || '/tmp/race-intro-qa'; fs.mkdirSync(out, {recursive:true});
(async () => {
  const browser = await chromium.launch({headless:true, args:['--use-angle=metal','--ignore-gpu-blocklist']});
  const errors = [], reports = [];
  try {
    for (const map of [1,2,3,4]) {
      const page = await browser.newPage({viewport:{width:map === 2 ? 390 : 1280,height:map === 2 ? 844 : 720}});
      page.on('pageerror', e => errors.push(e.message));
      page.on('response', r => {if (r.status() >= 400) errors.push(`${r.status()} ${r.url()}`);});
      await page.goto(`${process.env.BASE || 'http://127.0.0.1:18312'}/race/?map=${map}&seed=42&skin=a&introAt=${sparkAt}`);
      await page.click('#roster button:first-child');
      await page.waitForFunction(() => window.__race?.introT >= 0, {timeout:120000});
      const before = await page.evaluate(() => {
        const a=window.__race; return {map:a.course.map, intro:a.introT, clock:a.clock, courseTime:a.course.time, title:document.querySelector('#intro-title').textContent, example:!document.querySelector('#intro-example').hidden,camera:a.camera.position.toArray()};
      });
      if (!before.example || before.clock !== 0 || before.courseTime !== 0) throw Error(`Intro advanced gameplay or missing spark: ${JSON.stringify(before)}`);
      await page.waitForFunction(()=>document.querySelector('#intro').getAnimations({subtree:true}).every(a=>a.playState==='finished'));
      await page.screenshot({path:`${out}/map-${map}-spark.png`});
      const moving = await page.evaluate(() => window.__race.camera.position.toArray());
      await page.evaluate(t=>{const u=new URL(location.href);u.searchParams.set('introAt',String(t));history.replaceState(null,'',u);},sparkAt+.3);
      await page.waitForFunction(t=>Math.abs(window.__race.introT-t)<.01,sparkAt+.3);
      const next=await page.evaluate(()=>window.__race.camera.position.toArray());
      if(Math.hypot(...next.map((x,i)=>x-moving[i]))<.5)throw Error('Camera stalled during the spark narration');
      const times = map === 1 ? [1,...script.beats.slice(1).map((b,k)=>b.at+.7+(k===script.beats.length-2?shift:0)),duration-.5] : [script.beats[1].at+.7,script.beats[2].at+.7];
      for (const t of times) {
        await page.evaluate(t => {const u=new URL(location.href);u.searchParams.set('introAt',String(t));history.replaceState(null,'',u);},t);
        await page.waitForFunction(t=>Math.abs(window.__race.introT-t)<.01,t);
        await page.waitForFunction(()=>document.querySelector('#intro').getAnimations({subtree:true}).every(a=>a.playState==='finished'));
      await page.screenshot({path:`${out}/map-${map}-${t}.png`});
      }
      await page.click('#intro-skip');
      await page.waitForFunction(()=>document.querySelector('#intro').hidden && !document.body.classList.contains('intro-on'));
      const after=await page.evaluate(()=>({clock:window.__race.clock,courseTime:window.__race.course.time,fov:window.__race.camera.fov,moodRestored:!window.__race.rulesIntro.presentation && !window.__race.snd.cinematic,scissor:window.__race.renderer.getScissorTest(),filter:getComputedStyle(document.querySelector('#stage canvas')).filter}));
      if (!after.moodRestored || after.scissor || after.filter!=='none') throw Error('Film presentation leaked into gameplay');
      if (after.clock > 3.5 || after.courseTime > 3.5) throw Error('Skip fast-forwarded the game');
      if (map === 1) {
        // Exercise the real frame loop with a controllable shared clock, including the countdown after the film.
        await page.evaluate(duration => {const a=window.__race; a.introSkipped=false; window.__introNow=1000; window.__introStart=(duration+1)*1000; a.net={selfId:a.me.id,spectator:false,startAt:window.__introStart,serverNow:()=>window.__introNow,send:()=>{}};},duration);
        await page.waitForFunction(()=>window.__race.introT>0 && window.__race.introT<4);
        await page.evaluate(()=>window.__introNow=window.__introStart-2000);
        await page.waitForFunction(()=>document.querySelector('#intro').hidden && window.__race.clock>0 && window.__race.clock<3.5);
        const countdown=await page.locator('#count').textContent(); if (!countdown) throw Error('Missing online countdown after intro');
      }
      reports.push({before,after});await page.close();
    }
    fs.writeFileSync(`${out}/report.json`,JSON.stringify({reports,errors},null,2));
    if (errors.length) throw Error(errors.join('\n'));
    console.log(JSON.stringify({ok:true,maps:reports.length,out}));
  } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exit(1);});
