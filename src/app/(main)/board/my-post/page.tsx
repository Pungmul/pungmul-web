import PostList from "./PostList";
import { Header } from "@pThunder/component/shared/Header";


export default function MyPostsPage() {

    return (
        <div className="relative h-full flex flex-col">
            <Header title={'내가 작성한 글'}/>
            <div className="flex-grow overflow-y-auto">
                    <PostList />
            </div>
        </div>
    )   
}