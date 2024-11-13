'use client'

import { useEffect, useState } from "react"
import { useRouter, useSelectedLayoutSegments } from "next/navigation";
import { loadPosts } from "./utils";

interface BoardInfo {
    rootCategoryName: string;
    childCategoryName: string | null;
}

interface HotPost {
    postId: number;
    title: string;
    content: string;
    viewCount: number;
    likedNum: number;
    timeSincePosted: number;
    timeSincePostedText: string;
    author: string;
}

interface RecentPost {
    postId: number;
    title: string;
    content: string;
    viewCount: number;
    likedNum: number;
    timeSincePosted: number;
    timeSincePostedText: string;
    author: string;
}

interface RecentPostList {
    total: number;
    list: RecentPost[];
    pageNum: number;
    pageSize: number;
    isFirstPage: boolean;
    isLastPage: boolean;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
}

export interface BoardData {
    boardInfo: BoardInfo;
    hotPost: HotPost;
    recentPostList: RecentPostList;
}


export default function PostList({ params, data }: { params: { boardID: number }, data: BoardData }) {
    const router = useRouter();
    const { boardID } = params

    const segments = useSelectedLayoutSegments();
    const [BoardData, setData] = useState<BoardData>(data);
    const [page, setPage] = useState(1);

    useEffect(() => {
        const loadPage = async () => {
            try {
                const data = await loadPosts(boardID) as BoardData;
                console.log(data)
                setData(data);
            } catch (e) { console.error(e) }
        }

        loadPage();
    }, [])

    return (
        <>
            {BoardData?.recentPostList?.list.map(post => (
                <div key={post.postId} className={`w-full flex flex-col px-4 py-4 border-b cursor-pointer ${Number(segments.join('/')) == post.postId ? 'bg-gray-100' : ''}`}
                    onClick={() => {
                        router.push(`/board/${boardID}/${post.postId}`)
                    }}>
                    <div className="flex justify-between flex-row gap-4 items-start">
                        <div className="text-gray-500 text-sm max-w-24 truncate">{post.author == 'Anonymous' ? '익명' : post.author}</div>
                        <div className="font-semibold max-w-48 truncate">{post.title}</div>
                    </div>
                    <div className="flex flex-row gap-2 items-center justify-between">
                        <div className="flex flex-row gap-1 items-center"><div className="w-3 h-3 bg-red-200" /><div>{post.likedNum}</div></div>
                        <div className="flex flex-row gap-2  items-end">

                            <div className="flex flex-row gap-1 items-center">
                                <div className="w-3 h-3 bg-gray-200" /><div>{post.viewCount}</div>
                            </div>
                            <div className="text-gray-400 text-xs">{post.timeSincePostedText}</div>
                        </div>
                    </div>
                </div>
            ))}
        </>
    )
}