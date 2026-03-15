// serverActionでAPI Routesより少ないコードで同じ機能を実現できる

export default function Home() {
	const createAction = async (formData: FormData) => {
		// use serverはuse clientみたいなものでcreateActionという関数がサーバーアクションになるということを
		// Next側に伝えるための重要な記述
		'use server'
		const name = formData.get('name')
		console.log('ServerActionで実行されました', name)
	}
	// データキャッシュはfetch関数にオプションを渡すことで利用することができる。
	// 以下force-cacheをすることにより外部から取得したデータがキャッシュされ無駄な通信を減らすことができる
	fetch('hoge.com', { cache: 'force-cache' })
	// 無効化したい場合はno-storeを指定（デフォルトはno-storeなのでオプション指定なしだとキャッシュ機能無効化になる）
	// ただNext14まではデフォルトが逆でforce-cacheがデフォルト(キャッシュ機能有効化)になっている
	fetch('hoge.com', { cache: 'no-store' })
	fetch('hoge.com')
	return (
		<form action={createAction}>
			<input type="text" name="name" />
			<button type="submit">送信</button>
		</form>
	)
}
