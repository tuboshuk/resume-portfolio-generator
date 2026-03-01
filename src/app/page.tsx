import Link from "next/link";
import { Container } from "@/components/Container";
import { CopyButton } from "@/components/CopyButton";
import { PrimaryLink } from "@/components/PrimaryLink";
import { ProjectCard } from "@/components/ProjectCard";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { Tag } from "@/components/Tag";
import { getFeaturedProjects, site } from "@/lib/content";

export default function Home() {
  const featured = getFeaturedProjects();
  const anchors = {
    skills: site.anchors?.skills ?? "skills",
    experience: site.anchors?.experience ?? "experience",
    contact: site.anchors?.contact ?? "contact",
  };
  const resume =
    site.resume?.href
      ? {
          href: site.resume.href,
          label: site.resume.label ?? "查看简历",
          download: site.resume.download === true,
        }
      : site.resumeHref
        ? {
            href: site.resumeHref,
            label: "查看简历",
            download: false,
          }
        : null;
  const resumeIsExternal = resume ? /^https?:\/\//.test(resume.href) : false;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50">
      <SiteHeader mode="home" />
      <main>
        <section className="border-b border-white/10">
          <Container className="py-16 sm:py-20">
            <div className="grid items-center gap-10 lg:grid-cols-[1.2fr_0.8fr]">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-white/80">
                  <span>{site.location}</span>
                  <span className="h-1 w-1 rounded-full bg-white/30" />
                  <span>可售卖模板 · 可一键部署</span>
                </div>
                <h1 className="mt-5 text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
                  {site.name}
                  <span className="block text-white/70">{site.title}</span>
                </h1>
                <p className="mt-4 max-w-2xl text-base leading-7 text-white/70 sm:text-lg">
                  {site.tagline}
                </p>
                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                  <PrimaryLink href="/projects/" label="查看作品" />
                  {resume ? (
                    <PrimaryLink
                      href={resume.href}
                      label={resume.label}
                      variant="secondary"
                      external={resumeIsExternal}
                      download={!resumeIsExternal && resume.download}
                    />
                  ) : null}
                </div>
                <div className="mt-8 flex flex-wrap gap-2">
                  {site.skills.flatMap((g) => g.items).slice(0, 10).map((t) => (
                    <Tag key={t} label={t} />
                  ))}
                </div>
              </div>

              <div className="relative">
                <div className="absolute -inset-6 rounded-[28px] bg-gradient-to-tr from-indigo-500/20 via-white/5 to-transparent blur-2xl" />
                <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-white/5 p-6">
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                      <img
                        alt={site.name}
                        src={site.avatarUrl}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="text-sm font-semibold">{site.name}</div>
                      <div className="mt-1 text-sm text-white/65">{site.description}</div>
                    </div>
                  </div>
                  <div className="mt-6 rounded-2xl border border-white/10 bg-zinc-950/40 p-4">
                    <div className="text-xs font-semibold text-white/60">Email</div>
                    <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <a className="text-sm text-white/80 hover:text-white" href={`mailto:${site.email}`}>
                        {site.email}
                      </a>
                      <CopyButton value={site.email} className="self-start sm:self-auto" />
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {site.socials.map((s) => (
                      <PrimaryLink
                        key={s.href}
                        href={s.href}
                        label={s.label}
                        variant="secondary"
                        external
                        className="h-10 px-4"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </section>

        <section id={anchors.skills} className="border-b border-white/10">
          <Container className="py-14 sm:py-16">
            <div className="flex items-end justify-between gap-6">
              <div>
                <h2 className="text-2xl font-semibold">{site.nav?.skills ?? "技能与亮点"}</h2>
                <p className="mt-2 text-sm text-white/65">
                  用最短的话讲清楚我能解决什么问题。
                </p>
              </div>
              <PrimaryLink
                  href="/projects/"
                label="全部作品"
                variant="secondary"
                className="hidden sm:inline-flex"
              />
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-2">
              <div className="grid gap-3 rounded-3xl border border-white/10 bg-white/5 p-6">
                {site.skills.map((g) => (
                  <div key={g.group} className="grid gap-2">
                    <div className="text-sm font-semibold text-white/85">{g.group}</div>
                    <div className="flex flex-wrap gap-2">
                      {g.items.map((t) => (
                        <Tag key={`${g.group}-${t}`} label={t} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid gap-3">
                {site.highlights.map((h) => (
                  <div
                    key={h.title}
                    className="rounded-3xl border border-white/10 bg-white/5 p-6"
                  >
                    <div className="text-base font-semibold">{h.title}</div>
                    <div className="mt-2 text-sm leading-6 text-white/65">{h.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </Container>
        </section>

        <section id={anchors.experience} className="border-b border-white/10">
          <Container className="py-14 sm:py-16">
            <h2 className="text-2xl font-semibold">{site.nav?.experience ?? "经历"}</h2>
            <div className="mt-8 grid gap-4">
              {site.experience.map((e) => (
                <Link
                  key={e.slug}
                  href={`/experience/${e.slug}/`}
                  className="block rounded-3xl border border-white/10 bg-white/5 p-6 transition-colors hover:bg-white/7"
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="text-base font-semibold">{e.title}</div>
                      <div className="mt-1 text-sm text-white/65">{e.org}</div>
                    </div>
                    <div className="text-sm font-semibold text-white/55">{e.period}</div>
                  </div>
                  <ul className="mt-4 grid gap-2 text-sm text-white/70">
                    {(e.highlights?.length ? e.highlights : e.bullets).slice(0, 3).map((b) => (
                      <li key={b} className="leading-6">
                        · {b}
                      </li>
                    ))}
                  </ul>
                </Link>
              ))}
            </div>
          </Container>
        </section>

        <section className="border-b border-white/10">
          <Container className="py-14 sm:py-16">
            <div className="flex items-end justify-between gap-6">
              <div>
                <h2 className="text-2xl font-semibold">精选作品</h2>
                <p className="mt-2 text-sm text-white/65">
                  只展示最能体现能力与结果的项目。
                </p>
              </div>
              <PrimaryLink
                href="/projects/"
                label="查看全部"
                variant="secondary"
                className="hidden sm:inline-flex"
              />
            </div>

            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featured.slice(0, 6).map((p) => (
                <ProjectCard key={p.slug} project={p} from="home" />
              ))}
            </div>
          </Container>
        </section>

        <section id={anchors.contact}>
          <Container className="py-14 sm:py-16">
            <div className="rounded-3xl border border-white/10 bg-gradient-to-tr from-white/8 via-white/5 to-transparent p-7 sm:p-10">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 className="text-2xl font-semibold">{site.nav?.contact ?? "联系我"}</h2>
                  <p className="mt-2 text-sm text-white/65">
                    任何合作/机会都欢迎邮件沟通。
                  </p>
                </div>
                <PrimaryLink
                  href={`mailto:${site.email}`}
                  label="发送邮件"
                  external
                />
              </div>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <a className="text-base text-white/85 hover:text-white" href={`mailto:${site.email}`}>
                  {site.email}
                </a>
                <CopyButton value={site.email} />
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                {site.socials.map((s) => (
                  <PrimaryLink
                    key={s.href}
                    href={s.href}
                    label={s.label}
                    variant="secondary"
                    external
                    className="h-10 px-4"
                  />
                ))}
              </div>
            </div>
          </Container>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
