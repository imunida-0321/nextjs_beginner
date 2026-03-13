export default async function BlagPage({params}:{
    params: Promise<{id: string}>
}) {
    const {id} = await params;
    return <h1>Blog ID: {id}</h1>
}