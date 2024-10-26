'use client'
import { useRouter } from "next/navigation";

export default function PostingButton({ boardID }: { boardID: number }) {
    const router = useRouter();
    const handleClick = () => {
        const newPath = `/board/${boardID}/post`; 
        router.push(newPath);
    };

    return (
        <div className="w-12 h-12 rounded-full bg-gray-400" onClick={handleClick} />
    );
}