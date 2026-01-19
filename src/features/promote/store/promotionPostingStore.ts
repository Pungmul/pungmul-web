import { create } from "zustand";
import {
  FormDetailDto,
  FormSaveDto,
  FormSaveResponse,
  Question,
  QuestionType,
} from "../types";
import dayjs from "dayjs";
import type { Editor as EditorType } from "@toast-ui/react-editor";
import type { Address } from "@/shared/types";

interface ImageInfo {
  id: number;
  imageUrl: string;
}

interface PromotionPostingState {
  // 폼 기본 정보
  title: string;
  address: Address | null;
  dateTime: string;
  limitPersonnel: number;
  isUnlimitedPersonnel: boolean;
  description: string;
  // 포스터
  poster: ImageInfo | null;

  // 질문 관리
  questions: Question[];
  focusedQuestionId: string | null;

  // 폼 버전 관리
  version: number;

  // 편집 상태
  isDirty: boolean;
  isPending: boolean;

  // Editor Ref
  descriptionEditorRef: React.RefObject<EditorType | null> | null;
}

interface PromotionPostingActions {
  // 기본 정보 관리
  setTitle: (title: string) => void;
  setAddress: (address: Address | null) => void;
  setDateTime: (dateTime: string) => void;
  setLimitPersonnel: (limitPersonnel: number) => void;
  setIsUnlimitedPersonnel: (isUnlimited: boolean) => void;
  setDetailAddress: (detailAddress: string) => void;
  setDescription: (description: string) => void;
  // 포스터 관리
  setPoster: (poster: { id: number; imageUrl: string } | null) => void;

  // 질문 관리
  setQuestions: (questions: Question[]) => void;
  addQuestion: (type: QuestionType) => void;
  updateQuestion: (clientTempId: string, updates: Partial<Question>) => void;
  updateQuestionOption: (
    clientTempId: string,
    optionIndex: number,
    label: string
  ) => void;
  deleteQuestion: (clientTempId: string) => void;
  moveQuestion: (clientTempId: string, direction: "up" | "down") => void;
  addQuestionOption: (clientTempId: string) => void;
  removeQuestionOption: (clientTempId: string, optionIndex: number) => void;
  setFocusedQuestionId: (id: string | null) => void;

  // 버전 관리
  setVersion: (version: number) => void;

  // 편집 상태 관리
  markAsDirty: () => void;
  markAsClean: () => void;
  setPending: (pending: boolean) => void;

  // Editor Ref 관리
  setDescriptionEditorRef: (
    ref: React.RefObject<EditorType | null> | null
  ) => void;
  getDescriptionEditorContent: () => string;
  setDescriptionEditorContent: (content: string) => void;

  // 폼 제출 관리
  prepareFormData: () => FormSaveDto;
  saveForm: ({
    formId,
    onSuccess,
    onError,
  }: {
    formId: number;
    onSuccess?: (data: FormSaveResponse) => void;
    onError?: (error: unknown) => void;
  }) => void;
  submitForm: ({
    formId,
    onSuccess,
    onError,
  }: {
    formId: number;
    onSuccess?: (data: {
      formId: number;
      publicKey: string;
      publicUrl: string;
    }) => void;
    onError?: (error: unknown) => void;
  }) => void;

  // 날짜/시간 헬퍼 함수들
  getFormattedDate: () => string;
  getFormattedTime: () => string;
  setDate: (date: string) => void;
  setTime: (time: string) => void;

  // 폼 초기화
  initializeForm: (formData: FormDetailDto) => void;
  reset: () => void;
}

const initialState: PromotionPostingState = {
  title: "",
  address: null,
  dateTime: "",
  limitPersonnel: 0,
  isUnlimitedPersonnel: false,
  poster: null,
  questions: [],
  focusedQuestionId: null,
  version: 0,
  isDirty: false,
  isPending: false,
  description: "",
  descriptionEditorRef: null,
};

export const usePromotionPostingStore = create<
  PromotionPostingState & PromotionPostingActions
>((set, get) => ({
  ...initialState,

  // 기본 정보 관리
  setTitle: (title) => set({ title, isDirty: true }),
  setAddress: (address) => set({ address, isDirty: true }),
  setDateTime: (dateTime) => set({ dateTime, isDirty: true }),
  setLimitPersonnel: (limitPersonnel) => set({ limitPersonnel, isDirty: true }),
  setIsUnlimitedPersonnel: (isUnlimitedPersonnel) =>
    set({ isUnlimitedPersonnel, isDirty: true }),
  setDescription: (description) => set({ description, isDirty: true }),
  setDetailAddress: (detailAddress) =>
    set((state) => ({
      address: state.address
        ? { ...state.address, detail: detailAddress }
        : {
            latitude: 0,
            longitude: 0,
            detail: detailAddress,
            buildingName: "",
          },
      isDirty: true,
    })),

  // 포스터 관리
  setPoster: (poster) =>
    set({
      poster,
      isDirty: true,
    }),

  // 질문 관리
  setQuestions: (questions) => set({ questions, isDirty: true }),

  addQuestion: (type) => {
    const { questions } = get();
    const newQuestion: Question = {
      clientTempId: `q-${Date.now()}`,
      questionType: type,
      label: "",
      required: false,
      orderNo: questions.length + 1,
      imageUrl: null,
      settingsJson: getDefaultSettings(type),
      options: type === "TEXT" ? [] : [{ label: "", orderNo: 1 }],
    };

    set({
      questions: [...questions, newQuestion],
      focusedQuestionId: newQuestion.clientTempId,
      isDirty: true,
    });
  },

  updateQuestion: (clientTempId, updates) =>
    set((state) => ({
      questions: state.questions.map((question) =>
        question.clientTempId === clientTempId
          ? { ...question, ...updates }
          : question
      ),
      isDirty: true,
    })),

  updateQuestionOption: (clientTempId, optionIndex, label) =>
    set((state) => ({
      questions: state.questions.map((question) =>
        question.clientTempId === clientTempId
          ? {
              ...question,
              options: question.options.map((option, index) =>
                index === optionIndex ? { ...option, label } : option
              ),
            }
          : question
      ),
      isDirty: true,
    })),

  deleteQuestion: (clientTempId) =>
    set((state) => ({
      questions: state.questions.filter((q) => q.clientTempId !== clientTempId),
      focusedQuestionId:
        state.focusedQuestionId === clientTempId
          ? null
          : state.focusedQuestionId,
      isDirty: true,
    })),

  moveQuestion: (clientTempId, direction) =>
    set((state) => {
      const currentIndex = state.questions.findIndex(
        (q) => q.clientTempId === clientTempId
      );
      if (currentIndex === -1) return state;

      const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
      if (newIndex < 0 || newIndex >= state.questions.length) return state;

      const newQuestions = [...state.questions];
      const temp = newQuestions[currentIndex];
      if (temp && newQuestions[newIndex]) {
        newQuestions[currentIndex] = newQuestions[newIndex];
        newQuestions[newIndex] = temp;
      }

      // orderNo 업데이트
      const updatedQuestions = newQuestions.map((q, index) => ({
        ...q,
        orderNo: index + 1,
      }));

      return { questions: updatedQuestions, isDirty: true };
    }),

  addQuestionOption: (clientTempId) =>
    set((state) => ({
      questions: state.questions.map((question) =>
        question.clientTempId === clientTempId
          ? {
              ...question,
              options: [
                ...question.options,
                { label: "", orderNo: question.options.length + 1 },
              ],
            }
          : question
      ),
      isDirty: true,
    })),

  removeQuestionOption: (clientTempId, optionIndex) =>
    set((state) => ({
      questions: state.questions.map((question) =>
        question.clientTempId === clientTempId
          ? {
              ...question,
              options: question.options
                .filter((_, index) => index !== optionIndex)
                .map((option, index) => ({ ...option, orderNo: index + 1 })),
            }
          : question
      ),
      isDirty: true,
    })),

  setFocusedQuestionId: (focusedQuestionId) => set({ focusedQuestionId }),

  // 버전 관리
  setVersion: (version) => set({ version }),

  // 편집 상태 관리
  markAsDirty: () => set({ isDirty: true }),
  markAsClean: () => set({ isDirty: false }),
  setPending: (isPending) => set({ isPending }),

  // Editor Ref 관리
  setDescriptionEditorRef: (descriptionEditorRef) =>
    set({ descriptionEditorRef }),

  getDescriptionEditorContent: () => {
    const { descriptionEditorRef } = get();
    if (descriptionEditorRef?.current) {
      return descriptionEditorRef.current.getInstance().getMarkdown();
    }
    return "";
  },

  setDescriptionEditorContent: (content) => {
    const { descriptionEditorRef } = get();
    if (descriptionEditorRef?.current) {
      descriptionEditorRef.current.getInstance().setMarkdown(content);
    }
  },

  // 폼 제출 관리
  prepareFormData: () => {
    const state = get();
    const description = state.getDescriptionEditorContent();

    // poster가 맨 앞에 오도록 정렬
    const performanceImageIdList = state.poster ? [state.poster.id] : null;

    return {
      expectedVersion: state.version,
      snapshot: {
        questions: state.questions,
        title: state.title,
        description: description,
        formType: "PERFORMANCE",
        startAt: state.dateTime,
        limitNum: state.isUnlimitedPersonnel ? 999 : state.limitPersonnel,
        address: state.address,
        performanceImageIdList,
      },
    };
  },

  saveForm: ({ formId, onSuccess, onError }) => {
    const { setVersion, markAsClean, setPending } = get();
    const formData = get().prepareFormData();

    // 저장 상태 설정
    setPending(true);

    // API 호출
    fetch(`/api/promotions/forms/${formId}/save`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data: FormSaveResponse) => {
        setVersion(data.version);
        markAsClean();
        setPending(false);
        onSuccess?.(data);
      })
      .catch((error) => {
        setPending(false);
        onError?.(error);
      });
  },

  submitForm: ({ formId, onSuccess, onError }) => {
    const { setVersion, markAsClean, setPending } = get();
    const formData = get().prepareFormData();

    // 저장 상태 설정
    setPending(true);

    // API 호출
    fetch(`/api/promotions/forms/${formId}/save`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data: FormSaveResponse) => {
        setVersion(data.version);
        markAsClean();
        setPending(false);
        // 저장 성공 후 제출 요청
        fetch(`/api/promotions/forms/${formId}/submit`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ expectedVersion: data.version }),
        })
          .then((response) => response.json())
          .then((submitData) => {
            setPending(false);
            onSuccess?.(submitData);
          })
          .catch((error: unknown) => {
            setPending(false);
            onError?.(error);
          });
      })
      .catch((error) => {
        setPending(false);
        onError?.(error);
      });
  },

  // 날짜/시간 헬퍼 함수들
  getFormattedDate: () => {
    const { dateTime } = get();
    return dayjs(new Date(dateTime)).format("YYYY-MM-DD");
  },

  getFormattedTime: () => {
    const { dateTime } = get();
    return dayjs(new Date(dateTime)).format("HH:mm");
  },

  setDate: (date: string) => {
    const { dateTime } = get();
    const [year, month, day] = date.split("-");
    if (!year || !month || !day) return;
    const newDate = dayjs(dateTime || new Date())
      .set("year", parseInt(year))
      .set("month", parseInt(month) - 1)
      .set("date", parseInt(day));
    set({ dateTime: newDate.format("YYYY-MM-DDTHH:mm:ss"), isDirty: true });
  },

  setTime: (time: string) => {
    const { dateTime } = get();
    const [hour, minute] = time.split(":");
    if (!hour || !minute) return;
    const newDate = dayjs(dateTime || new Date())
      .set("hour", parseInt(hour))
      .set("minute", parseInt(minute))
      .set("second", 0)
      .set("millisecond", 0);
    set({ dateTime: newDate.format("YYYY-MM-DDTHH:mm:ss"), isDirty: true });
  },

  // 폼 초기화
  initializeForm: (formData) => {
    const snapshot = formData.snapshotDto || formData;
    set({
      title: snapshot.title || "",
      address: snapshot.address || null,
      dateTime: snapshot.startAt || "",
      limitPersonnel: snapshot.limitNum ?? 0,
      isUnlimitedPersonnel: snapshot.limitNum === null,
      poster: snapshot.performanceImageInfoList?.[0] || null,
      questions: snapshot.questions ?? [],
      version: formData.version || 0,
      isDirty: false,
      isPending: false,
      description: snapshot.description || "",
    });
  },

  // 초기화
  reset: () => set(initialState),
}));

// 헬퍼 함수
function getDefaultSettings(type: QuestionType): string {
  switch (type) {
    case "TEXT":
      return JSON.stringify({ maxLength: 100, placeholder: "" });
    case "CHOICE":
      return JSON.stringify({ shuffleOptions: false, allowOther: false });
    case "CHECKBOX":
      return JSON.stringify({ min: 1, max: 5 });
    default:
      return "{}";
  }
}
