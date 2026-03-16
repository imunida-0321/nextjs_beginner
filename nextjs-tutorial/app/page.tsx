import { cacheTag, revalidatePath, revalidateTag } from 'next/cache'
import { useRouter } from 'next/navigation'

// use Cache使用
async function getHeavyData() {
	// use CacheでgetHeavyDataのキャッシュが保存される
	'use cache'
	//
	cacheTag('posts')
	await new Promise((resolve) => setTimeout(resolve, 3000))
	return '重いデータの取得完了'
}

fetch('hoge.com', {
	// tagsに対して配列を指定するとfecthで取得したデータにpostsというタグをつけれる。
	next: { tags: ['posts'] },
})

// これに対し消したいタグを指定することで、postsタグがついているデータを一掃できる。
revalidateTag('posts')

// next/routeの方ではなく、next/navigationの方を使用する
const router = useRouter()
// このrouterからrefreshという関数を呼び出す
router.refresh()

export default async function Home() {
	const data = await getHeavyData()
	return <h1>{data}</h1>
}
