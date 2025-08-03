"use server";
import { cookies } from "next/headers";

const serverApi = {
  reissueToken: async (): Promise<{
    accessToken: string;
    expiresIn: number;
    refreshToken: string;
    refreshTokenExpiresIn: number;
  }> => {
    try {
      const cookieStore = await cookies();
      const refreshToken = cookieStore.get("refreshToken")?.value;

      if (!refreshToken) {
        throw new Error("Refresh token not found");
      }

      const refreshResponse = await fetch(
        `${process.env.BASE_URL}/api/member/refresh`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            refreshToken: refreshToken,
          },
        }
      );

      if (!refreshResponse.ok) {
        throw new Error("Token refresh failed - please login again");
      }

      const { response } = await refreshResponse.json();
      const {
        accessToken: newAccessToken,
        expiresIn,
        refreshToken: newRefreshToken,
        refreshTokenExpiresIn,
      } = response;

      if (!newAccessToken) {
        throw new Error("Invalid token response");
      }

      return {
        accessToken: newAccessToken,
        expiresIn,
        refreshToken: newRefreshToken,
        refreshTokenExpiresIn,
      };
    } catch (error) {
      console.error("Token refresh failed - please login again", error);

      const cookieStore = await cookies();

      cookieStore.delete("accessToken");
      cookieStore.delete("refreshToken");

      throw new Error("Token refresh failed - please login again");
    }
  },
};

export const { reissueToken } = serverApi;