import { Suspense } from 'react'
import SlowComponent from './SlowComponent'

// ページの一部をローディング状態にするにはSuspence
// ページ全体をローディング状態にするにはSuspenceを使用せず、loading.tsxを使用する

export default async function Home() {
	return (
		<div>
			<h1>メインコンテンツ(すぐに表示)</h1>
			{/* Suspenceを使うことで、中身のみローディング状態にすることができる*/}
			{/* fallbackはSuspenceが読み込まれるまでに代わりに表示しておくUIを設定できる */}
			{/* <Suspense fallback={<div>重いコンポーネントを読み込み中</div>}> */}
			<SlowComponent />
			{/* </Suspense> */}
		</div>
	)
}
