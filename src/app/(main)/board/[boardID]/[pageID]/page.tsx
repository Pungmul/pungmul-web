'use client'

import { useCallback, useEffect, useRef, useState } from "react";
import { addComment, addReply, clickLike, loadPost } from "./utils";

interface Post {
    postId: number;                // 게시물 ID (Long 타입, TypeScript에서는 number로 사용)
    title: string;                 // 게시물 제목
    content: string;               // 게시물 내용
    imageList: ImageObject[];           // 이미지 파일 목록 (이미지 경로의 리스트로 가정)
    viewCount: number;             // 조회수
    likedNum: number;              // 좋아요 수
    timeSincePosted: number;       // 게시 후 경과 시간 (분 단위)
    timeSincePostedText: string;   // 경과 시간 텍스트 (예: "2분 전")
    author: string;                // 작성자
    commentList: Comment[];
    isLiked: boolean;
}
interface ImageObject {
    id: number;                          // 파일의 고유 ID
    originalFilename: string;            // 원본 파일명
    convertedFileName: string;           // 변환된 파일명 (S3 저장 경로 포함)
    fullFilePath: string;                // 전체 파일 경로 (S3 URL)
    fileType: string;                    // 파일 타입 (예: image/jpeg)
    fileSize: number;                    // 파일 크기 (바이트 단위)
    createdAt: string;                   // 파일이 생성된 시간 (ISO 형식)
}
interface Profile {
    id: number;                          // 프로필 이미지의 고유 ID
    originalFilename: string;            // 원본 파일명
    convertedFileName: string;           // 변환된 파일명 경로
    fullFilePath: string;                // 전체 파일 경로 (S3 URL)
    fileType: string;                    // 파일 타입 (예: image/jpeg)
    fileSize: number;                    // 파일 크기 (바이트 단위)
    createdAt: string;                   // 파일 생성일 (ISO 형식)
}

interface Comment {
    commentId: number;                   // 댓글의 고유 ID
    postId: number;                      // 연결된 게시글의 ID
    parentId: number | null;             // 부모 댓글 ID (대댓글인 경우), null이면 최상위 댓글
    content: string;                     // 댓글 내용
    userName: string;                    // 작성자 이름
    profile: Profile;                    // 작성자 프로필 객체
    createdAt: string;                   // 댓글 작성 시간
    replies: Comment[];
}
export default function Page({ params }: { params: { pageID: number } }) {

    const { pageID } = params;

    const [Post, setPost] = useState<Post | null>(null);
    const [isReplying, setReply] = useState<number | null>(null)

    const wholeRef = useRef<any>(null);

    useEffect(() => {
        const loadingPost = async () => {
            try {
                const data = await loadPost(pageID) as Post;

                setPost({ ...data, commentList: buildCommentTree(data.commentList) })

            } catch (e) {
                console.error(e)
            }
        }
        loadingPost();
    }, [])

    const buildCommentTree = (comments: Comment[]): Comment[] => {
        const commentMap: { [key: number]: Comment } = {};
        const rootComments: Comment[] = [];

        // 각 댓글을 ID 기반으로 맵핑
        comments.forEach(comment => {
            comment.replies = [];  // 초기화
            commentMap[comment.commentId] = comment;
        });

        // 모든 댓글을 순회하여 부모-자식 관계 구성
        comments.forEach(comment => {
            if (comment.parentId === null) {
                // 최상위 댓글이면 rootComments에 추가
                rootComments.push(comment);
            } else {
                // 부모 댓글이 존재하는 경우 해당 부모 댓글의 replies 배열에 추가
                const parentComment = commentMap[comment.parentId];
                if (parentComment) {
                    parentComment.replies.push(comment);
                }
            }
        });

        return rootComments;
    }

    const LikeHandler = useCallback(async () => {
        try {
            const data = await clickLike(pageID)

            if (!data) throw Error('좋아요 업데이트 실패')

            if (pageID != data.postId) throw Error('좋아요 업데이트 실패:잘못된 게시물')

            const currentPost = Post

            if (currentPost)

                setPost({ ...currentPost, likedNum: data.likedNum, isLiked: data.liked })

        } catch (error) {
            console.log(error)
        }

    }, [Post])

    const CommentHandler = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form =  e.currentTarget;
        const comment = (new FormData(form).get('comment')) as string;

        try {
            const data = await addComment(pageID, comment) as Comment;

            if (!data) throw Error('댓글 작성 실패')

            const currentPost = Post;
            
           
            if (currentPost) {
                console.log(buildCommentTree([...currentPost!.commentList, data]))
                setPost({ ...currentPost, commentList: buildCommentTree([...currentPost.commentList, data]) })
                wholeRef.current?.scrollIntoView({ behavior: 'smooth',scrollY:10000 });
                (form.elements.namedItem('comment') as HTMLInputElement).value='';
            }


        } catch (error) {
            console.log(error)
        }
    }, [Post])

    const ReplyHandler = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const comment = (new FormData(e.currentTarget).get('comment')) as string;

        try {
            if (!isReplying) throw Error('is not reply')
            const data = await addReply(pageID, comment, isReplying)

            if (!data) throw Error('댓글 작성 실패')

            const currentPost = Post;

            if (currentPost) {
                setReply(null);
                setPost({ ...currentPost, commentList: buildCommentTree([...currentPost.commentList, data]) })
                
                e.currentTarget.reset();
            }


        } catch (error) {
            console.log(error)
        }
    }, [Post, isReplying])


    return (
        <div className="h-full flex flex-col">
            <div ref={wholeRef} className="overflow-x-hidden overflow-y-scroll flex-grow rounded-md bg-gray-300">
                <div className="flex flex-col gap-1 px-6 py-6  bg-white">
                    <div className="flex flex-row">
                        <div className="text-2xl font-semibold">
                            {Post?.title}
                        </div>
                    </div>
                    <div className="flex flex-col gap-0">
                        <div className="font-semibold">
                            {Post?.author == 'Anonymous' ? '익명' : Post?.author}
                        </div>
                        <div className="flex flex-row justify-between items-start">
                            <div className="text-gray-400 text-sm">
                                {Post?.timeSincePostedText}
                            </div>
                            <div className="flex items-center flex-row gap-2">
                                <div className="w-4 h-4 bg-gray-400" />
                                <div className="text-gray-400 text-sm">{Post?.viewCount}</div>
                            </div>
                        </div>

                    </div>

                    <div className="my-2">
                        {Post?.content}
                    </div>
                    <div className="w-full ">
                        <div className="flex flex-row w-full gap-2">
                            {Post?.imageList?.map((image) => (
                                <img
                                    key={image.id}
                                    src={image.fullFilePath} // 이미지의 경로를 사용하여 렌더링
                                    alt={image.originalFilename}
                                    style={{ width: '100px', height: 'auto', margin: '10px' }} // 스타일 적용
                                />
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-row gap-4">
                        <div className="flex items-center flex-row gap-1 cursor-pointer"
                            onClick={LikeHandler}>
                            <div className={`w-6 h-6 ${Post?.isLiked ? 'bg-red-200' : 'border-red-200 border'}`} />
                            <div className="text-red-300">{Post?.likedNum}</div>
                        </div>
                        <div className="flex items-center flex-row gap-1">
                            <div className="w-6 h-6 bg-blue-200" />
                            <div className="text-blue-300">{Post?.commentList?.length ?? 0}</div>
                        </div>
                    </div>
                </div>
                {Post?.commentList!.length! > 0 && <div className="w-full mt-6 flex-col gap-2 flex">
                    {Post?.commentList.map(comment => (
                        <div key={comment.commentId} className="w-full bg-white ">
                            <div className="w-full py-4 px-4 bg-white rounded-md border-b" onClick={() => setReply(comment.commentId)}>
                                <div>{comment.userName}</div>
                                <div>{comment.content}</div>
                            </div>
                            <div className="w-full flex-col gap-2 flex">
                                {comment.replies?.map(reply => (
                                    <div key={reply.commentId} className="w-full py-4 ml-2 pl-4 border-b rounded-md bg-gray-200">
                                        <div>{reply.userName}</div>
                                        <div>{reply.content}</div>
                                    </div>

                                ))}
                            </div>
                            {isReplying == comment.commentId && <form onSubmit={ReplyHandler} className="flex flex-row sticky bottom-0 w-full bg-white items-center gap-2 px-2 py-3 shadow-up-md">
                                <label htmlFor="anony">
                                    <input type="checkbox" defaultChecked={true} name="anony" id="anony" />
                                    {' 익명 댓글'}
                                </label>
                                <input type="text" name='comment' className="px-2 py-1 border flex-grow" />
                                <button type="submit" className="px-3 py-1 bg-slate-300">완료</button>
                            </form>}
                        </div>

                    ))}
                </div>}

            </div>
            <form onSubmit={CommentHandler} className="flex flex-row sticky bottom-0 w-full bg-white items-center gap-2 px-2 py-3 shadow-up-md">
                <label htmlFor="anony">
                    <input type="checkbox" defaultChecked={true} name="anony" id="anony" />
                    {' 익명 댓글'}
                </label>
                <input type="text" name='comment' className="px-2 py-1 border flex-grow" />
                <button type="submit" className="px-3 py-1 bg-slate-300">완료</button>
            </form>
        </div>
    )
}