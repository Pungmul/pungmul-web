import { Header } from "@pThunder/app/component/header";
import PostingButton from "./PostingButton";
import Link from "next/link";

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


export default function PostList({ boardData, boardId }: { boardData: BoardData,boardId:number }) {

    if (!boardData)
        return (
            <>로딩중</>)

    return (
        <>
            <Header title={boardData.boardInfo.rootCategoryName} rightBtn={<PostingButton boardID={boardId} />} />
            {boardData?.recentPostList?.list.map(post => (
                <Link href={`/board/${boardId}/${post.postId}`} key={post.postId} style={{ gap: 12, paddingTop: 16, paddingBottom: 16, paddingLeft: 28, paddingRight: 28 }} className={`w-full bg-white flex flex-col px-6 border-b cursor-pointer`}
                    prefetch={true}
                >
                    <div className="flex justify-between flex-col items-start">
                        <div style={{ fontSize: 14 }} className="w-full truncate">{post.title}</div>
                        <div style={{ fontSize: 12 }} className="text-gray-300 max-w-24 truncate">{post.author == 'Anonymous' ? '익명' : post.author}</div>
                    </div>
                    <div style={{ fontSize: 12 }} className="text-gray-400 w-full truncate">
                        {post.content}
                    </div>
                    <div className="flex flex-row gap-2 items-center justify-between">
                        <div className="flex flex-row gap-2 items-center">
                            <div className="flex flex-row items-center gap-1">
                                <div style={{ width: 12, height: 12 }} className=" bg-red-200" />
                                <div style={{ fontSize: 11 }} className="text-red-200" >{post.likedNum}</div>
                            </div>
                            <div className="flex flex-row items-center gap-1">
                                <div style={{ width: 12, height: 12 }} className=" bg-gray-200" />
                                <div style={{ fontSize: 11 }} >{post.viewCount}</div>
                            </div>
                        </div>
                        <div className="flex flex-row gap-2  items-end">

                            <div className="flex flex-row gap-1 items-center">
                                <div className="text-gray-400 text-xs">{post.timeSincePostedText}</div>
                            </div>
                        </div>
                    </div>
                </Link>
            ))}
        </>
    )
}