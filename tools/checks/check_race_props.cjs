// Race scenery is solid: a runner pushing into a rock stops at its edge, and can jump onto a low one.
const assert=require('node:assert/strict'),path=require('node:path'),os=require('node:os');
const esbuild=require('../../web3d/node_modules/esbuild');const out=path.join(os.tmpdir(),'race_course_check.cjs');
esbuild.buildSync({entryPoints:[path.resolve('web3d/src/games/race/course.ts')],outfile:out,bundle:true,platform:'node',format:'cjs',logLevel:'error'});
const {Course,Runner,R}=require(out);
const c=new Course(1,7);const b=c.blocks.find(b=>!b.gear&&!b.tilt&&!b.driftAmp&&!b.liftAmp&&!b.crumbles&&b.x1-b.x0>6&&b.z1-b.z0>10&&b.y0===b.y1);assert(b,'flat block');
const y=b.y0,z=(b.z0+b.z1)/2,x=(b.x0+b.x1)/2;
const place=()=>{const r=new Runner('a','A','skeleton',0,false);r.x=x;r.z=z-3;r.y=y;r.ground=b;return r;};
// tall rock in the way: the runner never gets through
c.props=[{x,z,y,r:.6,h:1.5}];let r=place();
for(let i=0;i<120;i++){r.inX=0;r.inZ=1;c.move(r,1/60);}
assert(r.z<=z-.6-R+1e-3+.02,`stopped before the rock (z=${r.z.toFixed(2)}, rock at ${z})`);
// low rock: jump on top and stand there
c.props=[{x,z,y,r:.6,h:.5}];r=place();let top=false;
for(let i=0;i<120;i++){r.inX=0;r.inZ=r.z<z-.1?1:0;if(i===3)r.jump=true;c.move(r,1/60);if(Math.abs(r.z-z)<.6+R&&Math.abs(r.y-(y+.5))<.02)top=true;}
assert(top,'stood on the low rock');
console.log('race props: solid OK, low rock walkable OK');
