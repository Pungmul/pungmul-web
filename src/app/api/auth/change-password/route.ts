import { fetchWithRefresh } from "@pThunder/core";

export const POST = async (req: Request) => {
  try {
    const proxyUrl = `${process.env.BASE_URL}/api/member/password`;

    const { currentPassword, newPassword } = await req.json();

    console.log(currentPassword, newPassword);
    console.log(JSON.stringify({ currentPassword, password: newPassword }));
    const response = await fetchWithRefresh(proxyUrl, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ currentPassword, password: newPassword }),
    });

    if (!response.ok) {
      const errorText = await response.text();

      console.error("에러:", errorText);
      throw Error("서버 불안정" + response.status);
    }

    const proxyResponse = await response.json();
    return Response.json(proxyResponse, { status: 200 });
  } catch (error) {
    console.error("프록시 처리 중 에러:", error);
    return new Response("프록시 처리 실패", { status: 500 });
  }
};
