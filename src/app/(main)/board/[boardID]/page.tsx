import { loadPostList } from "./serverSide";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import PostList from "./PostList";
import PostingButton from "./PostingButton";
import { Header } from "@pThunder/app/component/header";

export default async function BoardPage({
    params
}: Readonly<{
    params: { boardID: number }
}>) {
    const { boardID } = params;
    const boardData = await loadPostList(boardID);

    console.log(boardData, 'in Page');

    if (!boardData) {
        return notFound();
    }

    return (
        <div className="relative h-full flex flex-col">
            <Header title={boardData.boardInfo.rootCategoryName} rightBtn={<PostingButton boardID={boardID} />} />

            <div className="flex-grow">
                <Suspense fallback={<div style={{ flex: 1, backgroundColor: '#DDD' }}>Loading...</div>}>
                    <PostList boardData={boardData} boardId={params.boardID} />
                </Suspense>
            </div>
        </div>
    )
}