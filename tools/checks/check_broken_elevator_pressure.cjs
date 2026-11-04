// PRESSURE CONTROL end-to-end: real pointer drags on the 3D valves (mouse + touch), practice mode and room mode
// (server-authoritative pressure, success + repair reward, timeout -> failure -> the car drops).
// URL=http://host:port/broken-elevator-manual/ BASE=http://host:port OUT=dir PLAYWRIGHT_MODULE=... CHROME_PATH=... node tools/checks/check_broken_elevator_pressure.cjs
const assert = require('node:assert/strict'); const {chromium} = require(process.env.PLAYWRIGHT_MODULE);
const url = process.env.URL, base = process.env.BASE, out = process.env.OUT; const ok = m => console.log('PASS ' + m);
const post = async (path, form) => { const r = await fetch(base + path, {method: 'POST', headers: {'Content-Type': 'application/x-www-form-urlencoded'}, body: new URLSearchParams(form)}); const j = await r.json(); if (!r.ok) throw new Error(path + ' ' + JSON.stringify(j)); return j; };

async function page(b, touch, seat) {
  const p = await b.newPage({viewport: touch ? {width: 844, height: 390} : {width: 1280, height: 800}, deviceScaleFactor: touch ? 2 : 1, hasTouch: touch, isMobile: touch});
  const errors = []; p.on('pageerror', e => errors.push(String(e)));
  if (seat) await p.addInitScript(s => sessionStorage.setItem('finalanswer-session', s), JSON.stringify(seat));
  await p.goto(`${url}?capture=1&seed=11&task=pressure&quality=${touch ? 'low' : 'high'}`); await p.waitForFunction(() => window.__manual, null, {timeout: 120000});
  await p.waitForFunction(() => window.__manual.link.view(), null, {timeout: 20000}); await p.waitForTimeout(600); return {p, errors};
}
const view = p => p.evaluate(() => window.__manual.link.view());
/** screen centre of valve i (0 intake, 1 release, 2 stabilizer) */
const centre = (p, i) => p.evaluate(i => { const m = window.__manual, v = m.press.valves[i]; const w = v.spin.getWorldPosition(new m.camera.position.constructor()).project(m.camera); return {x: (w.x + 1) / 2 * innerWidth, y: (1 - w.y) / 2 * innerHeight}; }, i);
/** turn valve i to detent `to` with a real drag along an arc around its hub (left = shut, top = half, right = open) */
async function turn(p, i, from, to, touch) {
  const c = await centre(p, i), R = 46, ang = k => Math.PI + k * Math.PI / 2; const pts = []; const steps = 14;
  for (let s = 0; s <= steps; s++) { const a = ang(from) + (ang(to) - ang(from)) * s / steps; pts.push([c.x + Math.cos(a) * R, c.y + Math.sin(a) * R]); }
  if (touch) { const cdp = await p.context().newCDPSession(p); const tp = ([x, y]) => [{x, y, id: 1}];
    await cdp.send('Input.dispatchTouchEvent', {type: 'touchStart', touchPoints: tp(pts[0])}); for (const q of pts.slice(1)) { await cdp.send('Input.dispatchTouchEvent', {type: 'touchMove', touchPoints: tp(q)}); await p.waitForTimeout(16); } await cdp.send('Input.dispatchTouchEvent', {type: 'touchEnd', touchPoints: []}); }
  else { await p.mouse.move(...pts[0]); await p.mouse.down(); for (const q of pts.slice(1)) { await p.mouse.move(...q); await p.waitForTimeout(16); } await p.mouse.up(); }
  await p.waitForTimeout(500);
}
async function rateOver(p, ms) { const a = (await view(p)).pressure; await p.waitForTimeout(ms); const b = (await view(p)).pressure; console.log('   pressure', a.toFixed(2), '->', b.toFixed(2)); return (b - a) / (ms / 1000); }
/** human-like controller using the same valve API the drags feed */
async function solve(p) {
  for (let i = 0; i < 120; i++) { const v = await view(p); if (v.outcome !== 'RUNNING') return v.outcome; const err = (v.safeLow + v.safeHigh) / 2 - v.pressure, a = Math.abs(err);
    await p.evaluate(([inn, rel, st]) => { const l = window.__manual.link, v = l.view(); if (v.intake !== inn) l.setValve('INTAKE', inn); if (v.release !== rel) l.setValve('RELEASE', rel); if (v.stabilizer !== st) l.setValve('STABILIZER', st); },
      [a > 12 ? (err > 0 ? 2 : 0) : a > 3 ? (err > 0 ? 1 : 0) : 1, a > 12 ? (err > 0 ? 0 : 2) : a > 3 ? (err > 0 ? 0 : 1) : 1, a > 12 ? 0 : 1]); await p.waitForTimeout(500); }
  return (await view(p)).outcome;
}

async function mechanics(b, touch, seat, tag) {
  const {p, errors} = await page(b, touch, seat); const online = !!seat;
  if (online) { await p.waitForFunction(() => window.__manual.link.view()?.online, null, {timeout: 15000}); ok(`${tag}: server-authoritative puzzle attached`); }
  await p.evaluate(() => window.__manual.setInspect(true, 'pressure')); await p.waitForTimeout(1300); await p.screenshot({path: `${out}/pressure-${tag}-close.png`});
  // start from a known state through the real UI: everything shut, stabilizer off
  let v = await view(p); for (const [i, name] of [[0, 'intake'], [1, 'release'], [2, 'stabilizer']]) if (v[name] !== 0) { await turn(p, i, v[name], 0, touch); v = await view(p); }
  assert.deepEqual([v.intake, v.release, v.stabilizer], [0, 0, 0]); ok(`${tag}: drags close every valve`);
  // measure away from the 0/120 clamps: vent or feed (through the same valve API) into a band, then shut again
  // (and well outside the green zone, so the puzzle cannot complete while we measure)
  const band = v.safeLow >= 50 ? [12, 32] : [72, 92];
  for (let i = 0; i < 60; i++) { const pr = (await view(p)).pressure; if (pr > band[0] && pr < band[1]) break; await p.evaluate(hi => { const l = window.__manual.link; l.setValve(hi ? 'RELEASE' : 'INTAKE', 2); l.setValve(hi ? 'INTAKE' : 'RELEASE', 0); }, pr >= band[1]); await p.waitForTimeout(250); }
  await p.evaluate(() => { const l = window.__manual.link; l.setValve('INTAKE', 0); l.setValve('RELEASE', 0); }); await p.waitForTimeout(400); v = await view(p);
  const q = () => p.evaluate(() => window.__manual.camera.quaternion.toArray()); const yaw0 = await q();
  await turn(p, 0, 0, 2, touch); v = await view(p); assert.equal(v.intake, 2, 'red valve open'); ok(`${tag}: red valve dragged to OPEN (detent)`);
  { const q1 = await q(); assert.ok(q1.every((x, i) => Math.abs(x - yaw0[i]) < 1e-4), 'camera did not move while turning a valve'); } ok(`${tag}: valve drag does not rotate the camera`);
  const up = await rateOver(p, 1200); assert.ok(up > 4, 'pressure rises with intake open: ' + up); ok(`${tag}: intake raises pressure (${up.toFixed(2)} PSI/s)`);
  await turn(p, 0, 2, 0, touch); await turn(p, 1, 0, 2, touch); v = await view(p); assert.equal(v.release, 2); const down = await rateOver(p, 1200); assert.ok(down < -4, 'pressure falls: ' + down); ok(`${tag}: release lowers pressure (${down.toFixed(2)} PSI/s)`);
  await turn(p, 2, 0, 1, touch); v = await view(p); assert.equal(v.stabilizer, 1); const slow = await rateOver(p, 1200); assert.ok(Math.abs(slow) < Math.abs(down) * .5 && Math.abs(slow) > .2, `stabilizer slows: ${slow}`); ok(`${tag}: stabilizer slows the change (${slow.toFixed(2)} PSI/s)`);
  const shot = await p.evaluate(() => getComputedStyle(document.getElementById('clock-num')).display); void shot;
  const h0 = await p.evaluate(() => window.__manual.cage.height);
  const outcome = await solve(p); assert.equal(outcome, 'STABILIZED'); ok(`${tag}: pressure held in the green zone for 3 s -> STABILIZED${online ? ' (server-confirmed)' : ''}`);
  await p.waitForTimeout(400); const verdict = await p.evaluate(() => document.querySelector('#verdict b').textContent); assert.equal(verdict, 'Давление стабилизировано'); ok(`${tag}: "Давление стабилизировано" shown`);
  await p.screenshot({path: `${out}/pressure-${tag}-ok.png`});
  assert.equal(await p.evaluate(() => window.__manual.cage.height), h0, 'no drop on success'); ok(`${tag}: the car does not descend after a successful repair`);
  if (online) { await p.waitForTimeout(1500); const r = await p.evaluate(() => window.__manual.link.repairs); if (r !== 1) console.log('DEBUG', await p.evaluate(() => JSON.stringify({a: window.__manual.link.auth, r: window.__manual.link.repairs}))); assert.equal(r, 1); ok(`${tag}: server granted the repair reward (elevatorRepairs = 1)`); }
  await p.waitForTimeout(3200); assert.equal(await p.evaluate(() => window.__manual.kind), 'wire'); ok(`${tag}: next task is WIRE CUTTING again`);
  assert.deepEqual(errors, []); ok(`${tag}: no page errors`); await p.close();
}

async function timeout(b, seat) {
  const {p, errors} = await page(b, false, seat); await p.waitForFunction(() => window.__manual.link.view()?.online, null, {timeout: 15000});
  const h0 = await p.evaluate(() => window.__manual.cage.height); const d = (await view(p)).deadline - await p.evaluate(() => performance.now());
  assert.ok(d > 40000 && d <= 45500, 'server deadline ~45 s: ' + d); ok('timeout: server deadline is 45 s');
  await p.waitForFunction(() => window.__manual.link.view()?.outcome === 'FAILED', null, {timeout: 60000}); ok('timeout: idle puzzle fails when the server timer expires');
  await p.waitForTimeout(1600); assert.equal(await p.evaluate(() => document.querySelector('#verdict b').textContent), 'Отказ давления'); ok('timeout: "Отказ давления" shown');
  assert.ok(await p.evaluate(() => window.__manual.cage.height) < h0, 'car dropped'); ok('timeout: the existing failure penalty (car drops toward the lava) fired');
  // a valve request after the end is ignored by the server
  await p.evaluate(() => window.__manual.link.setValve('INTAKE', 2)); await p.waitForTimeout(500); assert.equal((await view(p)).outcome, 'FAILED'); ok('timeout: inputs after the end change nothing');
  assert.deepEqual(errors, []); await p.close();
}

(async () => {
  const b = await chromium.launch({executablePath: process.env.CHROME_PATH, args: ['--use-angle=metal', '--ignore-gpu-blocklist']});
  await mechanics(b, false, null, 'practice-desktop');
  await mechanics(b, true, null, 'practice-phone');
  const room = await post('/rooms', {name: 'Pressure', maxPlayers: '4', gameMode: 'standard', password: ''});
  const seat = async n => { const j = await post(`/rooms/${room.code}/join`, {name: n}); return {code: j.code, token: j.token, name: n}; };
  await mechanics(b, false, await seat('Desk'), 'room-desktop');
  await mechanics(b, true, await seat('Phone'), 'room-phone');
  await timeout(b, await seat('Idle'));
  await b.close(); console.log('ALL PRESSURE CHECKS PASSED');
})().catch(e => { console.error(e); process.exit(1); });
