import { match } from "ts-pattern";
import { QuestionType } from "../types";

/**
 * 질문 유형에 해당하는 라벨을 반환합니다.
 */
export function getQuestionTypeLabel(type: QuestionType): string {
  return match(type)
    .with("TEXT", () => "단답형")
    .with("CHOICE", () => "객관식")
    .with("CHECKBOX", () => "체크 리스트")
    .otherwise(() => "");
}


