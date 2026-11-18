/** Fixed-step rigid sphere on a sloping chute. Absolute birth ticks keep all phones in the same wave. */
export interface StoneTrack {z0: number; z1: number; y0: number; y1: number; halfWidth: number}
export interface StoneBody {x: number; y: number; z: number; vx: number; vy: number; vz: number; spin: number; tick: number; birth: number}
export const STONE_INTERVAL = 3.4; // one stone every 3.4 s: time to reach the next alcove
export const STONE_STEP = 1 / 120;
export function stoneAt(previous: StoneBody | undefined, age: number, birth: number, track: StoneTrack, radius: number): StoneBody {
  const target = Math.max(0, Math.floor(age / STONE_STEP + 1e-7));
  let b = previous;
  if (!b || b.birth !== birth || target < b.tick) {
    b = {x: Math.sin(birth * 2.17) * .18, y: track.y1 + radius + .6, z: track.z1 - 1, vx: Math.sin(birth * 1.31) * .22, vy: 0, vz: -6, spin: 0, tick: 0, birth};
  }
  const slope = (track.y1 - track.y0) / (track.z1 - track.z0), norm = Math.sqrt(1+slope*slope);
  for (; b.tick < target; b.tick++) {
    const dt = STONE_STEP;
    b.vy -= 18 * dt;
    b.vx *= Math.exp(-.12*dt);
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
      if (b.z > track.z0 + 10 && Math.abs(b.x)>limit) {b.x=Math.sign(b.x)*limit;b.vx=-b.vx*.45;}
    }
    b.spin += b.vz*dt/radius;
  }
  return b;
}
