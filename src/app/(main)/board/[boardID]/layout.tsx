import type { Metadata } from "next";
import "@pThunder/app/globals.css";
import PostList from "./PostList";
import { GET } from "./api/route";
import PostingButton from "./PostingButton";

export const metadata: Metadata = {
    title: "Create Next App",
    description: "Generated by create next app",
};

export default async function Layout({
    children, params
}: Readonly<{
    children: React.ReactNode
    params: { boardID: number }
}>) {
    const { boardID } = params;
    const req: Request = new Request(`${process.env.LOCAL_URL}/board/${boardID}/api?boardId=${boardID}`);
    const response = await GET(req);
    const data = await response.json();

    return (
        <>
            <div className="flex flex-row h-screen items-center justify-center gap-4 mx-24">
                <div className="border rounded-lg w-auto min-w-72 h-3/4 overflow-y-scroll">
                    <PostList params={params} data={data} />
                </div>
                <div className="md:block hidden border h-3/4 rounded-md flex-grow">
                    {children}
                </div>
            </div>
            <div className="fixed bottom-12 right-12">
                <PostingButton boardID={boardID}/>
            </div>
        </>

    );
}