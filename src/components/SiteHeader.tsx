"use client";

import Link from "next/link";
import { useState } from "react";
import { Container } from "@/components/Container";
import { cn } from "@/lib/cn";
import { site } from "@/lib/content";

export function SiteHeader(props: { mode: "home" | "inner" }) {
  const [open, setOpen] = useState(false);
  const basePath = (() => {
    const raw = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/$/, "");
    if (!raw) return "";
    return raw.startsWith("/") ? raw : `/${raw}`;
  })();
  const anchor = (id: string) => (props.mode === "home" ? `#${id}` : `${basePath}/#${id}`);
  const anchors = {
    skills: site.anchors?.skills ?? "skills",
    experience: site.anchors?.experience ?? "experience",
    contact: site.anchors?.contact ?? "contact",
  };
  const labels = {
    skills: site.nav?.skills ?? "技能",
    experience: site.nav?.experience ?? "经历",
    contact: site.nav?.contact ?? "联系",
    projects: site.nav?.projects ?? "作品集",
    learning: site.nav?.learning ?? "学习",
    resume: site.nav?.resume ?? "简历",
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-zinc-950/80 backdrop-blur">
      <Container className="flex h-14 items-center justify-between">
        <Link
          href="/"
          className={cn(
            "flex items-center gap-2 text-sm font-semibold text-white",
            "hover:text-white/90",
          )}
        >
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-white/10">
            {site.name.slice(0, 1)}
          </span>
          <span className="hidden sm:inline">{site.name}</span>
        </Link>

        <nav className="hidden items-center gap-3 text-sm text-white/80 sm:flex">
          <a className="hover:text-white" href={anchor(anchors.skills)}>
            {labels.skills}
          </a>
          <a className="hover:text-white" href={anchor(anchors.experience)}>
            {labels.experience}
          </a>
          <a className="hover:text-white" href={anchor(anchors.contact)}>
            {labels.contact}
          </a>
          <Link
            className="ml-1 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 font-semibold text-white hover:bg-white/10"
            href="/projects/"
          >
            {labels.projects}
          </Link>
          <Link
            className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 font-semibold text-white hover:bg-white/10"
            href="/learning/"
          >
            {labels.learning}
          </Link>
        </nav>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white sm:hidden"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
        >
          <span className="text-lg leading-none">≡</span>
        </button>
      </Container>

      {open ? (
        <div className="fixed inset-0 z-50 bg-black/70 sm:hidden" onClick={() => setOpen(false)}>
          <div
            className="absolute right-4 top-4 w-[min(92vw,360px)] rounded-3xl border border-white/10 bg-zinc-950 p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold text-white/85">菜单</div>
              <button
                type="button"
                className="text-xs font-semibold text-white/60 hover:text-white"
                onClick={() => setOpen(false)}
              >
                关闭
              </button>
            </div>

            <div className="mt-4 grid gap-2 text-sm">
              <a
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white/80"
                href={anchor(anchors.skills)}
                onClick={() => setOpen(false)}
              >
                {labels.skills}
              </a>
              <a
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white/80"
                href={anchor(anchors.experience)}
                onClick={() => setOpen(false)}
              >
                {labels.experience}
              </a>
              <a
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white/80"
                href={anchor(anchors.contact)}
                onClick={() => setOpen(false)}
              >
                {labels.contact}
              </a>
              <Link
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white/80"
                href="/projects/"
                onClick={() => setOpen(false)}
              >
                {labels.projects}
              </Link>
              <Link
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white/80"
                href="/learning/"
                onClick={() => setOpen(false)}
              >
                {labels.learning}
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
