import { fetchWithRefresh } from "@pThunder/core";
export const dynamic = "force-dynamic";
export async function GET() {
  try {
    const proxyUrl = `${process.env.BASE_URL}/api/posts/user`;

    const proxyResponse = await fetchWithRefresh(proxyUrl);

    if (!proxyResponse.ok) throw Error("서버 불안정" + proxyResponse.status);

    const { response } = await proxyResponse.json();
    console.log(response);
    return Response.json(response.userPosts);
  } catch (error) {
    console.error("프록시 처리 중 에러:", error);
    return new Response("프록시 처리 실패", { status: 500 });
  }
}

/**
 * "userPosts": {
            "total": 20,
            "list": [
                {
                    "postId": 135,
                    "title": "우예!",
                    "content": "우예~",
                    "viewCount": 0,
                    "likedNum": 1,
                    "timeSincePosted": 85570,
                    "timeSincePostedText": "5/26",
                    "categoryId": 1,
                    "categoryName": "자유 게시판",
                    "author": "Anonymous"
                },
                {
                    "postId": 124,
                    "title": "게시글 제목 예시2",
                    "content": "이것은 게시글의 본문 내용입니다.",
                    "viewCount": 0,
                    "likedNum": 0,
                    "timeSincePosted": 170582,
                    "timeSincePostedText": "3/28",
                    "categoryId": 1,
                    "categoryName": "자유 게시판",
                    "author": "Anonymous"
                },
                {
                    "postId": 123,
                    "title": "게시글 제목 예시2",
                    "content": "이것은 게시글의 본문 내용입니다.",
                    "viewCount": 0,
                    "likedNum": 0,
                    "timeSincePosted": 170590,
                    "timeSincePostedText": "3/28",
                    "categoryId": 1,
                    "categoryName": "자유 게시판",
                    "author": "Anonymous"
                },
                {
                    "postId": 122,
                    "title": "게시글 제목 예시2",
                    "content": "이것은 게시글의 본문 내용입니다.",
                    "viewCount": 0,
                    "likedNum": 0,
                    "timeSincePosted": 170593,
                    "timeSincePostedText": "3/28",
                    "categoryId": 1,
                    "categoryName": "자유 게시판",
                    "author": "Anonymous"
                },
                {
                    "postId": 121,
                    "title": "게시글 제목 예시2",
                    "content": "이것은 게시글의 본문 내용입니다.",
                    "viewCount": 0,
                    "likedNum": 0,
                    "timeSincePosted": 170593,
                    "timeSincePostedText": "3/28",
                    "categoryId": 1,
                    "categoryName": "자유 게시판",
                    "author": "Anonymous"
                },
                {
                    "postId": 120,
                    "title": "게시글 제목 예시2",
                    "content": "이것은 게시글의 본문 내용입니다.",
                    "viewCount": 0,
                    "likedNum": 0,
                    "timeSincePosted": 170711,
                    "timeSincePostedText": "3/28",
                    "categoryId": 1,
                    "categoryName": "자유 게시판",
                    "author": "Anonymous"
                },
                {
                    "postId": 117,
                    "title": "게시글 제목 예시2",
                    "content": "이것은 게시글의 본문 내용입니다.",
                    "viewCount": 0,
                    "likedNum": 0,
                    "timeSincePosted": 173386,
                    "timeSincePostedText": "3/26",
                    "categoryId": 1,
                    "categoryName": "자유 게시판",
                    "author": "Anonymous"
                },
                {
                    "postId": 116,
                    "title": "게시글 제목 예시2",
                    "content": "이것은 게시글의 본문 내용입니다.",
                    "viewCount": 0,
                    "likedNum": 0,
                    "timeSincePosted": 173448,
                    "timeSincePostedText": "3/26",
                    "categoryId": 1,
                    "categoryName": "자유 게시판",
                    "author": "Anonymous"
                },
                {
                    "postId": 102,
                    "title": "게시글 제목 예시2",
                    "content": "이것은 게시글의 본문 내용입니다.",
                    "viewCount": 0,
                    "likedNum": 0,
                    "timeSincePosted": 203521,
                    "timeSincePostedText": "3/5",
                    "categoryId": 1,
                    "categoryName": "자유 게시판",
                    "author": "Anonymous"
                },
                {
                    "postId": 100,
                    "title": "게시글 제목 예시2",
                    "content": "이것은 게시글의 본문 내용입니다.",
                    "viewCount": 0,
                    "likedNum": 0,
                    "timeSincePosted": 203534,
                    "timeSincePostedText": "3/5",
                    "categoryId": 1,
                    "categoryName": "자유 게시판",
                    "author": "Anonymous"
                },
                {
                    "postId": 99,
                    "title": "게시글 섹스 예시2",
                    "content": "이것은 게시글의 본문 내용입니다.",
                    "viewCount": 0,
                    "likedNum": 1,
                    "timeSincePosted": 203540,
                    "timeSincePostedText": "3/5",
                    "categoryId": 1,
                    "categoryName": "자유 게시판",
                    "author": "Anonymous"
                },
                {
                    "postId": 98,
                    "title": "게시글 제목 예시2",
                    "content": "이것은 게시글의 본문 내용입니다.",
                    "viewCount": 0,
                    "likedNum": 0,
                    "timeSincePosted": 203540,
                    "timeSincePostedText": "3/5",
                    "categoryId": 1,
                    "categoryName": "자유 게시판",
                    "author": "Anonymous"
                },
                {
                    "postId": 97,
                    "title": "게시글 제목 예시2",
                    "content": "이것은 게시글의 본문 내용입니다.",
                    "viewCount": 0,
                    "likedNum": 0,
                    "timeSincePosted": 203540,
                    "timeSincePostedText": "3/5",
                    "categoryId": 1,
                    "categoryName": "자유 게시판",
                    "author": "Anonymous"
                },
                {
                    "postId": 96,
                    "title": "게시글 제목 예시2",
                    "content": "이것은 게시글의 본문 내용입니다.",
                    "viewCount": 0,
                    "likedNum": 0,
                    "timeSincePosted": 203542,
                    "timeSincePostedText": "3/5",
                    "categoryId": 1,
                    "categoryName": "자유 게시판",
                    "author": "Anonymous"
                },
                {
                    "postId": 95,
                    "title": "게시글 제목 예시2",
                    "content": "이것은 게시글의 본문 내용입니다.",
                    "viewCount": 0,
                    "likedNum": 0,
                    "timeSincePosted": 203542,
                    "timeSincePostedText": "3/5",
                    "categoryId": 1,
                    "categoryName": "자유 게시판",
                    "author": "Anonymous"
                },
                {
                    "postId": 94,
                    "title": "게시글 제목 예시2",
                    "content": "이것은 게시글의 본문 내용입니다.",
                    "viewCount": 0,
                    "likedNum": 0,
                    "timeSincePosted": 203543,
                    "timeSincePostedText": "3/5",
                    "categoryId": 1,
                    "categoryName": "자유 게시판",
                    "author": "Anonymous"
                },
                {
                    "postId": 93,
                    "title": "게시글 제목 예시2",
                    "content": "이것은 게시글의 본문 내용입니다.",
                    "viewCount": 0,
                    "likedNum": 0,
                    "timeSincePosted": 203545,
                    "timeSincePostedText": "3/5",
                    "categoryId": 1,
                    "categoryName": "자유 게시판",
                    "author": "Anonymous"
                },
                {
                    "postId": 92,
                    "title": "게시글 제목 예시2",
                    "content": "이것은 게시글의 본문 내용입니다.",
                    "viewCount": 0,
                    "likedNum": 0,
                    "timeSincePosted": 203549,
                    "timeSincePostedText": "3/5",
                    "categoryId": 1,
                    "categoryName": "자유 게시판",
                    "author": "Anonymous"
                },
                {
                    "postId": 91,
                    "title": "게시글 제목 예시2",
                    "content": "이것은 게시글의 본문 내용입니다.",
                    "viewCount": 0,
                    "likedNum": 0,
                    "timeSincePosted": 203551,
                    "timeSincePostedText": "3/5",
                    "categoryId": 1,
                    "categoryName": "자유 게시판",
                    "author": "Anonymous"
                },
                {
                    "postId": 90,
                    "title": "게시글 제목 예시2",
                    "content": "이것은 게시글의 본문 내용입니다.",
                    "viewCount": 0,
                    "likedNum": 0,
                    "timeSincePosted": 203551,
                    "timeSincePostedText": "3/5",
                    "categoryId": 1,
                    "categoryName": "자유 게시판",
                    "author": "Anonymous"
                }
            ],
            "pageNum": 1,
            "pageSize": 20,
            "size": 20,
            "startRow": 0,
            "endRow": 19,
            "pages": 1,
            "prePage": 0,
            "nextPage": 0,
            "isFirstPage": true,
            "isLastPage": true,
            "hasPreviousPage": false,
            "hasNextPage": false,
            "navigatePages": 8,
            "navigatepageNums": [
                1
            ],
            "navigateFirstPage": 1,
            "navigateLastPage": 1
        }
 */
