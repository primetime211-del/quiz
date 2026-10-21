// =============================================================
//  算数「速さ」  （予習のページ1〜6 / 秘伝P.137〜147）
// =============================================================
(function(){

// diagrams
const D={
 area:()=>`<svg viewBox="0 0 300 130"><rect x="70" y="10" width="170" height="90" fill="none" stroke="currentColor" stroke-width="3"/><text x="155" y="62" text-anchor="middle" font-size="18" fill="currentColor">きょり</text><text x="30" y="62" text-anchor="middle" font-size="16" fill="currentColor">速さ</text><text x="155" y="124" text-anchor="middle" font-size="16" fill="currentColor">時間</text></svg>`,
 conv:()=>`<svg viewBox="0 0 320 90"><g font-size="16" fill="currentColor" text-anchor="middle"><text x="40" y="52">秒速</text><text x="160" y="52">分速</text><text x="280" y="52">時速</text><text x="100" y="22">×60 →</text><text x="220" y="22">×60 →</text><text x="100" y="82">← ÷60</text><text x="220" y="82">← ÷60</text></g></svg>`,
 meet:()=>`<svg viewBox="0 0 320 80"><line x1="20" y1="40" x2="300" y2="40" stroke="currentColor" stroke-width="3"/><path d="M20 40 h90" stroke="#E4572E" stroke-width="6"/><path d="M300 40 h-70" stroke="#2E9E5B" stroke-width="6"/><text x="60" y="28" font-size="14" fill="currentColor">→</text><text x="260" y="28" font-size="14" fill="currentColor">←</text><text x="160" y="72" font-size="14" text-anchor="middle" fill="currentColor">1分で 速さの和 ずつ近づく</text></svg>`,
 chase:()=>`<svg viewBox="0 0 320 90"><line x1="20" y1="30" x2="300" y2="30" stroke="currentColor" stroke-width="2"/><line x1="20" y1="60" x2="300" y2="60" stroke="currentColor" stroke-width="2"/><path d="M20 30 h100" stroke="#E4572E" stroke-width="6"/><circle cx="20" cy="60" r="6" fill="#2E9E5B"/><text x="70" y="22" font-size="13" text-anchor="middle" fill="currentColor">先に行ったぶん</text><text x="160" y="84" font-size="14" text-anchor="middle" fill="currentColor">1分で 速さの差 ずつ縮まる</text></svg>`,
 pond:(same)=>`<svg viewBox="0 0 300 140"><circle cx="150" cy="70" r="40" fill="none" stroke="currentColor" stroke-width="2"/><text x="150" y="76" font-size="16" text-anchor="middle" fill="currentColor">池</text><circle cx="150" cy="70" r="56" fill="none" stroke="currentColor" stroke-dasharray="5 5"/><line x1="150" y1="6" x2="150" y2="30" stroke="currentColor" stroke-width="3"/><text x="150" y="136" font-size="13" text-anchor="middle" fill="currentColor">${same?'同じ向き → 進んだ距離の差が1周':'反対向き → 進んだ距離の和が1周'}</text></svg>`
};


registerUnit({
  id:'sansu-hayasa',
  subject:'sansu',
  players:['カンナ'],
  adaptive:true,   // 正解率に合わせてレベルを上げる今日のチャレンジ
  title:'速さ',
  desc:'単位の換算・3用法・旅人算',
  levels:[
    {title:'時間の単位',page:'予習1',gen:()=>{const k=ri(0,5);
 if(k===0){const h=ri(0,4)+pick([.1,.2,.25,.4,.5,.6,.75,.8]);return Q(`${r(h)}時間 ＝ □ 分`,'分',r(h*60),'時間 → 分 は ×60。時間は10進法じゃないので「150分」のようにしないこと！',[`${r(h)} × 60 ＝ ${r(h*60)}分`]);}
 if(k===1){const s=6*ri(2,60);return Q(`${s}秒 ＝ □ 分`,'分',r(s/60),'秒 → 分 は ÷60',[`${s} ÷ 60 ＝ ${r(s/60)}分`]);}
 if(k===2){const m=6*ri(2,60);return Q(`${m}分 ＝ □ 時間`,'時間',r(m/60),'分 → 時間 は ÷60',[`${m} ÷ 60 ＝ ${r(m/60)}時間`]);}
 if(k===3){const m=ri(1,20)+pick([0,.25,.5,.75]);return Q(`${r(m)}分 ＝ □ 秒`,'秒',r(m*60),'分 → 秒 は ×60',[`${r(m)} × 60 ＝ ${r(m*60)}秒`]);}
 if(k===4){const h=ri(1,4),m=ri(1,11)*5;return Q(`${h}時間${m}分 ＝ □ 分`,'分',h*60+m,'1時間＝60分。時間の分を60倍してからたそう',[`${h}×60＋${m}＝${h*60+m}分`]);}
 const t=ri(65,300);return P(`${t}分 ＝ □時間□分`,['時間','分'],[Math.floor(t/60),t%60],'60分で1時間。60で何回とれるか考えよう',[`${t} ÷ 60 ＝ ${Math.floor(t/60)} あまり ${t%60}`,`→ ${Math.floor(t/60)}時間${t%60}分`]);}},
    {title:'長さの単位',page:'予習1',gen:()=>{const k=ri(0,3);
 if(k===0){const p=pick([1,2,3]),n=ri(1,p===1?99:p===2?999:9999),km=n/Math.pow(10,p);return Q(`${r(km)}km ＝ □ m`,'m',r(km*1000),'1km ＝ 1000m。km → m は ×1000',[`${r(km)} × 1000 ＝ ${r(km*1000)}m`]);}
 if(k===1){const m=ri(5,9999);return Q(`${m}m ＝ □ km`,'km',r(m/1000),'m → km は ÷1000',[`${m} ÷ 1000 ＝ ${r(m/1000)}km`]);}
 if(k===2){const a=ri(1,9)+ri(1,9)/10,b=ri(1,9)*100;return Q(`${r(a)}km ＋ ${b}m ＝ □ m`,'m',r(a*1000+b),'単位をそろえてからたそう',[`${r(a)}km ＝ ${r(a*1000)}m`,`${r(a*1000)}＋${b}＝${r(a*1000+b)}m`]);}
 const a=ri(2,9),b=ri(1,9)*100+ri(0,9)*10;return Q(`${a}km − ${b}m ＝ □ km`,'km',r(a-b/1000),'まず m を km に直す（または km を m に直す）',[`${b}m ＝ ${r(b/1000)}km`,`${a}−${r(b/1000)}＝${r(a-b/1000)}km`]);}},
    {title:'秒速・分速・時速',page:'予習1',gen:()=>{const k=ri(0,4);
 if(k===0){const s=ri(2,20);return Q(`秒速${s}m ＝ 分速 □ m`,'m',s*60,'秒速 → 分速 は ×60',[`${s} × 60 ＝ 分速${s*60}m`],D.conv());}
 if(k===1){const m=pick([50,100,150,250,800,1200]);return Q(`分速${m}m ＝ 時速 □ km`,'km',r(m*60/1000),'分速 → 時速 は ×60。そのあと m を km に！',[`${m} × 60 ＝ ${m*60}m`,`${m*60}m ＝ ${r(m*60/1000)}km`],D.conv());}
 if(k===2){const v=pick([3,6,9,12,18,36,54,72]);return Q(`時速${v}km ＝ 分速 □ m`,'m',r(v*1000/60),'まず km を m に。時速 → 分速 は ÷60',[`${v}km ＝ ${v*1000}m`,`${v*1000} ÷ 60 ＝ ${r(v*1000/60)}m`],D.conv());}
 if(k===3){const s=ri(2,25);return Q(`秒速${s}m ＝ 時速 □ km`,'km',r(s*3.6),'秒速1m ＝ 時速3.6km を使うと速い！',[`${s} × 3.6 ＝ 時速${r(s*3.6)}km`],D.conv());}
 const s=ri(5,25);return Q(`時速${r(s*3.6)}km ＝ 秒速 □ m`,'m',s,'秒速1m ＝ 時速3.6km。だから ÷3.6',[`${r(s*3.6)} ÷ 3.6 ＝ 秒速${s}m`],D.conv());}},
    {title:'きょりを求める',page:'予習2',gen:()=>{if(Math.random()<.5){const a=pick([60,70,80,90,120,150]),t=ri(5,25),n=pick(KIDS)[0];
  return Q(`${n}さんが分速${a}mで${t}分歩くと、何km進みますか。`,'km',r(a*t/1000),'きょり ＝ 速さ × 時間。答えは km で！',[`${a} × ${t} ＝ ${a*t}m`,`${a*t}m ＝ ${r(a*t/1000)}km`],D.area());}
 const v=pick([30,36,42,48,60]),t=pick([20,30,40,50]);
 return Q(`時速${v}kmの車が${t}分走ると、何km進みますか。`,'km',r(v*t/60),'時速なので「分」を「時間」に直してからかけ算！',[`${t}分 ＝ ${t}/60時間`,`${v} × ${t}/60 ＝ ${r(v*t/60)}km`],D.area());}},
    {title:'時間を求める',page:'予習2',gen:()=>{if(Math.random()<.5){let a,t;do{a=pick([60,75,80,120,150,200,250]);t=ri(6,40);}while((a*t)%100);
  return Q(`分速${a}mの自転車が${r(a*t/1000)}km進むのに何分かかりますか。`,'分',t,'時間 ＝ きょり ÷ 速さ。km を m にそろえてから！',[`${r(a*t/1000)}km ＝ ${a*t}m`,`${a*t} ÷ ${a} ＝ ${t}分`],D.area());}
 let v,t;do{v=pick([40,45,48,60,36]);t=pick([75,80,90,100,105,40,50]);}while((v*t)%60);
 const d=v*t/60;return P(`時速${v}kmの車で${d}km進むと、何時間何分かかりますか。`,['時間','分'],[Math.floor(t/60),t%60],'時間 ＝ きょり ÷ 速さ。出た「時間」の小数・分数を分に直そう',[`${d} ÷ ${v} ＝ ${r(d/v)}時間`,`＝ ${tf(t)}`],D.area());}},
    {title:'速さを求める',page:'予習2',gen:()=>{if(Math.random()<.5){let v,t;do{v=pick([30,36,45,48,54,60,72,75,90]);t=pick([40,50,80,90,100,75,20,70]);}while((v*t)%60);
  const d=v*t/60;return Q(`${d}kmを${tf(t)}で走る車の速さは、時速何kmですか。`,'km',v,'速さ ＝ きょり ÷ 時間。時速なので時間を「時間」の単位に！',[`${tf(t)} ＝ ${t}/60時間`,`${d} ÷ ${t}/60 ＝ ${d} × 60/${t} ＝ 時速${v}km`],D.area());}
 const a=pick([60,70,80,90,150,200]),t=ri(6,30);
 return Q(`${a*t}mを${t}分で進みました。速さは分速何mですか。`,'m',a,'速さ ＝ きょり ÷ 時間',[`${a*t} ÷ ${t} ＝ 分速${a}m`],D.area());}},
    {title:'出会いの旅人算',page:'予習3',gen:()=>{const a=pick([60,70,80,90,100]),b=pick([40,50,60,70]),t=ri(8,20),d=(a+b)*t,[n1,n2]=pick(KIDS);
 return Q(`A町とB町は${r(d/1000)}km離れています。${n1}さんはA町から分速${a}m、${n2}さんはB町から分速${b}mで、向かい合って同時に出発しました。2人は何分後に出会いますか。`,'分',t,'反対向きに進む → 速さの「和」を使う！',[`1分で ${a}＋${b} ＝ ${a+b}m ずつ近づく`,`${r(d/1000)}km ＝ ${d}m`,`${d} ÷ ${a+b} ＝ ${t}分後`],D.meet());}},
    {title:'追いかけの旅人算',page:'予習3',gen:()=>{let a,b,k,t;do{a=pick([50,60,70,80]);b=a+pick([20,30,40,50]);k=ri(3,12);t=a*k/(b-a);}while(t%1||t>20);
 const [n1,n2]=pick(KIDS);
 return Q(`${n1}さんが分速${a}mで家を出てから${k}分後に、${n2}さんが分速${b}mで追いかけました。${n2}さんは出発してから何分後に追いつきますか。`,'分',t,'同じ向きに進む → 速さの「差」を使う！まず先に進んだ距離を出そう',[`先に進んだ距離：${a} × ${k} ＝ ${a*k}m`,`1分で ${b}－${a} ＝ ${b-a}m ずつ縮まる`,`${a*k} ÷ ${b-a} ＝ ${t}分後`],D.chase());}},
    {title:'池の周りの旅人算',page:'予習4',gen:()=>{const [n1,n2]=pick(KIDS);let a,b;do{a=pick([80,90,100,110,120]);b=pick([40,50,60,70]);}while(a-b<30);
 if(Math.random()<.5){const t=ri(4,10),L=(a+b)*t;
  return Q(`1周${L}mの池の周りを、${n1}さん（分速${a}m）と${n2}さん（分速${b}m）が同じ場所から同時に、反対向きに歩きます。はじめて出会うのは何分後ですか。`,'分',t,'反対向き → 2人の進んだ距離の「和」が1周',[`${L} ÷ (${a}＋${b}) ＝ ${L} ÷ ${a+b} ＝ ${t}分後`],D.pond(false));}
 let t,L;do{t=ri(10,30);L=(a-b)*t;}while(L>2400||L<400);
 return Q(`1周${L}mの池の周りを、${n1}さん（分速${a}m）と${n2}さん（分速${b}m）が同じ場所から同時に、同じ向きに歩きます。${n1}さんが${n2}さんをはじめて追いこすのは何分後ですか。`,'分',t,'同じ向き → 2人の進んだ距離の「差」が1周',[`${L} ÷ (${a}－${b}) ＝ ${L} ÷ ${a-b} ＝ ${t}分後`],D.pond(true));}},
    {title:'ボス：くり返し・3人',page:'予習5・6',gen:()=>{const [n1,n2]=pick(KIDS);
 if(Math.random()<.5){const a=pick([60,70,80]),b=pick([40,50,60]),t1=ri(8,14)+pick([0,.5]),d=(a+b)*t1,tot=t1*3;
  return P(`A町とB町は${r(d/1000)}km離れています。${n1}さんは分速${a}mでA町から、${n2}さんは分速${b}mでB町から同時に出発し、2つの町の間を何往復もします。2人が「2回目」に出会うのは出発してから何分何秒後ですか。`,['分','秒'],[Math.floor(tot),Math.round((tot%1)*60)],'1回目までに2人で「片道ぶん」、1回目→2回目は2人で「1往復ぶん（片道の2倍）」進むよ',[`1回目：${d} ÷ (${a}＋${b}) ＝ ${t1}分`,`1回目→2回目は2倍：${t1} × 2 ＝ ${t1*2}分`,`合計：${t1} ＋ ${t1*2} ＝ ${tot}分 → ${Math.floor(tot)}分${Math.round((tot%1)*60)}秒`]);}
 let p,q,s,g,t;do{p=pick([100,110,120,130]);q=p-pick([20,30,40]);s=pick([60,70,80]);g=ri(4,8);t=(q+s)*g/(p-q);}while(t%1||t>40);
 const gap=(q+s)*g,PQ=(p+s)*t;
 return Q(`ゆうとさん（分速${p}m）とあきらさん（分速${q}m）はP町からQ町へ、みおさん（分速${s}m）はQ町からP町へ同時に出発しました。ゆうとさんとみおさんがすれちがってから${g}分後に、あきらさんとみおさんがすれちがいました。P町からQ町までは何kmですか。`,'km',r(PQ/1000),'情景図をかこう！① 最初のすれちがいの時、あきらさんはゆうとさんより何m後ろ？ ② それは出発から何分後？',[`① あきらさんとみおさんが${g}分で近づく：(${q}＋${s}) × ${g} ＝ ${gap}m`,`② ゆうとさんとあきらさんの差が${gap}mになるのは：${gap} ÷ (${p}－${q}) ＝ ${t}分後`,`③ PQ間 ＝ (${p}＋${s}) × ${t} ＝ ${PQ}m ＝ ${r(PQ/1000)}km`]);}},
  ]
});

})();
