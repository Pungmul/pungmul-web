import { create } from "zustand";

interface ReportedPost {
  postId: number;
  title: string;
  author: string;
}

interface ReportPostState {
  // 상태
  reportedPost: ReportedPost | null;
  isModalOpen: boolean;

  // 액션
  openModalToReport: (post: ReportedPost) => void;
  closeModal: () => void;
}

export const reportPostStore = create<ReportPostState>((set) => ({
  // 초기 상태
  reportedPost: null,
  isModalOpen: false,

  // 액션
  openModalToReport: (post: ReportedPost) => {
    set({
      reportedPost: post,
      isModalOpen: true,
    });
  },

  closeModal: () => {
    set({
      isModalOpen: false,
      reportedPost: null,
    });
  },
}));

// 편의를 위한 훅들
export const useReportPost = () => {
  const openModalToReport = reportPostStore((state) => state.openModalToReport);
  const closeModal = reportPostStore((state) => state.closeModal);
  return { openModalToReport, closeModal };
};

export const useReportPostModal = () => {
  const reportedPost = reportPostStore((state) => state.reportedPost);
  const isModalOpen = reportPostStore((state) => state.isModalOpen);
  return { reportedPost, isModalOpen };
};

