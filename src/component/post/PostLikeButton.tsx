'use client'

import React, { useCallback, useState } from 'react'
import { likePostRequest } from '@pThunder/api/post/likePostRequest'

type PostLikeResponse = {
    postId: number
    liked: boolean
    likedNum: number
}

function PostLikeButton({ postId, isLiked, likedNum: initialLikedNum }: { postId: number, isLiked: boolean, likedNum: number }) {

    const [isLikedState, setIsLikedState] = useState(isLiked)
    const [likedNum, setLikedNumb] = useState(initialLikedNum)
    const LikeHandler = useCallback(async () => {
        try {
            if (!confirm(isLikedState ? '추천을 취소하시겠습니까?' : '이 게시글을 추천하시겠습니까?')) return;

            const data: PostLikeResponse = await likePostRequest(postId)
            setLikedNumb(data.likedNum)
            setIsLikedState(prev => !prev);
            alert(isLikedState ? '추천이 취소 되었습니다.' : '게시글을 추천했습니다.')
        } catch (error) {
            alert(error)
        }

    }, [postId])

    return (
        <div className="flex items-center flex-row gap-1 cursor-pointer"
            onClick={LikeHandler}>
            <div className={`w-6 h-6 ${isLikedState ? 'bg-red-200' : 'border-red-200 border'}`} />
            <div className="text-red-300">{likedNum}</div>
        </div>
    )
}

export default PostLikeButton