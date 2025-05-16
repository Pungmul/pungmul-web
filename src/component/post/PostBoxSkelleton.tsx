export default function PostBoxSkelleton({ length }: { length: number }) {
  return (
    <>
      {Array.from({ length }).map((_, idx) => (
        <div
          key={idx}
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
            <div
              style={{ height: 20, backgroundColor: "#E3E3E3" }}
              className="w-full rounded skeleton-container"
            >
              <div className="skeleton-item " />
            </div>
            <div
              style={{ height: 12, width: 48, backgroundColor: "#E3E3E3" }}
              className="rounded skeleton-container"
            >
              <div className="skeleton-item " />
            </div>
          </div>
          <div
            style={{ gap: 8 }}
            className="text-gray-400 flex flex-col w-full"
          >
            <div
              style={{ height: 8, backgroundColor: "#E3E3E3" }}
              className="w-full rounded skeleton-container"
            >
              <div className="skeleton-item " />
            </div>
            <div
              style={{ height: 8, backgroundColor: "#E3E3E3" }}
              className="w-full rounded skeleton-container"
            >
              <div className="skeleton-item " />
            </div>
            <div
              style={{ height: 8, backgroundColor: "#E3E3E3" }}
              className="w-32 rounded skeleton-container"
            >
              <div className="skeleton-item " />
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
