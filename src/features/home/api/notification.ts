import { NotificationData } from "@pThunder/features/notification/model/index";

export async function loadNotReadMessageCnt(): Promise<number> {
  try {
    const proxyUrl = `/notification/notReadCnt`;

    const proxyResponse = await fetch(proxyUrl, {
      credentials: "include",
      cache: "no-cache",
    });

    if (!proxyResponse.ok) throw Error("서버 불안정" + proxyResponse.status);

    const count = await proxyResponse.json();

    return count;
  } catch (error) {
    console.error("프록시 처리 중 에러:", error);
    throw error;
  }
}

export async function loadNotReadMessage(): Promise<NotificationData[]> {
  try {
    const proxyResponse = await fetch(
      `${process.env.NEXT_PUBLIC_LOCAL_URL}/notification/notReadMessage`,
      {
        credentials: "include",
      }
    );
    if (!proxyResponse.ok) throw Error("서버 불안정" + proxyResponse.status);

    const messages = await proxyResponse.json();

    return messages;
  } catch (error) {
    console.error("프록시 처리 중 에러:", error);
    throw error;
  }
} 