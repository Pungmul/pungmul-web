'use client'

import { useEffect, useState } from "react";
import { loadPost } from "./utils";

interface Post {
    postId: number;                // 게시물 ID (Long 타입, TypeScript에서는 number로 사용)
    title: string;                 // 게시물 제목
    content: string;               // 게시물 내용
    imageList: string[];           // 이미지 파일 목록 (이미지 경로의 리스트로 가정)
    viewCount: number;             // 조회수
    likedNum: number;              // 좋아요 수
    timeSincePosted: number;       // 게시 후 경과 시간 (분 단위)
    timeSincePostedText: string;   // 경과 시간 텍스트 (예: "2분 전")
    author: string;                // 작성자
  }

export default function Page({params}:{params:{pageID:number}}){
    const {pageID} =params;
    const [Post,setPost] = useState<Post|null>(null);
    useEffect(()=>{
        const loadingPost = async ()=>{
            try{
                const data = await loadPost(pageID) as Post;
                console.log(data)
                setPost(data);
            }catch(e){
                console.error(e)
            }
        }
        loadingPost()
    },[])
    return(
        <div>{JSON.stringify(Post)}</div>
    )
}