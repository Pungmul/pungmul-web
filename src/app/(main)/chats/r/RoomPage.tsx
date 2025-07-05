"use client";
import { Responsive } from "@/shared/components/Responsive";
import { useParams } from "next/navigation";

export default function RoomPage({ children }: { children: React.ReactNode }) {
  const { roomId } = useParams();
  return (
    <Responsive
      mobile={
        roomId ? (
          <div className="absolute top-0 left-0 w-full h-dvh">{children}</div>
        ) : null
      }
      desktop={<div className="min-w-[50dvw] flex-grow">{children}</div>}
      key="responsive-room-page"
    />
  );
}
