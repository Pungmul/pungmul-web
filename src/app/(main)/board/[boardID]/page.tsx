import PostList, { BoardData } from "./PostList";

export default function Page({
    params
}: Readonly<{
    params: { boardID: number, data: BoardData }
}>) {
    return (
        <>
            <PostList params={params} data={params.data} />
        </>
    )
}