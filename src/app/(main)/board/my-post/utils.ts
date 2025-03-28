import { cookies } from "next/headers";

interface RecentPost {
    postId: number;
    title: string;
    content: string;
    viewCount: number;
    likedNum: number;
    categoryId: number;
    timeSincePosted: number;
    timeSincePostedText: string;
    author: string;
}

interface UserPosts {
    total: number;
    list: RecentPost[];
    pageNum: number;
    pageSize: number;
    isFirstPage: boolean;
    isLastPage: boolean;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
}

export async function loadPostList(): Promise<UserPosts | null> {

    try {

        const proxyUrl = `/board/my-post/api`;

        const proxyResponse = await fetch(proxyUrl, {
            next: {
                revalidate: 10, // 이 부분만 추가
            },
            credentials: 'include',
            cache: 'no-cache'
        });

        if (!proxyResponse.ok) throw Error('서버 불안정' + proxyResponse.status)

        const data = await proxyResponse.json();
        const { userPosts } = await data;
        // console.log(response);
        console.log(userPosts)

        return userPosts

    } catch (error) {

        console.error('프록시 처리 중 에러:', error);
        if (error instanceof Error)
            throw Error(error.message);
        else alert('알수 없는 에러')
        return null;
    }
}