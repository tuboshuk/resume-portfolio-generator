import { notFound } from "next/navigation";
import { Container } from "@/components/Container";
import { PrimaryLink } from "@/components/PrimaryLink";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { Tag } from "@/components/Tag";
import { blog, getBlogBySlug } from "@/lib/content";

export const dynamicParams = false;

export function generateStaticParams() {
  return blog.map((p) => ({ slug: p.slug }));
}

function renderContent(text: string) {
  const blocks = text.split("\n\n").map((x) => x.trim()).filter((x) => x.length > 0);
  return (
    <div className="grid gap-4">
      {blocks.map((b, idx) => {
        const h2 = b.startsWith("## ");
        if (h2) {
          return (
            <div key={idx} className="text-base font-semibold">
              {b.slice(3).trim()}
            </div>
          );
        }
        const lines = b.split("\n").map((x) => x.trim()).filter((x) => x.length > 0);
        const isList = lines.every((x) => x.startsWith("- "));
        if (isList) {
          return (
            <ul key={idx} className="grid gap-2 text-sm text-white/70">
              {lines.map((x) => (
                <li key={x} className="leading-6">
                  · {x.slice(2).trim()}
                </li>
              ))}
            </ul>
          );
        }
        return (
          <div key={idx} className="text-sm leading-6 text-white/70">
            {b}
          </div>
        );
      })}
    </div>
  );
}

export default async function BlogDetailPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const p = getBlogBySlug(slug);
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
                <div className="mt-3 text-sm font-semibold text-white/55">{p.date}</div>
                <p className="mt-3 text-sm leading-6 text-white/65 sm:text-base">
                  {p.summary}
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {p.tags.map((t) => (
                    <Tag key={t} label={t} />
                  ))}
                </div>
              </div>

              <aside className="h-fit rounded-3xl border border-white/10 bg-white/5 p-6">
                <div className="text-xs font-semibold text-white/60">快速导航</div>
                <div className="mt-4 grid gap-2">
                  <PrimaryLink
                    href="/blog"
                    label="返回博客"
                    variant="secondary"
                    className="w-full justify-center"
                  />
                </div>
              </aside>
            </div>
          </Container>
        </section>

        <section>
          <Container className="py-12 sm:py-14">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              {renderContent(p.content)}
            </div>
          </Container>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
