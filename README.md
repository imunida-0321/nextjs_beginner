# 【Next16対応】Next.js+TypeScript：基礎からデプロイまで、仕組みを理解して作る本格Webアプリ講座の実装（以降は学習メモ）

---

## ・Server Actionとは？

---

Server ActionでAPI Routesより少ないコードで同じ機能を実現できる<br>

### API Routeと ServerActionの使い分けについて<br>

---

- Server Action<br>
  - フォーム送信やボタンクリックなどのユーザー操作から、直接サーバー処理を呼べる。<br>
  - フェッチなどの通信コードを書かなくて良いので、コードが非常にシンプルになる。<br>
  - キャッシュ機能についても密接に連携しているところがあり、このような部分の扱いも手軽にできるメリットがある。
- API Routes<br>
  - Server Actionは外部のアプリから呼び出すことが非常に難しい。<br>
    例えば同じサービスのWEB版とネイティブアプリ版で同一のAPIを使いたいという場合に関しては、<br>
    API Routesで定義すると簡単に使うことができる。<br>
  - 他にも外部からのWEBフックを受け取りたい時や、API自体を公開してしまいたい場合はこちらの方が適している。<br>

## キャッシュ機能

---

- Next.jsにはデータを取得したり更新したりする方法を、さらに高速に扱うためのキャッシュ機能がある。<br>
- ※キャッシュとは計算した結果を保存しておいて、必要に応じて使いまわす仕組みのこと<br>
- キャッシュは高速化に寄与してくれるためすごく便利だが、キャッシュが正しく更新されない場合古いデータが表示されてしまうなどの不具合がある。これを適切に更新する仕組みについては[こちら](#キャッシュの更新について（Revalidation）)<br>
  N- ext.jsの４つのキャッシュ機能が以下になる<br>

1. Full Route Cache（サーバー側・ビルド時）<br>
   - ビルド時にHTMLを作成して保存
   - アクセス時は作り置きを返すだけ
   - サーバー負荷が低く、表示が爆速
2. Router Cache（ブラウザ側・ユーザー操作側）
   - ブラウザ側でページ情報を一時保存
   - 「戻る・進む」が瞬時に完了
   - リンクが見えた時点で裏で先読み
3. Request Memoization（サーバー側・1リクエスト内）
   - 1リクエスト内で重複処理をカット
   - 同じデータ取得は1回だけ実行
   - バケツリレーが不要に
4. Data Cache（サーバー側・永続的）
   - リクエストを跨いで永続的に保存
   - ユーザーAの結果をBさんにも共有
   - コードを書く際に明示的な設定が必要（Next.js 15~）

- Data Cacheはfetch関数にオプションを渡すことで利用することができる。
- 以下force-cacheをすることにより外部から取得したデータがキャッシュされ無駄な通信を減らすことができる<br>
  `fetch('hoge.com', { cache: 'force-cache' })`
- 無効化したい場合はno-storeを指定（デフォルトはno-storeなのでオプション指定なしだとキャッシュ機能無効化になる）<br>
  `fetch('hoge.com', { cache: 'force-cache' })` or `fetch('hoge.com')`

#### 注意点

Next14まではデフォルトが逆で`force-cache`がデフォルト(キャッシュ有効化)になっているため、Next14以前を使用する場合は注意

### Next15から登場した機能 useCache

#### use Cacheとは？

- Data Cacheをさらに強力に拡張したもの
- use Cacheはfetchを使用し通信結果はもちろんのこと、それ以外のあらゆる関数の実行結果をキャッシュとして保存できる

## キャッシュの更新について（Revalidation）

キャッシュを適切なタイミングで削除/更新する**Revalidation**という仕組みがある<br>
以下は前述で紹介した5つのキャッシュについて消し方という観点で紹介する

- **Request Memoization**についてはキャッシュの削除を意識する必要はない。<br>
  なぜならこのキャッシュは１回のリクエスト内という非常に短い時間でしか有効ではないため<br>
  画面を表示するための処理が終われば、その瞬間自動的に消滅する。

それ以外の手動で消すことができるキャッシュ達↓

- 流れとしてキャッシュがサーバー側に保存されるもの
  - Full Route Cache
  - Data Cache
  - use Cache

これらは一定のサイクルでNext側で削除してくれる。<br>

- これらに明示的に削除指示を出すこともでき、サーバ側のキャッシュを消す仕組みをRevalidation（リバリデーション）という。
- リバリデーションを行うことでData Cacheやuse Cacheが削除され、新しいデータの再取得が走るようになる。<br>
  そしてそれらは更新されると、連動してFull Route Cacheも自動的に作り直される仕組みとなっている。
- 大きく分けて**Revalidate Pass**と**Revalidate tag**という二つの方法がある。

#### Revalidate Pass

指定したページに関連するキャッシュを一括で消すという方法。<br>
引数に対して消したいページのパスを指定してあげると、このページに関するキャッシュを削除することができる。<br>
。以下だとトップページに使われているキャッシュなどが全て削除される
`revalidatePath('/')`<br>
例えば、記事を投稿したからトップページの一覧を最新にしたいなど、ページ単位の更新はこれが一番手っ取り早い

#### Revalidate Pass

細かく開発者側で指定したデータだけ狙い撃ちで消したい場合に使用する。<br>
使用するにはデータを取得する段階で、タグというものをつける必要がある。

```
// fecth関数の第二引数のオプションでnextというのがあり、その中にtagsというものがある
fetch('hoge.com', {
	// tagsに対して配列を指定するとfecthで取得したデータにpostsというタグをつけれる。
	next: { tags: ['posts'] },
})
```

fetch以外で例えばuse Cacheでも同様でtagsをつけたい場合は

```
async function getHeavyData() {
	// use CacheでgetHeavyDataのキャッシュが保存される
	'use cache'
	// ここでcacheTagを指定
	cacheTag('posts')
	await new Promise((resolve) => setTimeout(resolve, 3000))
	return '重いデータの取得完了'
}
```

cacheTagという関数があり同じく名前を指定するすることで、getHeavyData関数で取得したデータに対しても<br>postsというタグをつけることができる。<br>
こうしてタグをつけておくと更新する時に、そのタグを指定してキャッシュを削除することができる。

```
// revalidateTagに対し消したいタグを指定することで、postsタグがついているデータを一掃できる。
revalidateTag('posts')
```

ここまではサーバ側のキャッシュの話だが、

- Router Cache（ブラウザ側・ユーザー操作側）

についてはサーバーではなくクライアントブラウザ側に保存されているキャッシュになるため、<br>
サーバー側でRevalidationを行うだけでは削除できずブラウザに古い画面が残ってしまうことがある。<br>
これを防ぐためにはブラウザ側で**ルーターリフレッシュという関数を使って画面を強制的に更新する必要がある。**<br>

```
// next/routeの方ではなく、next/navigationの方を使用する
const router = useRouter()
router.refresh()
```

このrouterからrefreshという関数を呼び出すだけで、Router Cacheを無効化してサーバーから最新のエータを取得し直すことができる。

- 注意点
  NextのServer Actionを使用している場合はrouter.refresh()を手動で呼ぶ必要はない。<br>
  Server Actionの中でRevalidate PassとRevalidate tagを実行すると、Next側は自動的にサーバー側のデータが変わったことを検知し、レスポンスを返す際にブラウザ側のRouter Cacheも一緒に更新してくれる。<br>
  Server Actionを中心に開発しているとRouter Cacheの存在も意識することはない。<br>
  ただServer Actionを使用せずに、API Routesを使用していたり、Nextの外にAPIを持っている場合はrouter.refreshが必要になってくるケースもある。
