import { fetchWithRefresh } from "@/core";
export const dynamic = "force-dynamic";
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ commentId: string }> }
) {
  try {
    const { commentId } = await params;


    const proxyUrl = `${process.env.BASE_URL}/api/comments/${commentId}/delete`;

    console.log(proxyUrl, commentId);

    const response = await fetchWithRefresh(
      proxyUrl,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.log(errorText);
      throw Error("서버 불안정" + response.status + errorText);
    }

    return Response.json({ message: "success" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response("서버 불안정", { status: 500 });
  }
}
