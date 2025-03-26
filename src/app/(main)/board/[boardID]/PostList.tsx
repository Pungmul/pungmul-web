'use client'

import { useCallback, useEffect, useRef, useState } from "react";
import { loadMorePosts } from "./utils";
import { debounce, throttle } from "lodash";
import { WebViewLink } from "../main/ResponsiveLink";

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


export default function PostList({ boardData, boardId }: { boardData: BoardData, boardId: number }) {

    const [postList, setPostList] = useState<RecentPost[]>(boardData.recentPostList.list)
    const [isLoading, setLoading] = useState(false)
    const [pageNum, setPageNum] = useState(0)
    const [isLast, setIsLast] = useState(false);
    const loaderRef = useRef(null); // 무한 스크롤을 감지할 마지막 요소

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    nextPage(); // 마지막 항목이 보이면 데이터 로드
                }
            },
            {
                rootMargin: "0px 0px 1000px 0px", // 200px 전에 트리거
            }
        );

        if (loaderRef.current) {
            observer.observe(loaderRef.current); // 마지막 항목에 옵저버 적용
        }
        // Cleanup (컴포넌트가 언마운트 될 때 옵저버 해제)
        return () => {
            if (loaderRef.current) {
                observer.unobserve(loaderRef.current);
            }
        };
    }, [isLoading, postList]);

    const nextPage = useCallback(debounce(() => {
        if(isLast) 
            return
        
        setLoading(true);
        setPageNum(prev => prev + 1)
    }, 1000), [])

    useEffect(() => {

        if(isLast) 
            return

        const loadNextPage = async () => {
            try {
                const nextPage = await loadMorePosts(boardId, pageNum) as BoardData;

                const { recentPostList } = nextPage;

                console.log(recentPostList.list.length)
                if (recentPostList.list.length < 10) setIsLast(true);

                setPostList(prev => [...prev, ...recentPostList.list])

            } catch {
                alert('불러오기 실패')
            }
        }

        if (pageNum > 0)
            loadNextPage()

    }, [pageNum])

    if (!boardData)
        return (
            <>로딩중</>)

    return (
        <div className="h-full overflow-y-auto"
        // ref={scrollRef} onScroll={handleScroll}
        >
            
            <div >

                {postList.map((post, index) => (
                    <WebViewLink
                        key={post.postId}
                        href={`/board/${boardId}/${post.postId}`}
                        style={{ gap: 12, paddingTop: 16, paddingBottom: 16, paddingLeft: 28, paddingRight: 28, borderTopWidth: 0.25, borderBottomWidth: 0.25, borderColor: '#E3E3E3' }} 
                        className={`w-full bg-white flex flex-col px-6 cursor-pointer`}
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
                    </WebViewLink>
                ))}
                <div ref={loaderRef}>{isLoading &&
                    <div className="flex justify-center items-center py-4">
                        <div className="w-12 h-12 border-8 border-t-8 border-gray-300 border-solid rounded-full animate-spin" style={{ borderColor: '#DDD transparent transparent transparent',animationDuration: '500ms'  }}></div>
                    </div>
                }</div>
            </div>
        </div>
    )
}