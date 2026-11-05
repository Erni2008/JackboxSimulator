// THE UNSTABLE FORMULA end-to-end: real taps on the laboratory (mouse + touch), the separate ALCHEMIST'S JOURNAL
// (open, three spreads, lower), recipe decoded from the analyzer with the journal rules written out independently here
// (so the book's rules are checked against the server), rejection + drain, unstable reaction, success, timeout.
// URL=http://host:port/broken-elevator-manual/ BASE=http://host:port OUT=dir PLAYWRIGHT_MODULE=... CHROME_PATH=... node tools/checks/check_broken_elevator_formula.cjs
const assert = require('node:assert/strict'); const {chromium} = require(process.env.PLAYWRIGHT_MODULE);
const url = process.env.URL, base = process.env.BASE, out = process.env.OUT; const ok = m => console.log('PASS ' + m);
const post = async (path, form) => { const r = await fetch(base + path, {method: 'POST', headers: {'Content-Type': 'application/x-www-form-urlencoded'}, body: new URLSearchParams(form)}); const j = await r.json(); if (!r.ok) throw new Error(path + ' ' + JSON.stringify(j)); return j; };
// THE ALCHEMIST'S JOURNAL, transcribed from the task description
const BASE = {LUNAR: ['AZURE', 'VIOLET'], SOLAR: ['CRIMSON', 'AMBER'], CRYSTAL: ['VERDANT', 'AZURE'], ORGANIC: ['AMBER', 'VERDANT']};
const ADD = {CRIMSON: ['AZURE', 'AMBER', 'VIOLET'], AZURE: ['CRIMSON', 'VERDANT', 'VIOLET'], VERDANT: ['CRIMSON', 'AZURE', 'AMBER'], AMBER: ['AZURE', 'VERDANT', 'VIOLET'], VIOLET: ['CRIMSON', 'VERDANT', 'AMBER']};
const DOSE = {LOW: [2, 1], MEDIUM: [2, 2], HIGH: [1, 3]};
function decode(v) { const b = BASE[v.family][v.cls - 1], a = ADD[b]['ABC'.indexOf(v.reaction)], [nb, na] = DOSE[v.concentration]; const first = v.polarity === 'POSITIVE' ? b : a, second = first === b ? a : b; return [...Array(first === b ? nb : na).fill(first), ...Array(first === b ? na : nb).fill(second)]; }

async function page(b, touch, seat, extra = '') {
  const p = await b.newPage({viewport: touch ? {width: 844, height: 390} : {width: 1280, height: 800}, deviceScaleFactor: touch ? 2 : 1, hasTouch: touch, isMobile: touch});
  const errors = []; p.on('pageerror', e => errors.push(String(e)));
  if (seat) await p.addInitScript(s => sessionStorage.setItem('finalanswer-session', s), JSON.stringify(seat));
  await p.goto(`${url}?capture=1&lang=ru&tutorial=0&task=formula&quality=${touch ? 'low' : 'high'}${extra}`); await p.waitForFunction(() => window.__manual, null, {timeout: 180000});
  await p.waitForFunction(() => window.__manual.flink.view(), null, {timeout: 20000}); await p.waitForTimeout(500); return {p, errors, touch};
}
const view = s => s.p.evaluate(() => window.__manual.flink.view());
const at = (s, id) => s.p.evaluate(id => window.__manual.lab.controlScreen(id, window.__manual.camera), id);
async function tapXY(s, x, y) { if (s.touch) await s.p.touchscreen.tap(x, y); else await s.p.mouse.click(x, y); }
async function tap(s, id) { const c = await at(s, id); await tapXY(s, c.x, c.y); }
async function inspect(s) { await s.p.evaluate(() => window.__manual.setInspect(true, 'lab')); await s.p.waitForTimeout(1400); }
async function dose(s, r) { await s.p.waitForFunction(() => { const v = window.__manual.flink.view(); return v && !v.dispensing && !v.draining; }, null, {timeout: 5000}); await tap(s, 'dose-' + r); await s.p.waitForTimeout(720); }
async function lockOn(s) { const v = await view(s); if (!v.lock) { await tap(s, 'lock'); await s.p.waitForTimeout(350); } assert.equal((await view(s)).lock, true); }

async function journal(s, tag) {
  // look at the journal on the ledge and tap it: the journal (not the engineering manual) comes to hand
  await s.p.evaluate(() => window.__manual.setInspect(false)); await s.p.waitForTimeout(900);
  await s.p.evaluate(() => { const m = window.__manual, c = m.journal.root.getWorldPosition(new m.camera.position.constructor()), e = m.camera.position, d = c.clone().sub(e); m.look(Math.atan2(-d.x, -d.z), Math.atan2(d.y, Math.hypot(d.x, d.z))); }); await s.p.waitForTimeout(600);
  const c = await s.p.evaluate(() => { const m = window.__manual, w = m.journal.root.getWorldPosition(new m.camera.position.constructor()).project(m.camera); return {x: (w.x + 1) / 2 * innerWidth, y: (1 - w.y) / 2 * innerHeight}; });
  await tapXY(s, c.x, c.y); await s.p.waitForFunction(() => window.__manual.jui.state === 'held', null, {timeout: 6000}); assert.equal(await s.p.evaluate(() => window.__manual.ui.state), 'rest'); ok(`${tag}: THE ALCHEMIST'S JOURNAL picked up (engineering manual stays on its shelf)`);
  await s.p.evaluate(() => document.getElementById('btn-open').click()); await s.p.waitForFunction(() => window.__manual.jui.state === 'reading', null, {timeout: 6000});
  assert.equal(await s.p.evaluate(() => window.__manual.journal.pages.length), 6); assert.equal(await s.p.evaluate(() => window.__manual.book.pages.length), 10, 'engineering manual unchanged'); ok(`${tag}: journal opened — 3 spreads (6 pages); the engineering manual still has its own 10 pages`);
  for (let k = 0; k < 3; k++) { await s.p.waitForFunction(() => window.__manual.journal.isOpen && !window.__manual.journal.turning, null, {timeout: 8000}); await s.p.waitForTimeout(300); await s.p.screenshot({path: `${out}/journal-${tag}-spread${k + 1}.png`}); if (k < 2) { await s.p.evaluate(() => window.__manual.journal.turn(1)); } }
  assert.equal(await s.p.evaluate(() => window.__manual.journal.spread), 2); ok(`${tag}: all three journal spreads turned and captured`);
  await s.p.evaluate(() => document.getElementById('btn-lower').click()); await s.p.waitForTimeout(500); assert.ok(await s.p.evaluate(() => window.__manual.jui.lowered)); ok(`${tag}: journal lowered, kept in hand`);
}

async function brew(b, touch, seat, tag) {
  const s = await page(b, touch, seat, seat ? '' : '&unstable=1'); const online = !!seat; let v = await view(s);
  if (online) { assert.ok(v.online); ok(`${tag}: server-authoritative laboratory attached (no recipe in client state: ${!('sequence' in v)})`); }
  await inspect(s); await s.p.screenshot({path: `${out}/lab-${tag}-ready.png`});
  const recipe = decode(v); ok(`${tag}: analyzer ${v.sampleId} ${v.family}/${v.cls}/${v.reaction}/${v.polarity}/${v.concentration}${v.unstable ? ' unstable ' + v.unstable : ''} -> journal gives ${recipe.join(' ')}`);
  if (touch) await journal(s, tag), await inspect(s);
  // 1) wrong order -> FORMULA REJECTED, drained, timer keeps running
  const wrong = [...recipe].reverse(); if (wrong.join() === recipe.join()) wrong.pop();
  if (v.unstable) await lockOn(s);
  for (const r of wrong) await dose(s, r);
  await s.p.screenshot({path: `${out}/lab-${tag}-mixing.png`});
  const d0 = (await view(s)).deadline; await tap(s, 'inject'); await s.p.waitForTimeout(450); v = await view(s);
  assert.equal(v.event.type, 'REJECTED'); assert.equal(v.outcome, 'RUNNING'); await s.p.screenshot({path: `${out}/lab-${tag}-rejected.png`});
  assert.equal(await s.p.evaluate(() => document.querySelector('#verdict b').textContent), 'Формула отвергнута'); ok(`${tag}: wrong order -> FORMULA REJECTED`);
  await s.p.waitForFunction(() => { const v = window.__manual.flink.view(); return v && !v.draining && v.doses.length === 0; }, null, {timeout: 5000}); assert.ok(Math.abs((await view(s)).deadline - d0) < 300); ok(`${tag}: mixture drained, ready again, timer not reset`);
  // 2) unstable reagent without the cooling lock -> unstable reaction
  if (v.unstable) { await tap(s, 'lock'); await s.p.waitForTimeout(350); assert.equal((await view(s)).lock, false); await dose(s, v.unstable); v = await view(s);
    assert.equal(v.event.reason, 'UNSTABLE_UNPROTECTED'); await s.p.waitForTimeout(300); assert.equal(await s.p.evaluate(() => document.querySelector('#verdict b').textContent), 'Нестабильная реакция'); ok(`${tag}: ${v.unstable} without the cooling lock -> unstable reaction, drained`);
    await s.p.waitForFunction(() => { const v = window.__manual.flink.view(); return v && !v.draining && v.doses.length === 0; }, null, {timeout: 5000}); await lockOn(s); ok(`${tag}: cooling lock engaged`); }
  // 3) the journal's recipe -> COOLING SYSTEM RESTORED
  const h0 = await s.p.evaluate(() => window.__manual.cage.height);
  for (const r of recipe) await dose(s, r);
  assert.deepEqual((await view(s)).doses, recipe); await s.p.waitForTimeout(1200); await s.p.screenshot({path: `${out}/lab-${tag}-mixed.png`});
  await tap(s, 'inject'); await s.p.waitForTimeout(400); v = await view(s); assert.equal(v.outcome, 'STABILIZED'); ok(`${tag}: INJECT accepted${online ? ' by the server' : ''}`);
  await s.p.waitForTimeout(1000); await s.p.screenshot({path: `${out}/lab-${tag}-injecting.png`}); await s.p.waitForTimeout(1300);
  assert.equal(await s.p.evaluate(() => document.querySelector('#verdict b').textContent), 'Система охлаждения восстановлена'); await s.p.screenshot({path: `${out}/lab-${tag}-restored.png`}); ok(`${tag}: "COOLING SYSTEM RESTORED" sequence played`);
  assert.equal(await s.p.evaluate(() => window.__manual.cage.height), h0); ok(`${tag}: the car does not move after the repair`);
  if (online) { assert.equal(await s.p.evaluate(() => window.__manual.flink.repairs), 1); ok(`${tag}: server granted the repair reward once`); }
  await s.p.waitForTimeout(1600); assert.equal(await s.p.evaluate(() => window.__manual.kind), 'wire'); ok(`${tag}: next task is WIRE CUTTING`);
  assert.deepEqual(s.errors, []); ok(`${tag}: no page errors`); await s.p.close();
}

async function timeout(b, seat) {
  const s = await page(b, false, seat); const d = (await view(s)).deadline - await s.p.evaluate(() => performance.now()); assert.ok(d > 40000 && d <= 45500, 'deadline ~45 s: ' + d); ok('timeout: server timer is 45 s');
  const h0 = await s.p.evaluate(() => window.__manual.cage.height);
  await s.p.waitForFunction(() => window.__manual.flink.view()?.outcome === 'FAILED', null, {timeout: 60000}); await s.p.waitForTimeout(1500);
  assert.equal(await s.p.evaluate(() => document.querySelector('#verdict b').textContent), 'Отказ системы охлаждения'); ok('timeout: "COOLING SYSTEM FAILED"');
  assert.ok(await s.p.evaluate(() => window.__manual.cage.height) < h0); assert.equal(await s.p.evaluate(() => window.__manual.flink.penalties), 1); ok('timeout: existing penalty once (the car drops)');
  assert.deepEqual(s.errors, []); await s.p.close();
}

(async () => {
  const b = await chromium.launch({executablePath: process.env.CHROME_PATH, args: ['--use-angle=metal', '--ignore-gpu-blocklist']});
  await brew(b, false, null, 'practice-desktop');
  await brew(b, true, null, 'practice-phone');
  const room = await post('/rooms', {name: 'Lab', maxPlayers: '8', gameMode: 'standard', password: ''});
  const seat = async n => { const j = await post(`/rooms/${room.code}/join`, {name: n}); return {code: j.code, token: j.token, name: n}; };
  await brew(b, false, await seat('Desk'), 'room-desktop');
  await brew(b, true, await seat('Phone'), 'room-phone');
  await timeout(b, await seat('Idle'));
  await b.close(); console.log('ALL UNSTABLE FORMULA CHECKS PASSED');
})().catch(e => { console.error(e); process.exit(1); });
