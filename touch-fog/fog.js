(() => {
  'use strict';
  const canvas = document.querySelector('#field'), ctx = canvas.getContext('2d');
  const W = 1000, H = 560, N = 180, q = id => document.getElementById(id);
  const descriptions = {gather:'ゆっくりなぞると、霧が指のそばへ集まります。',stir:'円を描くように、森の空気を混ぜてみましょう。',scatter:'指のそばから、霧がふわりとほどけていきます。'};
  let mode = 'gather', gravity = .45, running = !matchMedia('(prefers-reduced-motion: reduce)').matches;
  let particles = [], pointer = null, wave = null, last = 0, keyboard = {x:W/2,y:H/2,active:false};
  function sync() { canvas.dataset.running = String(running); canvas.dataset.mode = mode; q('pause').textContent = running ? '一時停止' : '再開'; q('pause').setAttribute('aria-pressed',String(!running)); }
  function populate() { particles = Array.from({length:N},()=>({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*1.2,vy:(Math.random()-.5)*1.2,size:25+Math.random()*48}));wave=null;pointer=null;keyboard.active=false;draw(); }
  function draw() {
    ctx.clearRect(0,0,W,H);
    for(const p of particles){
      const g=ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.size);
      g.addColorStop(0,'rgba(255,255,244,.16)');g.addColorStop(.5,'rgba(245,250,230,.10)');g.addColorStop(1,'rgba(248,252,240,0)');
      ctx.fillStyle=g;ctx.fillRect(p.x-p.size,p.y-p.size,p.size*2,p.size*2);
    }
    if(wave){const alpha=Math.max(0,1-wave.r/480);ctx.beginPath();ctx.arc(wave.x,wave.y,wave.r,0,Math.PI*2);ctx.strokeStyle=`rgba(255,226,126,${alpha*.65})`;ctx.lineWidth=14;ctx.stroke();const g=ctx.createRadialGradient(wave.x,wave.y,0,wave.x,wave.y,Math.max(1,wave.r));g.addColorStop(0,`rgba(255,246,192,${alpha*.32})`);g.addColorStop(1,'rgba(255,246,192,0)');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);}
    if(keyboard.active){ctx.beginPath();ctx.arc(keyboard.x,keyboard.y,19,0,Math.PI*2);ctx.strokeStyle='#6d855d';ctx.lineWidth=2;ctx.setLineDash([3,5]);ctx.stroke();ctx.setLineDash([]);}
  }
  function step(){
    if(document.hidden)return;
    for(const p of particles){
      p.vx+=(W/2-p.x)*gravity*.00007+(Math.random()-.5)*.06;
      p.vy+=(H/2-p.y)*gravity*.00007+(Math.random()-.5)*.06;
      if(pointer){const dx=pointer.x-p.x,dy=pointer.y-p.y,d=Math.hypot(dx,dy),s=1-d/220;if(d>1&&s>0){if(mode==='gather'){p.vx+=dx/d*s*.9;p.vy+=dy/d*s*.9;}else if(mode==='scatter'){p.vx-=dx/d*s*1.3;p.vy-=dy/d*s*1.3;}else{p.vx+=-dy/d*s*.9+pointer.dx*.025;p.vy+=dx/d*s*.9+pointer.dy*.025;}}}
      p.vx*=.965;p.vy*=.965;const speed=Math.hypot(p.vx,p.vy);if(speed>5){p.vx*=5/speed;p.vy*=5/speed;}p.x+=p.vx;p.y+=p.vy;
      if(p.x<0||p.x>W)p.vx*=-1;if(p.y<0||p.y>H)p.vy*=-1;p.x=Math.max(0,Math.min(W,p.x));p.y=Math.max(0,Math.min(H,p.y));
    }
    if(pointer){pointer.dx=0;pointer.dy=0;}if(wave){wave.r+=5;if(wave.r>480)wave=null;}draw();
  }
  function frame(t){if(running&&t-last>32){step();last=t;}requestAnimationFrame(frame);}
  function locate(e){const r=canvas.getBoundingClientRect();return{x:(e.clientX-r.left)*W/r.width,y:(e.clientY-r.top)*H/r.height};}
  function release(){pointer=null;keyboard.active=false;draw();}
  canvas.addEventListener('pointerdown',e=>{if(!running){q('note').textContent='いまはひと休み中。「再開」で、また触れられます。';return;}const p=locate(e);pointer={...p,dx:0,dy:0};canvas.setPointerCapture(e.pointerId);canvas.focus({preventScroll:true});});
  canvas.addEventListener('pointermove',e=>{if(!pointer)return;const p=locate(e);pointer.dx=p.x-pointer.x;pointer.dy=p.y-pointer.y;pointer.x=p.x;pointer.y=p.y;});
  ['pointerup','pointercancel','lostpointercapture','blur'].forEach(ev=>canvas.addEventListener(ev,release));
  canvas.addEventListener('keydown',e=>{if(!['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' '].includes(e.key))return;e.preventDefault();if(!running)return;keyboard.active=true;const before={...keyboard};if(e.key==='ArrowUp')keyboard.y-=22;if(e.key==='ArrowDown')keyboard.y+=22;if(e.key==='ArrowLeft')keyboard.x-=22;if(e.key==='ArrowRight')keyboard.x+=22;keyboard.x=Math.max(0,Math.min(W,keyboard.x));keyboard.y=Math.max(0,Math.min(H,keyboard.y));pointer={x:keyboard.x,y:keyboard.y,dx:keyboard.x-before.x,dy:keyboard.y-before.y};draw();});
  canvas.addEventListener('keyup',e=>{if(e.key===' '||e.key.startsWith('Arrow')){pointer=null;}});
  document.querySelectorAll('[data-action]').forEach(b=>b.addEventListener('click',()=>{mode=b.dataset.action;document.querySelectorAll('[data-action]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));q('note').textContent=descriptions[mode];sync();}));
  q('gravity').addEventListener('input',e=>{gravity=Number(e.target.value)/100;q('value').textContent=e.target.value+'%';});
  q('pulse').addEventListener('click',()=>{wave={x:W/2,y:H/2,r:18};draw();q('note').textContent=running?'光の波が、霧の中へ広がっていきます。':'光の波を置きました。「再開」で広がります。';});
  q('pause').addEventListener('click',()=>{running=!running;release();sync();q('note').textContent=running?descriptions[mode]:'森の空気も、ひと休み。「再開」でまた動きます。';});
  q('reset').addEventListener('click',()=>{gravity=.45;mode='gather';q('gravity').value='45';q('value').textContent='45%';document.querySelectorAll('[data-action]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.action===mode)));populate();sync();q('note').textContent=running?descriptions[mode]:'霧をはじめの姿に戻しました。再開すると動きます。';});
  populate();sync();if(!running)q('note').textContent='動きを抑える設定に合わせて休んでいます。「再開」で遊べます。';requestAnimationFrame(frame);
})();
