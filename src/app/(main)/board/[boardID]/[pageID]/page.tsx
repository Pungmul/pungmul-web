'use client'

import { useCallback, useEffect, useRef, useState } from "react";
import { addComment, addReply, clickLike, loadPost } from "./utils";
import { debounce, divide } from "lodash";
import { requestFriend } from "@pThunder/app/(main)/friends/utils";
import { Header } from "@pThunder/app/component/header";

import sendIcon from '@public/sendIcon.svg';
import checkMark from '@public/checkMark.svg';
import Image from "next/image";

interface Post {
    postId: number;                // 게시물 ID (Long 타입, TypeScript에서는 number로 사용)
    title: string;                 // 게시물 제목
    content: string;               // 게시물 내용
    imageList: ImageObject[];           // 이미지 파일 목록 (이미지 경로의 리스트로 가정)
    viewCount: number;             // 조회수
    likedNum: number;              // 좋아요 수
    timeSincePosted: number;       // 게시 후 경과 시간 (분 단위)
    timeSincePostedText: string;   // 경과 시간 텍스트 (예: "2분 전")
    author: any;
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
    const [isReplying, setReply] = useState<Comment | null>(null)

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
    const FriendRequset = useCallback(debounce(async (friendName: string, freindId: string) => {
        try {
            const response = await requestFriend(freindId);
            if (!response) throw Error('친구 추가 실패')
            alert(`${friendName}님께 친구를 신청했어요`);
        } catch (e: unknown) {
            console.error(e);
            if (e instanceof Error) {
                alert(e.message);
            } else {
                alert("An unknown error occurred");
            }
        }
    }), [])

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
        const form = e.currentTarget;
        const comment = (new FormData(form).get('comment')) as string;

        try {
            const data = await addComment(pageID, comment) as Comment;

            if (!data) throw Error('댓글 작성 실패')

            const currentPost = Post;


            if (currentPost) {
                console.log(buildCommentTree([...currentPost!.commentList, data]))
                setPost({ ...currentPost, commentList: buildCommentTree([...currentPost.commentList, data]) })
                wholeRef.current?.scrollIntoView({ behavior: 'smooth', scrollY: 10000 });
                (form.elements.namedItem('comment') as HTMLInputElement).value = '';
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
            const data = await addReply(pageID, comment, isReplying.commentId)

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
        <>

            <Header title={Post?.title || ''} />
            <div className="h-full flex flex-col">

                <div ref={wholeRef} style={{ backgroundColor: '#F9F9F9' }} className="flex-grow">
                    <div className="flex flex-col gap-4 px-6 py-5 mt-2  bg-white">
                        <div className="flex flex-col gap-2">
                            <div className="font-semibold" style={{ fontSize: 17 }}>
                                {Post?.title}
                            </div>
                            <div className="flex flex-row justify-between items-start">
                                <div className="flex flex-row gap-2 items-center">
                                    <div className="text-gray-400" style={{ fontSize: 14 }}>
                                        {Post?.author == 'Anonymous' ? '익명' : Post?.author}
                                    </div>

                                    {Post?.author !== 'Anonymous' && Post?.author &&
                                        <div className=" text-xs items-center justify-center flex  border border-blue-400 rounded-sm text-blue-600 hover:bg-blue-400 hover:text-white cursor-pointer"
                                            onClick={() => FriendRequset(Post?.author.name, Post?.author.username)}>
                                            친구 추가
                                        </div>
                                    }
                                    <div className="text-gray-300" style={{ fontSize: 11 }}>
                                        {Post?.timeSincePostedText}
                                    </div>
                                </div>
                                <div className="flex items-center flex-row gap-1">
                                    <div className="w-4 h-4 bg-gray-300" />
                                    <div className="text-gray-300 text-sm">{Post?.viewCount}</div>
                                </div>
                            </div>
                        </div>

                        <div style={{ fontSize: 14 }}>
                            {Post?.content}
                        </div>

                        <div className="w-full overflow-x-auto">
                            <div className="flex flex-row w-full gap-2">
                                {Post?.imageList?.map((image) => (
                                    <img
                                        key={image.id}
                                        src={image.fullFilePath} // 이미지의 경로를 사용하여 렌더링
                                        alt={image.originalFilename}
                                        style={{ width: '100px', height: 'auto', }} // 스타일 적용
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
                    {Post?.commentList!.length! > 0 && <div className="w-full mt-12 flex-col flex">
                        {Post?.commentList.map(comment => (
                            <div key={comment.commentId} className="w-full bg-white ">
                                <div style={{ backgroundColor: isReplying?.commentId == comment.commentId ? '#F4F2FF' : '#FFF' }} className="w-full py-4 px-6 gap-2 flex flex-col border-b" onClick={() => { if (isReplying?.commentId == comment.commentId) setReply(null); else setReply(comment) }}>
                                    <div className="flex flex-row justify-between items-center">
                                        <div className="flex flex-row gap-1 items-center" style={{ fontSize: 12 }}>
                                            <div>{comment.userName}</div>
                                            <div className="text-gray-300">{comment.createdAt}</div>
                                        </div>
                                        <div className="flex flex-row items-center">
                                            <div className="w-4 h-4 bg-blue-500"></div>
                                            <div className="w-4 h-4 bg-red-500"></div>
                                            <div className="w-4 h-4 bg-green-500"></div>
                                        </div>
                                    </div>
                                    <div style={{ fontSize: 13 }}>{comment.content}</div>
                                </div>
                                <div className="w-full flex-col flex">
                                    {comment.replies?.map(reply => (
                                        <div key={reply.commentId} className="w-full py-4 pl-8 pr-6 border-b border-b-gray-300" style={{ backgroundColor: '#EAEAEA' }}>
                                            <div className="flex flex-row justify-between items-center">
                                                <div className="flex flex-row gap-1 items-center" style={{ fontSize: 12 }}>
                                                    <div>{reply.userName}</div>
                                                    <div className="text-gray-300">{reply.createdAt}</div>
                                                </div>
                                                <div className="flex flex-row items-center">
                                                    <div className="w-4 h-4 bg-blue-500"></div>
                                                    <div className="w-4 h-4 bg-red-500"></div>
                                                    <div className="w-4 h-4 bg-green-500"></div>
                                                </div>
                                            </div>
                                            <div style={{ fontSize: 13 }}>{reply.content}</div>
                                        </div>

                                    ))}
                                </div>
                            </div>

                        ))}
                    </div>}

                </div>
                <form onSubmit={isReplying ? ReplyHandler : CommentHandler} className="sticky bottom-0 w-fullshadow-up-md">
                    {isReplying &&
                        <div style={{ paddingLeft: 24, paddingRight: 24, height: 32, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#F2F2F2' }}>
                            <div style={{ fontSize: 12, color: '#816DFF' }}>@{isReplying.userName}</div>
                            <div style={{ width: 24, height: 24, cursor: 'pointer', backgroundColor: '#816DFF' }} onClick={() => setReply(null)}></div>
                        </div>
                    }
                    <div className=" bg-white items-center px-2 py-2 ">
                        <div className="flex flex-row items-center px-4 py-1 rounded-full" style={{ backgroundColor: '#F9F9F9' }}>
                            <label
                                htmlFor="anony"
                                className="flex flex-row gap-2 items-center cursor-pointer"
                            >
                                <input
                                    type="checkbox"
                                    defaultChecked={true}
                                    name="anony"
                                    id="anony"
                                    className="hidden peer"
                                />
                                <div
                                    className="hidden w-5 h-5 peer-checked:flex rounded-sm items-center justify-center"
                                    style={{ backgroundColor: '#816DFF' }}
                                >
                                    <Image src={checkMark} width={12} alt="" />
                                </div>
                                <div
                                    className="block w-5 h-5 bg-white peer-checked:hidden rounded-sm"
                                />
                                <div style={{fontSize:12}} className="text-gray-400 peer-checked:text-black">익명</div>
                            </label>
                            <input type="text" name='comment' style={{ fontSize: 12 }} placeholder="댓글을 입력하세요..." className="bg-transparent outline-none px-2 py-1  flex-grow" />
                            <button type="submit" className="w-6 h-6 p-1">
                                <Image src={sendIcon} width={32} alt="" />
                            </button>
                        </div>
                    </div>

                </form>
            </div>
        </>

    )
}