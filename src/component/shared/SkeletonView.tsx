import { CSSProperties, useEffect, useRef } from "react";

export const SkeletonView: React.FC<{
  className?: string;
  style?: CSSProperties;
  bgColor?: CSSProperties["color"];
  highlightColor?: CSSProperties["color"];
}> = ({
  className,
  style,
  bgColor = "#E3E3E3",
  highlightColor = "#f0f0f0",
}) => {
  const childRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!childRef.current) return;
    if (bgColor) {
      if (containerRef.current) {
        containerRef.current.style.setProperty("--bg-default", bgColor);
      }
      childRef.current?.style.setProperty("--bg-default", bgColor);
    }
    if (highlightColor) {
      childRef.current?.style.setProperty("--highlight", highlightColor);
    }
  }, [bgColor, highlightColor]);

  return (
    <div
      ref={containerRef}
      style={{ ...style, backgroundColor: bgColor }}
      className={"skeleton-container " + className}
    >
      <div
        ref={childRef}
        className="skeleton-item"
        style={{
          background: `linear-gradient(to right, ${bgColor}, ${highlightColor}, ${bgColor})`,
        }}
      />
    </div>
  );
};
