interface UploadImageResponse {
  performanceImageList: {
    id: number;
    imageUrl: string;
    originalFileName: string;
  }[];
}

export const uploadImageToS3 = async (formId: number, blob: Blob) => {
  const formData = new FormData();
  formData.append("files", blob);

  const response = await fetch(`/api/promotions/forms/${formId}/uploadImage`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to upload image");
  }

  const { performanceImageList }: UploadImageResponse = await response.json();

  if (performanceImageList.length === 0) {
    throw new Error("Failed to upload image");
  }

  return performanceImageList;
};


