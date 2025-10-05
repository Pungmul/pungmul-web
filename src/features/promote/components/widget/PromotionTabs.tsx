"use client";
import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Conditional } from "@pThunder/shared/components/Conditional";

import { QuestionItem } from "./QuestionItem";
import { QuestionAddButton } from "./QuestionAddButton";
import { PromotionDescriptionEditor } from "./PromotionDescriptionEditor";
import { usePromotionPostingStore } from "../../store/promotionPostingStore";

const PromotionTabsTabs = [
  {
    label: "공연 소개",
    value: "description",
  },
  {
    label: "설문",
    value: "question",
  },
];

export const PromotionTabs = () => {
  // Zustand store에서 필요한 상태와 액션 가져오기
  const {
    questions,
    focusedQuestionId,
    addQuestion,
    updateQuestion,
    updateQuestionOption,
    deleteQuestion,
    moveQuestion,
    addQuestionOption,
    removeQuestionOption,
    setFocusedQuestionId,
  } = usePromotionPostingStore();
  const [selectedTab, setSelectedTab] = useState(PromotionTabsTabs[0]);
  const tabsSectionRef = useRef<HTMLElement>(null);

  const handleTabChange = (tab: (typeof PromotionTabsTabs)[0]) => {
    setSelectedTab(tab);

    // 탭 섹션으로 스크롤 이동
    if (tabsSectionRef.current) {
      const offset = 80; // 상단 여백
      const elementPosition = tabsSectionRef.current.offsetTop;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <section
      ref={tabsSectionRef}
      className="relative w-full max-w-[640px] min-w-[320px] mx-auto"
    >
      <AnimatePresence key="promotion-tabs-animate-presence">
        <nav className="w-full" key="promotion-tabs-nav">
          <ul className="flex flex-row w-full">
            {PromotionTabsTabs.map((item) => (
              <motion.li
                key={item.label}
                initial={false}
                animate={{
                  color: item === selectedTab ? "var(--color-grey-800)" : "var(--color-grey-400)",
                }}
                className="relative flex-1 border-b border-grey-200 text-center text-[15px] font-semibold py-[12px] cursor-pointer"
                onClick={() => handleTabChange(item)}
              >
                {`${item.label}`}
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-grey-800"
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: item === selectedTab ? 1 : 0,
                  }}
                  transition={{
                    duration: 0.25,
                  }}
                />
              </motion.li>
            ))}
          </ul>
        </nav>
        <main className="w-full flex flex-col gap-[12px] py-[12px] min-h-[320px] h-full">
          <Conditional
            value={selectedTab!.value}
            cases={{
              description: (
                <section className="relative w-full h-[480px] z-0">
                  <PromotionDescriptionEditor />
                </section>
              ),
              question: (
                <section className="w-full flex flex-col gap-[12px]">
                  <main className="w-full flex flex-col gap-[12px]">
                    {questions.map((question, index) => (
                      <QuestionItem
                        key={question.clientTempId}
                        question={question}
                        questionIndex={index}
                        totalQuestions={questions.length}
                        isEditing={focusedQuestionId === question.clientTempId}
                        onFocus={() =>
                          setFocusedQuestionId(question.clientTempId)
                        }
                        onBlur={() => setFocusedQuestionId(null)}
                        updateQuestion={updateQuestion}
                        updateQuestionOption={updateQuestionOption}
                        deleteQuestion={deleteQuestion}
                        moveQuestion={moveQuestion}
                        addQuestionOption={addQuestionOption}
                        removeQuestionOption={removeQuestionOption}
                      />
                    ))}
                  </main>
                  <QuestionAddButton addQuestion={addQuestion} />
                </section>
              ),
            }}
          />
        </main>
      </AnimatePresence>
    </section>
  );
};