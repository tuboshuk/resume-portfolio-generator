"use client";

import { useSearchParams } from "next/navigation";
import { PrimaryLink } from "@/components/PrimaryLink";

export function ProjectBackButton() {
  const params = useSearchParams();
  const from = params.get("from");

  if (from === "home") {
    return (
      <PrimaryLink
        href="/"
        label="返回首页"
        variant="secondary"
        className="w-full justify-center"
      />
    );
  }

  return (
    <PrimaryLink
      href="/projects/"
      label="返回作品集"
      variant="secondary"
      className="w-full justify-center"
    />
  );
}
