// =============================================================
//  算数「線分図と和差算」 イロハ（3年生）向け
//  §1 数量の関係を線分図に表す / §2 2つの数量の和差算 / §3 3つの数量の和差算
// =============================================================
(function(){

// ---- 線分図をかく ----
// rows: [{name, parts:[{len, label, dash}]}]   total: 右の かっこ に書く文字
function seg(rows,total){
  const W=330,X0=58,MAXW=200,rh=40,H=rows.length*rh+30;
  const max=Math.max(...rows.map(r=>r.parts.reduce((a,p)=>a+p.len,0)));
  const k=MAXW/max;let s=`<svg viewBox="0 0 ${W} ${H}" style="color:inherit">`;
  rows.forEach((r,i)=>{
    const y=18+i*rh;let x=X0;
    s+=`<text x="${X0-8}" y="${y+5}" text-anchor="end" font-size="14" fill="currentColor">${r.name}</text>`;
    s+=`<line x1="${x}" y1="${y-6}" x2="${x}" y2="${y+6}" stroke="currentColor" stroke-width="2"/>`;
    r.parts.forEach(p=>{
      const w=p.len*k;
      s+=`<line x1="${x}" y1="${y}" x2="${x+w}" y2="${y}" stroke="${p.dash?'#E4572E':'currentColor'}" stroke-width="${p.dash?3:2.5}" ${p.dash?'stroke-dasharray="5 4"':''}/>`;
      s+=`<line x1="${x+w}" y1="${y-6}" x2="${x+w}" y2="${y+6}" stroke="currentColor" stroke-width="2"/>`;
      if(p.label)s+=`<text x="${x+w/2}" y="${y+20}" text-anchor="middle" font-size="12" fill="${p.dash?'#E4572E':'currentColor'}">${p.label}</text>`;
      x+=w;});
  });
  if(total){const xb=X0+MAXW+12,y1=10,y2=18+(rows.length-1)*rh+8;
    s+=`<path d="M${xb} ${y1} q8 0 8 8 V${(y1+y2)/2-6} l6 6 l-6 6 V${y2-8} q0 8 -8 8" fill="none" stroke="currentColor" stroke-width="1.5"/>`;
    s+=`<text x="${xb+18}" y="${(y1+y2)/2+5}" font-size="13" fill="currentColor">${total}</text>`;}
  return s+'</svg>';
}

const NAMES=['たけし','まりこ','ゆうと','さくら','けいた','みお'];
const PAIRS=[['兄','弟'],['姉','妹'],['お父さん','ぼく'],['赤組','白組']];
const THINGS=[['ビー玉','個'],['カード','まい'],['どんぐり','個'],['シール','まい'],['おはじき','個']];

registerUnit({
  id:'sansu-wasazan',
  subject:'sansu',
  players:['イロハ'],
  title:'線分図と和差算',
  desc:'線分図をかいて、和と差から数を求めよう',
  levels:[

    // ---------- §1 線分図 ----------
    {title:'線分図：残りはいくつ', page:'§1', gen:()=>{
      const n=pick(NAMES),tot=pick([500,600,800,1000]);
      let a,b;do{a=ri(10,50)*10;b=ri(5,30)*10;}while(a+b>=tot-50);
      return Q(`${n}さんは${tot}円を持って買い物に行き、${a}円の本を1さつと、${b}円のおかしを1個買いました。残りのお金は何円ですか。`,
        '円',tot-a-b,
        'はじめのお金から「使ったお金の合計」をひこう。先に、使ったお金の合計を出すよ',
        [`使ったお金：${a}＋${b}＝${a+b}円`,`残りのお金：${tot}−${a+b}＝${tot-a-b}円`],
        seg([{name:'お金',parts:[{len:tot-a-b,label:'残り'},{len:b,label:b+'円'},{len:a,label:a+'円'}]}],tot+'円'));
    }},

    {title:'線分図：同じ数ずつあげる', page:'§1', gen:()=>{
      const n=pick(NAMES),[th,u]=pick(THINGS),k=pick([2,2,3]),each=ri(6,25),left=ri(10,45),tot=left+each*k;
      const who=k===2?'妹と弟':'3人の友だち';
      return Q(`${n}さんは、${th}を${tot}${u}持っています。${who}に同じ数ずつあげると、残りは${left}${u}になりました。1人に何${u}ずつあげましたか。`,
        u,each,
        `まず「あげた${th}の合計」を出そう。それを${k}人で同じ数ずつに分けるよ`,
        [`あげた合計：${tot}−${left}＝${tot-left}${u}`,`1人分：${tot-left}÷${k}＝${each}${u}`],
        seg([{name:th,parts:[{len:left,label:'残り'+left},...Array.from({length:k},()=>({len:each,label:'？'}))]}],tot+u));
    }},

    // ---------- §2 2つの数量の和差算 ----------
    {title:'和差算：小さい方', page:'§2', gen:()=>{
      const [A,B]=pick(PAIRS),[th,u]=pick(THINGS),sm=ri(8,40),d=ri(4,30),sum=sm*2+d;
      return Q(`${A}と${B}が持っている${th}の合計は${sum}${u}で、${A}は${B}よりも${d}${u}多く持っています。${B}は何${u}持っていますか。`,
        u,sm,
        `${A}が${d}${u}少なかったら、2人は同じ数。合計から${d}をひくと、${B}の2つ分になるよ`,
        [`${A}を${B}にそろえる：${sum}−${d}＝${sum-d}${u}`,`これが${B}の2つ分：${sum-d}÷2＝${sm}${u}`],
        seg([{name:A,parts:[{len:sm},{len:d,label:'差'+d,dash:true}]},{name:B,parts:[{len:sm}]}],'和'+sum));
    }},

    {title:'和差算：大きい方', page:'§2', gen:()=>{
      const [A,B]=pick(PAIRS),[th,u]=pick(THINGS),sm=ri(8,40),d=ri(4,30),sum=sm*2+d,bg=sm+d;
      return Q(`${A}と${B}が持っている${th}の合計は${sum}${u}で、${A}は${B}よりも${d}${u}多く持っています。${A}は何${u}持っていますか。`,
        u,bg,
        `${B}が${d}${u}多かったら、2人とも${A}と同じ数。合計に${d}をたすと、${A}の2つ分になるよ`,
        [`${B}を${A}にそろえる：${sum}＋${d}＝${sum+d}${u}`,`これが${A}の2つ分：${sum+d}÷2＝${bg}${u}`],
        seg([{name:A,parts:[{len:bg}]},{name:B,parts:[{len:sm},{len:d,label:'＋'+d,dash:true}]}],'和'+sum));
    }},

    {title:'和差算：両方求める', page:'§2', gen:()=>{
      const [A,B]=pick(PAIRS),[th,u]=pick(THINGS),sm=ri(10,60),d=ri(4,40),sum=sm*2+d,bg=sm+d;
      return P(`${A}と${B}が持っている${th}の合計は${sum}${u}で、${A}は${B}よりも${d}${u}多く持っています。${A}と${B}はそれぞれ何${u}持っていますか。`,
        [[A,u],[B,u]],[bg,sm],
        `どちらか一方にそろえよう。小さい方にそろえるなら「合計−差」、大きい方なら「合計＋差」が2つ分`,
        [`${B}にそろえる：(${sum}−${d})÷2＝${sm}${u} … ${B}`,`${A}は ${sm}＋${d}＝${bg}${u}`],
        seg([{name:A,parts:[{len:sm},{len:d,label:'差'+d,dash:true}]},{name:B,parts:[{len:sm}]}],'和'+sum));
    }},

    {title:'和差算：いろいろな文章題', page:'§2', gen:()=>{
      const t=ri(0,2);
      if(t===0){const sm=ri(15,60),d=ri(5,30),sum=sm*2+d;
        return P(`長さ${sum}cmのリボンを2本に切ったところ、長い方は短い方より${d}cm長くなりました。長い方と短い方はそれぞれ何cmですか。`,
          [['長い方','cm'],['短い方','cm']],[sm+d,sm],
          '短い方にそろえると「全体−差」が短い方の2本分',
          [`短い方：(${sum}−${d})÷2＝${sm}cm`,`長い方：${sm}＋${d}＝${sm+d}cm`],
          seg([{name:'長い方',parts:[{len:sm},{len:d,label:'差'+d,dash:true}]},{name:'短い方',parts:[{len:sm}]}],sum+'cm'));}
      if(t===1){const sm=ri(4,15),d=ri(2,8),sum=sm*2+d;
        return P(`姉と妹の年れいをたすと${sum}才です。姉は妹より${d}才年上です。姉と妹はそれぞれ何才ですか。`,
          [['姉','才'],['妹','才']],[sm+d,sm],
          '妹にそろえると「合計−差」が妹の2人分',
          [`妹：(${sum}−${d})÷2＝${sm}才`,`姉：${sm}＋${d}＝${sm+d}才`],
          seg([{name:'姉',parts:[{len:sm},{len:d,label:'差'+d,dash:true}]},{name:'妹',parts:[{len:sm}]}],sum+'才'));}
      const sm=ri(10,40)*10,d=ri(2,20)*10,sum=sm*2+d;
      return P(`ノートとペンを1つずつ買うと、代金は${sum}円です。ノートはペンより${d}円高いそうです。ノートとペンはそれぞれ何円ですか。`,
        [['ノート','円'],['ペン','円']],[sm+d,sm],
        'ペンにそろえると「代金−差」がペン2本分',
        [`ペン：(${sum}−${d})÷2＝${sm}円`,`ノート：${sm}＋${d}＝${sm+d}円`],
        seg([{name:'ノート',parts:[{len:sm},{len:d,label:'差'+d,dash:true}]},{name:'ペン',parts:[{len:sm}]}],sum+'円'));
    }},

    // ---------- §3 3つの数量の和差算 ----------
    {title:'3つの数量：いちばんの差', page:'§3', gen:()=>{
      const x=ri(2,30)*10,y=ri(2,20)*10,c=ri(20,80)*10;
      return Q(`お兄さん、かずお君、弟の3人でおこづかいを分けました。お兄さんはかずお君より${x}円多く、かずお君は弟より${y}円多くなりました。お兄さんは弟より何円多いですか。`,
        '円',x+y,
        '線分図をかくと、お兄さんと弟の差は「2つの差をつなげた長さ」になっているよ',
        [`${x}＋${y}＝${x+y}円`],
        seg([{name:'兄',parts:[{len:c},{len:y,label:y,dash:true},{len:x,label:x,dash:true}]},{name:'かずお',parts:[{len:c},{len:y,label:y,dash:true}]},{name:'弟',parts:[{len:c}]}]));
    }},

    {title:'3つの数量：それぞれ求める', page:'§3', gen:()=>{
      const x=ri(2,20)*100,y=ri(2,12)*100,c=ri(10,40)*100,b=c+y,a=b+x,tot=a+b+c;
      return P(`${tot}円のおこづかいを、お兄さん、かずお君、弟の3人で分けました。お兄さんはかずお君より${x}円多く、かずお君は弟より${y}円多くなりました。3人はそれぞれ何円ですか。`,
        [['兄','円'],['かずお','円'],['弟','円']],[a,b,c],
        `いちばん少ない弟にそろえよう。お兄さんは弟より${x}＋${y}円多いので、合計から「${x+y}」と「${y}」をひくと、弟の3人分になるよ`,
        [`お兄さんと弟の差：${x}＋${y}＝${x+y}円`,`弟にそろえる：${tot}−${x+y}−${y}＝${tot-x-y-y}円`,`弟：${tot-x-2*y}÷3＝${c}円`,`かずお君：${c}＋${y}＝${b}円　お兄さん：${b}＋${x}＝${a}円`],
        seg([{name:'兄',parts:[{len:c},{len:x+y,label:(x+y)+'円',dash:true}]},{name:'かずお',parts:[{len:c},{len:y,label:y+'円',dash:true}]},{name:'弟',parts:[{len:c}]}],tot+'円'));
    }},

    {title:'ボス：3つの数量（多い・少ない）', page:'§3', gen:()=>{
      const [th,u]=pick(THINGS),x=ri(3,20),y=ri(3,15),c=ri(10,40),b=c+y,a=b+x,tot=a+b+c;
      return P(`さくら、ゆうと、みおの3人が${th}を合わせて${tot}${u}持っています。さくらはゆうとより${x}${u}多く、みおはゆうとより${y}${u}少ないそうです。3人はそれぞれ何${u}持っていますか。`,
        [['さくら',u],['ゆうと',u],['みお',u]],[a,b,c],
        `線分図で、いちばん少ないのはだれかな？みおにそろえると、さくらはみおより${x}＋${y}多く、ゆうとは${y}多いよ`,
        [`いちばん少ないのはみお`,`さくらとみおの差：${x}＋${y}＝${x+y}${u}`,`みおにそろえる：${tot}−${x+y}−${y}＝${tot-x-2*y}${u}`,`みお：${tot-x-2*y}÷3＝${c}${u}　ゆうと：${c}＋${y}＝${b}${u}　さくら：${b}＋${x}＝${a}${u}`],
        seg([{name:'さくら',parts:[{len:c},{len:x+y,label:'?',dash:true}]},{name:'ゆうと',parts:[{len:c},{len:y,label:y,dash:true}]},{name:'みお',parts:[{len:c}]}],tot+u));
    }},
  ]
});

})();
