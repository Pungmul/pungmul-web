import {
  getQueryClient,
  Instrument,
  InstrumentStatus,
  Member,
} from "@pThunder/shared";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";

const getMyPageInfo = async (): Promise<Member> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_LOCAL_URL}/my-page/api`,
    {
      credentials: "include",
    }
  );

  if (!response.ok) throw Error("비정상 동작");

  const data = await response.json();

  return data;
};

const updateInstrumentSkill = async (body: InstrumentStatus) => {
  try {
    const { instrument, instrumentAbility, major } = body;
    console.log(JSON.stringify({ instrument, instrumentAbility, major }));
    const response = await fetch("instrument-skill/patch", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ instrument, instrumentAbility, major }),
    });

    if (!response.ok) throw new Error("악기 정보 업데이트 실패");
    const { response: data } = await response.json();
    const { instruments } = data;
    return instruments;
  } catch (e) {
    console.error(e);
    alert("악기 정보 업데이트 실패");
  }
};

const addInstrumentSkill = async (body: InstrumentStatus) => {
  try {
    const response = await fetch("/instrument-skill/patch", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(body),
    });
    return await response.json();
  } catch (e) {
    console.error(e);
    alert("악기 정보 업데이트 실패");
  }
};

const deleteInstrumentSkill = async (instrument: Instrument) => {
  try {
    const response = await fetch("/instrument-skill/patch", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ instrument }),
    });

    if (!response.ok) throw new Error("악기 정보 업데이트 실패");
    const { response: data } = await response.json();
    const { instruments } = data;
    return instruments;
  } catch (e) {
    console.error(e);
    alert("악기 정보 삭제 실패");
  }
};

export { getMyPageInfo };

const prefetchMyPageInfo = () => {
  const queryClient = getQueryClient();
  queryClient.prefetchQuery({
    queryKey: ["my-page-info"],
    queryFn: getMyPageInfo,
    staleTime: 1000 * 60 * 5,
  });
  return queryClient;
};

const useGetMyPageInfo = () => {
  return useSuspenseQuery({
    queryKey: ["my-page-info"],
    queryFn: getMyPageInfo,
    staleTime: 1000 * 60 * 5,
  });
};

const useUpdateInstrumentSkill = () => {
  return useMutation({
    mutationFn: updateInstrumentSkill,
    mutationKey: ["instrument-skill"],
  });
};

const useAddInstrumentSkill = () => {
  return useMutation({
    mutationFn: addInstrumentSkill,
    mutationKey: ["instrument-skill"],
  });
};

const useDeleteInstrumentSkill = () => {
  return useMutation({
    mutationFn: deleteInstrumentSkill,
    mutationKey: ["instrument-skill"],
  });
};

export {
  prefetchMyPageInfo as prefetchMyPageInfo,
  useGetMyPageInfo,
  useUpdateInstrumentSkill,
  useAddInstrumentSkill,
  useDeleteInstrumentSkill,
};
