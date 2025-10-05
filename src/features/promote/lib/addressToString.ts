import { Address } from "@pThunder/features/promote/types";

export const addressToString = (address: Address) => {
  return `${address.buildingName}, ${address.detail}`;
};
