// =============================================================
//  算数「比」 カンナ（5年生）向け　（予習のページ 1-1〜1-6 / 秘伝P.6〜11・108〜113）
//  比をかんたんにする・比の値・比例配分・連比・逆比・比の積・比の商
// =============================================================
(function(){

const gcd=(a,b)=>b?gcd(b,a%b):Math.abs(a);
const lcm=(a,b)=>a/gcd(a,b)*b;
const red=(...xs)=>{const g=xs.reduce((a,b)=>gcd(a,b));return xs.map(x=>x/g);};
// 分数の表示（たてに並べる）
const F=(n,d)=>d===1?String(n):`<span class="fr"><i>${n}</i><i>${d}</i></span>`;
const M=n=>`<span class="maru">${n}</span>`;       // ○数字
const S=n=>`<span class="shikaku">${n}</span>`;    // □数字
const R2=['：',''],R3=['：','：',''];               // 比の答え欄「□：□」「□：□：□」
const ratioTxt=a=>a.join('：');
const NAMES=[['けいた','あきこ'],['たろう','はなこ'],['兄','弟'],['姉','妹'],['Aさん','Bさん']];

registerUnit({
  id:'sansu-hi',
  subject:'sansu',
  players:['カンナ'],
  adaptive:true,
  title:'比',
  desc:'比をかんたんにする・比例配分・連比・逆比・比の積と商',
  levels:[

    {title:'比をかんたんにする（整数）',page:'予習1',gen:()=>{
      let a,b,k;do{a=ri(1,12);b=ri(1,12);}while(a===b||gcd(a,b)!==1);k=ri(2,12);
      return P(`次の比を、最もかんたんな整数の比で表しなさい。<br><b style="font-size:24px">${a*k}：${b*k}</b>`,R2,[a,b],
        '前項と後項を同じ数でわっても、比は変わらない（約分と同じ）。どちらもわれる一番大きい数でわろう',
        [`${a*k}と${b*k}の最大公約数は${k}`,`${a*k}÷${k}：${b*k}÷${k}＝${a}：${b}`]);
    }},

    {title:'比をかんたんにする（小数・分数）',page:'予習1',gen:()=>{
      let a,b;do{a=ri(1,9);b=ri(1,9);}while(a===b||gcd(a,b)!==1);
      if(Math.random()<.5){ // 小数
        const p=pick([1,2]),k=pick([2,3,4,6,8,9,12]),A=a*k,B=b*k,sc=Math.pow(10,p);
        const da=A/sc,db=B/sc;if(da===Math.round(da)&&db===Math.round(db))return null;
        return P(`次の比を、最もかんたんな整数の比で表しなさい。<br><b style="font-size:24px">${da}：${db}</b>`,R2,[a,b],
          `まず${sc}倍して整数にしよう。そのあと、同じ数でわる`,[`${sc}倍して ${A}：${B}`,`${k}でわって ${a}：${b}`]);
      }
      let p,q,r,s;do{q=pick([2,3,4,5,6,8,9,10,12]);s=pick([2,3,4,5,6,8,9,10,12]);p=ri(1,q-1);r=ri(1,s-1);}while(gcd(p,q)!==1||gcd(r,s)!==1||q===s&&p===r);
      const L=lcm(q,s),A=p*L/q,B=r*L/s,[x,y]=red(A,B);
      return P(`次の比を、最もかんたんな整数の比で表しなさい。<br><b style="font-size:24px">${F(p,q)} ： ${F(r,s)}</b>`,R2,[x,y],
        '分母の最小公倍数をかけると、整数の比になる',[`分母${q}と${s}の最小公倍数${L}をかけて ${A}：${B}`,`かんたんにして ${x}：${y}`]);
    }},

    {title:'比の値',page:'予習1',gen:()=>{
      let a,b,k;do{a=ri(1,12);b=ri(2,12);}while(gcd(a,b)!==1);k=ri(1,9);
      const show=Math.random()<.5?`${a*k}：${b*k}`:`${a*k/10}：${b*k/10}`;
      return P(`「${show}」の比の値を、分数で答えなさい（約分した形で）。`,[['分子',''],['分母','']],[a,b],
        '比の値＝前項÷後項＝前項／後項',[`${show.replace('：','÷')}＝${a}/${b}`,`比の値は ${a}/${b}${a>b?`（${frac2(a,b)}）`:''}`]);
    }},

    {title:'比例配分',page:'予習2',gen:()=>{
      let a,b;do{a=ri(1,9);b=ri(1,9);}while(a===b||gcd(a,b)!==1);
      const [n1,n2]=pick(NAMES),u=pick([1,10,50,100]),one=ri(2,30)*u,k=ri(0,2);
      if(k===0)return Q(`${n1}と${n2}の所持金の比は ${a}：${b} で、${n1}の所持金は${a*one}円です。${n2}の所持金は何円ですか。`,'円',b*one,
        `${n1}を${a}とすると、①はいくら？`,[`${M(a)}＝${a*one}円 → ${M(1)}＝${a*one}÷${a}＝${one}円`,`${n2}は ${M(b)}＝${one}×${b}＝${b*one}円`]);
      if(k===1)return Q(`${(a+b)*one}円を、${n1}と${n2}が ${a}：${b} になるように分けました。${n2}は何円もらいましたか。`,'円',b*one,
        `全体は ${a}＋${b}＝${a+b} 個分`,[`${M(a+b)}＝${(a+b)*one}円 → ${M(1)}＝${one}円`,`${n2}は ${M(b)}＝${b*one}円`,`（分数倍なら ${(a+b)*one}×${b}/${a+b}＝${b*one}円）`]);
      const big=a>b?n1:n2,bv=Math.max(a,b),sv=Math.min(a,b),cnt=ri(2,15),diff=(bv-sv)*cnt;
      return Q(`${n1}と${n2}が ${a}：${b} になるようにあめを分けたところ、2人の個数の差が${diff}個になりました。${big}はあめを何個もらいましたか。`,'個',bv*cnt,
        `個数の差は ${bv}−${sv}＝${bv-sv} 個分`,[`${M(bv-sv)}＝${diff}個 → ${M(1)}＝${cnt}個`,`${big}は ${M(bv)}＝${bv*cnt}個`]);
    }},

    {title:'連比',page:'予習3',gen:()=>{
      let a,b,c,d;do{a=ri(1,9);b=ri(1,9);c=ri(1,9);d=ri(1,9);}while(gcd(a,b)!==1||gcd(c,d)!==1||b===c);
      const L=lcm(b,c),ans=red(a*L/b,L,d*L/c);
      return P(`A：B＝${a}：${b}、B：C＝${c}：${d} のとき、A：B：C を最もかんたんな整数の比で表しなさい。`,R3,ans,
        `共通するBをそろえる。${b}と${c}の最小公倍数にしよう（通分と同じ）`,
        [`Bを${b}と${c}の最小公倍数${L}にそろえる`,`A：B＝${a}：${b} を${L/b}倍 → ${a*L/b}：${L}`,`B：C＝${c}：${d} を${L/c}倍 → ${L}：${d*L/c}`,`A：B：C＝${a*L/b}：${L}：${d*L/c}${gcd(gcd(a*L/b,L),d*L/c)>1?` ＝ ${ratioTxt(ans)}`:''}`]);
    }},

    {title:'連比の応用（重なり・プール）',page:'予習3',gen:()=>{
      let p,q,r,s;do{q=ri(2,9);s=ri(2,9);p=ri(1,q-1);r=ri(1,s-1);}while(gcd(p,q)!==1||gcd(r,s)!==1||p*s===r*q);
      // 重なり＝X×p/q＝Y×r/s → X：Y＝(r/s)：(p/q)＝q×r：p×s
      const ans=red(q*r,p*s);
      if(Math.random()<.5)return P(`正方形と円が重なっています。重なっている部分の面積は、正方形の面積の${F(p,q)}であり、円の面積の${F(r,s)}です。正方形と円の面積の比を、最もかんたんな整数の比で表しなさい。`,R2,ans,
        '重なりの部分を共通の「B」と考えて、連比をつくろう',
        [`正方形を${q}とすると重なりは${p}、円を${s}とすると重なりは${r}`,p===r?`重なりはどちらも${p}でそろっている`:`重なりを${p}と${r}の最小公倍数${lcm(p,r)}にそろえる`,`正方形：円＝${q*lcm(p,r)/p}：${s*lcm(p,r)/r}${ratioTxt(ans)!==`${q*lcm(p,r)/p}：${s*lcm(p,r)/r}`?`＝${ratioTxt(ans)}`:''}`]);
      return P(`2本の棒AとBをプールの同じ場所に立てたところ、それぞれAの${F(p,q)}、Bの${F(r,s)}が水中にありました。AとBの長さの比を、最もかんたんな整数の比で表しなさい。`,R2,ans,
        '水の深さが共通。深さをそろえて連比をつくろう',
        [`Aを${q}とすると深さは${p}、Bを${s}とすると深さは${r}`,p===r?`深さはどちらも${p}でそろっている`:`深さを${p}と${r}の最小公倍数${lcm(p,r)}にそろえる`,`A：B＝${q*lcm(p,r)/p}：${s*lcm(p,r)/r}${ratioTxt(ans)!==`${q*lcm(p,r)/p}：${s*lcm(p,r)/r}`?`＝${ratioTxt(ans)}`:''}`]);
    }},

    {title:'逆比',page:'予習4',gen:()=>{
      const k=ri(0,3);
      if(k===0){let m,n;do{m=ri(2,12);n=ri(2,12);}while(m===n);const ans=red(n,m);
        return P(`Aの${m}倍とBの${n}倍が等しいとき、A：B を最もかんたんな整数の比で表しなさい。`,R2,ans,
          'A×○＝B×□ なら A：B＝1/○：1/□（逆数の比）',[`A×${m}＝B×${n}`,`A：B＝1/${m}：1/${n}＝${n}：${m}${gcd(m,n)>1?`＝${ratioTxt(ans)}`:''}`]);}
      if(k===1){let p,q,r,s;do{q=ri(2,9);s=ri(2,9);p=ri(1,9);r=ri(1,9);}while(gcd(p,q)!==1||gcd(r,s)!==1||p*s===r*q);
        const ans=red(q*r,p*s);
        return P(`Aの${F(p,q)}倍とBの${F(r,s)}倍が等しいとき、A：B を最もかんたんな整数の比で表しなさい。`,R2,ans,
          '逆数の比にしよう。分数の逆数は、分子と分母を入れかえた数',[`A：B＝${q}/${p}：${s}/${r}`,`分母をそろえて整数にすると ${ratioTxt(ans)}`]);}
      if(k===2){let a,b,c;do{a=ri(2,9);b=ri(2,9);c=ri(2,9);}while(new Set([a,b,c]).size<3);
        const L=lcm(lcm(a,b),c),ans=red(L/a,L/b,L/c);
        return P(`A×${a}＝B×${b}＝C×${c} のとき、A：B：C を最もかんたんな整数の比で表しなさい。`,R3,ans,
          `${c}：${b}：${a} のように数字を逆にならべるだけではダメ！ 1/${a}：1/${b}：1/${c} で考えよう`,
          [`A：B：C＝1/${a}：1/${b}：1/${c}`,`${L}倍して ${L/a}：${L/b}：${L/c}${gcd(gcd(L/a,L/b),L/c)>1?`＝${ratioTxt(ans)}`:''}`]);}
      let p,q,r,s;do{q=ri(2,6);s=ri(2,6);p=ri(1,q-1);r=ri(1,s-1);}while(gcd(p,q)!==1||gcd(r,s)!==1||p*s===r*q);
      const ans=red(q*(s-r),(q-p)*s);
      return P(`2本の棒AとBをプールの同じ深さの場所に立てたところ、水面上にそれぞれAの${F(p,q)}、Bの${F(r,s)}が出ました。AとBの長さの比を、最もかんたんな整数の比で表しなさい。`,R2,ans,
        `水中にあるのは Aの${F(q-p,q)}、Bの${F(s-r,s)}。A×${F(q-p,q)}＝B×${F(s-r,s)} として逆比`,
        [`水中：Aの${q-p}/${q}、Bの${s-r}/${s}`,`A：B＝${q}/${q-p}：${s}/${s-r}＝${ratioTxt(ans)}`]);
    }},

    {title:'比の積',page:'予習5',gen:()=>{
      const k=ri(0,2);
      if(k===0){let h1,h2,a,b;do{h1=ri(2,12)*2;h2=ri(2,12)*2;a=ri(1,7);b=ri(1,7);}while(h1===h2||a===b||gcd(a,b)!==1);
        const ans=red(h1*a,h2*b);
        return P(`たての長さが${h1}cmの長方形Aと、たての長さが${h2}cmの長方形Bがあります。AとBの横の長さの比が ${a}：${b} であるとき、AとBの面積の比を最もかんたんな整数の比で表しなさい。`,R2,ans,
          '面積＝たて×横。横を□とおいてかけ算',[`Aの横を${S(a)}、Bの横を${S(b)}とする`,`(${h1}×${S(a)})：(${h2}×${S(b)})＝${h1*a}：${h2*b}＝${ratioTxt(ans)}`]);}
      if(k===1){let a,b,t1,t2;do{a=ri(2,9);b=ri(2,9);t1=ri(5,30);t2=ri(5,30);}while(a===b||gcd(a,b)!==1||t1===t2);
        const [n1,n2]=pick(NAMES),ans=red(a*t1,b*t2);
        return P(`${n1}と${n2}の歩く速さの比は ${a}：${b} で、家から学校までにかかる時間は、${n1}が${t1}分、${n2}が${t2}分です。2人の家から学校までの距離の比を、最もかんたんな整数の比で表しなさい。`,R2,ans,
          '距離＝速さ×時間',[`(${S(a)}×${t1})：(${S(b)}×${t2})＝${a*t1}：${b*t2}＝${ratioTxt(ans)}`]);}
      const [c1,c2]=pick([[5,50],[10,50],[10,100],[50,100],[5,10]]);let a,b;do{a=ri(1,6);b=ri(1,6);}while(gcd(a,b)!==1);
      const per=c1*a+c2*b,n=ri(2,12),tot=per*n;
      return Q(`所持金は${tot}円で、すべて${c1}円玉と${c2}円玉です。${c1}円玉と${c2}円玉の枚数の比は ${a}：${b} です。${c1}円玉を何枚持っていますか。`,'枚',a*n,
        '合計金額＝1枚の金額×枚数。枚数を□とおこう',[`${c1}円玉を${S(a)}枚、${c2}円玉を${S(b)}枚とすると`,`${c1}×${S(a)}＋${c2}×${S(b)}＝${S(per)}＝${tot}円`,`${S(1)}＝${tot}÷${per}＝${n}枚`,`${c1}円玉は ${n}×${a}＝${a*n}枚`]);
    }},

    {title:'比の商',page:'予習6',gen:()=>{
      const k=ri(0,2);
      if(k===0){let h1,h2,a,b,ans;do{h1=ri(2,12)*2;h2=ri(2,12)*2;a=ri(1,9);b=ri(1,9);ans=red(a*h2,b*h1);}while(h1===h2||a===b||gcd(a,b)!==1||ans[0]>20||ans[1]>20);
        return P(`たての長さが${h1}cmの長方形Aと、たての長さが${h2}cmの長方形Bがあります。AとBの面積の比が ${a}：${b} であるとき、AとBの横の長さの比を最もかんたんな整数の比で表しなさい。`,R2,ans,
          '横＝面積÷たて',[`Aの面積を${M(a)}、Bの面積を${M(b)}とする`,`(${M(a)}÷${h1})：(${M(b)}÷${h2})＝${a}/${h1}：${b}/${h2}＝${ratioTxt(ans)}`]);}
      if(k===1){let a,b,d1,d2,ans;do{a=ri(2,9);b=ri(2,9);d1=ri(5,30)*100;d2=ri(5,30)*100;ans=red(d1*b,d2*a);}while(a===b||gcd(a,b)!==1||d1===d2||ans[0]>30||ans[1]>30);
        const [n1,n2]=pick(NAMES);
        return P(`${n1}と${n2}の歩く速さの比は ${a}：${b} で、家から学校までの距離は、${n1}が${d1}m、${n2}が${d2}mです。2人が家から学校まで行くのにかかる時間の比を、最もかんたんな整数の比で表しなさい。`,R2,ans,
          '時間＝距離÷速さ',[`(${d1}÷${M(a)})：(${d2}÷${M(b)})＝${d1}/${a}：${d2}/${b}＝${ratioTxt(ans)}`]);}
      const [c1,c2]=pick([[10,50],[5,50],[10,100],[50,100]]);let a,b,x,y,n;
      do{a=ri(1,9);b=ri(1,9);[x,y]=red(a*c2,b*c1);n=ri(2,10);}while(gcd(a,b)!==1);
      const cnt=(x+y)*n,money=c1*x*n+c2*y*n;
      return Q(`持っているお金はすべて${c1}円玉と${c2}円玉で、合わせて${cnt}枚あります。また、${c1}円玉と${c2}円玉の金額の比は ${a}：${b} です。所持金はいくらですか。`,'円',money,
        '枚数＝合計金額÷1枚の金額。まず枚数の比を出そう',[`金額を${M(a)}、${M(b)}とすると、枚数の比は (${M(a)}÷${c1})：(${M(b)}÷${c2})＝${x}：${y}`,`${S(x)}＋${S(y)}＝${S(x+y)}＝${cnt}枚 → ${S(1)}＝${n}枚`,`${c1}円玉${x*n}枚、${c2}円玉${y*n}枚`,`${c1}×${x*n}＋${c2}×${y*n}＝${money}円`]);
    }},

    {title:'ボス：比ミックス',page:'予習1〜6',gen:()=>{
      const u=UNITS.find(x=>x.id==='sansu-hi');return pick(u.levels.slice(3,-1)).gen();
    }},
  ]
});

function frac2(n,d){const w=Math.floor(n/d),r=n%d;return r?`${w}と${r}/${d}`:String(w);}

// null を返したときは作り直す
UNITS.find(u=>u.id==='sansu-hi').levels.forEach(l=>{const g=l.gen;l.gen=()=>{for(let i=0;i<80;i++){const q=g();if(q)return q;}return g();};});

})();
