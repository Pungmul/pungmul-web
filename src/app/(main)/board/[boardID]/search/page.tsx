import { notFound } from "next/navigation";
import { SearchResult } from "@/features/board";

export default async function SearchPage({
  params,
  searchParams,
}: {
  params: Promise<{ boardID: number }>;
  searchParams: Promise<{ keyword?: string }>;
}) {
  const { boardID } = await params;
  const { keyword } = await searchParams;
  if (!keyword) {
    return notFound();
  }
  return <SearchResult boardID={boardID} keyword={keyword} />;
}
