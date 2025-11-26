import { ImageObject } from "@pThunder/shared";

export type QuestionType = "TEXT" | "CHOICE" | "CHECKBOX";

export interface QuestionOption {
  label: string;
  orderNo: number;
}

export interface QuestionOptionDto {
  id: number;
  label: string;
  orderNo: number;
}

export interface Question {
  clientTempId: string;
  questionType: QuestionType;
  label: string;
  required: boolean;
  orderNo: number;
  imageUrl?: string | null;
  settingsJson: string;
  options: QuestionOption[];
}

export interface QuestionDto {
  id: number;
  questionType: QuestionType;
  label: string;
  required: boolean;
  orderNo: number;
  imageUrl?: string | null;
  settingsJson: string;
  options: QuestionOptionDto[];
}

export interface Answer {
  answerText?: string | null;
  selectedOptionIds?: number[];
}

export interface FormDetailDto {
  version: number;
  snapshotDto: {
    title: string | null;
    description: string | null;
    questions: Question[] | null;
    formType: string | null;
    startAt: string | null;
    limitNum: number | null;
    address: Address | null;
    performanceImageInfoList: PerformanceImageUrl[] | null;
  };
}

export interface FormDto {
  address: Address | null;
  createdAt: string | null;
  description: string | null;
  formType: string | null;
  id: number;
  limitNum: number;
  ownerId: number;
  performanceImageInfoList: PerformanceImageUrl[] | null;
  publicKey: string | null;
  startAt: string | null;
  status: string | null;
  title: string | null;
  updatedAt: string | null;
}

export interface FormSaveDto {
  expectedVersion: number;
  snapshot: {
    title: string | null;
    description: string | null;
    questions: Question[] | null;
    formType: string | null;
    startAt: string | null;
    limitNum: number | null;
    address: Address | null;
    performanceImageIdList: number[] | null;
  };
}

export interface FormSaveResponse {
  formId: number;
  version: number;
  autosavedAt: string;
}

export interface PromotionDetail {
  performanceId: number;
  title: string;
  description: string;
  limitNum: number;
  startAt: string;
  publicKey: string;
  performanceImageInfoList: PerformanceImageUrl[];
  address: Address | null;
  // imageUrl: null;
  questions: QuestionDto[];
}

export interface Address {
  latitude: number;
  longitude: number;
  detail: string;
  buildingName: string;
}

export interface PerformanceImageUrl {
  id: number;
  imageUrl: string;
}

export interface Promotion {
  id: number;
  ownerId: number;
  title: string;
  description: string;
  publicKey: string;
  status: string;
  formType: string;
  performanceImageInfoList: PerformanceImageUrl[] | null;
  startAt: string | null;
  limitNum: number | null;
  address: Address | null;
  createdAt: string;
  updatedAt: string;
}

export interface PromotionResponseDto {
  address: Address;
  formType: string;
  performanceId: number;
  performanceImageList: ImageObject[];
  publicKey: string;
  startAt: string;
  title: string;
  status: string;
  responseId: number;
  updatedAt: string;
  submittedAt: string;
}

export interface AnswerDto {
  questionId: number;
  selectedOptions: QuestionOptionDto[];
  answerText: string | null;
}

export interface PromotionResponseDetailDto {
  responseId: number;
  formId: number;
  submitterUsername: string;
  submitterNickname: string;
  submittedAt: string;
  answerList: AnswerDto[];
}

export interface PromotionSurveyAnswerRequest {
  questionId: number;
  selectedOptionIds: number[];
  answerText: string | null;
}

// 통계 관련 타입
export interface OptionStatistics {
  optionId: number;
  optionLabel: string;
  count: number;
  percentage: number;
}

export interface QuestionStatistics {
  questionId: number;
  questionLabel: string;
  required: boolean;
  questionType: QuestionType;
  orderNo: number;
  // TEXT 타입의 경우
  textAnswers: string[];
  // CHOICE, CHECKBOX 타입의 경우
  optionStatistics: OptionStatistics[];
  totalResponses: number;
}

export interface ResponseDto {
  responseId: number;
  formId: number;
  submitterUsername: string;
  submitterNickname: string;
  submittedAt: string;
  answerList: AnswerDto[];
}