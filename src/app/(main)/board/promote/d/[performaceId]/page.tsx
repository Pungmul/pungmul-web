"use client";
import dynamic from "next/dynamic";

import { useParams, useRouter } from "next/navigation";
import { loadPromotionDetail } from "@/features/promote";
import type { PromotionDetail } from "@/features/promote";
import { Spinner } from "@/shared";

import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Conditional } from "@/shared/components/Conditional";

import { Header } from "@/shared";
import { PromotionProfile } from "@/features/promote";


// Toast UI Editor를 클라이언트에서만 로드
const Viewer = dynamic(
  () =>
    import("@/features/promote/components/import").then((mod) => ({
      default: mod.ToastViewer,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="flex-1 flex items-center justify-center">
        <Spinner size={32} />
      </div>
    ),
  }
);

export default function PromotionPage() {
  const { performaceId } = useParams<{ performaceId: string }>();
  const router = useRouter();
  const { data: promotionDetail, isLoading: isPromotionDetailLoading } =
    useQuery<PromotionDetail>({
      queryKey: ["promotionDetail", performaceId],
      queryFn: () => loadPromotionDetail(performaceId),
    });

  useEffect(() => {
    if (promotionDetail) {
      document.title = `풍덩 | ${promotionDetail.title}`;
    } else {
      document.title = "풍덩 | 공연";
    }
  }, [promotionDetail]);

  return (
    <div className=" bg-grey-100 w-full">
      {isPromotionDetailLoading ? (
        <div className="w-full flex flex-col gap-[12px] md:max-w-[768px] mx-auto min-h-screen bg-background">
          <Header title={""} isBackBtn={false} />
          <div className="flex-1 flex items-center justify-center">
            <Spinner size={32} />
          </div>
        </div>
      ) : (
        <div className="relative w-full md:max-w-[768px] mx-auto bg-background">
          <article className="relative w-full flex flex-col bg-background min-h-screen">
            <Header title={promotionDetail?.title || ""} />
            <section className="flex flex-col gap-[12px] flex-grow h-full">
              <PromotionProfile
                posterUrl={
                  promotionDetail?.performanceImageInfoList?.[0]?.imageUrl || ""
                }
                title={promotionDetail?.title || ""}
                address={promotionDetail?.address || null}
                startAt={promotionDetail?.startAt || ""}
              />
              <PromotionTabs description={promotionDetail?.description || ""} />
            </section>
            <section className="sticky bottom-0 w-full flex justify-center px-[28px] pb-[24px] py-[48px] bg-gradient-to-t from-background via-background via-80% to-transparent">
              <button
                className="bg-red-300 text-background w-full h-[48px] rounded-[8px]"
                onClick={() =>
                  router.push(`/board/promote/d/${performaceId}/survey`)
                }
              >
                참가 신청하기
              </button>
            </section>
          </article>
        </div>
      )}
    </div>
  );
}


const PromotionDetailTabs: TabItem[] = [
  {
    label: "공연 소개",
    value: "description",
  },
  {
    label: "기타 안내",
    value: "etc",
  },
];
const PromotionTabs = ({ description }: { description?: string }) => {
  const [selectedTab, setSelectedTab] = useState<TabItem>(
    PromotionDetailTabs[0]!
  );

  const handleTabChange = (tab: TabItem) => {
    setSelectedTab(tab);
  };

  return (
    <AnimatePresence key="promotion-tabs-animate-presence">
      <section className="relative w-full flex-grow h-full flex flex-col">
        <nav className="w-full" key="promotion-tabs-nav">
          <ul className="flex flex-row w-full border-b border-grey-200 px-[24px]">
            {PromotionDetailTabs.map((item) => (
              <motion.li
                key={item.label}
                initial={false}
                animate={{
                  color: item.value === selectedTab.value ? "var(--color-grey-800)" : "var(--color-grey-500)",
                }}
                className="relative w-[96px] text-center text-[15px] font-semibold py-[12px] cursor-pointer"
                onClick={() => handleTabChange(item)}
              >
                {`${item.label}`}
                {item.value === selectedTab.value ? (
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-grey-800"
                    layoutId="underline"
                    transition={{
                      duration: 0.25,
                    }}
                  />
                ) : null}
              </motion.li>
            ))}
          </ul>
        </nav>
        <main className="w-full flex flex-col gap-[12px] py-[12px] min-h-[320px] px-[16px] flex-grow">
          <Conditional
            value={selectedTab.value}
            cases={{
              description: (
                <PromotionDescription description={description || ""} />
              ),
              etc: <PromotionEtc etc={""} />,
            }}
          />
        </main>
      </section>
    </AnimatePresence>
  );
};

const PromotionDescription = ({ description }: { description?: string }) => {

  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const darkMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    // 초기 값 세팅
    setTheme(darkMediaQuery.matches ? 'dark' : 'light');

    // 변경 감지
    const handler = (e: MediaQueryListEvent) => setTheme(e.matches ? 'dark' : 'light');
    darkMediaQuery.addEventListener('change', handler);

    return () => darkMediaQuery.removeEventListener('change', handler);
  }, []);

  return (
    <section className="w-full flex flex-col gap-[12px] bg-background px-[16px] py-[16px] flex-grow">
      <h1 className="text-grey-800 text-[18px] font-semibold">공연 소개</h1>
      <div className="text-grey-500 text-[14px] font-normal max-w-full">
        <Viewer initialValue={description || ""} theme={theme} />
      </div>
    </section>
  );
};

const PromotionEtc = ({ etc }: { etc?: string }) => {
  return (
    <section className="w-full flex flex-col gap-[12px] bg-background px-[16px] py-[16px] flex-grow">
      <h1 className="text-grey-800 text-[18px] font-semibold">기타 안내</h1>
      <div className="text-grey-500 text-[14px] font-normal max-w-full line-clamp-2">
        {etc || ""}
      </div>
    </section>
  );
};
