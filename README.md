# かんいろの旅

カンナとイロハの毎日学習アプリ（国語・算数・理科・社会）。

公開URL: https://primetime211-del.github.io/quiz/

## ファイル構成

```
index.html          画面のデザインと、読みこむ単元の一覧
app.js              共通のしくみ（ふだん触らない）
units/
  sansu-hayasa.js   算数「速さ」（カンナ）
  sansu-wasazan.js  算数「線分図と和差算」（イロハ）
  sansu-gyakuzan.js 算数「□を求める問題」（イロハ・電卓なし）
  sansu-shosu.js    算数「小数」（イロハ・電卓なし）
  sansu-kakudo.js   算数「角度」（イロハ）
  _template.js      新しい単元のひな形（読みこまれない）
```

## 単元の追加方法

1. `units/_template.js` をコピーして名前を変える（例：`units/rika-tenki.js`）
2. 中の `id` `subject` `players` `title` `levels` を書きかえる
   （`players:['イロハ']` のように書くと、その人のときだけ表示されます）
   （`calc:false` と書くと、電卓なしの数字キーになります）
   （レベルに `daily:false` と書くと、今日のチャレンジに出ません）
3. `index.html` の「単元ファイル」の所に1行足す

```html
<script src="units/rika-tenki.js"></script>
```

4. GitHubに2つのファイル（新しい単元ファイルと index.html）をアップロード

## 記録

⭐と連続日数は、端末のブラウザに保存されます（プレイヤーごと）。
連続日数は教科をまたいで共通で、どの単元でも1回終えればその日にカウントされます。
