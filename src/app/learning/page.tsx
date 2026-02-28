import type { Metadata } from "next";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { site } from "@/lib/content";
import { LearningClient } from "@/app/learning/learning-client";

export const metadata: Metadata = {
  title: `学习｜${site.name}`,
  description: site.description,
};

export default function LearningPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50">
      <SiteHeader mode="inner" />
      <LearningClient />
      <SiteFooter />
    </div>
  );
}

