import { Header } from "@pThunder/app/component/header";

// import sendIcon from '@public/sendIcon.svg';
// import checkMark from '@public/checkMark.svg';
// import Image from "next/image";
import FriendsAddButton from "./FriendsAddButton";
import CommentList from "./CommentsList";
import PostLikeButton from "./PostLikeButton";
import { loadPost } from "./serverSide";

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

export default async function Page({ params }: { params: { pageID: number } }) {

    const { pageID } = params;

    // const [Post, setPost] = useState<Post | null>(null);

    const Post:Post = await loadPost(pageID);

    // useEffect(() => {
    //     const loadingPost = async () => {
    //         try {
    //             const data = await loadPost(pageID) as Post;

    //             // setPost({ ...data })

    //         } catch (e) {
    //             console.error(e)
    //         }
    //     }
    //     loadingPost();
    // }, [])

    

    // const CommentHandler = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    //     e.preventDefault();
    //     const form = e.currentTarget;
    //     const comment = (new FormData(form).get('comment')) as string;

    //     try {
    //         const data = await addComment(pageID, comment) as Comment;

    //         if (!data) throw Error('댓글 작성 실패')

    //         const currentPost = Post;


    //         if (currentPost) {
    //             console.log(buildCommentTree([...currentPost!.commentList, data]))
    //             setPost({ ...currentPost, commentList: buildCommentTree([...currentPost.commentList, data]) })
    //             wholeRef.current?.scrollIntoView({ behavior: 'smooth', scrollY: 10000 });
    //             (form.elements.namedItem('comment') as HTMLInputElement).value = '';
    //         }


    //     } catch (error) {
    //         console.log(error)
    //     }
    // }, [Post])

    // const ReplyHandler = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    //     e.preventDefault();
    //     const comment = (new FormData(e.currentTarget).get('comment')) as string;

    //     try {
    //         if (!isReplying) throw Error('is not reply')
    //         const data = await addReply(pageID, comment, isReplying.commentId)

    //         if (!data) throw Error('댓글 작성 실패')

    //         const currentPost = Post;

    //         if (currentPost) {
    //             setReply(null);
    //             setPost({ ...currentPost, commentList: buildCommentTree([...currentPost.commentList, data]) })

    //             e.currentTarget.reset();
    //         }


    //     } catch (error) {
    //         console.log(error)
    //     }
    // }, [Post, isReplying])


    return (
        <div className="h-dvh w-full flex flex-col">

            <div className="grow-0">
                <Header title={Post?.title || ''} />
            </div>
            <div className="flex flex-col flex-grow overflow-y-auto">
                <div style={{ backgroundColor: '#F9F9F9' }} className="">
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
                                        <FriendsAddButton friendName={Post.author.name} friendId={Post.author.username} />
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
                            <PostLikeButton isLiked={Post?.isLiked} postId={Post?.postId} likedNum={Post?.likedNum}/>
                            <div className="flex items-center flex-row gap-1">
                                <div className="w-6 h-6 bg-blue-200" />
                                <div className="text-blue-300">{Post?.commentList?.length ?? 0}</div>
                            </div>
                        </div>
                    </div>

                    {Post?.commentList!.length! > 0 && <CommentList comments={Post?.commentList!} />}

                </div>
            </div>
            
        </div>

    )
}