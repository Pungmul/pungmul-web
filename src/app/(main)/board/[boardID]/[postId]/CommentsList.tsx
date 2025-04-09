'use client'

import { useCallback, useEffect, useRef, useState } from "react";

import sendIcon from '@public/sendIcon.svg';
import checkMark from '@public/checkMark.svg';
import Image from "next/image";
import { addComment, addReply } from "./utils";
import CommentMenu from "./CommentMenu";
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

export default function CommentList({ comments, postId }: { comments: Comment[], postId: number }) {

    const [commentList, setCommentList] = useState<Comment[]>(comments);
    const [isReplying, setReply] = useState<Comment | null>(null);
    const commentInputRef = useRef<HTMLInputElement>(null)

    const CommentHandler = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {

        e.preventDefault();

        const form = e.currentTarget;
        const comment = (new FormData(form).get('comment')) as string;
        const anonymity = (new FormData(form).get('anonymity')) as string;

        console.log(comment, anonymity)

        try {

            if (comment.trim().length === 0) {
                alert('댓글을 입력해주세요');
                return;
            }

            const data = await addComment(postId, comment) as Comment;

            if (!data) throw Error('댓글 작성 실패')

            setCommentList(prev => ([...prev, data]));
            (form.elements.namedItem('comment') as HTMLInputElement).value = '';


        } catch (error) {
            console.log(error)
        }
    }, [postId])

    const ReplyHandler = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const comment = (new FormData(form).get('comment')) as string;
        const anonymity = (new FormData(form).get('anonymity')) as string;

        console.log(comment, anonymity)
        
        try {
            if (!isReplying) throw Error('is not reply')
            const data = await addReply(postId, comment, isReplying.commentId)

            if (!data) throw Error('댓글 작성 실패')

            console.log(data)
            setCommentList(prev => ([...prev, data]));
            (form.elements.namedItem('comment') as HTMLInputElement).value = '';

            setReply(null);

        } catch (error) {
            console.log(error)
        }
    }, [isReplying])

    const buildCommentTree = (commentArray: Comment[]): Comment[] => {

        const commentMap = new Map<number, Comment>();
        const rootComments: Comment[] = [];

        // 각 댓글을 ID 기반으로 매핑 (불변성을 유지하면서 새로운 객체 생성)
        commentArray.forEach(comment => {
            commentMap.set(comment.commentId, { ...comment, replies: [] });
        });

        // 모든 댓글을 순회하여 부모-자식 관계 구성
        commentArray.forEach(comment => {
            if (comment.parentId === null) {
                rootComments.push(commentMap.get(comment.commentId)!);
            } else {
                const parentComment = commentMap.get(comment.parentId);
                if (parentComment) {
                    parentComment.replies.push(commentMap.get(comment.commentId)!);
                }
            }
        });

        return rootComments;
    };

    const moveToHash = () => {
        const hash = window.location.hash.replace("#", ""); // "#comment1" → "comment1"
        if (hash) {
            const element = document.getElementById(hash);
            if (element) {
                element.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        }
    }

    useEffect(() => {
        moveToHash()
    }, [])

    return (
        <div className="w-full mt-12 flex-col flex flex-grow">
            <div className="flex-col flex flex-grow">
                {buildCommentTree(commentList).map(comment => (
                    <div key={comment.commentId} id={comment.commentId.toString()} className="w-full bg-white ">
                        <div style={{ backgroundColor: isReplying?.commentId == comment.commentId ? '#F4F2FF' : '#FFF' }}
                            className="w-full py-4 px-6 gap-2 flex flex-col border-b">
                            <div className="flex flex-row justify-between items-center">
                                <div className="flex flex-row gap-1 items-center" style={{ fontSize: 12 }}>
                                    <div>{comment.userName}</div>
                                    <div className="text-gray-300">{comment.createdAt}</div>
                                </div>
                                <div className="flex flex-row items-center">
                                    <div className="w-8 h-4 bg-blue-500 cursor-pointer"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (confirm('대댓글을 작성하시겠습니까?')) {
                                                commentInputRef.current?.focus();
                                                window.location.hash = comment.commentId.toString();
                                                setReply(comment)
                                            }
                                        }}></div>
                                    <div className="w-8 h-4 bg-red-500 cursor-pointer"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (confirm('이 댓글을 추천하시겠습니까?')) {
                                                alert(comment.content.substring(0, 10) + '추천됨')
                                            }
                                        }}></div>
                                    <div className="w-8 h-4 bg-green-500 cursor-pointer"
                                    >
                                        <CommentMenu
                                            commentId={comment.commentId}
                                            commentContent={comment.content}
                                            commentWriter={comment.userName}
                                        />
                                    </div>
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
                                        <div className="flex flex-row items-center cursor-pointer">
                                            <div
                                                className="w-8 h-4 bg-red-500"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    if (confirm('이 대댓글을 추천하시겠습니까?')) {
                                                        alert(reply.content.substring(0, 10) + '추천됨')
                                                    }
                                                }}></div>
                                            <div className="w-8 h-4 bg-green-500 cursor-pointer">
                                                <CommentMenu
                                                    commentId={reply.commentId}
                                                    commentContent={reply.content}
                                                    commentWriter={reply.userName}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{ fontSize: 13 }}>{reply.content}</div>
                                </div>

                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <form onSubmit={isReplying ? ReplyHandler : CommentHandler} className="sticky bottom-0 w-fullshadow-up-md">
                {isReplying &&
                    <div style={{ paddingLeft: 24, paddingRight: 24, height: 32, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'rgba(0, 0, 0, 0.7)' }}
                        onClick={moveToHash}
                    >
                        <div style={{ fontSize: 12, color: '#816DFF' }}>@{isReplying.userName}</div>
                        <div style={{ width: 24, height: 24, cursor: 'pointer', backgroundColor: '#816DFF' }} onClick={(e) => {
                            e.stopPropagation();
                            setReply(null);
                        }}></div>
                    </div>
                }
                <div className=" bg-white items-center px-2 py-2 ">
                    <div className="flex flex-row items-center px-4 py-1 rounded-full" style={{ backgroundColor: '#F9F9F9' }}>
                        <label
                            htmlFor="anonymity"
                            className="flex flex-row gap-2 items-center cursor-pointer"
                        >
                            <input
                                type="checkbox"
                                defaultChecked={true}
                                name="anonymity"
                                id="anonymity"
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
                            <div style={{ fontSize: 12 }} className="text-gray-400 peer-checked:text-black">익명</div>
                        </label>
                        <input
                            ref={commentInputRef}
                            type="text" name='comment' style={{ fontSize: 12 }} placeholder="댓글을 입력하세요..." className="bg-transparent outline-none px-2 py-1  flex-grow" />
                        <button type="submit" className="w-6 h-6 p-1">
                            <Image src={sendIcon} width={32} alt="" />
                        </button>
                    </div>
                </div>

            </form>
        </div>
    )
}