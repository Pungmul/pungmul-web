'use client'

import { useCallback, useEffect, useRef, useState } from "react";
import { loadMorePosts } from "./utils";
import { debounce, throttle } from "lodash";
import PostBox from "../../../../component/post/PostBox";
import PostBoxSkelleton from "../../../../component/post/PostBoxSkelleton";
import DragScroll from "@pThunder/component/shared/DragScroll";

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

    const [postList, setPostList] = useState<RecentPost[]>(boardData.recentPostList.list);
    const [pageNum, setPageNum] = useState(0);
    const [isLoading, setLoading] = useState(false);
    const [isLast, setIsLast] = useState(false);

    const loaderRef = useRef(null); // 무한 스크롤을 감지할 마지막 요소

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    if (!isLast) {
                        setLoading(true)
                        nextPage(pageNum); // 마지막 항목이 보이면 데이터 로드
                    }
                }
            },
            {
                rootMargin: "0px 0px 60px 0px", // 200px 전에 트리거
            }
        );

        if (loaderRef.current) {
            observer.observe(loaderRef.current); // 마지막 항목에 옵저버 적용
        }

        if (isLast)
            if (loaderRef.current) {
                observer.unobserve(loaderRef.current);
            }
        // Cleanup (컴포넌트가 언마운트 될 때 옵저버 해제)
        return () => {
            if (loaderRef.current) {
                observer.unobserve(loaderRef.current);
            }
        };
    }, [postList, isLast]);

    const nextPage = useCallback(
        debounce((pageNum) => {
            const loadNextPage = async () => {
                if (isLast || isLoading) return;

                try {
                    console.log("Fetching new posts...");
                    const nextPageData = (await loadMorePosts(boardId, pageNum)) as BoardData;
                    const { recentPostList } = nextPageData;

                    if (recentPostList.list.length < 10) setIsLast(true);

                    setPostList((prev) => [...prev, ...recentPostList.list]);
                    setPageNum((prev) => prev + 1);
                } catch (error) {
                    console.error("Error fetching posts:", error);
                    alert("불러오기 실패");
                } finally {
                    setLoading(false);
                }
            };

            loadNextPage();
        }, 1000),
        [isLast, isLoading]
    );

    if (!boardData)
        return (
            <>로딩중</>)

    return (

        <div className="flex flex-col overflow-hidden">
            <div className="h-0">
                <button >새로 고침</button>
            </div>
            <DragScroll>
                {postList.map((post) => (
                    <PostBox
                        boardId={boardId}
                        post={post}
                    />
                ))}
                {isLoading &&
                    <PostBoxSkelleton length={3} />
                }
                <div ref={loaderRef} className="h-[1px]" />
            </DragScroll>
        </div>
    )
}