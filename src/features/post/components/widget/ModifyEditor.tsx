"use client";
import React, { useCallback, useRef, useState } from "react";

import { notFound, useRouter } from "next/navigation";
import { throttle } from "lodash";
import { EditorState, Editor, convertFromRaw } from "draft-js";

import "draft-js/dist/Draft.css"; // 기본 스타일 적용

import { getQueryClient } from "@/core";
import { Header } from "@/shared/components";

import { postQueryKeys, useUpdatePost } from "@pThunder/features/post";
import PostFooter from "../element/PostFooter";
import ImageListPreview from "../element/ImageListPreview";
import PostingRuleText from "../element/PostingRuleText";
import { postStore } from "../../store";
import { useInitPost } from "../../hooks/useInitPost";


const ModifyEditor: React.FC<{ documentId: number }> = ({ documentId }) => {
  const router = useRouter();
  const queryClient = getQueryClient();
  const { prevImageIdList, initContent } = useInitPost(documentId);

  const { mutate: patchContextRequest } = useUpdatePost();

  const { title, content, imageFiles, anonymity, setTitle, setContent, reset } =
    postStore();

  const [editorState, setEditorState] = useState(
    EditorState.createWithContent(
      convertFromRaw({
        entityMap: {},
        blocks: [
          {
            text: initContent,
            key: documentId.toString(),
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

    const changedImageFiles = imageFiles.filter((file) => file.id === -1);

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

    console.log(documentId, userForm);
    patchContextRequest(
      {
        postId: documentId,
        formData: userForm,
      },
      {
        onSuccess: () => {
          // 게시글 상세 정보 및 목록 무효화

          const revalidations = async () => {
            await queryClient.invalidateQueries({
              queryKey: postQueryKeys.list(),
            });
            await queryClient.invalidateQueries({
              queryKey: ["boardInfo"],
            });
            await queryClient.invalidateQueries({
              queryKey: postQueryKeys.detail(documentId),
            });
          };

          return revalidations().then(() => {
            reset();
            router.back();
          });
        },
        onError: (error) => {
          console.error(error);
          alert("게시물 수정에 실패했습니다.");
        },
      }
    );
  };

  if (editorState === undefined || editorRef.current === undefined)
    return notFound();

  return (
    <form
      className="h-full flex flex-col"
      onSubmit={handlePosting}
    >
      <Header
        title={"글쓰기"}
        onLeftClick={() => {
          router.back();
        }}
        rightBtn={
          title?.length > 0 &&
          editorState.getCurrentContent().getPlainText().length > 0 ? (
            <button
              type="submit"
              className="text-center text-primary cursor-pointer w-8 "
            >
              저장
            </button>
          ) : (
            <div className="text-center text-grey-300 w-8 ">저장</div>
          )
        }
      />
      <div className="my-4 min-h-60 w-full flex px-4 flex-col flex-grow gap-[12px]">
        <input
          type="text"
          name="Title"
          id="Title"
          placeholder="제목을 입력하세요"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="px-2 outline-none border-t-0 border-l-0 border-r-0 border-b border-grey-300 placeholder-grey-300 font-medium text-xl pb-0.5 mb-2 break-words w-full"
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
            <span className="text-grey-500 text-right font-light">
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

export default ModifyEditor;
