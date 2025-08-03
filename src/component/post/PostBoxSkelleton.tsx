import { SkeletonView } from "../shared/SkeletonView";

export default function PostBoxSkelleton({ length }: { length: number }) {
  return (
    <>
      {Array.from({ length }).map((_, idx) => (
        <div
          key={"post-skeleton-" + idx}
          style={{
            gap: 8,
            paddingTop: 16,
            paddingBottom: 16,
            paddingLeft: 28,
            paddingRight: 28,
            borderTopWidth: 0.25,
            borderBottomWidth: 0.25,
            borderColor: "#E3E3E3",
          }}
          className="w-full bg-white flex flex-col px-6 relative"
        >
          <div
            style={{ gap: 8 }}
            className="flex justify-between flex-col items-start gap-2 "
          >
            <SkeletonView style={{ height: 20 }} className="w-full rounded" />
            <SkeletonView
              style={{ height: 12, width: 48 }}
              className="rounded"
            />
          </div>
          <div
            style={{ gap: 8 }}
            className="text-gray-400 flex flex-col w-full"
          >
            <SkeletonView style={{ height: 8 }} className="w-full rounded" />
            <SkeletonView style={{ height: 8 }} className="w-full rounded" />
            <SkeletonView style={{ height: 8 }} className="w-32 rounded" />
          </div>
        </div>
      ))}
    </>
  );
}
