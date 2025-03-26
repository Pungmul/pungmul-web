import { loadPostList } from "./serverSide";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import PostList from "./PostList";
import { headers } from "next/headers";

export default async function MyPostsPage(req: Request) {

    console.log(req.url, "url")
    const boardData = await loadPostList();

    if (!boardData) {
        return notFound();
    }

    return (
        <div className="w-full h-full">
            <Suspense fallback={<div style={{ flex: 1, backgroundColor: '#DDD' }}>Loading...</div>}>
                <PostList boardData={boardData} />
            </Suspense>
        </div>
    )
}