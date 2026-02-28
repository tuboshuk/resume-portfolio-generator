"use client";

import { Container } from "@/components/Container";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { site } from "@/lib/content";

export default function ResumePage() {
  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <SiteHeader mode="inner" />
      <main className="pb-16">
        <Container className="py-10 sm:py-12">
          <div className="flex items-end justify-between gap-6 mb-8 no-print">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">简历预览</h1>
              <p className="mt-2 text-sm text-zinc-500">
                点击右上角“打印”，选择“另存为 PDF”即可导出。
              </p>
            </div>
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-indigo-500 px-5 text-sm font-semibold text-white hover:bg-indigo-400 no-print"
            >
              打印 / 导出 PDF
            </button>
          </div>

          <div
            className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm print:shadow-none print:border-none print:rounded-none print:p-0"
            style={{ maxWidth: "800px" }}
          >
            {/* Header */}
            <div className="border-b border-zinc-200 pb-6 mb-6">
              <div className="flex items-start justify-between gap-6">
                <div>
                  <div className="text-3xl font-bold text-zinc-900">{site.name}</div>
                  <div className="text-lg font-semibold text-zinc-600 mt-1">{site.title}</div>
                  <div className="text-sm text-zinc-500 mt-2 flex flex-wrap gap-3">
                    <span>{site.location}</span>
                    <span>·</span>
                    <a href={`mailto:${site.email}`} className="hover:text-indigo-600">
                      {site.email}
                    </a>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {site.socials.map((s) => (
                      <a
                        key={s.href}
                        href={s.href}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm text-indigo-600 hover:underline"
                      >
                        {s.label}
                      </a>
                    ))}
                  </div>
                </div>
                <div className="h-24 w-24 overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-50">
                  <img
                    alt={site.name}
                    src={site.avatarUrl}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Summary / Tagline */}
            <section className="mb-8">
              <h2 className="text-lg font-bold text-zinc-900 mb-2">个人简介</h2>
              <p className="text-sm leading-6 text-zinc-700">
                {site.tagline}
              </p>
            </section>

            {/* Skills */}
            <section className="mb-8">
              <h2 className="text-lg font-bold text-zinc-900 mb-3">技能</h2>
              <div className="flex flex-wrap gap-2">
                {site.skills.flatMap((g) =>
                  g.items.map((t) => (
                    <span
                      key={`${g.group}-${t}`}
                      className="inline-flex items-center rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-medium text-zinc-700"
                    >
                      {t}
                    </span>
                  )),
                )}
              </div>
            </section>

            {/* Experience */}
            <section className="mb-8">
              <h2 className="text-lg font-bold text-zinc-900 mb-4">工作经历</h2>
              <div className="grid gap-6">
                {site.experience.map((e) => (
                  <div key={e.slug} className="break-inside-avoid">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="text-base font-semibold text-zinc-900">{e.title}</div>
                        <div className="text-sm text-zinc-600 mt-1">{e.org}</div>
                      </div>
                      <div className="text-sm font-semibold text-zinc-500">{e.period}</div>
                    </div>
                    {e.overview ? (
                      <p className="text-sm text-zinc-700 mt-2 leading-6">{e.overview}</p>
                    ) : null}
                    {(e.highlights?.length ? e.highlights : e.bullets).length > 0 ? (
                      <ul className="mt-3 grid gap-1.5 text-sm text-zinc-700">
                        {(e.highlights?.length ? e.highlights : e.bullets).map((b) => (
                          <li key={b} className="leading-6">
                            · {b}
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                ))}
              </div>
            </section>

            {/* Projects */}
            <section className="mb-8">
              <h2 className="text-lg font-bold text-zinc-900 mb-4">代表项目</h2>
              <div className="grid gap-6">
                {site.featuredProjectSlugs.slice(0, 3).map((slug) => {
                  return (
                    <div key={slug} className="break-inside-avoid">
                      <div className="text-base font-semibold text-zinc-900">
                        {slug
                          .split("-")
                          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                          .join(" ")}
                      </div>
                      <p className="text-sm text-zinc-700 mt-1 leading-6">
                        请在 builder 中把项目与经历关联，或直接在 content/projects.json 中完善项目描述。
                      </p>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>
        </Container>
      </main>
      <SiteFooter />
    </div>
  );
}
