"use client";

import { useMemo, useState } from "react";
import { Container } from "@/components/Container";
import { ProjectCard } from "@/components/ProjectCard";
import { Tag } from "@/components/Tag";
import { filterProjects } from "@/lib/filter-projects";
import { getAllTags, projects } from "@/lib/content";
import { cn } from "@/lib/cn";

export function ProjectsClient() {
  const [query, setQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const allTags = useMemo(() => getAllTags(), []);

  const filtered = useMemo(() => {
    const out = filterProjects({ projects, query, selectedTags });
    return out.sort((a, b) => {
      if (a.featured !== b.featured) return a.featured ? -1 : 1;
      return b.period.localeCompare(a.period);
    });
  }, [query, selectedTags]);

  return (
    <main>
      <section className="border-b border-white/10">
        <Container className="py-12 sm:py-14">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">作品集</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/65 sm:text-base">
            支持搜索与标签筛选。内容来自本地配置文件，构建后可导出为纯静态站点。
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
              <div className="flex flex-wrap gap-2">
                {allTags.map((t) => {
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
          </div>
        </Container>
      </section>

      <section>
        <Container className="py-12 sm:py-14">
          <div className="flex items-center justify-between gap-6">
            <div className="text-sm text-white/65">共 {filtered.length} 个项目</div>
          </div>

          {filtered.length === 0 ? (
            <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-10 text-sm text-white/70">
              没有匹配的项目，试试清除筛选或修改搜索词。
            </div>
          ) : (
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((p) => (
                <ProjectCard key={p.slug} project={p} />
              ))}
            </div>
          )}
        </Container>
      </section>
    </main>
  );
}

