'use client'

import React, { useCallback, useState } from 'react'
import { clickLike } from './utils'

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
            const data: PostLikeResponse = await clickLike(postId)

            if (!data) throw Error('좋아요 업데이트 실패')

            if (postId != data.postId) throw Error('좋아요 업데이트 실패:잘못된 게시물')

            setLikedNumb(data.likedNum)
            setIsLikedState(prev => !prev);
        } catch (error) {
            console.log(error)
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