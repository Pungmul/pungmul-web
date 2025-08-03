'use client';

import { useView } from "@/shared/lib/useView";
import React from "react";
import { match } from "ts-pattern";

type ResponsiveProps = {
  mobile: React.ReactNode;
  desktop: React.ReactNode;
};

export const Responsive: React.FC<ResponsiveProps> = ({ mobile, desktop }) => {
  const view = useView();

  return match(view)
    .with("desktop", () => desktop)
    .otherwise(() => mobile);
};
