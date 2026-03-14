export default async function InterceptedPhotoPage({
	params,
}: {
	params: Promise<{ id: string }>
}) {
	const { id } = await params
	return (
		<div>
			<h1>Intercepted Photo Page ID: {id}</h1>
			<p>これはインターセプトされた画面です</p>
		</div>
	)
}
