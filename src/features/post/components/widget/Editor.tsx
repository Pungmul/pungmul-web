"use client";
import "draft-js/dist/Draft.css"; // 기본 스타일 적용
import React, { useCallback, useRef, useState } from "react";
import { throttle } from "lodash";
import { EditorState, Editor, convertFromRaw } from "draft-js";

import { useCreatePost, useUpdatePost } from "@/features/post/api";
import { Header } from "@/shared/components";
import { notFound, useRouter, useSearchParams } from "next/navigation";

import PostFooter from "../element/PostFooter";
import ImageListPreview from "../element/ImageListPreview";
import PostingRuleText from "../element/PostingRuleText";
import { postStore } from "@pThunder/store/post/postStore";
import { useInitPost } from "../../hooks/useInitPost";

const DraftEditor: React.FC<{ boardID: number }> = ({ boardID }) => {
  const router = useRouter();
  const query = useSearchParams();
  const postId = query.get("postId") as number | null;
  const {prevImageIdList, initContent} = useInitPost(postId);
  
  const { mutate: patchContextRequest } = useUpdatePost();
  const { mutate: postContextRequest } = useCreatePost();

  const { title, content, imageFiles, anonymity, setTitle, setContent, reset } =
    postStore();
  const isEdit = !!postId;

  const [editorState, setEditorState] = useState(
    EditorState.createWithContent(
      convertFromRaw({
        entityMap: {},
        blocks: [
          {
            text: initContent,
            key: postId?.toString() ?? "newPost",
            type: "unstyled",
            entityRanges: [],
            depth: 0,
            inlineStyleRanges: [],
          },
        ],
      })
    )
  );

  const [hasScroll, setHasScroll] = useState(false);

  const scrollableRef = useRef<HTMLDivElement | null>(null);
  const editorRef = useRef<Editor | null>(null);

  const checkForScroll = useCallback(() => {
    if (scrollableRef.current) {
      setHasScroll(
        scrollableRef.current.scrollHeight > scrollableRef.current.clientHeight
      );
    }
  }, []);

  const checkForScrollThrottled = throttle(() => checkForScroll(), 5000);

  const handleEditorChange = (newState: EditorState) => {
    setEditorState(newState);
    setContent(newState.getCurrentContent().getPlainText());
    checkForScrollThrottled();
  };

  const handlePosting = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const userForm = new FormData();

    const changedImageFiles = imageFiles.filter(
      (file) => file.id === -1
    );

    if (changedImageFiles && changedImageFiles.length > 0) {
      // 새로 추가된 파일들 (id가 undefined인 파일들)
      const addedImageFiles = changedImageFiles.filter(
        (file) => file.id === -1
      );
      Array.from(addedImageFiles).forEach((file) => {
        userForm.append("files", file.blob); // 이미 Blob 객체임
      });
    } else {
      userForm.append("files", new Blob()); // 빈 파일 추가
    }

    if (isEdit && !!postId) {
      const deleteImageIdList = prevImageIdList.filter(
        (id) => !imageFiles.some((file) => file.id === id)
      );

      const postBlob = new Blob(
        [
          JSON.stringify({
            title,
            text: content,
            anonymity,
            deleteImageIdList,
          }),
        ],
        {
          type: "application/json",
        }
      );

      userForm.append("postData", postBlob);
      // 게시글 수정 시에는 삭제된 이미지 id 도 전달해야함
      patchContextRequest(
        {
          postId,
          boardId: boardID,
          formData: userForm,
        },
        {
          onSuccess: () => {
            reset();
            router.back();
          },
          onError: (error) => {
            console.error(error);
            alert("게시물 수정에 실패했습니다.");
          },
        }
      );
    } else {
      const postBlob = new Blob(
        [JSON.stringify({ title, text: content, anonymity })],
        {
          type: "application/json",
        }
      );
      
      userForm.append("postData", postBlob);
      postContextRequest(
        {
          boardId: boardID,
          formData: userForm,
        },
        {
          onSuccess: (data) => {
            reset();
            router.replace(`/board/${boardID}?postId=${data.postId}`);
          },
          onError: (error) => {
            console.error(error);
            alert("게시물 작성에 실패했습니다.");
          },
        }
      );
    }
  };

  if (editorState === undefined || editorRef.current === undefined)
    return notFound();

  return (
    <form
      className="h-full overflow-y-auto flex flex-col"
      onSubmit={handlePosting}
    >
      <Header
        title={"글쓰기"}
        onLeftClick={() => {
          if (isEdit) {
            router.replace(`/board/${boardID}?postId=${postId}`);
          } else {
            router.replace(`/board/${boardID}`);
          }
        }}
        rightBtn={
          title?.length > 0 &&
          editorState.getCurrentContent().getPlainText().length > 0 ? (
            <button
              type="submit"
              className="text-center text-gray-500 cursor-pointer w-8 "
            >
              저장
            </button>
          ) : (
            <div className="text-center text-gray-300 w-8 ">저장</div>
          )
        }
      />
      <div className="my-4 min-h-60 w-full flex px-4 flex-col flex-grow">
        <input
          type="text"
          name="Title"
          id="Title"
          placeholder="제목을 입력하세요"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="px-2 outline-none border-b border-b-gray-300 placeholder-gray-300 font-medium text-xl pb-0.5 mb-2 break-words w-full"
        />
        <div
          ref={scrollableRef}
          onClick={() => {
            editorRef.current?.focus();
          }}
          className={`flex-grow overflow-y-auto flex flex-col ${
            hasScroll ? "pl-4 pr-1" : "px-2"
          }`}
        >
          <div className="flex flex-col">
            <div className="min-h-32">
              <Editor
                ref={editorRef}
                editorState={editorState}
                placeholder="내용을 작성하세요"
                onChange={handleEditorChange}
              />
            </div>
            <ImageListPreview />
            <span className="text-[#b2b2b2] text-right font-light">
              {editorState.getCurrentContent().getPlainText().length}
            </span>
            <PostingRuleText editorState={editorState} />
          </div>
        </div>
      </div>
      <PostFooter />
    </form>
  );
};

export default DraftEditor;
