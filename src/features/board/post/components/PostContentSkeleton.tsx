import { SkeletonView } from "@/shared/components";

const PostContentSkeleton:React.FC = () => {
  return (
    <div className="flex flex-col flex-grow -z-10">
      <div
        className="flex-grow flex flex-col"
      >
        <div
          className="flex flex-col px-6 py-5 mt-2 bg-white"
          style={{ gap: 36 }}
        >
          <div className="flex flex-col" style={{ gap: 16 }}>
            <SkeletonView
              style={{ height: 32, width: "80%", borderRadius: 4 }}
            />
            <div className="flex flex-row justify-between items-start">
              <div className="flex flex-row gap-2 items-center">
                <SkeletonView
                  style={{ height: 24, width: 48, borderRadius: 4 }}
                />
              </div>
              <div className="flex items-center flex-row gap-1">
                <div className="w-4 h-4 bg-gray-300" />
                <SkeletonView
                  style={{ height: 16, width: 36, borderRadius: 4 }}
                />
              </div>
            </div>
          </div>
          <div className="flex flex-col" style={{ gap: 12 }}>
            <SkeletonView
              style={{ height: 20, width: "100%", borderRadius: 4 }}
            />
            <SkeletonView
              style={{ height: 20, width: "100%", borderRadius: 4 }}
            />
            <SkeletonView
              style={{ height: 20, width: "40%", borderRadius: 4 }}
            />
          </div>
          <div className="flex flex-row gap-4">
            <div className="flex items-center flex-row gap-1">
              <div className="w-6 h-6 bg-red-200" />
              <SkeletonView
                style={{ height: 24, width: 48, borderRadius: 4 }}
              />
            </div>
            <div className="flex items-center flex-row gap-1">
              <div className="w-6 h-6 bg-gray-200" />
              <SkeletonView
                style={{ height: 24, width: 48, borderRadius: 4 }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostContentSkeleton;