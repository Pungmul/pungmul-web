import "@pThunder/app/globals.css";

type LightningCardProps = {
  type: "GENERAL" | "PUNGMUL";
  name: string; // max 20자
  startAt: string; // ISO
  endAt: string;
  deadlineMinutes: number;
  minParticipants: number;
  maxParticipants: number;
  location: {
    latitude: number;
    longitude: number;
    buildingName?: string;
    detail?: string;
  };
  tags: string[]; // max 4
  visibility: "PUBLIC" | "SCHOOL";
};

export const LightningCard: React.FC<LightningCardProps> = ({
  // type,
  name,
  // startAt,
  // endAt,
  // deadlineMinutes,
  // minParticipants,
  // maxParticipants,
  // location,
  // tags,
  // visibility,
}) => {
  return (
    <div className="w-full h-full bg-black rounded-lg overflow-hidden">
      <h1 className="text-white">{name}</h1>
    </div>
  );
};
