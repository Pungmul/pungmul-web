import { NextRequest } from "next/server";

export default async function POST(req: NextRequest) {
  try {
    const {
      title,
      lightningType,
      minPersonnel,
      maxPersonnel,
      recruitmentPeriod,
      address,
      detailAddress,
    } = await req.json();

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/lightning`,
      {
        method: "POST",
        body: JSON.stringify({
          title,
          lightningType,
          minPersonnel,
          maxPersonnel,
          recruitmentPeriod,
          address,
          detailAddress,
        }),
      }
    );

    return Response.json(response);
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Failed to create lightning" },
      { status: 500 }
    );
  }
}
