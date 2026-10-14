// =============================================================
//  かんいろの旅 — 共通エンジン
//  問題そのものは units/ フォルダの単元ファイルに書きます。
//  このファイルはふだん触らなくてOKです。
// =============================================================

// ===== 単元ファイルで使える道具 =====
const ri=(a,b)=>a+Math.floor(Math.random()*(b-a+1));          // a〜bの整数
const pick=a=>a[Math.floor(Math.random()*a.length)];            // 配列から1つ
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
const r=x=>Math.round(x*1000)/1000;                              // 小数の誤差を消す
const tf=m=>{const h=Math.floor(m/60),mm=m%60;return (h?h+'時間':'')+(mm?mm+'分':'');};
const KIDS=[['ゆうと','そうた'],['さくら','ひなた'],['けいた','あきら'],['みお','りん']];

// 問題の形
// Q: 数字1つを答える     Q(問題文, 単位, 答え, ヒント, [解説の行...], 図SVG)
// P: 数字2つを答える     P(問題文, [単位1,単位2], [答え1,答え2], ヒント, [解説...], 図)
// C: えらんで答える      C(問題文, 正解, [まちがい...], ヒント, [解説...], 図)
function Q(text,unit,ans,hint,explain,diag){return{type:'num',text,unit,ans,hint,explain,diag}}
function P(text,labels,ans,hint,explain,diag){return{type:'pair',text,labels,ans,hint,explain,diag}}
function C(text,correct,wrongs,hint,explain,diag){const ch=shuffle([correct,...wrongs]);return{type:'choice',text,choices:ch,ans:ch.indexOf(correct),hint,explain,diag}}

// ===== 教科と単元 =====
const SUBJECTS=[
  {id:'kokugo',name:'国語',icon:'📖',color:'#C8483F'},
  {id:'sansu', name:'算数',icon:'📐',color:'#2F6FB3'},
  {id:'rika',  name:'理科',icon:'🔬',color:'#2E8B57'},
  {id:'shakai',name:'社会',icon:'🗾',color:'#D9821E'},
];
const UNITS=[];
function registerUnit(u){UNITS.push(u);}
const subj=id=>SUBJECTS.find(s=>s.id===id);
const unitsOf=sid=>UNITS.filter(u=>u.subject===sid);

// ===== 記録の保存 =====
const PLAYERS=['カンナ','イロハ'];
const KEY='kaniro:';
const state={player:PLAYERS[0],data:{}};
const blank=()=>({days:{},best:{}});
async function rawGet(k){try{if(window.storage){const g=await window.storage.get(k,false);return g?g.value:null;}return localStorage.getItem(k);}catch(e){return null;}}
async function rawSet(k,v){try{if(window.storage)await window.storage.set(k,v,false);else localStorage.setItem(k,v);}catch(e){}}
async function load(p){
  const v=await rawGet(KEY+p);
  if(v){try{const d=JSON.parse(v);d.days=d.days||{};d.best=d.best||{};return d;}catch(e){}}
  // 「はやさの旅」時代の記録を引き継ぐ
  const old=await rawGet('hayasa:'+p);
  if(old){try{const o=JSON.parse(old);return{days:o.days||{},best:{'sansu-hayasa':o.best||{}}};}catch(e){}}
  return blank();
}
async function save(){await rawSet(KEY+state.player,JSON.stringify(me()));}
const me=()=>state.data[state.player]||(state.data[state.player]=blank());
const dkey=d=>d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
const today=()=>dkey(new Date());
function streak(days){let n=0,d=new Date();if(!days[dkey(d)])d.setDate(d.getDate()-1);while(days[dkey(d)]){n++;d.setDate(d.getDate()-1);}return n;}
const unitBest=uid=>me().best[uid]||{};
const unitStars=u=>{const b=unitBest(u.id);return u.levels.reduce((a,_,i)=>a+(b[i+1]||0),0);};

// ===== 画面 =====
const app=()=>document.getElementById('app');
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
let view={name:'home'};
function go(v){view=v;window.scrollTo(0,0);render();}
function render(){({home,subject,unit}[view.name]||home)();}

function playersBar(){
  return `<div class="players">${PLAYERS.map(p=>`<button aria-pressed="${p===state.player}" data-p="${p}">${p}</button>`).join('')}</div>`;
}
function bindPlayers(){
  app().querySelectorAll('[data-p]').forEach(b=>b.onclick=async()=>{state.player=b.dataset.p;if(!state.data[state.player])state.data[state.player]=await load(state.player);render();});
}
function streakBar(){
  const d=me();let days='';
  for(let i=6;i>=0;i--){const x=new Date();x.setDate(x.getDate()-i);const k=dkey(x);
    days+=`<div class="day ${d.days[k]?'on':''} ${i===0?'today':''}"><b></b>${'日月火水木金土'[x.getDay()]}</div>`;}
  return `<div class="streak"><span>🔥 れんぞく <b style="font-size:22px">${streak(d.days)}</b> 日</span><div class="days">${days}</div></div>`;
}

// --- ホーム：教科をえらぶ
function home(){
  app().innerHTML=`
  <h1>かんいろの旅 🚶</h1>
  <p class="lead">毎日すこしずつ。4つの教科を旅しよう</p>
  ${playersBar()}
  ${streakBar()}
  <div class="subjects">${SUBJECTS.map(s=>{const us=unitsOf(s.id);
    const st=us.reduce((a,u)=>a+unitStars(u),0),mx=us.reduce((a,u)=>a+u.levels.length*2,0);
    return `<button class="subj ${us.length?'':'empty'}" style="--sc:${s.color}" data-s="${s.id}">
      <span class="ic">${s.icon}</span><b>${s.name}</b>
      <small>${us.length?`${us.length}単元　⭐${st}/${mx}`:'じゅんびちゅう'}</small></button>`;}).join('')}</div>`;
  bindPlayers();
  app().querySelectorAll('[data-s]').forEach(b=>b.onclick=()=>go({name:'subject',sid:b.dataset.s}));
}

// --- 教科：単元をえらぶ
function subject(){
  const s=subj(view.sid),us=unitsOf(s.id);
  app().innerHTML=`
  <button class="back" id="bk">← 教科をえらぶ</button>
  <h1>${s.icon} ${s.name}</h1>
  ${playersBar()}
  ${us.length?`<div class="units">${us.map(u=>{const st=unitStars(u),mx=u.levels.length*2;
    return `<button class="unit" style="--sc:${s.color}" data-u="${u.id}"><b>${esc(u.title)}</b><span>${esc(u.desc||'')}</span>
      <span>⭐ ${st} / ${mx}</span><div class="bar"><i style="width:${mx?st/mx*100:0}%"></i></div></button>`;}).join('')}</div>`
  :`<div class="emptybox">${s.name}のステージはじゅんびちゅう。<br>もうすぐ追加されるよ！</div>`}`;
  document.getElementById('bk').onclick=()=>go({name:'home'});
  bindPlayers();
  app().querySelectorAll('[data-u]').forEach(b=>b.onclick=()=>go({name:'unit',uid:b.dataset.u}));
}

// --- 単元：地図とステージ
function mapSVG(u){
  const n=u.levels.length,best=unitBest(u.id);
  const pts=u.levels.map((_,i)=>[n>1?30+i*(310/(n-1)):185, Math.round(115-60*Math.sin(i*1.15)+i*-4)]);
  const path='M'+pts.map(p=>p.join(' ')).join(' L');
  let s=`<svg viewBox="0 0 370 210" aria-label="ステージの地図"><path d="${path}" fill="none" stroke="var(--road)" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/>`;
  s+=`<path d="${path}" fill="none" stroke="var(--card)" stroke-width="2" stroke-dasharray="6 8"/>`;
  pts.forEach((p,i)=>{const b=best[i+1]||0,c=b>0;
    s+=`<circle cx="${p[0]}" cy="${p[1]}" r="14" fill="${c?'var(--flag)':'var(--card)'}" stroke="var(--ink)" stroke-width="2"/>`;
    s+=`<text x="${p[0]}" y="${p[1]+5}" text-anchor="middle" font-size="13" font-weight="700" fill="${c?'#fff':'var(--ink)'}">${i+1}</text>`;
    if(b===2)s+=`<text x="${p[0]+12}" y="${p[1]-10}" font-size="14">⭐</text>`;});
  const done=Object.keys(best).filter(k=>best[k]>0).map(Number);const at=done.length?Math.max(...done):0;
  const w=at?pts[at-1]:[pts[0][0]-10,pts[0][1]+16];
  return s+`<text x="${w[0]-6}" y="${w[1]-14}" font-size="22">🚶</text></svg>`;
}
function unit(){
  const u=UNITS.find(x=>x.id===view.uid),s=subj(u.subject),d=me(),t=today();
  const doneToday=d.days[t]&&d.days[t].u&&d.days[t].u[u.id];
  const best=unitBest(u.id);
  app().innerHTML=`
  <button class="back" id="bk">← ${s.name}</button>
  <h1>${esc(u.title)}</h1>
  <p class="lead">${esc(u.desc||'')}</p>
  ${playersBar()}
  <div class="mapbox">${mapSVG(u)}</div>
  ${streakBar()}
  <button class="big" id="daily">${doneToday!==undefined?`今日のチャレンジ もう一回（今日の記録 ⭐${doneToday}/${u.levels.length*2}）`:`今日のチャレンジ（${u.levels.length}問）`}</button>
  <div class="sec">ステージをえらんで練習（5問）</div>
  <div class="lvlist">${u.levels.map((l,i)=>`<button class="lv" data-l="${i+1}"><span>レベル${i+1}${l.page?'・'+esc(l.page):''}</span>${esc(l.title)}<div class="st">${'⭐'.repeat(best[i+1]||0)||'　'}</div></button>`).join('')}</div>`;
  document.getElementById('bk').onclick=()=>go({name:'subject',sid:u.subject});
  bindPlayers();
  document.getElementById('daily').onclick=()=>start(u,'daily');
  app().querySelectorAll('[data-l]').forEach(b=>b.onclick=()=>start(u,'lv',+b.dataset.l));
}

// ===== クイズ =====
let run=null;
function start(u,mode,lv){
  const mk=l=>({lv:l,...u.levels[l-1].gen()});
  const qs=mode==='daily'?u.levels.map((_,i)=>mk(i+1)):Array.from({length:5},()=>mk(lv));
  run={u,mode,lv,qs,i:0,res:[],tries:0,hint:false,vals:[],act:0,done:false};show();
}
function show(){
  const q=run.qs[run.i],n=run.qs.length;
  Object.assign(run,{tries:0,hint:false,done:false,act:0,vals:q.type==='pair'?['','']:['']});
  const dots=run.qs.map((_,k)=>{const st=run.res[k];return `<div class="dot ${st===undefined?'':st>0?'ok':'ng'}" style="left:${(k+.5)/n*100}%"></div>`;}).join('');
  const lvt=run.u.levels[q.lv-1].title;
  app().innerHTML=`
  <div class="top"><span>${run.mode==='daily'?'今日のチャレンジ':'れんしゅう'}　${run.i+1} / ${n}</span><button class="quit" id="quit">やめる</button></div>
  <div class="track"><div class="rd"></div>${dots}<div class="walker" style="left:${(run.i+.5)/n*100}%">🚶</div></div>
  <div class="card">
   <span class="tag">レベル${q.lv}　${esc(lvt)}</span>
   <div class="q">${q.text.replace('□','<b>□</b>')}</div>
   <div class="ansrow" id="ar"></div>
   ${q.type==='choice'?'':`<div id="keys"><div class="keys calc">${CALC_KEYS.map(k=>`<button data-k="${k}" class="${OPS.includes(k)?'op':k==='='?'eq':k==='C'||k==='⌫'?'fn':''}" aria-label="${k==='⌫'?'1文字けす':k==='C'?'ぜんぶけす':k}">${k}</button>`).join('')}</div>
   <button class="go" data-k="go">こたえる</button></div>`}
   ${q.hint?'<button class="hintbtn" id="hb">💡 ヒントを見る（⭐が1つになるよ）</button>':''}
   <div id="hint"></div><div id="fb"></div>
  </div>`;
  drawAns();
  document.getElementById('quit').onclick=()=>go({name:'unit',uid:run.u.id});
  const hb=document.getElementById('hb');if(hb)hb.onclick=showHint;
  app().querySelectorAll('[data-k]').forEach(b=>b.onclick=()=>key(b.dataset.k));
}
function drawAns(){
  const q=run.qs[run.i],ar=document.getElementById('ar');
  if(q.type==='choice'){
    ar.innerHTML=`<div class="choices">${q.choices.map((c,i)=>`<button data-c="${i}">${c}</button>`).join('')}</div>`;
    ar.querySelectorAll('[data-c]').forEach(b=>b.onclick=()=>{if(run.done||b.classList.contains('x'))return;run.vals=[b.dataset.c];check(b);});
    return;
  }
  const f=i=>{const v=run.vals[i],hasOp=/[＋−×÷()]/.test(v),c=hasOp?calc(v):null;
    return `<div class="fwrap"><div class="field ${run.act===i?'act':''}" data-f="${i}" role="button" tabindex="0">${v||'&nbsp;'}</div>${hasOp?`<div class="prev">${c===null?'…':'＝ '+fmt(c)}</div>`:''}</div>`;};
  ar.innerHTML=q.type==='pair'?`${f(0)}${q.labels[0]} ${f(1)}${q.labels[1]}`:`${f(0)} ${q.unit||''}`;
  ar.querySelectorAll('[data-f]').forEach(e=>e.onclick=()=>{run.act=+e.dataset.f;drawAns();});
}
// ===== 電卓 =====
const OPS=['＋','−','×','÷'];
const CALC_KEYS=['7','8','9','÷','⌫','4','5','6','×','C','1','2','3','−','(','0','.','=','＋',')'];
function calc(v){
  if(!v||!/^[0-9.＋−×÷()]+$/.test(v))return null;
  const js=v.replace(/＋/g,'+').replace(/−/g,'-').replace(/×/g,'*').replace(/÷/g,'/');
  try{const x=Function('"use strict";return ('+js+')')();return (typeof x==='number'&&isFinite(x))?Math.round(x*1e9)/1e9:null;}catch(e){return null;}
}
const fmt=x=>String(Math.round(x*1e6)/1e6);
function key(k){
  if(!run||run.done)return;
  if(k==='go')return check();
  let v=run.vals[run.act];
  const last=v.slice(-1),num=v.split(/[＋−×÷()]/).pop();
  if(k==='⌫')v=v.slice(0,-1);
  else if(k==='C')v='';
  else if(k==='='){const c=calc(v);if(c===null)return bad('式をたしかめてね');v=fmt(c);}
  else if(v.length>=24)return;
  else if(OPS.includes(k)){if(OPS.includes(last))v=v.slice(0,-1)+k;else if(v===''||last==='('){if(k==='−')v+=k;else return;}else v+=k;}
  else if(k==='.'){if(!num.includes('.'))v+=(num===''?'0':'')+'.';}
  else if(k==='('){if(v===''||OPS.includes(last)||last==='(')v+=k;else v+='×(';}
  else if(k===')'){const o=(v.match(/\(/g)||[]).length,c=(v.match(/\)/g)||[]).length;if(o>c&&!OPS.includes(last)&&last!=='(')v+=k;}
  else{if(last===')')v+='×';if(num==='0')v=v.slice(0,-1);v+=k;}
  run.vals[run.act]=v;drawAns();
}
function bad(msg){
  const ar=document.getElementById('ar');ar.classList.remove('shake');void ar.offsetWidth;ar.classList.add('shake');
  document.getElementById('fb').innerHTML=`<div class="fb ng"><p>${msg}</p></div>`;
}
document.addEventListener('keydown',e=>{
  if(!run||!document.getElementById('ar'))return;
  if(e.key==='Enter'&&run.done)return nextQ();
  if(!document.getElementById('keys'))return;
  const m={'+':'＋','-':'−','*':'×','/':'÷','=':'=','(':'(',')':')','Backspace':'⌫','Escape':'C','Enter':'go'};
  if(/^[0-9.]$/.test(e.key))key(e.key);else if(m[e.key]){e.preventDefault();key(m[e.key]);}
});
function showHint(){
  const q=run.qs[run.i];if(!q.hint)return;run.hint=true;
  document.getElementById('hint').innerHTML=`<div class="hint">💡 ${q.hint}${q.diag||''}</div>`;
  const hb=document.getElementById('hb');if(hb)hb.style.display='none';
}
function check(btn){
  const q=run.qs[run.i];
  if(run.vals.some(v=>v===''||v==='.'))return;
  let nums=[];
  if(q.type!=='choice'){nums=run.vals.map(calc);if(nums.some(x=>x===null))return bad('式をたしかめてね（かっこの数や、さいごの記号など）');
    run.vals=nums.map(fmt);drawAns();}
  let ok;
  if(q.type==='choice')ok=+run.vals[0]===q.ans;
  else if(q.type==='pair')ok=q.ans.every((a,i)=>Math.abs(nums[i]-a)<1e-6);
  else ok=Math.abs(nums[0]-q.ans)<1e-6;
  if(ok)return finish((run.tries===0&&!run.hint)?2:1,true);
  run.tries++;
  if(run.tries===1){
    const ar=document.getElementById('ar');ar.classList.remove('shake');void ar.offsetWidth;ar.classList.add('shake');
    document.getElementById('fb').innerHTML=`<div class="fb ng"><p>おしい！もう一回やってみよう。</p></div>`;
    if(q.type==='choice'){if(btn)btn.classList.add('x');}
    else{run.vals=run.vals.map(()=>'');run.act=0;drawAns();}
    if(!run.hint)showHint();
  }else finish(0,false);
}
function finish(s,ok){
  const q=run.qs[run.i];run.done=true;run.res[run.i]=s;
  const ans=q.type==='choice'?q.choices[q.ans]:q.type==='pair'?`${q.ans[0]}${q.labels[0]}${q.ans[1]}${q.labels[1]}`:`${q.ans}${q.unit||''}`;
  const keys=document.getElementById('keys');if(keys)keys.style.display='none';
  const hb=document.getElementById('hb');if(hb)hb.style.display='none';
  if(q.type==='choice'){const b=app().querySelector(`[data-c="${q.ans}"]`);if(b)b.classList.add('c');}
  const praise=['すごい！','カンペキ！','やったね！','その調子！'];
  document.getElementById('fb').innerHTML=`<div class="fb ${ok?'ok':'ng'}">
   <h3>${ok?pick(praise)+' '+'⭐'.repeat(s):'答えは '+ans}</h3>
   ${(q.explain||[]).map(l=>`<p>${l}</p>`).join('')}
   <button class="big next" id="nx">${run.i+1<run.qs.length?'つぎへ':'けっかを見る'}</button></div>`;
  const nx=document.getElementById('nx');nx.onclick=nextQ;nx.focus();
}
function nextQ(){run.i++;if(run.i<run.qs.length)show();else result();}

async function result(){
  const d=me(),u=run.u,total=run.res.reduce((a,b)=>a+b,0),max=run.qs.length*2,t=today();
  const b=d.best[u.id]=d.best[u.id]||{};
  run.qs.forEach((q,k)=>{b[q.lv]=Math.max(b[q.lv]||0,run.res[k]);});
  const day=d.days[t]=(d.days[t]&&typeof d.days[t]==='object')?d.days[t]:{};
  day.n=(day.n||0)+1;
  if(run.mode==='daily'){day.u=day.u||{};day.u[u.id]=Math.max(day.u[u.id]||0,total);}
  await save();
  const rate=total/max;
  const msg=rate===1?'全問パーフェクト！旅の達人だ 🏆':rate>=.75?'すばらしい！あと少しで満点 🎉':rate>=.5?'いい感じ！ヒントを見た問題をもう一度 💪':'まずはヒントを読んで、ゆっくりやってみよう 🌱';
  const r0=run;
  app().innerHTML=`<div class="card res">
   <span class="tag">${state.player}さんのけっか</span>
   <div class="stars">⭐ ${total} / ${max}</div>
   <div class="msg">${msg}</div>
   <table>${r0.qs.map((q,k)=>`<tr><td>レベル${q.lv}　${esc(u.levels[q.lv-1].title)}</td><td>${r0.res[k]?'⭐'.repeat(r0.res[k]):'もう一回'}</td></tr>`).join('')}</table>
   <p style="margin-top:14px">🔥 れんぞく ${streak(d.days)} 日目！${r0.mode==='daily'?'また明日もちがう問題が出るよ':''}</p>
   <button class="big" id="again">もう一回</button>
   <button class="ghost" id="hm">地図にもどる</button>
   <button class="ghost" id="top">ほかの教科へ</button></div>`;
  run=null;
  document.getElementById('again').onclick=()=>start(u,r0.mode,r0.lv);
  document.getElementById('hm').onclick=()=>go({name:'unit',uid:u.id});
  document.getElementById('top').onclick=()=>go({name:'home'});
}

// ===== パスワード =====
const PASS_HASH='629f4cf9337b0d0c76f305d860f98894cfa8c279516b425747514ca8710deb97';
async function sha(t){const b=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(t));return [...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('');}
function unlocked(){try{return localStorage.getItem('hayasa:unlock')===PASS_HASH;}catch(e){return false;}}
async function boot(){for(const p of PLAYERS)state.data[p]=await load(p);go({name:'home'});}
function lockScreen(){
  let v='';
  const draw=(err='')=>{app().innerHTML=`<div class="lock"><h1>かんいろの旅 🚶</h1><p>あいことば（パスワード）を入れてね</p>
    <div class="pins">${[0,1,2].map(i=>`<i class="${i<v.length?'on':''}"></i>`).join('')}</div>
    <div class="err">${err}</div>
    <div class="keys">${['1','2','3','4','5','6','7','8','9','','0','⌫'].map(k=>k?`<button data-k="${k}">${k}</button>`:'<span></span>').join('')}</div></div>`;
    app().querySelectorAll('[data-k]').forEach(b=>b.onclick=()=>press(b.dataset.k));};
  const press=async k=>{
    if(k==='⌫'){v=v.slice(0,-1);return draw();}
    if(v.length>=3)return;v+=k;draw();
    if(v.length===3){
      if(await sha(v)===PASS_HASH){try{localStorage.setItem('hayasa:unlock',PASS_HASH);}catch(e){}window.removeEventListener('keydown',kb);boot();}
      else{v='';draw('ちがうみたい。もう一度！');app().querySelector('.pins').classList.add('shake');}
    }};
  const kb=e=>{if(/^[0-9]$/.test(e.key))press(e.key);else if(e.key==='Backspace')press('⌫');};
  window.addEventListener('keydown',kb);draw();
}
function kaniroStart(){unlocked()?boot():lockScreen();}
