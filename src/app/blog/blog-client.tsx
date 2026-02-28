"use client";

import { useMemo, useState } from "react";
import { Container } from "@/components/Container";
import Link from "next/link";
import { Tag } from "@/components/Tag";
import { cn } from "@/lib/cn";
import { blog, getAllBlogTags, groupTags, site } from "@/lib/content";
import { filterBlog } from "@/lib/filter-blog";

export function BlogClient() {
  const [query, setQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const groupedTags = useMemo(() => {
    return groupTags(getAllBlogTags(), site.skills);
  }, []);

  const filtered = useMemo(() => {
    const out = filterBlog({ posts: blog, query, selectedTags });
    return out.sort((a, b) => {
      if (a.featured !== b.featured) return a.featured ? -1 : 1;
      return b.date.localeCompare(a.date);
    });
  }, [query, selectedTags]);

  return (
    <main>
      <section className="border-b border-white/10">
        <Container className="py-12 sm:py-14">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">博客</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/65 sm:text-base">
            用来沉淀项目复盘、工程化经验与可迁移的方法论。支持搜索与标签筛选，构建后可导出为纯静态站点。
          </p>

          <div className="mt-7 grid gap-4 rounded-3xl border border-white/10 bg-white/5 p-5 sm:p-6">
            <div className="grid gap-2">
              <label className="text-xs font-semibold text-white/70">搜索</label>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="按标题/摘要/标签搜索..."
                className="h-11 w-full rounded-2xl border border-white/10 bg-zinc-950/60 px-4 text-sm text-white placeholder:text-white/35 outline-none focus:border-indigo-400/60"
              />
            </div>

            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <div className="text-xs font-semibold text-white/70">标签筛选</div>
                {selectedTags.length > 0 ? (
                  <button
                    type="button"
                    className="text-xs font-semibold text-white/60 hover:text-white"
                    onClick={() => setSelectedTags([])}
                  >
                    清除
                  </button>
                ) : null}
              </div>
              <div className="grid gap-4">
                {groupedTags.map((g) => (
                  <div key={g.group}>
                    <div className="mb-2 text-[10px] font-bold uppercase tracking-wider text-white/40">
                      {g.group}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {g.items.map((t) => {
                        const active = selectedTags.includes(t);
                        return (
                          <button
                            key={t}
                            type="button"
                            className={cn(
                              "rounded-full transition-colors",
                              active ? "bg-indigo-500/25" : "bg-transparent",
                            )}
                            onClick={() => {
                              setSelectedTags((prev) =>
                                prev.includes(t)
                                  ? prev.filter((x) => x !== t)
                                  : [...prev, t],
                              );
                            }}
                          >
                            <Tag
                              label={t}
                              className={cn(
                                active
                                  ? "border-indigo-400/30 bg-indigo-500/20 text-white"
                                  : undefined,
                              )}
                            />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section>
        <Container className="py-12 sm:py-14">
          <div className="flex items-center justify-between gap-6">
            <div className="text-sm text-white/65">共 {filtered.length} 篇文章</div>
          </div>

          {filtered.length === 0 ? (
            <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-10 text-sm text-white/70">
              没有匹配的文章，试试清除筛选或修改搜索词。
            </div>
          ) : (
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((p) => (
                <Link
                  key={p.slug}
                  href={`/blog/${p.slug}`}
                  className={cn(
                    "rounded-3xl border border-white/10 bg-white/5 p-6",
                    "transition-colors hover:bg-white/7",
                  )}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="grid gap-2">
                      <div className="text-base font-semibold leading-6">{p.title}</div>
                      <div className="text-xs font-semibold text-white/55">{p.date}</div>
                    </div>
                    {p.featured ? (
                      <div className="rounded-full border border-indigo-400/30 bg-indigo-500/15 px-3 py-1 text-xs font-semibold text-white/80">
                        推荐
                      </div>
                    ) : null}
                  </div>
                  <div className="mt-3 text-sm leading-6 text-white/65">{p.summary}</div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {p.tags.slice(0, 6).map((t) => (
                      <Tag key={`${p.slug}-${t}`} label={t} />
                    ))}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </Container>
      </section>
    </main>
  );
}
