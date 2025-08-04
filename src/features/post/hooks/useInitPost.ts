import { useLoadPostDetail } from "@pThunder/features/post/api";
import { postStore } from "@pThunder/store/post/postStore";
import { useEffect, useMemo } from "react";

export function useInitPost(postId: number | null) {
  const { data: postDetail } = useLoadPostDetail(postId);

  const {
    title: postTitle = "",
    content: postContent = "",
    imageList: postImageList = [],
    author: postAuthor = "Anonymous",
  } = postDetail ?? {};

  const { setTitle, setContent, setImageFiles, setAnonymity } = postStore();
  const prevImageIdList = useMemo(
    () => postImageList.map((file) => file.id),
    [postImageList]
  );

  useEffect(() => {
    setTitle(postTitle);
    setContent(postContent);
    setImageFiles(
      postImageList.map((file) => ({
        id: file.id,
        blob: new Blob([file.fullFilePath], { type: "image/jpeg" }),
        url: file.fullFilePath,
      }))
    );
    setAnonymity(postAuthor === "Anonymous");
  }, [postDetail]);
  
  return { prevImageIdList, initContent: postContent };
}
