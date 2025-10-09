import { PostDetail } from '../types';

export const loadPostDetail = async (postId: number): Promise<PostDetail> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_LOCAL_URL}/api/posts/${postId}`,
    {
      credentials: "include",
    }
  );

  if (!response.ok) {
    throw new Error(`게시글 로드 실패: ${response.status}`);
  }

  const { response: data } = await response.json();
  return data;
};

