// =============================================================
//  算数「速さ②」 カンナ（5年生）向け　（予習のページ 2-1〜2-7 / 秘伝P.148〜159）
//  進行グラフ・出会い/追いかけの三角形・ツルカメ算・差集め算・通過算・時計算
// =============================================================
(function(){

const RED='#E4572E',BLUE='#2F6FB3';
// 進行グラフ：lines=[{pts:[[時間,距離],...],c:色,label}], xt/yt=目もり
function graph(lines,xt,yt,yUnit,dots){
  const W=330,H=220,L=48,B=185,T=24,R=292;
  const xmax=Math.max(...xt),ymax=Math.max(...yt);
  const X=t=>L+(R-L)*t/xmax,Y=d=>B-(B-T)*d/ymax;
  let s=`<svg viewBox="0 0 ${W} ${H}" style="width:100%;max-width:360px;display:block;margin:6px auto">`;
  s+=`<path d="M${L} ${T-6} V${B} H${R+8}" fill="none" stroke="currentColor" stroke-width="1.5"/>`;
  xt.forEach(t=>{s+=`<line x1="${X(t)}" y1="${B}" x2="${X(t)}" y2="${T}" stroke="currentColor" stroke-opacity=".2" stroke-dasharray="3 3"/><text x="${X(t)}" y="${B+15}" font-size="11" text-anchor="middle" fill="currentColor">${t}</text>`;});
  yt.forEach(d=>{s+=`<line x1="${L}" y1="${Y(d)}" x2="${R}" y2="${Y(d)}" stroke="currentColor" stroke-opacity=".2" stroke-dasharray="3 3"/><text x="${L-5}" y="${Y(d)+4}" font-size="11" text-anchor="end" fill="currentColor">${d}</text>`;});
  s+=`<text x="${L-5}" y="${T-8}" font-size="11" text-anchor="end" fill="currentColor">(${yUnit})</text><text x="${R+8}" y="${B+15}" font-size="11" text-anchor="end" fill="currentColor">(分)</text>`;
  lines.forEach(l=>{s+=`<polyline points="${l.pts.map(p=>X(p[0]).toFixed(1)+','+Y(p[1]).toFixed(1)).join(' ')}" fill="none" stroke="${l.c||RED}" stroke-width="2.5"/>`;
    if(l.label){const [a,b]=[l.pts[0],l.pts[l.pts.length-1]],f=.35,tx=a[0]+(b[0]-a[0])*f,ty=a[1]+(b[1]-a[1])*f,up=b[1]>=a[1];
      s+=`<text x="${(X(tx)+(up?-6:6)).toFixed(1)}" y="${(Y(ty)+(up?-8:-8)).toFixed(1)}" font-size="12" text-anchor="${up?'end':'start'}" fill="${l.c||RED}">${l.label}</text>`;}});
  (dots||[]).forEach(([t,d])=>{s+=`<circle cx="${X(t)}" cy="${Y(d)}" r="4" fill="currentColor"/>`;});
  return s+'</svg>';
}
// 時計
function clock(h,m){
  const cx=70,cy=70,R=58,ang=a=>[(cx+Math.sin(a*Math.PI/180)).toFixed(1),(cy-Math.cos(a*Math.PI/180)).toFixed(1)];
  const hand=(a,len,w,c)=>`<line x1="${cx}" y1="${cy}" x2="${(cx+len*Math.sin(a*Math.PI/180)).toFixed(1)}" y2="${(cy-len*Math.cos(a*Math.PI/180)).toFixed(1)}" stroke="${c}" stroke-width="${w}" stroke-linecap="round"/>`;
  let s=`<svg viewBox="0 0 140 140" style="width:140px;display:block;margin:6px auto"><circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="currentColor" stroke-width="2"/>`;
  for(let i=1;i<=12;i++){const a=i*30*Math.PI/180;s+=`<text x="${(cx+46*Math.sin(a)).toFixed(1)}" y="${(cy-46*Math.cos(a)+4).toFixed(1)}" font-size="11" text-anchor="middle" fill="currentColor">${i}</text>`;}
  s+=hand(30*(h%12)+0.5*m,30,4,'currentColor')+hand(6*m,44,2.5,RED);
  return s+`<circle cx="${cx}" cy="${cy}" r="3" fill="currentColor"/></svg>`;
}
const frac=(n,d)=>{const g=(a,b)=>b?g(b,a%b):a,w=Math.floor(n/d),r=n%d,k=g(r,d);return r?`${w?w:''}${w?'と':''}${r/k}/${d/k}`:String(w);};
const km=m=>m%1000===0?`${m/1000}km`:`${m}m`;

registerUnit({
  id:'sansu-hayasa2',
  subject:'sansu',
  players:['カンナ'],
  adaptive:true,
  title:'速さ②',
  desc:'進行グラフ・ツルカメ算・差集め算・通過算・時計算',
  levels:[

    {title:'進行グラフを読む（速さ）',page:'予習1',gen:()=>{
      let t1,d1;do{t1=pick([20,25,30,40,50,60]);d1=ri(4,15);}while((d1*1000)%t1);
      const r=pick([5,10,15]),t2=pick([20,30,40,50]),v2=pick([150,200,225,250,300]),d2=v2*t2/1000;
      if(d2%1&&d2*2%1)return null;
      const T2=t1+r,T3=T2+t2,D2=d1+d2;
      const g=graph([{pts:[[0,0],[t1,d1],[T2,d1],[T3,D2]]}],[t1,T2,T3],[d1,D2],'km');
      if(Math.random()<.5)return Q(`グラフは、Aさんが自転車でA町からB町（${d1}km）を通ってC町まで行ったようすです。A町からB町まで、分速何mで進みましたか。${g}`,'m',d1*1000/t1,
        '「かたむき」が速さ。0分から'+t1+'分までに何km進んだかな？km を m に直そう',[`${t1}分で${d1}km＝${d1*1000}m 進んだ`,`${d1*1000}÷${t1}＝分速${d1*1000/t1}m`]);
      return Q(`グラフは、Aさんが自転車でA町からB町（${d1}km）を通ってC町（${D2}km）まで行ったようすです。B町からC町まで、分速何mで進みましたか。${g}`,'m',v2,
        `B町を出たのは${T2}分後。${T2}分から${T3}分までの${t2}分間で、${d1}kmから${D2}kmまで進んでいるよ（「${T3}分で${D2}km」ではない！）`,[`かかった時間：${T3}−${T2}＝${t2}分`,`進んだ距離：${D2}−${d1}＝${d2}km＝${d2*1000}m`,`${d2*1000}÷${t2}＝分速${v2}m`]);
    }},

    {title:'進行グラフを読む（休けい・平均）',page:'予習1',gen:()=>{
      let t1,d1;do{t1=pick([20,30,40]);d1=ri(4,12);}while((d1*1000)%t1);
      const r=pick([5,10,15,20]),t2=pick([20,30,40]),d2=ri(3,9),T2=t1+r,T3=T2+t2,D2=d1+d2;
      const g=graph([{pts:[[0,0],[t1,d1],[T2,d1],[T3,D2]]}],[t1,T2,T3],[d1,D2],'km');
      const k=ri(0,2);
      if(k===0)return Q(`グラフは、Aさんが自転車で進んだようすです。途中で何分間休けいしましたか。${g}`,'分',r,'かたむきが0（グラフが横になっている）ところは進んでいない＝休けい',[`${T2}−${t1}＝${r}分間`]);
      if(k===1){if((D2*1000)%T3)return null;return Q(`グラフは、Aさんが自転車で進んだようすです。休けいした時間もふくめて、出発から着くまでの平均の速さは分速何mですか。${g}`,'m',D2*1000/T3,'平均の速さ＝全体の距離÷全体の時間（休けい時間もふくむ）',[`全体の距離：${D2}km＝${D2*1000}m`,`全体の時間：${T3}分`,`${D2*1000}÷${T3}＝分速${D2*1000/T3}m`]);}
      const fast=d1/t1>d2/t2?'前半':'後半';
      return C(`グラフは、Aさんが自転車で進んだようすです。前半（休けい前）と後半（休けい後）で、速いのはどちら？${g}`,fast,[fast==='前半'?'後半':'前半','同じ'],'かたむきが急なほど速い',[`前半：${d1}÷${t1}、後半：${d2}÷${t2} で比べる → ${fast}が速い`]);
    }},

    {title:'出会いの三角形',page:'予習2',gen:()=>{
      let D,v1,v2,k,t;do{D=ri(2,8);v1=ri(4,9)*10;v2=ri(4,9)*10;k=ri(2,20);t=(D*1000-v1*k)/(v1+v2);}while(t%1||t<=0);
      const T=k+t,g=graph([{pts:[[0,0],[T,v1*T]],label:`Aさん ${v1}m/分`},{pts:[[k,D*1000],[T,D*1000-v2*t]],c:BLUE,label:`Bさん ${v2}m/分`}],[k,T],[v1*k,D*1000],'m',[[k,v1*k],[k,D*1000],[T,v1*T]]);
      if(Math.random()<.35)return Q(`${D}km離れたA町とB町があります。AさんはA町からB町に向かって分速${v1}mで歩き始めました。BさんはAさんが出発してから${k}分後に、B町からA町に向かって分速${v2}mで出発しました。2人が出会うのは、A町から何mのところですか。`,'m',v1*T,
        'まず出会う時間を出そう（出会いの三角形）。そのあとAさんの速さ×時間',
        [`2人の間：${D*1000}−${v1}×${k}＝${D*1000-v1*k}m`,`Bさんが出発してから ${D*1000-v1*k}÷(${v1}＋${v2})＝${t}分後に出会う`,`Aさんは ${k}＋${t}＝${T}分歩いたので ${v1}×${T}＝${v1*T}m`,g]);
      return Q(`${D}km離れたA町とB町があります。AさんはA町からB町に向かって分速${v1}mで歩き始めました。BさんはAさんが出発してから${k}分後に、B町からA町に向かって分速${v2}mで出発しました。2人はAさんが出発してから何分後に出会いますか。`,'分',T,
        '出会いの三角形：Bさんが出発したときの2人の間の距離を「速さの和」でわる。最後に'+k+'分をたすのを忘れずに！',
        [`${k}分後までにAさんは ${v1}×${k}＝${v1*k}m 進む`,`2人の間：${D*1000}−${v1*k}＝${D*1000-v1*k}m`,`${D*1000-v1*k}÷(${v1}＋${v2})＝${t}分`,`${k}＋${t}＝${T}分後`,g]);
    }},

    {title:'追いかけの三角形',page:'予習3',gen:()=>{
      let v1,v2,k,t;do{v1=pick([40,50,60,70,80]);v2=v1+pick([10,20,30,40,50]);k=ri(2,12);t=v1*k/(v2-v1);}while(t%1||t>30);
      const T=k+t,g=graph([{pts:[[0,0],[T,v1*T]],label:`姉 ${v1}m/分`},{pts:[[k,0],[T,v1*T]],c:BLUE,label:`妹 ${v2}m/分`}],[k,T],[v1*k,v1*T],'m',[[k,v1*k],[k,0],[T,v1*T]]);
      if(Math.random()<.5)return Q(`姉は家から分速${v1}mで歩き始めました。妹は姉が出発してから${k}分後に分速${v2}mで追いかけました。妹が姉に追いつくのは、姉が出発してから何分後ですか。`,'分',T,
        '追いかけの三角形：妹が出発したときの2人の間の距離を「速さの差」でわる。最後に'+k+'分をたす',
        [`${k}分で姉は ${v1}×${k}＝${v1*k}m 進む`,`${v1*k}÷(${v2}−${v1})＝${t}分`,`${k}＋${t}＝${T}分後`,g]);
      return Q(`姉は家から分速${v1}mで歩き始めました。妹は姉が出発してから${k}分後に分速${v2}mで追いかけました。妹が姉に追いつくのは、家から何mのところですか。`,'m',v1*T,
        'まず追いつくまでの時間を出そう。そのあと、どちらかの速さ×時間',
        [`妹が追いつくのは出発から ${v1*k}÷(${v2}−${v1})＝${t}分後`,`妹の進んだ距離：${v2}×${t}＝${v2*t}m`,g]);
    }},

    {title:'速さのツルカメ算',page:'予習4',gen:()=>{
      const a=pick([50,60,70,80,90]),b=a+pick([40,60,80,100]),T=ri(12,30),x=ri(3,T-3),D=a*x+b*(T-x);
      if(Math.random()<.6)return Q(`Aさんの歩く速さは分速${a}m、走る速さは分速${b}mです。家から学校まで${km(D)}の道のりを、はじめは歩き、途中から走ったところ、ちょうど${T}分で着きました。走り始めたのは、家を出発してから何分後ですか。`,'分',x,
        '時間の合計と距離の合計がわかっている → 速さのツルカメ算。全部走ったとすると、何m多くなる？',
        [`全部走ったとすると ${b}×${T}＝${b*T}m`,`実際より ${b*T}−${D}＝${b*T-D}m 多い`,`1分歩くごとに ${b}−${a}＝${b-a}m 少なくなるので、歩いた時間は ${b*T-D}÷${b-a}＝${x}分`]);
      return Q(`Aさんの歩く速さは分速${a}m、走る速さは分速${b}mです。${km(D)}の道のりを、はじめは歩き、途中から走ったところ、全部で${T}分かかりました。走ったのは何分間ですか。`,'分',T-x,
        '全部歩いたとすると何m足りない？',[`全部歩いたとすると ${a}×${T}＝${a*T}m`,`${D}−${a*T}＝${D-a*T}m 足りない`,`走った時間：${D-a*T}÷(${b}−${a})＝${T-x}分`]);
    }},

    {title:'速さの差集め算',page:'予習5',gen:()=>{
      let v1,v2,D,dm;do{v2=pick([2,3,4,5,6,8,10,12,15]);v1=v2+pick([1,2,3,4,5]);D=ri(1,12);dm=60*D*(v1-v2)/(v1*v2);}while(dm%1||dm<5||dm>90||(v2*dm)%6||(D*60)%v1||(D*60)%v2);
      if(Math.random()<.65)return Q(`家から学校まで時速${v1}kmで行くと、時速${v2}kmで行くよりも${dm}分早く着きます。家から学校までの距離は何kmですか。`,'km',D,
        '同じ距離で速さが変わると時間も変わる → 差集め算。おそい方の「時間の差」の部分（★）と、速い方の上の部分（♥）の面積は同じ',
        [`時間の差 ${dm}分＝${dm}/60時間`,`★＝${v2}×${dm}/60＝${v2*dm/60}km`,`♥＝★なので、速い方でかかる時間は ${v2*dm/60}÷(${v1}−${v2})＝${D*60/v1}分（${frac(D*60,v1*60)}時間）`,`距離：${v1}×${frac(D*60,v1*60)}＝${D}km`]);
      return Q(`ある道のりを時速${v1}kmで行くと${D/v1*60}分、時速${v2}kmで行くとそれより何分多くかかりますか。`,'分',dm,'まず道のり＝速さ×時間を出そう',[`道のり：${v1}×${D/v1*60}/60＝${D}km`,`時速${v2}kmでは ${D}÷${v2}×60＝${D/v2*60}分`,`${D/v2*60}−${D/v1*60}＝${dm}分`]);
    }},

    {title:'通過算（電柱・トンネル）',page:'予習6',gen:()=>{
      let L,v,Tn,t;do{L=ri(10,30)*10;v=pick([10,12,15,18,20,24,25,30]);Tn=ri(20,120)*10;t=(Tn+L)/v;}while(t%1||L%v);
      if(Math.random()<.4)return Q(`秒速${v}mで走る、長さ${L}mの電車があります。この電車が電柱の前を通り過ぎるのに何秒かかりますか。`,'秒',L/v,'電車の先頭に注目！電柱を通り過ぎるまでに先頭が進む距離は、電車の長さと同じ',[`${L}÷${v}＝${L/v}秒`]);
      return Q(`秒速${v}mで走る、長さ${L}mの電車が、長さ${Tn}mのトンネルに入り始めてから出終わるまでに何秒かかりますか。`,'秒',t,'電車の先頭に注目！進む距離は「トンネルの長さ＋電車の長さ」',[`進む距離：${Tn}＋${L}＝${Tn+L}m`,`${Tn+L}÷${v}＝${t}秒`]);
    }},

    {title:'通過算（かくれる・長さを求める）',page:'予習6',gen:()=>{
      let L,v,Tn;do{L=ri(10,30)*10;v=pick([10,12,15,18,20,24,25,30]);Tn=ri(30,120)*10;}while((Tn+L)%v||(Tn-L)%v||Tn<=L);
      const k=ri(0,2);
      if(k===0)return Q(`秒速${v}mで走る、長さ${L}mの電車が、長さ${Tn}mのトンネルを通ります。電車が完全にトンネルの中にかくれている時間は何秒ですか。`,'秒',(Tn-L)/v,'電車の先頭に注目！完全にかくれている間に進む距離は「トンネルの長さ−電車の長さ」',[`${Tn}−${L}＝${Tn-L}m`,`${Tn-L}÷${v}＝${(Tn-L)/v}秒`]);
      if(k===1){const t=(Tn+L)/v;return Q(`秒速${v}mで走る電車が、長さ${Tn}mの鉄橋をわたり始めてからわたり終わるまでに${t}秒かかりました。この電車の長さは何mですか。`,'m',L,'わたり始めからわたり終わりまでに進む距離＝鉄橋の長さ＋電車の長さ',[`進んだ距離：${v}×${t}＝${v*t}m`,`電車の長さ：${v*t}−${Tn}＝${L}m`]);}
      const t=(Tn+L)/v,t2=L/v;return Q(`ある電車が、電柱の前を${t2}秒で通り過ぎ、長さ${Tn}mのトンネルを${t}秒で通りぬけました。この電車の速さは秒速何mですか。`,'m',v,'2つの通り方の「時間の差」は、トンネルの長さ分を進む時間',[`${t}−${t2}＝${t-t2}秒でトンネルの長さ${Tn}mを進む`,`${Tn}÷${t-t2}＝秒速${v}m`]);
    }},

    {title:'時計算（角度）',page:'予習7',gen:()=>{
      const h=ri(1,11),m=ri(1,29)*2;let a=Math.abs(30*h-5.5*m);if(a>180)a=360-a;
      return Q(`${h}時${m}分に、時計の長針と短針が作る角度のうち、小さいほうの角度は何度ですか。${clock(h,m)}`,'度',a,
        '長針は1分で6度、短針は1分で0.5度。'+h+'時ちょうどの角度からスタートして、1分で5.5度ずつ変わるよ',
        [`${h}時ちょうど：長針と短針の差は ${30*h}度（短針が前）`,`${m}分で差は 5.5×${m}＝${5.5*m}度 変わる`,`|${30*h}−${5.5*m}|＝${Math.abs(30*h-5.5*m)}度${Math.abs(30*h-5.5*m)>180?` → 小さいほうは 360−${Math.abs(30*h-5.5*m)}＝${a}度`:''}`]);
    }},

    {title:'ボス：時計算（重なる・一直線・直角）',page:'予習7',gen:()=>{
      const h=ri(1,11);
      if(Math.random()<.35){ // 何分後に□度になる（整数で答える）
        const m=ri(1,29)*2;let A=30*h-5.5*m;const after=A<0;A=Math.abs(A);if(A===0||A>=180||A%1)return null;
        return Q(`${h}時から${h+1}時の間で、長針と短針の作る角度が${after?'（長針が短針を追いこしてから）':'はじめて'}${A}度になるのは${h}時何分ですか。`,'分',m,
          `${h}時ちょうどの差は${30*h}度。長針は1分に5.5度ずつ短針に近づく（追いこしたら、はなれていく）`,
          after?[`${30*h}度に追いついて、さらに${A}度はなれるので、合計 ${30*h}＋${A}＝${30*h+A}度 近づく`,`${30*h+A}÷5.5＝${m}分 → ${h}時${m}分`]:[`${30*h}−${A}＝${30*h-A}度 近づけばよい`,`${30*h-A}÷5.5＝${m}分 → ${h}時${m}分`]);}
      const types=[['重なる',30*h],['一直線になる（180度）',30*h>=180?30*h-180:30*h+180],['はじめて直角になる',30*h>90?30*h-90:30*h+90],['2回目に直角になる',(30*h>90?30*h-90:30*h+90)+180]];
      const [label,deg]=pick(types),n=deg*2,ans=frac(n,11),w=Math.floor(n/11);
      if(deg===0||w>=60)return null;
      const wrong=[...new Set([frac(n+1,11),frac(n-1,11),frac(n+11,11),frac(n,12)])].filter(x=>x!==ans);
      return C(`${h}時と${h+1}時の間で、長針と短針が${label}のは${h}時何分ですか。`,`${h}時${ans}分`,shuffle(wrong).slice(0,3).map(x=>`${h}時${x}分`),
        `${h}時ちょうどは、長針が短針の${30*h}度後ろ。長針は1分に5.5度ずつ追いつく`,
        [`長針が短針より多く進む角度：${deg}度`,`${deg}÷5.5＝${n}/11＝${ans}分`,`→ ${h}時${ans}分`]);
    }},
  ]
});

// null を返したときは作り直す
UNITS.find(u=>u.id==='sansu-hayasa2').levels.forEach(l=>{const g=l.gen;l.gen=()=>{for(let i=0;i<50;i++){const q=g();if(q)return q;}return g()||Q('1＋1＝□','',2,'',[]);};});

})();
