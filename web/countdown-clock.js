'use strict';
/* Absolute server deadline only. This component never advances the game. */
class CountdownClock {
  static frame(deadline,now,duration){const remaining=Math.max(0,Math.min(duration,(deadline-now)/1000));return {remaining,angle:Math.min(360,remaining*6)};}
  constructor(canvas,now){
    this.canvas=canvas;this.now=now;this.ctx=canvas.getContext('2d');this.deadline=0;this.duration=0;this.enabled=false;this.frameId=0;
    this.face=new Image();this.hand=new Image();this.face.src='/art/impostor/clock/clockmini.png';this.hand.src='/art/impostor/clock/arrow_clock1.png';
    this.face.onload=this.hand.onload=()=>this.draw();
    this.visibility=()=>{cancelAnimationFrame(this.frameId);this.frameId=0;if(this.enabled&&!document.hidden)this.run();};
    document.addEventListener('visibilitychange',this.visibility);
  }
  set(deadline,duration,enabled){const changed=deadline!==this.deadline||duration!==this.duration;this.deadline=deadline;this.duration=Math.max(0,duration);this.enabled=enabled;
    if(!enabled){cancelAnimationFrame(this.frameId);this.frameId=0;return;}
    if(changed)this.draw();if(!this.frameId&&!document.hidden&&this.now()<deadline)this.run();
  }
  run(){this.frameId=requestAnimationFrame(()=>{this.frameId=0;if(!this.enabled||document.hidden)return;this.draw();if(this.now()<this.deadline)this.run();});}
  draw(){
    const c=this.ctx,{remaining,angle}=CountdownClock.frame(this.deadline,this.now(),this.duration);
    c.clearRect(0,0,1223,1286);if(this.face.complete&&this.face.naturalWidth)c.drawImage(this.face,0,0,1223,1286);
    if(angle>0){c.save();c.beginPath();c.moveTo(613,682);c.arc(613,682,354,-Math.PI/2,(angle-90)*Math.PI/180);c.closePath();c.fillStyle='rgba(135,8,24,.42)';c.shadowColor='rgba(210,18,36,.6)';c.shadowBlur=20;c.fill();c.restore();}
    if(this.hand.complete&&this.hand.naturalWidth){c.save();c.translate(613,682);c.rotate(angle*Math.PI/180);c.drawImage(this.hand,-512*.26,-1320*.26,1024*.26,1536*.26);c.restore();}
    const seconds=Math.ceil(remaining);if(this.lastSeconds!==seconds){this.lastSeconds=seconds;this.canvas.setAttribute('aria-label',`${seconds} seconds remaining`);}
    this.canvas.dataset.angle=String(angle);
  }
  dispose(){this.enabled=false;cancelAnimationFrame(this.frameId);document.removeEventListener('visibilitychange',this.visibility);this.face.onload=this.hand.onload=null;}
}
