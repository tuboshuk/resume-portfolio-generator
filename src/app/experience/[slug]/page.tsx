import { notFound } from "next/navigation";
import { Container } from "@/components/Container";
import { PrimaryLink } from "@/components/PrimaryLink";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { Tag } from "@/components/Tag";
import { site } from "@/lib/content";

export const dynamicParams = false;

export function generateStaticParams() {
  return site.experience.map((e) => ({ slug: e.slug }));
}

export default async function ExperienceDetailPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const e = site.experience.find((x) => x.slug === slug);
  if (!e) return notFound();

  const experienceAnchor = site.anchors?.experience ?? "experience";
  const highlights = e.highlights?.length ? e.highlights : e.bullets;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50">
      <SiteHeader mode="inner" />
      <main>
        <section className="border-b border-white/10">
          <Container className="py-12 sm:py-14">
            <div className="grid gap-8 lg:grid-cols-[1.6fr_0.8fr]">
              <div>
                <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                  {e.org}
                </h1>
                <div className="mt-2 text-sm font-semibold text-white/65">{e.title}</div>
                <div className="mt-2 text-sm font-semibold text-white/55">{e.period}</div>

                {e.overview ? (
                  <p className="mt-5 text-sm leading-6 text-white/70 sm:text-base">
                    {e.overview}
                  </p>
                ) : null}

                {e.stack?.length ? (
                  <div className="mt-5 flex flex-wrap gap-2">
                    {e.stack.map((t) => (
                      <Tag key={t} label={t} />
                    ))}
                  </div>
                ) : null}
              </div>

              <aside className="h-fit rounded-3xl border border-white/10 bg-white/5 p-6">
                <div className="text-xs font-semibold text-white/60">快速操作</div>
                <div className="mt-4 grid gap-2">
                  <PrimaryLink
                    href={`/#${experienceAnchor}`}
                    label={site.nav?.experience ?? "返回成长轨迹"}
                    variant="secondary"
                    className="w-full justify-center"
                  />
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
                  <div className="text-base font-semibold">重点成果</div>
                  <ul className="mt-3 grid gap-2 text-sm text-white/70">
                    {highlights.map((x) => (
                      <li key={x} className="leading-6">
                        · {x}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                  <div className="text-base font-semibold">详细工作</div>
                  <ul className="mt-3 grid gap-2 text-sm text-white/70">
                    {e.bullets.map((x) => (
                      <li key={x} className="leading-6">
                        · {x}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {e.links?.length ? (
                <div className="h-fit rounded-3xl border border-white/10 bg-white/5 p-6">
                  <div className="text-xs font-semibold text-white/60">相关链接</div>
                  <div className="mt-4 grid gap-2">
                    {e.links.map((l) => (
                      <PrimaryLink
                        key={`${l.label}-${l.href}`}
                        href={l.href}
                        label={l.label}
                        variant="secondary"
                        external
                        className="w-full justify-center"
                      />
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </Container>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
