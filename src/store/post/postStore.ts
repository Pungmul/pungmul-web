import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface PostState {
  // 현재 편집 중인 게시글 정보
  boardId: number | null;
  postId: number | null;
  prevImageIdList: number[];

  //기본 필드 정보
  title: string;
  content: string; // EditorState 대신 plain text로 저장
  imageFiles: { id?: number; blob: Blob; url?: string }[];
  anonymity: boolean;
  
  // UI 상태
  hasScroll: boolean;
  isLoading: boolean;
  isError: boolean;
  
  // 액션들
  setBoardId: (boardId: number) => void;
  setPostId: (postId: number | null) => void;
  setTitle: (title: string) => void;
  setContent: (content: string) => void;
  setImageFiles: (files: { id?: number; blob: Blob; url?: string }[]) => void;
  addImageFile: (file: { id?: number; blob: Blob; url?: string }) => void;
  removeImageFile: (index: number) => void;
  setPrevImageIdList: (ids: number[]) => void;
  setAnonymity: (anonymity: boolean) => void;
  setHasScroll: (hasScroll: boolean) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: boolean) => void;
  
  // 임시 저장 관련
  saveTempPost: () => void;
  loadTempPost: (boardId: number) => void;
  clearTempPost: () => void;
  
  // 전체 초기화
  reset: () => void;
}

const initialState = {
  boardId: null,
  postId: null,
  title: '',
  content: '',
  imageFiles: [],
  prevImageIdList: [],
  anonymity: true,
  hasScroll: false,
  isLoading: false,
  isError: false,
};

export const postStore = create<PostState>()(
  persist(
    (set, get) => ({
      ...initialState,
      
      setBoardId: (boardId) => set({ boardId }),
      setPostId: (postId) => set({ postId }),
      setTitle: (title) => set({ title }),
      setContent: (content) => set({ content }),
      setImageFiles: (imageFiles) => set({ imageFiles }),
      addImageFile: (file) => set((state) => ({ 
        imageFiles: [...state.imageFiles, file] 
      })),
      removeImageFile: (index) => set((state) => ({
        imageFiles: state.imageFiles.filter((_, i) => i !== index)
      })),
      setPrevImageIdList: (prevImageIdList) => set({ prevImageIdList }),
      setAnonymity: (anonymity) => set({ anonymity }),
      setHasScroll: (hasScroll) => set({ hasScroll }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (isError) => set({ isError }),
      
      saveTempPost: () => {
        const state = get();
        if (state.boardId && (state.title || state.content || state.imageFiles.length > 0)) {
          // 이미지 파일은 URL로 변환하여 저장
          const imageFilesWithUrls = state.imageFiles.map(file => ({
            ...file,
            url: file.url || URL.createObjectURL(file.blob)
          }));
          
          localStorage.setItem(`temp_post_${state.boardId}`, JSON.stringify({
            title: state.title,
            content: state.content,
            imageFiles: imageFilesWithUrls,
            anonymity: state.anonymity,
            timestamp: Date.now()
          }));
        }
      },
      
      loadTempPost: (boardId) => {
        const tempData = localStorage.getItem(`temp_post_${boardId}`);
        if (tempData) {
          try {
            const parsed = JSON.parse(tempData);
            set({
              boardId,
              title: parsed.title || '',
              content: parsed.content || '',
              imageFiles: parsed.imageFiles || [],
              anonymity: parsed.anonymity ?? true
            });
          } catch (error) {
            console.error('임시 저장 데이터 로드 실패:', error);
          }
        }
      },
      
      clearTempPost: () => {
        const state = get();
        if (state.boardId) {
          localStorage.removeItem(`temp_post_${state.boardId}`);
        }
      },
      
      reset: () => set(initialState),
    }),
    {
      name: 'post-store',
      // EditorState는 직렬화가 어려우므로 content만 저장
      partialize: (state) => ({
        boardId: state.boardId,
        postId: state.postId,
        title: state.title,
        content: state.content,
        anonymity: state.anonymity,
      }),
    }
  )
);
