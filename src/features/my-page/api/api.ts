import { useQuery } from "@tanstack/react-query";

const getMyPageInfo = async () => {
    const response = await fetch("/my-page/api", {
        credentials: "include",
    });

    if (!response.ok) throw Error("비정상 동작");

    const data = await response.json();

    return data;
};

export const useGetMyPageInfo = () => {
    return useQuery({
        queryKey: ["my-page-info"],
        queryFn: getMyPageInfo,
        staleTime: 1000 * 60 * 5,
    });
};