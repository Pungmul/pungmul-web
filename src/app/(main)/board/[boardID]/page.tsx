"use client"
import { useEffect, useState } from "react";
import PostList, { BoardData } from "./PostList";
import { loadPosts } from "./utils";

export default function BoardPage({
    params
}: Readonly<{
    params: { boardID: number }
}>) {
    return (
        <>
            <PostList params={params} />
        </>
    )
}