import DraftEditor from "@pThunder/component/post/Editor";

export default function Posting({ params }: { params: { boardID: number } }) {

    const { boardID } = params; // URL에서 동적 경로 매개변수 가져오기
    console.log(boardID)
    return (
        
        <DraftEditor boardID={boardID} />
    )
}