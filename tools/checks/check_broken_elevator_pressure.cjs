// THE BROKEN VALVES end-to-end — every control is operated through real pointer input on the 3D machine
// (mouse and touch): TEST + fault code, the fault's behaviour, BYPASS, FINE, EMERGENCY RELEASE (once), solving to a
// server-confirmed success, critical pressure, timeout, surge warning, and WIRE CUTTING afterwards.
// URL=http://host:port/broken-elevator-manual/ BASE=http://host:port OUT=dir PLAYWRIGHT_MODULE=... CHROME_PATH=... node tools/checks/check_broken_elevator_pressure.cjs
const assert = require('node:assert/strict'); const {chromium} = require(process.env.PLAYWRIGHT_MODULE);
const url = process.env.URL, base = process.env.BASE, out = process.env.OUT; const ok = m => console.log('PASS ' + m);
const post = async (path, form) => { const r = await fetch(base + path, {method: 'POST', headers: {'Content-Type': 'application/x-www-form-urlencoded'}, body: new URLSearchParams(form)}); const j = await r.json(); if (!r.ok) throw new Error(path + ' ' + JSON.stringify(j)); return j; };
const CODE_RE = /^(R-02|B-04|F-01|L-03)( \+ L-03)?$/; const TOL = 2.6; // line noise kicks up to ±2 PSI, the leak bleeds 1 PSI/s

async function page(b, touch, seat, extra = '') {
  const p = await b.newPage({viewport: touch ? {width: 844, height: 390} : {width: 1280, height: 800}, deviceScaleFactor: touch ? 2 : 1, hasTouch: touch, isMobile: touch});
  const errors = []; p.on('pageerror', e => errors.push(String(e)));
  if (seat) await p.addInitScript(s => sessionStorage.setItem('finalanswer-session', s), JSON.stringify(seat));
  await p.goto(`${url}?capture=1&seed=11&task=pressure&quality=${touch ? 'low' : 'high'}${extra}`); await p.waitForFunction(() => window.__manual, null, {timeout: 120000});
  await p.waitForFunction(() => window.__manual.link.view(), null, {timeout: 20000});
  await p.evaluate(() => window.__manual.setInspect(true, 'pressure')); await p.waitForTimeout(1400); return {p, errors, touch};
}
const view = s => s.p.evaluate(() => window.__manual.link.view());
const at = (s, id) => s.p.evaluate(id => window.__manual.press.controlScreen(id, window.__manual.camera), id);
async function tap(s, id) { const c = await at(s, id); if (s.touch) await s.p.touchscreen.tap(c.x, c.y); else await s.p.mouse.click(c.x, c.y); }
async function path(s, pts) {
  if (s.touch) { const cdp = await s.p.context().newCDPSession(s.p); const tp = ([x, y]) => [{x, y, id: 1}]; await cdp.send('Input.dispatchTouchEvent', {type: 'touchStart', touchPoints: tp(pts[0])});
    for (const q of pts.slice(1)) { await cdp.send('Input.dispatchTouchEvent', {type: 'touchMove', touchPoints: tp(q)}); await s.p.waitForTimeout(16); } await cdp.send('Input.dispatchTouchEvent', {type: 'touchEnd', touchPoints: []}); }
  else { await s.p.mouse.move(...pts[0]); await s.p.mouse.down(); for (const q of pts.slice(1)) { await s.p.mouse.move(...q); await s.p.waitForTimeout(16); } await s.p.mouse.up(); }
}
/** one clockwise quarter turn of a handwheel by dragging round its hub */
/** on-screen radius of a handwheel rim (so the drag starts on the wheel at any zoom / phone size) */
const rimPx = (s, id) => s.p.evaluate(id => { const m = window.__manual, c = m.press.controlScreen(id, m.camera), r = m.press.controls.find(k => k.id === id).root;
  const w = r.localToWorld(new m.camera.position.constructor(.045, 0, 0)).project(m.camera); return Math.hypot((w.x + 1) / 2 * innerWidth - c.x, (1 - w.y) / 2 * innerHeight - c.y); }, id);
async function turn(s, id) { const c = await at(s, id), R = Math.max(14, await rimPx(s, id)), pts = []; for (let k = 0; k <= 12; k++) { const a = -Math.PI / 2 + (Math.PI / 2 + .25) * k / 12; pts.push([c.x + Math.cos(a) * R, c.y + Math.sin(a) * R]); } await path(s, pts); }
async function settle(s, ms = 450) { await s.p.waitForTimeout(ms); return view(s); }

async function mechanics(b, touch, seat, tag) {
  const s = await page(b, touch, seat); const online = !!seat; let v = await view(s);
  if (online) { assert.ok(v.online); ok(`${tag}: server-authoritative machine attached`); }
  assert.equal(v.code, '', 'fault hidden before TEST'); assert.ok(v.pressure < v.safeLow || v.pressure > v.safeHigh, 'starts outside the zone'); ok(`${tag}: starts outside the green zone, fault hidden`);
  // TEST
  await tap(s, 'test'); v = await settle(s, 500); assert.ok(v.diagnosing, 'relays running'); await s.p.screenshot({path: `${out}/valves-${tag}-test.png`});
  v = await settle(s, 1400); assert.ok(CODE_RE.test(v.code), 'code shown: ' + v.code); const code = v.code, leak = code.includes('L-03'), mech = code.split(' + ').find(c => c !== 'L-03') || ''; ok(`${tag}: TEST shows fault code ${code}`);
  await tap(s, 'test'); v = await settle(s, 1800); assert.equal(v.code, code, 'repeat keeps the fault'); ok(`${tag}: repeated TEST keeps ${code}`);
  // the fault's behaviour on the main line, through a real red turn (or blue when high)
  if (v.fine) { await tap(s, 'fine'); v = await settle(s); assert.equal(v.fine, false); }
  const step = 10, useRed = v.pressure < 90, p0 = v.pressure; await turn(s, useRed ? 'red' : 'blue'); v = await settle(s);
  assert.equal(v.effect.action, useRed ? 'RED' : 'BLUE'); const d = v.effect.delta; void p0; const expect = useRed ? ({'R-02': 0, 'F-01': -step}[mech] ?? step) : ({'B-04': 0, 'F-01': step}[mech] ?? -step);
  assert.ok(Math.abs(d - expect) < 1e-6 && v.effect.jammed === (expect === 0), `${code}: ${useRed ? 'red' : 'blue'} turn changed ${d}, expected ${expect}`); ok(`${tag}: ${code} behaves as documented (${useRed ? 'red' : 'blue'} ${d >= 0 ? '+' : ''}${d.toFixed(1)} PSI)`);
  // BYPASS and FINE levers
  await tap(s, 'bypass'); v = await settle(s); assert.equal(v.bypass, true); assert.equal(v.safeState, !leak, 'BYPASS alone never cures a leak'); ok(`${tag}: BYPASS thrown to AUX`);
  if (leak) { await tap(s, 'clamp'); v = await settle(s); assert.equal(v.clamped, true); assert.equal(v.safeState, true); ok(`${tag}: CLAMP fitted on the cracked coupling — leak stopped (${code})`); }
  const fine0 = v.fine; await tap(s, 'fine'); v = await settle(s); assert.equal(v.fine, !fine0); ok(`${tag}: FINE lever toggles (${v.fine ? 'ON' : 'OFF'})`);
  const st = v.fine ? 2 : 10, q0 = v.pressure, dir = q0 < 60 ? 'red' : 'blue'; await turn(s, dir); v = await settle(s);
  void q0; assert.equal(v.effect.action, dir.toUpperCase()); assert.ok(Math.abs(v.effect.delta - (dir === 'red' ? st : -st)) < 1e-6 || (dir === 'blue' && v.pressure === 0), `after bypass a ${dir} turn moves ${st}: ${v.effect.delta}`); ok(`${tag}: after BYPASS the ${dir} valve works normally (${v.effect.delta > 0 ? '+' : ''}${v.effect.delta} PSI)`);
  // EMERGENCY RELEASE once (drag the handle down)
  const e0 = v.pressure, c = await at(s, 'emergency'); await path(s, [[c.x, c.y], [c.x, c.y + 30], [c.x, c.y + 60], [c.x, c.y + 90]]); v = await settle(s);
  assert.ok(v.emergencyUsed); assert.equal(v.effect.action, 'EMERGENCY'); assert.ok(Math.abs(v.effect.delta + Math.min(20, e0)) < TOL, `-20 PSI: ${v.effect.delta}`); ok(`${tag}: EMERGENCY RELEASE pulled (−20 PSI)`);
  const eSeq = v.effect.seq; await tap(s, 'emergency'); v = await settle(s); assert.equal(v.effect.seq, eSeq, 'second pull changes nothing'); assert.equal(v.emergencyUsed, true); ok(`${tag}: second EMERGENCY RELEASE rejected`);
  // camera stays put while turning
  const qa = await s.p.evaluate(() => window.__manual.camera.quaternion.toArray()); await turn(s, v.pressure < 60 ? 'red' : 'blue'); const qb = await s.p.evaluate(() => window.__manual.camera.quaternion.toArray());
  assert.ok(qa.every((x, i) => Math.abs(x - qb[i]) < 1e-4)); ok(`${tag}: turning a valve never rotates the camera`);
  // solve with real taps/turns: coarse, then FINE
  const h0 = await s.p.evaluate(() => window.__manual.cage.height);
  for (let i = 0; i < 90; i++) { v = await view(s); if (v.outcome !== 'RUNNING') break; const err = (v.safeLow + 2.5) - v.pressure, a = Math.abs(err);
    if (a > 6) { if (v.fine) await tap(s, 'fine'); else await turn(s, err > 0 ? 'red' : 'blue'); } else if (a > 1.5) { if (!v.fine) await tap(s, 'fine'); else await tap(s, err > 0 ? 'red' : 'blue'); }
    await s.p.waitForTimeout(450); }
  v = await view(s); assert.equal(v.outcome, 'STABILIZED', 'solved: ' + JSON.stringify(v)); ok(`${tag}: green zone held for 1 s -> STABILIZED${online ? ' (server-confirmed)' : ''}`);
  await s.p.waitForTimeout(300); assert.equal(await s.p.evaluate(() => document.querySelector('#verdict b').textContent), 'Давление стабилизировано'); ok(`${tag}: "Давление стабилизировано · PRESSURE STABILIZED" shown`);
  await s.p.screenshot({path: `${out}/valves-${tag}-ok.png`});
  assert.equal(await s.p.evaluate(() => window.__manual.cage.height), h0); ok(`${tag}: the car does not move after the repair (never rises, no drop)`);
  if (online) { await s.p.waitForTimeout(300); assert.equal(await s.p.evaluate(() => window.__manual.link.repairs), 1); ok(`${tag}: server granted the repair reward once`); }
  await s.p.waitForTimeout(3300); assert.equal(await s.p.evaluate(() => window.__manual.kind), 'wire'); ok(`${tag}: next task is WIRE CUTTING`);
  assert.deepEqual(s.errors, []); ok(`${tag}: no page errors`); await s.p.close();
}

async function critical(b, seat) {
  const s = await page(b, false, seat); await tap(s, 'bypass'); let v = await settle(s); if (v.fine) { await tap(s, 'fine'); v = await settle(s); }
  const h0 = await s.p.evaluate(() => window.__manual.cage.height);
  for (let i = 0; i < 14 && v.outcome === 'RUNNING'; i++) { await turn(s, 'red'); v = await settle(s, 300); }
  await s.p.waitForTimeout(60); await s.p.screenshot({path: `${out}/valves-explosion.png`});
  assert.equal(v.outcome, 'FAILED'); assert.equal(v.failReason, 'CRITICAL'); ok('critical: 120 PSI fails the machine');
  await turn(s, 'blue'); v = await settle(s, 250); assert.equal(v.outcome, 'FAILED'); assert.equal(v.pressure, 120); ok('critical: controls locked after the explosion');
  await s.p.waitForTimeout(1200); assert.equal(await s.p.evaluate(() => document.querySelector('#verdict b').textContent), 'Взрыв системы давления'); ok('critical: "Взрыв системы давления · PRESSURE SYSTEM FAILED" shown');
  assert.ok(await s.p.evaluate(() => window.__manual.press.gauge.broken)); ok('critical: the gauge glass blew out (system explosion)');
  assert.ok(await s.p.evaluate(() => window.__manual.cage.height) < h0); ok('critical: existing penalty fired (the car drops)');
  assert.equal(await s.p.evaluate(() => window.__manual.link.penalties), 1); ok('critical: server recorded exactly one penalty');
  assert.deepEqual(s.errors, []); await s.p.close();
}

async function timeout(b, seat) {
  const s = await page(b, false, seat); const v = await view(s), d = v.deadline - await s.p.evaluate(() => performance.now()); assert.ok(d > 40000 && d <= 45500, 'deadline ~45 s: ' + d); ok('timeout: server timer is 45 s');
  await s.p.waitForFunction(() => window.__manual.link.view()?.outcome === 'FAILED', null, {timeout: 60000}); const why = (await view(s)).failReason; assert.ok(['TIMEOUT', 'CRITICAL'].includes(why)); ok(`timeout: idle machine fails (${why === 'TIMEOUT' ? 'timer expired' : 'line noise + surge drove it to 120 PSI first'})`);
  assert.equal(await s.p.evaluate(() => window.__manual.link.penalties), 1); ok('timeout: one penalty'); assert.deepEqual(s.errors, []); await s.p.close();
}

async function surge(b) {
  const s = await page(b, false, null, '&surgeAt=5000'); const p0 = (await view(s)).pressure;
  await s.p.waitForFunction(() => window.__manual.link.view()?.surgeWarning, null, {timeout: 8000}); const lead = 5000 - await s.p.evaluate(() => 45000 - (window.__manual.link.view().deadline - performance.now()));
  assert.ok(lead > 1500 && lead < 2300, 'warned ~2 s ahead: ' + lead); await s.p.waitForTimeout(150); assert.ok(await s.p.evaluate(() => document.body.classList.contains('surge'))); await s.p.screenshot({path: `${out}/valves-surge-warning.png`}); ok('surge: 2 s warning with the PRESSURE SURGE tag');
  await s.p.waitForFunction(() => window.__manual.link.view()?.surged, null, {timeout: 5000}); const v = await view(s);
  assert.ok(Math.abs(v.pressure - Math.min(120, p0 + 10)) < 6, `+10 PSI: ${p0} -> ${v.pressure}`); await s.p.waitForTimeout(100); assert.equal(await s.p.evaluate(() => document.body.classList.contains('surge')), false); ok('surge: +10 PSI once, warning cleared');
  assert.deepEqual(s.errors, []); await s.p.close();
}

(async () => {
  const b = await chromium.launch({executablePath: process.env.CHROME_PATH, args: ['--use-angle=metal', '--ignore-gpu-blocklist']});
  await mechanics(b, false, null, 'practice-desktop');
  await mechanics(b, true, null, 'practice-phone');
  await surge(b);
  const room = await post('/rooms', {name: 'Valves', maxPlayers: '8', gameMode: 'standard', password: ''});
  const seat = async n => { const j = await post(`/rooms/${room.code}/join`, {name: n}); return {code: j.code, token: j.token, name: n}; };
  await mechanics(b, false, await seat('Desk'), 'room-desktop');
  await mechanics(b, true, await seat('Phone'), 'room-phone');
  await critical(b, await seat('Hot'));
  await timeout(b, await seat('Idle'));
  await b.close(); console.log('ALL BROKEN VALVES CHECKS PASSED');
})().catch(e => { console.error(e); process.exit(1); });
