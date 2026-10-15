// =============================================================
//  算数「□を求める問題」 イロハ（3年生）向け
//  §1 計算の約そく / §2 □を使った式（逆算） / §3 虫食い算
//  ※ 計算の練習なので電卓はオフ（calc:false）
// =============================================================
(function(){

// ---------- 虫食い算 ----------
const KANA=['ア','イ','ウ','エ'];
// rows: [上の数, 下の数, 答え]（数字の文字列）、op: '＋' '−' '×'
function mushiHTML(rows,op,holes){
  const W=Math.max(...rows.map(r=>r.length))+1;let h=0;const lab={};
  holes.forEach(k=>{lab[k]=KANA[h++];});
  const cell=(ri,s)=>{const pad=W-s.length;return Array.from({length:W},(_,c)=>{
    if(ri===1&&c===0)return `<span>${op}</span>`;
    const i=c-pad;if(i<0)return '<span></span>';
    const k=ri+':'+i;return lab[k]?`<span class="h">${lab[k]}</span>`:`<span>${s[i]}</span>`;}).join('');};
  return `<div class="mushi" style="grid-template-columns:repeat(${W},34px)">${cell(0,rows[0])}${cell(1,rows[1])}<div class="bar"></div>${cell(2,rows[2])}</div>`;
}
function countSolutions(rows,op,holes){
  let n=0;const f=op==='＋'?(a,b)=>a+b:op==='−'?(a,b)=>a-b:(a,b)=>a*b;
  const total=Math.pow(10,holes.length);
  for(let m=0;m<total;m++){
    const r=rows.map(s=>s.split(''));let ok=true,x=m;
    for(const k of holes){const [ri,i]=k.split(':').map(Number),d=x%10;x=Math.floor(x/10);if(i===0&&d===0&&r[ri].length>1){ok=false;break;}r[ri][i]=String(d);}
    if(!ok)continue;
    const [a,b,c]=r.map(z=>+z.join(''));if(f(a,b)===c)n++;
    if(n>1)return n;
  }
  return n;
}
function makeMushi(op,nHoles){
  for(let t=0;t<500;t++){
    let a,b,c;
    if(op==='＋'){a=ri(100,899);b=ri(100,999-a+ (Math.random()<.5?0:0));if(b<100)continue;c=a+b;}
    else if(op==='−'){a=ri(300,999);b=ri(100,a-100);c=a-b;if(c<100)continue;}
    else{a=ri(12,99);b=ri(3,9);c=a*b;}
    const rows=[String(a),String(b),String(c)];
    const cand=[];rows.forEach((s,ri)=>s.split('').forEach((_,i)=>cand.push(ri+':'+i)));
    const holes=shuffle(cand).slice(0,nHoles).sort((x,y)=>{const [a1,b1]=x.split(':').map(Number),[a2,b2]=y.split(':').map(Number);return a1-a2||b1-b2;});
    if(new Set(holes.map(k=>k.split(':')[0])).size<2)continue;
    if(countSolutions(rows,op,holes)!==1)continue;
    const ans=holes.map(k=>{const [ri,i]=k.split(':').map(Number);return +rows[ri][i];});
    return {rows,holes,ans};
  }
}
const pv=(k)=>['一','十','百','千'];
function mushiQ(op,n,title){
  const {rows,holes,ans}=makeMushi(op,n);
  const labels=holes.map((_,i)=>[KANA[i],'']);
  const html=mushiHTML(rows,op,holes);
  const full=`${rows[0]} ${op} ${rows[1]} ＝ ${rows[2]}`;
  return P(`次の計算の${KANA.slice(0,holes.length).join('・')}にあてはまる数字を求めなさい。${html}`,labels,ans,
    op==='−'?'一の位から順に考えよう。ひけないときは、上の位から1くり下がっているよ':op==='＋'?'一の位から順に考えよう。くり上がりに気をつけて':'かけ算九九を使って、一の位から考えよう。くり上がりに気をつけて',
    [holes.map((_,i)=>`${KANA[i]}＝${ans[i]}`).join('　'),`式：${full}`]);
}

// ---------- 逆算 ----------
const steps=a=>a.map(x=>x).filter(Boolean);

registerUnit({
  id:'sansu-gyakuzan',
  subject:'sansu',
  players:['イロハ'],
  calc:false,
  title:'□を求める問題',
  desc:'計算の約そく・逆算・虫食い算',
  levels:[

    {title:'計算の約そく', page:'§1', gen:()=>{
      let a,b,c,d,mid;
      do{b=ri(3,15);c=ri(2,6);a=ri(b*c,b*c+50);d=ri(5,40);}while(a-b*c<0);
      const v=a-b*c+d;
      if(Math.random()<.5)return Q(`${a} − ${b} × ${c} ＋ ${d} ＝ □`,'',v,'かけ算・わり算を先に計算！そのあと左から順に',
        [`まずかけ算：${b}×${c}＝${b*c}`,`${a}−${b*c}＋${d}＝${a-b*c}＋${d}＝${v}`]);
      const e=ri(2,9),f=ri(2,9),g=ri(10,60);const v2=g+e*f;
      return Q(`${g} ＋ ${e} × ${f} ＝ □`,'',v2,'たし算よりかけ算が先',[`${e}×${f}＝${e*f}`,`${g}＋${e*f}＝${v2}`]);
    }},

    {title:'かっこのある計算', page:'§1', gen:()=>{
      let p,q,d,e,f;
      do{d=ri(2,6);const inner=d*ri(5,20);q=ri(2,inner-2);p=inner+q;e=ri(2,6);f=ri(2,5);}while((p-q)/d-e*f<0);
      const v=(p-q)/d-e*f;
      return Q(`(${p} − ${q}) ÷ ${d} − ${e} × ${f} ＝ □`,'',v,'① かっこの中 → ② かけ算・わり算 → ③ たし算・ひき算',
        [`かっこの中：${p}−${q}＝${p-q}`,`${p-q}÷${d}＝${(p-q)/d}、${e}×${f}＝${e*f}`,`${(p-q)/d}−${e*f}＝${v}`]);
    }},

    {title:'□のたし算・ひき算', page:'§2', gen:()=>{
      const x=ri(12,300),a=ri(10,300),k=ri(0,2);
      if(k===0)return Q(`□ ＋ ${a} ＝ ${x+a}`,'',x,'□＋a＝b なら、□＝b−a',[`□＝${x+a}−${a}＝${x}`]);
      if(k===1)return Q(`□ − ${a} ＝ ${x}`,'',x+a,'□−a＝b なら、□＝b＋a（ひかれる前の数）',[`□＝${x}＋${a}＝${x+a}`]);
      return Q(`${x+a} − □ ＝ ${x}`,'',a,'a−□＝b なら、□＝a−b',[`□＝${x+a}−${x}＝${a}`]);
    }},

    {title:'□のかけ算・わり算', page:'§2', gen:()=>{
      const x=ri(3,25),a=ri(2,9),k=ri(0,2);
      if(k===0)return Q(`□ × ${a} ＝ ${x*a}`,'',x,'□×a＝b なら、□＝b÷a',[`□＝${x*a}÷${a}＝${x}`]);
      if(k===1)return Q(`□ ÷ ${a} ＝ ${x}`,'',x*a,'□÷a＝b なら、□＝b×a',[`□＝${x}×${a}＝${x*a}`]);
      return Q(`${x*a} ÷ □ ＝ ${x}`,'',a,'a÷□＝b なら、□＝a÷b',[`□＝${x*a}÷${x}＝${a}`]);
    }},

    {title:'□を使った式（2だん）', page:'§2', gen:()=>{
      const x=ri(2,15),a=ri(2,9),b=ri(3,40),k=ri(0,2);
      if(k===0){const c=x*a+b;return Q(`□ × ${a} ＋ ${b} ＝ ${c}`,'',x,'ふつうの計算は「×」→「＋」。逆算は逆の順で「＋」の方からもどす',[`□×${a}をひとまとまりにして：□×${a}＝${c}−${b}＝${c-b}`,`□＝${c-b}÷${a}＝${x}`]);}
      if(k===1){const c=(x+b)*a;return Q(`(□ ＋ ${b}) × ${a} ＝ ${c}`,'',x,'かっこをひとまとまりにして、先に「×」をもどそう',[`□＋${b}＝${c}÷${a}＝${c/a}`,`□＝${c/a}−${b}＝${x}`]);}
      const y=x*a,c=x+b;return Q(`□ ÷ ${a} ＋ ${b} ＝ ${c}`,'',y,'□÷'+a+'をひとまとまりにして、先に「＋」をもどそう',[`□÷${a}＝${c}−${b}＝${x}`,`□＝${x}×${a}＝${y}`]);
    }},

    {title:'□を使った式（3だん）', page:'§2', gen:()=>{
      let x,a,b,c,d;do{x=ri(2,12);a=ri(2,6);b=ri(1,20);c=ri(2,9);}while((x*a+b)%c!==0);
      d=(x*a+b)/c;
      return Q(`(□ × ${a} ＋ ${b}) ÷ ${c} ＝ ${d}`,'',x,'ふつうの計算の順は ①× ②＋ ③÷。逆算は ③→②→① の順にもどす',
        [`かっこをまとめて：□×${a}＋${b}＝${d}×${c}＝${d*c}`,`□×${a}＝${d*c}−${b}＝${d*c-b}`,`□＝${d*c-b}÷${a}＝${x}`]);
    }},

    {title:'虫食い算（たし算）', page:'§3', gen:()=>mushiQ('＋',pick([2,3]))},
    {title:'虫食い算（ひき算）', page:'§3', gen:()=>mushiQ('−',3)},
    {title:'ボス：虫食い算（かけ算）', page:'§3', gen:()=>mushiQ('×',pick([2,3]))},
  ]
});

})();
