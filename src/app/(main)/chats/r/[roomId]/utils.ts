export async function loadChatLogs(roomId: string): Promise<any | null> {
  try {
    const proxyUrl = `/chats/chatlog/${roomId}`;

    const proxyResponse = await fetch(proxyUrl, {
      next: {
        revalidate: 10, // 이 부분만 추가
      },
      credentials: "include",
      cache: "no-cache",
    });

    if (!proxyResponse.ok) throw Error("서버 불안정" + proxyResponse.status);

    const data = await proxyResponse.json();
    // console.log(response);
    console.log(data);

    return data;
  } catch (error) {
    console.error("프록시 처리 중 에러:", error);
    if (error instanceof Error) throw Error(error.message);
    else alert("알수 없는 에러");
    return null;
  }
}

export async function sendTextConent(roomId: string, body: { content: string }) {
  try {
    const proxyUrl = `/chats/r/${roomId}/message`;

    const proxyResponse = await fetch(proxyUrl, {
      method: "POST",
      credentials: "include",
      body: JSON.stringify(body),
    });

    if (!proxyResponse.ok) throw Error("서버 불안정" + proxyResponse.status);

    const data = await proxyResponse.json();
    console.log(data);

    return data;
  } catch (error) {
    console.error("프록시 처리 중 에러:", error);
    if (error instanceof Error) throw Error(error.message);
    else alert("알수 없는 에러");
    return null;
  }
}

export async function sendImageContent(roomId: string, body: FormData) {
  try {
    const proxyUrl = `/chats/r/${roomId}/image`;

    const proxyResponse = await fetch(proxyUrl, {
      method: "POST",
      credentials: "include",
      body: body,
    });

    if (!proxyResponse.ok) throw Error("서버 불안정" + proxyResponse.status);

    const data = await proxyResponse.json();
    console.log(data);

    return data;
  } catch (error) {
    console.error("프록시 처리 중 에러:", error);
    if (error instanceof Error) throw Error(error.message);
    else alert("알수 없는 에러");
    return null;
  }
}
