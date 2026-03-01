import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Container } from "@/components/Container";
import { PrimaryLink } from "@/components/PrimaryLink";
import { ProjectBackButton } from "@/components/ProjectBackButton";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { Tag } from "@/components/Tag";
import { getProjectBySlug, projects, site } from "@/lib/content";

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export default async function ProjectDetailPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const p = getProjectBySlug(slug);
  if (!p) return notFound();

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50">
      <SiteHeader mode="inner" />
      <main>
        <section className="border-b border-white/10">
          <Container className="py-12 sm:py-14">
            <div className="grid gap-8 lg:grid-cols-[1.6fr_0.8fr]">
              <div>
                <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                  {p.title}
                </h1>
                <p className="mt-3 text-sm leading-6 text-white/65 sm:text-base">
                  {p.summary}
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {p.tags.map((t) => (
                    <Tag key={t} label={t} />
                  ))}
                </div>
                <div className="mt-7 aspect-[4/3] overflow-hidden rounded-3xl border border-white/10 bg-white/5">
                  <img
                    alt={p.title}
                    src={p.coverImageUrl}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>

              <aside className="h-fit rounded-3xl border border-white/10 bg-white/5 p-6">
                <div className="text-xs font-semibold text-white/60">项目信息</div>
                <div className="mt-4 grid gap-3 text-sm">
                  <div className="flex items-center justify-between gap-4">
                    <div className="text-white/60">时间</div>
                    <div className="font-semibold text-white/85">{p.period}</div>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <div className="text-white/60">角色</div>
                    <div className="font-semibold text-white/85">{p.role}</div>
                  </div>
                </div>

                <div className="mt-6 grid gap-2">
                  {p.links.map((l) => (
                    <PrimaryLink
                      key={l.href}
                      href={l.href}
                      label={l.label}
                      variant="secondary"
                      external
                      className="w-full justify-center"
                    />
                  ))}
                  <PrimaryLink
                    href={`mailto:${site.email}`}
                    label="联系我"
                    external
                    className="w-full justify-center"
                  />
                </div>
              </aside>
            </div>
          </Container>
        </section>

        <section>
          <Container className="py-12 sm:py-14">
            <div className="grid gap-10 lg:grid-cols-[1.6fr_0.8fr]">
              <div className="grid gap-8">
                <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                  <div className="text-base font-semibold">背景与目标</div>
                  <div className="mt-2 text-sm leading-6 text-white/70">
                    {p.content.background}
                  </div>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                  <div className="text-base font-semibold">我的职责</div>
                  <ul className="mt-3 grid gap-2 text-sm text-white/70">
                    {p.content.responsibilities.map((x) => (
                      <li key={x} className="leading-6">
                        · {x}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                  <div className="text-base font-semibold">关键成果</div>
                  <ul className="mt-3 grid gap-2 text-sm text-white/70">
                    {p.content.results.map((x) => (
                      <li key={x} className="leading-6">
                        · {x}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                  <div className="text-base font-semibold">取舍与边界</div>
                  <ul className="mt-3 grid gap-2 text-sm text-white/70">
                    {p.content.tradeoffs.map((x) => (
                      <li key={x} className="leading-6">
                        · {x}
                      </li>
                    ))}
                  </ul>
                </div>

                {p.gallery.length > 0 ? (
                  <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                    <div className="text-base font-semibold">截图/媒体</div>
                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                      {p.gallery.map((src) => (
                        <div
                          key={src}
                          className="aspect-[4/3] overflow-hidden rounded-2xl border border-white/10 bg-white/5"
                        >
                          <img
                            alt={p.title}
                            src={src}
                            className="h-full w-full object-cover"
                            loading="lazy"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>

              <div className="h-fit rounded-3xl border border-white/10 bg-white/5 p-6">
                <div className="text-xs font-semibold text-white/60">快速导航</div>
                <div className="mt-4 grid gap-2">
                  <Suspense
                    fallback={
                      <PrimaryLink
                        href="/projects/"
                        label="返回作品集"
                        variant="secondary"
                        className="w-full justify-center"
                      />
                    }
                  >
                    <ProjectBackButton />
                  </Suspense>
                </div>
              </div>
            </div>
          </Container>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
