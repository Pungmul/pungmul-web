'use client'

import { useCallback, useState } from "react";

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

export default function CommentList({ comments }: { comments: Comment[] }) {

    const [isReplying, setReply] = useState<Comment | null>(null);

    const buildCommentTree = useCallback((comments: Comment[]): Comment[] => {
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
    }, [])


    return (
        <div className="w-full mt-12 flex-col flex">
            {buildCommentTree(comments).map(comment => (
                <div key={comment.commentId} className="w-full bg-white ">
                    <div style={{ backgroundColor: isReplying?.commentId == comment.commentId ? '#F4F2FF' : '#FFF' }}
                        className="w-full py-4 px-6 gap-2 flex flex-col border-b"
                        onClick={() => { if (isReplying?.commentId == comment.commentId) setReply(null); else setReply(comment) }}>
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
        </div>
    )
}