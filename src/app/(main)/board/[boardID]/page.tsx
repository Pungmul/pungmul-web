import { loadPostList } from "./serverSide";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import dynamic from "next/dynamic";
import PostList from "./PostList";

export default async function BoardPage({
    params
}: Readonly<{
    params: { boardID: number }
}>) {
    const boardData = await loadPostList(params.boardID);

    console.log(boardData, 'in Page');

    if (!boardData) {
        return notFound();
    }

    return (
        <div className="relative">
            <Suspense fallback={<div style={{flex:1, backgroundColor:'#DDD'}}>Loading...</div>}>
                <PostList boardData={boardData} boardId={params.boardID} />
            </Suspense>
        </div>
    )
}