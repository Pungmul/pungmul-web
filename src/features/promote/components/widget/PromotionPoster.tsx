"use client";
import Image from "next/image";
import { PhotoIcon } from "@heroicons/react/24/outline";
import { usePromotionPostingStore } from "../../store/promotionPostingStore";
import { uploadImageToS3 } from "../../api";
import { useSearchParams } from "next/navigation";
import { Spinner } from "@pThunder/shared";

export const PromotionPosterForm = () => {
  // Zustand store에서 필요한 상태와 액션 가져오기
  const { poster, setPoster, setPending, isPending } =
    usePromotionPostingStore();
  const formId = useSearchParams().get("formId");
  const onChangePoster = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!formId) return;
    const file = e.target.files?.[0];
    if (!file) return;
    setPending(true);
    const fileBlob = new Blob([file], { type: file.type });
    const performanceImageList = await uploadImageToS3(
      Number(formId),
      fileBlob
    );
    setPoster({ id: performanceImageList[0]!.id, imageUrl: performanceImageList[0]!.imageUrl });
    setPending(false);
  };

  const onResetPoster = () => {
    setPoster(null);
  };

  return (
    <div className="flex flex-row w-full justify-between max-w-[640px] min-w-[320px] mx-auto gap-[12px] h-[216px] md:h-[320px]">
      <div className="relative flex flex-col h-full bg-grey-200 rounded-md aspect-[7/10] border border-grey-300 overflow-hidden">
        {poster?.imageUrl ? (
          <div className="relative flex flex-col h-full bg-white">
            <Image
              src={poster.imageUrl}
              alt="promotion poster"
              fill
              className="object-cover rounded-md"
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full">
            <PhotoIcon className="size-[32px]" color="#CCCCCC" />
          </div>
        )}
      </div>
      <div className="flex flex-col h-full justify-end">
        <div className="relative flex flex-row items-center justify-between w-full h-fit gap-[8px]">
          <label htmlFor="image-upload" className="cursor-pointer w-fit">
            <div className="flex flex-row items-center justify-center gap-[4px] px-[8px] py-[4px] rounded-md bg-black">
              {isPending ? (
                <Spinner size={16} />
              ) : (
                <span className="text-white text-[14px] font-semibold">
                  포스터 업로드
                </span>
              )}
            </div>
            <input
              type="file"
              className="sr-only"
              id="image-upload"
              disabled={isPending}
              accept="image/*"
              onChange={onChangePoster}
            />
          </label>
          <button
            className="h-full py-[4px] px-[8px] w-fit border border-grey-500 rounded-md text-grey-500 text-[14px] font-semibold"
            onClick={onResetPoster}
            disabled={isPending}
          >
            초기화
          </button>
        </div>
      </div>
    </div>
  );
};
