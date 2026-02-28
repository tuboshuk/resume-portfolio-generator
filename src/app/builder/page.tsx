import type { Metadata } from "next";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { site } from "@/lib/content";
import { BuilderClient } from "@/app/builder/builder-client";

export const metadata: Metadata = {
  title: `简历制作｜${site.name}`,
  description: site.description,
};

export default function BuilderPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50">
      <SiteHeader mode="inner" />
      <BuilderClient />
      <SiteFooter />
    </div>
  );
}
