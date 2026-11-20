/** Fixed-step rigid sphere on a sloping chute. Absolute birth ticks keep all phones in the same wave. */
export interface StoneTrack {z0: number; z1: number; y0: number; y1: number; halfWidth: number}
export interface StoneBody {x: number; y: number; z: number; vx: number; vy: number; vz: number; spin: number; tick: number; birth: number}
export const STONE_INTERVAL = 2.7; // one stone every 2.7 s
export const STONE_STEP = 1 / 120;
export function stoneAt(previous: StoneBody | undefined, age: number, birth: number, track: StoneTrack, radius: number): StoneBody {
  const target = Math.max(0, Math.floor(age / STONE_STEP + 1e-7));
  let b = previous;
  if (!b || b.birth !== birth || target < b.tick) {
    // every wave rolls differently (same on every phone: derived from the birth time): straight down the middle,
    // diagonal ricocheting off the walls, or a fast diagonal; the launch speed varies too
    const h = (n: number) => {const v = Math.sin(birth * n) * 43758.5453; return v - Math.floor(v);};
    const style = h(3.71), dir = h(5.13) < .5 ? -1 : 1, vx = style < .4 ? (h(1.31) - .5) * .4 : dir * (style < .75 ? 2.4 : 3.6);
    b = {x: (h(2.17) - .5) * .6 - dir * (style < .4 ? 0 : .8), y: track.y1 + radius + .6, z: track.z1 - 1, vx, vy: 0, vz: -(4.6 + h(7.77) * 3.2), spin: 0, tick: 0, birth};
  }
  const slope = (track.y1 - track.y0) / (track.z1 - track.z0), norm = Math.sqrt(1+slope*slope);
  for (; b.tick < target; b.tick++) {
    const dt = STONE_STEP;
    b.vy -= 18 * dt;
    b.vx *= Math.exp(-.05*dt);
    b.x += b.vx*dt; b.z += b.vz*dt; b.y += b.vy*dt;
    // bottom of the chute: a deflector kicks the stone sideways off the open edge, so it drops into the abyss
    // instead of rolling on through the landing floor
    if (b.z < track.z0 + 10) b.vx -= 34 * dt;
    const onChute = b.z >= track.z0 && b.z <= track.z1 && (Math.abs(b.x) <= track.halfWidth || b.z > track.z0 + 10);
    if (onChute) {
      const floor = track.y0 + (b.z-track.z0)*slope + radius*norm;
      if (b.y < floor) {
        b.y = floor;
        const normalSpeed = (b.vy - slope*b.vz)/norm;
        if (normalSpeed < 0) {b.vy -= 1.16*normalSpeed/norm; b.vz += 1.16*normalSpeed*slope/norm;}
        // Contact projects gravity onto the slope. Angular inertia removes 2/7 of that drive.
        b.vz += (18*slope/(1+slope*slope)*2/7 - .012*b.vz*Math.abs(b.vz))*dt;
      }
      const limit = track.halfWidth-radius;
      if (b.z > track.z0 + 10 && Math.abs(b.x)>limit) {b.x=Math.sign(b.x)*limit;b.vx=-b.vx*.72;} // lively ricochet off the walls
    }
    b.spin += b.vz*dt/radius;
  }
  return b;
}
