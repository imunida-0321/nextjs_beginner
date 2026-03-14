'use client'
import { useEffect } from 'react'

// これでクライアントコンポーネントと認識される
// つけたからと言ってなんでも自由に書けるわけではない

export default function Home() {
	// window is not definedとエラーが出る
	// 実行できない理由はNext.jsではクライアントコンポーネントであってもサーバ側でHTMLを生成しようとする
	// その際にwindow.alertも一緒に実行されてしまい、そこでエラーになる

	// window.alert('Hello')

	// 解決するにはuseEffectを使用する
	// 画面表示後に実行される
	useEffect(() => {
		window.alert('Hello')
	}, [])
	return (
		<div>
			<h1>Hello World</h1>
			<button onClick={() => alert('Clicked')}>Click Me!</button>
		</div>
	)
}
