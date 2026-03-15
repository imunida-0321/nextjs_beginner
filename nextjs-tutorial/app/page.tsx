// serverActionでAPI Routesより少ないコードで同じ機能を実現できる
// API Routeと ServerActionの使い分けについて

export default function Home() {
	const createAction = async (formData: FormData) => {
		// use serverはuse clientみたいなものでcreateActionという関数がサーバーアクションになるということを
		// Next側に伝えるための重要な記述
		'use server'
		const name = formData.get('name')
		console.log('ServerActionで実行されました', name)
	}
	return (
		<form action={createAction}>
			<input type="text" name="name" />
			<button type="submit">送信</button>
		</form>
	)
}
