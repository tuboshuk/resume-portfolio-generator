import type { Metadata } from "next";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { site } from "@/lib/content";
import { BlogClient } from "@/app/blog/blog-client";

export const metadata: Metadata = {
  title: `博客｜${site.name}`,
  description: site.description,
};

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50">
      <SiteHeader mode="inner" />
      <BlogClient />
      <SiteFooter />
    </div>
  );
}
