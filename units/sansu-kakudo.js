// =============================================================
//  算数「角度」 イロハ（3年生）向け
//  §1 角の大きさ・対頂角 / §2 平行な直線の性質 / §3 三角形と角の関係
// =============================================================
(function(){

// ---- 図をかく道具 ----
const RAD=Math.PI/180;
const pt=(cx,cy,r,a)=>[cx+r*Math.cos(a*RAD),cy-r*Math.sin(a*RAD)];
function arc(cx,cy,r,a1,a2,label,col){
  const [x1,y1]=pt(cx,cy,r,a1),[x2,y2]=pt(cx,cy,r,a2),big=(a2-a1)>180?1:0;
  const [lx,ly]=pt(cx,cy,r+15,(a1+a2)/2);
  const c=col||'currentColor';
  return `<path d="M${x1.toFixed(1)} ${y1.toFixed(1)} A${r} ${r} 0 ${big} 0 ${x2.toFixed(1)} ${y2.toFixed(1)}" fill="none" stroke="${c}" stroke-width="2"/>`+
    `<text x="${lx.toFixed(1)}" y="${(ly+5).toFixed(1)}" text-anchor="middle" font-size="14" font-weight="700" fill="${c}">${label}</text>`;
}
const RED='#E4572E';
const line=(x1,y1,x2,y2,w)=>`<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="currentColor" stroke-width="${w||2}"/>`;
const svg=(w,h,body)=>`<svg viewBox="0 0 ${w} ${h}" style="width:100%;max-width:${w+40}px;display:block;margin:6px auto">${body}</svg>`;
const lab=v=>typeof v==='number'?v+'°':v;

// 中心を通る直線（向き dirs 度）。marks:[[a1,a2,label,赤?]]
function cross(dirs,marks){
  const cx=150,cy=95,L=95;let b='';
  dirs.forEach(d=>{const [x1,y1]=pt(cx,cy,L,d),[x2,y2]=pt(cx,cy,L,d+180);b+=line(x1,y1,x2,y2);});
  marks.forEach(([a1,a2,l,red],i)=>{b+=arc(cx,cy,24+(i%2)*8,a1,a2,lab(l),red?RED:null);});
  return svg(300,190,b);
}
// 平行線と1本の直線。marks:[[上or下, a1, a2, label, 赤?]]
function parallel(t,marks){
  const y1=60,y2=140,x0=20,x1=300,h=(y2-y1);
  const dx=h/Math.tan(t*RAD),cxB=130,cxT=cxB+dx;
  let b=line(x0,y1,x1,y1)+line(x0,y2,x1,y2);
  const [ax,ay]=pt(cxB,y2,40/Math.sin(t*RAD),t+180),[bx,by]=pt(cxT,y1,40/Math.sin(t*RAD),t);
  b+=line(ax,ay,bx,by);
  b+=`<text x="8" y="${y1+5}" font-size="14" fill="currentColor">ア</text><text x="8" y="${y2+5}" font-size="14" fill="currentColor">イ</text>`;
  marks.forEach(([which,a1,a2,l,red])=>{const cx=which==='上'?cxT:cxB,cy=which==='上'?y1:y2;b+=arc(cx,cy,22,a1,a2,lab(l),red?RED:null);});
  return svg(320,200,b);
}
// 三角形（底角 B,C）。labels:[A,B,C]、ext:Cの外側をのばす
function tri(B,C,labels,ext){
  const tb=Math.tan(B*RAD),tc=Math.tan(C*RAD);
  const ux=tc/(tb+tc),uh=ux*tb;               // 底辺1のときの頂点
  const w=Math.min(190,135/uh),by=165,bx=ext?40:(310-w)/2,cx=bx+w,cy=by;
  const AX=bx+w*ux,AY=by-w*uh;
  let b=line(bx,by,cx,cy)+line(bx,by,AX,AY)+line(cx,cy,AX,AY);
  if(ext)b+=line(cx,cy,cx+70,cy);
  const col=l=>l==='x'?RED:null;
  b+=arc(bx,by,22,0,B,lab(labels[1]),col(labels[1]));
  if(ext)b+=arc(cx,cy,24,0,180-C,lab(labels[3]),RED);
  else b+=arc(cx,cy,22,180-C,180,lab(labels[2]),col(labels[2]));
  b+=arc(AX,AY,20,180+B,360-C,lab(labels[0]),col(labels[0]));
  return svg(310,185,b);
}
const JOUGI=svg(300,110,
  `<path d="M20 100 V20 L100 100 Z" fill="none" stroke="currentColor" stroke-width="2"/><text x="28" y="45" font-size="12" fill="currentColor">45°</text><text x="72" y="94" font-size="12" fill="currentColor">45°</text><text x="26" y="94" font-size="12" fill="currentColor">90°</text>`+
  `<path d="M140 100 V20 L280 100 Z" fill="none" stroke="currentColor" stroke-width="2"/><text x="148" y="45" font-size="12" fill="currentColor">60°</text><text x="245" y="94" font-size="12" fill="currentColor">30°</text><text x="146" y="94" font-size="12" fill="currentColor">90°</text>`);

registerUnit({
  id:'sansu-kakudo',
  subject:'sansu',
  players:['イロハ'],
  title:'角度',
  desc:'対頂角・平行線・三角形の角',
  levels:[

    {title:'角の大きさ', page:'§1', gen:()=>{
      const t=ri(0,3);
      if(t===0)return Q('直角は何度ですか。','度',90,'三角定規のかどの、四角いしるしがついている角だよ',['直角は90度です。']);
      if(t===1){const n=pick([2,3,4]);return Q(`直角${n}つ分の角は何度ですか。`,'度',90*n,'直角は90度',[`90×${n}＝${90*n}度`]);}
      if(t===2)return Q('直線が半回転したときの角（一直線の角）は何度ですか。','度',180,'1回転が360度。その半分だよ',['360÷2＝180度']);
      return Q('直線が1回転したときの角は何度ですか。','度',360,'1回転の角は決まっている大きさ',['1回転は360度です。']);
    }},

    {title:'対頂角', page:'§1', gen:()=>{
      const a=ri(4,14)*5,askOpp=Math.random()<.5;
      const d=cross([0,a],[[0,a,a],askOpp?[180,180+a,'x',true]:[a,180,'x',true]]);
      return askOpp
        ?Q('2本の直線が交わっています。xの角は何度ですか。','度',a,'向かい合った角（対頂角）は、大きさが同じだよ',[`xは${a}度の角と向かい合っている（対頂角）`,`だから x＝${a}度`],d)
        :Q('2本の直線が交わっています。xの角は何度ですか。','度',180-a,'一直線の角は180度。xと'+a+'度を合わせると一直線だよ',[`xと${a}度で一直線（180度）`,`180−${a}＝${180-a}度`],d);
    }},

    {title:'3本の直線', page:'§1', gen:()=>{
      let a,b;do{a=ri(5,14)*5;b=ri(5,14)*5;}while(a+b>150);
      const c=180-a-b;
      const d=cross([0,a,a+c],[[0,a,a],[180,180+a,'x',true],[180+a,180+a+c,'y',true],[180+a+c,360,b]]);
      return P('3本の直線が1つの点で交わっています。x、yの角の大きさはそれぞれ何度ですか。',[['x','度'],['y','度']],[a,c],
        `xは${a}度の角の対頂角。下半分の x・y・${b}度 を合わせると一直線（180度）だよ`,
        [`xと${a}度は対頂角なので x＝${a}度`,`x＋y＋${b}＝180 だから`,`y＝180−${a}−${b}＝${c}度`],d);
    }},

    {title:'平行線の角', page:'§2', gen:()=>{
      const a=ri(7,14)*5,k=ri(0,2);
      const given=['下',0,a,a];
      if(k===0)return Q('アとイの直線は平行です。xの角は何度ですか。','度',a,'xと'+a+'度は同じ位置にある角（同位角）',[`xと${a}度は同位角`,`平行線の同位角は等しいので x＝${a}度`],parallel(a,[given,['上',0,a,'x',true]]));
      if(k===1)return Q('アとイの直線は平行です。xの角は何度ですか。','度',a,'Zの字の形になっている角（さっ角）は等しいよ',[`xと${a}度はさっ角`,`平行線のさっ角は等しいので x＝${a}度`],parallel(a,[given,['上',180,180+a,'x',true]]));
      return Q('アとイの直線は平行です。xの角は何度ですか。','度',180-a,`まず上の直線で、${a}度と同じ角（同位角）を見つけよう。xとその角で一直線だよ`,[`上の直線で、${a}度の同位角も${a}度`,`xとその角で一直線なので 180−${a}＝${180-a}度`],parallel(a,[given,['上',a,180,'x',true]]));
    }},

    {title:'角の名前', page:'§1・§2', gen:()=>{
      const a=ri(8,13)*5,k=ri(0,2);
      if(k===0)return C('赤い2つの角（xとy）のような関係の角を何といいますか。','対頂角',['同位角','さっ角','直角'],'2本の直線が交わってできた、向かい合った角',['向かい合った角を対頂角といいます。大きさは等しいです。'],cross([0,a],[[0,a,'x',true],[180,180+a,'y',true]]));
      if(k===1)return C('アとイは平行です。xとyのような関係の角を何といいますか。','同位角',['対頂角','さっ角','直角'],'2本の直線に対して、同じ位置にある角',['同じ位置にある角を同位角といいます。'],parallel(a,[['下',0,a,'y',true],['上',0,a,'x',true]]));
      return C('アとイは平行です。xとyのような関係の角を何といいますか。','さっ角',['対頂角','同位角','直角'],'Zの字の内側にある角',['xとyのような角をさっ角といいます。平行線ならさっ角は等しいです。'],parallel(a,[['下',0,a,'y',true],['上',180,180+a,'x',true]]));
    }},

    {title:'三角形の角', page:'§3', gen:()=>{
      let B,Cc;do{B=ri(6,16)*5;Cc=ri(6,16)*5;}while(B+Cc>150);
      const A=180-B-Cc,k=ri(0,2);
      const labels=[A,B,Cc];labels[k]='x';
      const known=[A,B,Cc].filter((_,i)=>i!==k);
      return Q('三角形のxの角は何度ですか。','度',[A,B,Cc][k],'三角形の3つの角をたすと、いつでも180度',[`180−${known[0]}−${known[1]}＝${[A,B,Cc][k]}度`],tri(B,Cc,labels));
    }},

    {title:'三角定規の角', page:'§3', gen:()=>{
      const list=[
        ['45度の角と30度の角を合わせると、何度の角ができますか。',75,'45＋30＝75度'],
        ['45度の角と60度の角を合わせると、何度の角ができますか。',105,'45＋60＝105度'],
        ['90度の角と45度の角を合わせると、何度の角ができますか。',135,'90＋45＝135度'],
        ['90度の角と60度の角を合わせると、何度の角ができますか。',150,'90＋60＝150度'],
        ['60度の角に45度の角を重ねると、はみ出した部分は何度ですか。',15,'60−45＝15度'],
        ['45度の角に30度の角を重ねると、はみ出した部分は何度ですか。',15,'45−30＝15度'],
        ['90度の角に30度の角を重ねると、残りは何度ですか。',60,'90−30＝60度'],
        ['60度の角に30度の角を2つ合わせると、何度の角ができますか。',120,'60＋30＋30＝120度'],
      ];
      const [t,a,e]=pick(list);
      return Q('1組の三角定規を使います。'+t,'度',a,'三角定規の角は 45度・45度・90度 と 30度・60度・90度。合わせるならたし算、重ねるならひき算',[e],JOUGI);
    }},

    {title:'ボス：三角形の外側の角', page:'§3', gen:()=>{
      let B,Cc;do{B=ri(7,16)*5;Cc=ri(7,16)*5;}while(B+Cc>150);
      const A=180-B-Cc;
      if(Math.random()<.5)
        return Q('三角形の1つの辺をのばしました。xの角は何度ですか。','度',A+B,
          `まず三角形の右下の角を求めよう。xとその角を合わせると一直線（180度）`,
          [`右下の角：180−${A}−${B}＝${Cc}度`,`x：180−${Cc}＝${A+B}度`,`（${A}＋${B}＝${A+B} でも求められるよ）`],tri(B,Cc,[A,B,'','x'],true));
      return Q(`三角形の1つの辺をのばしたところ、外側の角が${A+B}度になりました。上の角は${A}度です。左下のxの角は何度ですか。`,'度',B,
        '外側の角から三角形の右下の角がわかるよ。そのあと三角形の角の和180度を使おう',
        [`右下の角：180−${A+B}＝${Cc}度`,`x：180−${A}−${Cc}＝${B}度`],tri(B,Cc,[A,'x','',A+B],true));
    }},
  ]
});

})();
