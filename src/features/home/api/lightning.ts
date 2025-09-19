import { NearLightning } from "@pThunder/features/lightning/model/index";

export async function loadNearLightning(): Promise<NearLightning[]> {
  try {
    const proxyUrl = `${process.env.NEXT_PUBLIC_LOCAL_URL}/api/lightning/nearby`;

    const proxyResponse = await fetch(proxyUrl, {
      credentials: "include",
    });

    if (!proxyResponse.ok) throw Error("서버 불안정" + proxyResponse.status);

    const data = await proxyResponse.json();
    const { lightningMeetingList } = data;
    return lightningMeetingList;
  } catch (error) {
    console.error("프록시 처리 중 에러:", error);
    if (error instanceof Error) throw Error(error.message);
    else throw Error("알수 없는 에러");
  }
} 