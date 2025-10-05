export const requestCreatePromotion = async () => {
  const response = await fetch("/api/promotions/create", {
    method: "POST",
  });

  if (!response.ok) {
    throw new Error("Failed to create promotion form");
  }

  const { formId } = await response.json();
  return formId;
};


