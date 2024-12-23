'use client'
import { useRouter } from "next/navigation";

export default function PostingButton({ boardID }: { boardID: number }) {
    const router = useRouter();
    const handleClick = () => {
        const newPath = `/board/${boardID}/post`; 
        router.push(newPath);
    };

    return (
        <div style={{height:24, width:48, textAlign:'right', cursor:'pointer'}} onClick={handleClick}>
            글쓰기
        </div>
    );
}