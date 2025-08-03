import { Post } from "@pThunder/features/post/model/index";
import { NearLightning } from "@pThunder/features/lightning/model/index";
import { NotificationData } from "@pThunder/features/notification/model/index";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { getQueryClient } from "@/core";

export async function loadHotPostList(): Promise<Post[]> {
  try {
    const proxyUrl = `/board/hot-post/api`;

    const proxyResponse = await fetch(proxyUrl, {
      credentials: "include",
      cache: "no-cache",
    });

    if (!proxyResponse.ok) throw Error("서버 불안정" + proxyResponse.status);

    const data = await proxyResponse.json();
    const { list: hotPosts } = data;

    return hotPosts;
  } catch (error) {
    console.error("프록시 처리 중 에러:", error);
    if (error instanceof Error) throw Error(error.message);
    else throw Error("알수 없는 에러");
  }
}

export async function loadNearLightning(): Promise<NearLightning[]> {
  try {
    const proxyUrl = `${process.env.NEXT_PUBLIC_LOCAL_URL}/lightning/search/nearby`;

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

export function useNearLightningQuery() {
  return useSuspenseQuery({
    queryKey: ["nearLightning"],
    queryFn: loadNearLightning,
    retry: false,
  });
}

export const updateUserLocation = async (
  latitude: number,
  longitude: number
): Promise<void> => {
  try {
    const proxyUrl = `/location/api`;

    const response = await fetch(proxyUrl, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ latitude, longitude }),
    });

    if (!response.ok) throw new Error("서버 불안정" + response.status);

    return;
  } catch (error) {
    console.error("사용자 위치 업데이트 중 에러:", error);
    throw error;
  }
};

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

export function useNotReadMessageCount() {
  return useQuery({
    queryKey: ["notificationCount"],
    queryFn: loadNotReadMessageCnt,
  });
}

export function useNotReadMessageList() {
  return useSuspenseQuery({
    queryKey: ["notificationList"],
    queryFn: loadNotReadMessage,
  });
}

export function prefetchNotReadMessageList() {
  const queryClient = getQueryClient();
  queryClient.prefetchQuery({
    queryKey: ["notificationList"],
    queryFn: loadNotReadMessage,
  });

  return queryClient;
} 