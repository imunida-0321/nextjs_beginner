type Post = {
	id: number
	title: string
}

export default async function Home() {
	// fetchには独自の強力な機能がある、キャッシュの機能
	// 通常は外部のAPIにデータを取得しにいくのをページを表示するために毎回実行してしまうと通信が発生し時間がかかる
	// Next.jsのfetch関数は、サーバー側にこっそり保存しておき、次に同じデータが必要になったときは
	// 外部APIではなくNextのサーバー常に保存しておいたデータを返してくれる→これにより無駄な通信を防ぎ高速な表示が可能となる
	// キャッシュではなく新しいデータを1から取得する細かいキャッシュの制御方法については、後続のレクチャーで解説
	const res = await fetch('https://jsonplaceholder.typicode.com/posts')
	const posts: Post[] = await res.json()
	return (
		<div>
			<h1>記事一覧</h1>
			<ul>
				{posts.map((post) => (
					<li key={post.id}>{post.title}</li>
				))}
			</ul>
		</div>
	)
}
