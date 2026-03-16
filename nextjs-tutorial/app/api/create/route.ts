import { NextResponse } from 'next/server'

// API RoutesとはNextの中にWebAPIのエンドポイントを作れる機能
// APIを定義するにはルーティングと同じくルールに則ってフォルダやファイルを作ることで簡単に定義できる
// app配下にapi/〜/route.tsを作成する → APIのエンドポイントが作成できる。
export async function POST(request: Request) {
	const data = await request.json()
	console.log('API Routesで受け取りました', data.name)
	return NextResponse.json({ message: '成功しました' })
}
