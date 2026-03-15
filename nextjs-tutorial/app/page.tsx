// 今回はフォームが送信された時にapi/createのエンドポイントを叩く
// ブラウザ側のイベントフォームのonSubmitを扱う必要があるため、use clientを使用しClientコンポーネントにする
'use client'
type FormSubmitEv = { preventDefault(): void; currentTarget: HTMLFormElement }

// clientコンポーネントなのでasyncは使えないよ
export default function Home() {
	const handleSubmit = async (e: FormSubmitEv) => {
		// フォーム自体のsubmit処理のキャンセル
		e.preventDefault()
		// その上でe.currentTargetを渡してあげて
		const form = new FormData(e.currentTarget)
		// formの中のnameという名前のinputに入っている値を取り出す
		const name = form.get('name')

		await fetch('/api/create', {
			// createでPOSTを指定しているのでPOSTを定義
			method: 'POST',
			// JSONで送りたいのでjson指定
			headers: {
				'Content-Type': 'application/json',
			},
			// 実際にエンドポイントに渡すデータを定義
			// 以下の書き方はnameをjson形式に変換した上でapi/createのエンドポイントに送っている
			body: JSON.stringify({ name }),
		})
	}
	return (
		<form onSubmit={handleSubmit}>
			<input type="text" name="name" />
			<button type="submit">送信</button>
		</form>
	)
}
