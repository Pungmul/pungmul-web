"use client";

import { useRef, useEffect, useState, useLayoutEffect } from "react";
import dynamic from "next/dynamic";
import type { Editor as EditorType } from "@toast-ui/react-editor";
import { useSearchParams } from "next/navigation";
import { usePromotionPostingStore } from "../../store/promotionPostingStore";
import { uploadImageToS3 } from "../../api";

// Toast UI Editor를 클라이언트에서만 로드
const Editor = dynamic(
  () =>
    import("@/features/promote/components/import").then((mod) => ({ default: mod.ToastEditor })),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[300px] bg-grey-100 rounded animate-pulse flex items-center justify-center text-grey-500">
        에디터 로딩 중...
      </div>
    ),
  }
);

export const PromotionDescriptionEditor = () => {
  // 내부 ref 생성
  const editorRef = useRef<EditorType | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useLayoutEffect(() => {
    const darkMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    // 초기 값 세팅
    setTheme(darkMediaQuery.matches ? 'dark' : 'light');

    // 변경 감지
    const handler = (e: MediaQueryListEvent) => setTheme(e.matches ? 'dark' : 'light');
    darkMediaQuery.addEventListener('change', handler);
    darkMediaQuery.addListener(handler);

    return () => darkMediaQuery.removeEventListener('change', handler);
  }, []);
  // URL에서 formId 가져오기
  const searchParams = useSearchParams();
  const formId = searchParams.get("formId");

  // store에서 필요한 상태와 액션 가져오기
  const { setDescriptionEditorRef, setDescriptionEditorContent } =
    usePromotionPostingStore();

  const description = usePromotionPostingStore((state) => state.description);
  // Toast UI Editor용 이미지 업로드 함수
  const uploadImage = async (blob: Blob, callback: (url: string) => void) => {
    if (!formId) {
      throw new Error("Form ID is missing");
    }

    const performanceImageList = await uploadImageToS3(Number(formId), blob);
    callback(performanceImageList[0]!.imageUrl);
  };

  // ref를 store에 등록
  useEffect(() => {
    setDescriptionEditorRef(editorRef);
    return () => setDescriptionEditorRef(null);
  }, [setDescriptionEditorRef]);

  // 초기값 설정
  useEffect(() => {
    if (description && editorRef.current) {
      setDescriptionEditorContent(description);
    }
  }, [description, setDescriptionEditorContent]);

  return (
    <Editor
      key={description}
      ref={editorRef}
      theme={theme}
      class="text-grey-800"
      initialValue={
        description ||
        `### 공연 소개
---
여기에 공연 설명을 작성해주세요`
      }
      width="100%"
      height="100%"
      placeholder="공연 소개를 입력해주세요."
      previewStyle="vertical"
      initialEditType="wysiwyg"
      useCommandShortcut={false}
      toolbarItems={[
        ["heading", "bold", "ul", "ol"],
        ["hr", "quote"],
        ["image", "link"],
      ]}
      hooks={{
        addImageBlobHook: uploadImage,
      }}
    />
  );
};
