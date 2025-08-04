"use client";
import { useParams } from "next/navigation";
import { Responsive } from "@/shared/components/Responsive";

export default function RoomPageContent({ children }: { children: React.ReactNode }) {
    const { roomId } = useParams();
    
    return (
      <Responsive
        mobile={
          roomId ? (
            <div className="absolute top-0 left-0 w-full h-dvh z-50">{children}</div>
          ) : null
        }
        desktop={<div className="min-w-[50dvw] flex-grow">{children}</div>}
        key="responsive-room-page"
      />
    );
  }
  