import { loadPostList } from "./serverSide";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import PostList from "./PostList";
import PostingButton from "./PostingButton";
import { Header } from "@pThunder/app/component/Header";
import PostBoxSkelleton from "../../../component/PostBoxSkelleton";

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

            <div className="flex-grow overflow-y-auto">
                <Suspense fallback={
                        <PostBoxSkelleton length={5} />
                }>
                    <PostList boardData={boardData} boardId={params.boardID} />
                </Suspense>
            </div>
        </div>
    )
}