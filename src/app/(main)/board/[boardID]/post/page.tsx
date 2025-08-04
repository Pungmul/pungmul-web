import { Editor } from "@/features/post";

export default async function Posting({
  params,
}: {
  params: Promise<{ boardID: string }>;
}) {
  const { boardID } = await params; // URL에서 동적 경로 매개변수 가져오기
  return <Editor boardID={parseInt(boardID)} />;
}
