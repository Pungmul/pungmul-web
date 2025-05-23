"use client";

import { Header } from "@pThunder/component/shared/Header";

import { loadPostDetail } from "./utils";

import FriendsAddButton from "@pThunder/component/post/FriendsAddButton";
import CommentList from "@pThunder/component/comment/CommentsList";
import PostLikeButton from "@pThunder/component/post/PostLikeButton";
import PostMenu from "@pThunder/component/post/PostMenu";
import PostImage from "@pThunder/component/post/PostImage";
import { useEffect, useState } from "react";
import { SkeletonView } from "@pThunder/component/shared/SkeletonView";

interface Post {
  postId: number; // 게시물 ID (Long 타입, TypeScript에서는 number로 사용)
  title: string; // 게시물 제목
  content: string; // 게시물 내용
  imageList: ImageObject[]; // 이미지 파일 목록 (이미지 경로의 리스트로 가정)
  viewCount: number; // 조회수
  likedNum: number; // 좋아요 수
  timeSincePosted: number; // 게시 후 경과 시간 (분 단위)
  timeSincePostedText: string; // 경과 시간 텍스트 (예: "2분 전")
  author: any;
  commentList: Comment[];
  isLiked: boolean;
  isWriter: boolean;
}

interface ImageObject {
  id: number; // 파일의 고유 ID
  originalFilename: string; // 원본 파일명
  convertedFileName: string; // 변환된 파일명 (S3 저장 경로 포함)
  fullFilePath: string; // 전체 파일 경로 (S3 URL)
  fileType: string; // 파일 타입 (예: image/jpeg)
  fileSize: number; // 파일 크기 (바이트 단위)
  createdAt: string; // 파일이 생성된 시간 (ISO 형식)
}

interface Profile {
  id: number; // 프로필 이미지의 고유 ID
  originalFilename: string; // 원본 파일명
  convertedFileName: string; // 변환된 파일명 경로
  fullFilePath: string; // 전체 파일 경로 (S3 URL)
  fileType: string; // 파일 타입 (예: image/jpeg)
  fileSize: number; // 파일 크기 (바이트 단위)
  createdAt: string; // 파일 생성일 (ISO 형식)
}

interface Comment {
  commentId: number; // 댓글의 고유 ID
  postId: number; // 연결된 게시글의 ID
  parentId: number | null; // 부모 댓글 ID (대댓글인 경우), null이면 최상위 댓글
  content: string; // 댓글 내용
  userName: string; // 작성자 이름
  profile: Profile; // 작성자 프로필 객체
  createdAt: string; // 댓글 작성 시간
  replies: Comment[];
}

export default function PostDetail({
  boardName,
  postId,
}: {
  boardName?: string;
  postId: number;
}) {
  console.log("PostDetail postId", postId);
  const [Post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      setIsLoading(true);
      try {
        const Post: Post = await loadPostDetail(postId);
        console.log("Post", Post);
        setPost(Post);
      } catch (error) {
        alert("게시물 로드 중 에러:");
      } finally {
        setIsLoading(false);
      }
    };
    fetchPost();
  }, [postId]);

  return (
    <div className="h-dvh w-full flex flex-col">
      <div className="grow-0">
        <Header
          title={boardName || ""}
          onLeftClick={() => window.history.back()}
          rightBtn={<PostMenu isWriter={Post?.isWriter ?? false} />}
        />
      </div>

      {isLoading ? (
        <div className="flex flex-col flex-grow -z-10">
          <div
            style={{ backgroundColor: "#F9F9F9" }}
            className="flex-grow flex flex-col"
          >
            <div
              className="flex flex-col px-6 py-5 mt-2 bg-white"
              style={{ gap: 36 }}
            >
              <div className="flex flex-col" style={{ gap: 16 }}>
                <SkeletonView
                  style={{ height: 32, width: "80%", borderRadius: 4 }}
                />
                <div className="flex flex-row justify-between items-start">
                  <div className="flex flex-row gap-2 items-center">
                    <SkeletonView
                      style={{ height: 24, width: 48, borderRadius: 4 }}
                    />
                  </div>
                  <div className="flex items-center flex-row gap-1">
                    <div className="w-4 h-4 bg-gray-300" />
                    <SkeletonView
                      style={{ height: 16, width: 36, borderRadius: 4 }}
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex-col" style={{ gap: 12 }}>
                <SkeletonView
                  style={{ height: 20, width: "100%", borderRadius: 4 }}
                />
                <SkeletonView
                  style={{ height: 20, width: "100%", borderRadius: 4 }}
                />
                <SkeletonView
                  style={{ height: 20, width: "40%", borderRadius: 4 }}
                />
              </div>
              <div className="flex flex-row gap-4">
                <div className="flex items-center flex-row gap-1">
                  <div className="w-6 h-6 bg-red-200" />
                  <SkeletonView
                    style={{ height: 24, width: 48, borderRadius: 4 }}
                  />
                </div>
                <div className="flex items-center flex-row gap-1">
                  <div className="w-6 h-6 bg-gray-200" />
                  <SkeletonView
                    style={{ height: 24, width: 48, borderRadius: 4 }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col flex-grow overflow-y-auto">
          <div
            style={{ backgroundColor: "#F9F9F9" }}
            className="flex-grow flex flex-col"
          >
            <div className="flex flex-col gap-4 px-6 py-5 mt-2  bg-white">
              {!!Post && (
                <div className="flex flex-col gap-2">
                  <div className="flex flex-row justify-between">
                    <div className="font-semibold" style={{ fontSize: 17 }}>
                      {Post.title}
                    </div>
                  </div>

                  <div className="flex flex-row justify-between items-start">
                    <div className="flex flex-row gap-2 items-center">
                      <div className="text-gray-400" style={{ fontSize: 14 }}>
                        {Post.author == "Anonymous" ? "익명" : Post.author}
                      </div>

                      {Post.author !== "Anonymous" && Post.author && (
                        <FriendsAddButton
                          friendName={Post.author.name}
                          friendId={Post.author.username}
                        />
                      )}
                      <div className="text-gray-300" style={{ fontSize: 11 }}>
                        {Post.timeSincePostedText === "0분 전"
                          ? "방금"
                          : Post.timeSincePostedText}
                      </div>
                    </div>
                    <div className="flex items-center flex-row gap-1">
                      <div className="w-4 h-4 bg-gray-300" />
                      <div className="text-gray-300 text-sm">
                        {Post?.viewCount}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {Post && (
                <div style={{ fontSize: 14 }} className="break-words">
                  {Post.content}
                </div>
              )}

              <div className="w-full overflow-x-auto">
                <div className="flex flex-row w-full gap-2">
                  {Post?.imageList?.map((image) => (
                    <PostImage key={image.id} imageData={image} />
                  ))}
                </div>
              </div>

              {Post && (
                <div className="flex flex-row gap-4">
                  <PostLikeButton
                    isLiked={Post.isLiked}
                    postId={Post.postId}
                    likedNum={Post.likedNum}
                  />
                  <div className="flex items-center flex-row gap-1">
                    <div className="w-6 h-6 bg-blue-200" />
                    <div className="text-blue-300">
                      {Post?.commentList?.length ?? 0}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {Post?.commentList && (
              <CommentList comments={Post.commentList} postId={Post.postId} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
