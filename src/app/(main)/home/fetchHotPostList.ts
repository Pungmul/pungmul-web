"use server";

import { cookies } from "next/headers";

export async function fetchHotPostList() {
  try {
    const proxyUrl = `${process.env.BASE_URL}/api/boards/hot`;

    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    const proxyResponse = await fetch(proxyUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!proxyResponse.ok) throw Error("서버 불안정" + proxyResponse.status);

    const { response } = await proxyResponse.json();
    const { hotPosts } = response;
    return hotPosts;
  } catch (error) {
    console.error("프록시 처리 중 에러:", error);
    return [];
  }
}
