// use Cache使用前
// 実際に重いデータを取得してるわけではないがsetTimeoutで擬似的に再現
// async function getHeavyData() {
// 	await new Promise((resolve) => setTimeout(resolve, 3000))
// 	return '重いデータの取得完了'
// }

// export default async function Home() {
// 	const data = await getHeavyData()
// 	return <h1>{data}</h1>
// }

// use Cache使用
async function getHeavyData() {
	// これでgetHeavyDataのキャッシュが保存される
	'use cache'
	await new Promise((resolve) => setTimeout(resolve, 3000))
	return '重いデータの取得完了'
}

export default async function Home() {
	const data = await getHeavyData()
	return <h1>{data}</h1>
}
