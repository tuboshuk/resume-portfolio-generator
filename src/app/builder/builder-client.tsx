"use client";

import { useMemo, useRef, useState } from "react";
import { Container } from "@/components/Container";
import { PrimaryLink } from "@/components/PrimaryLink";
import { Tag } from "@/components/Tag";
import { cn } from "@/lib/cn";
import { learning as learningDefault, projects as projectsDefault, site as siteDefault } from "@/lib/content";
import type { LearningNote, Project, SiteConfig, SiteExperience, SiteSkillGroup } from "@/lib/types";

type ContentBundle = {
  site: SiteConfig;
  projects: Project[];
  learning: LearningNote[];
};

const STORAGE_KEY = "resume_portfolio_generator_content_bundle_v1";

const CITIES = [
  "Beijing, CN",
  "Shanghai, CN",
  "Shenzhen, CN",
  "Guangzhou, CN",
  "Hangzhou, CN",
  "Chengdu, CN",
  "Wuhan, CN",
  "Nanjing, CN",
  "Xi'an, CN",
  "Chongqing, CN",
  "Suzhou, CN",
  "Tianjin, CN",
  "Other",
];

function toLines(items: string[] | undefined): string {
  return (items ?? []).join("\n");
}

function fromLines(text: string): string[] {
  return text
    .split("\n")
    .map((x) => x.trim())
    .filter((x) => x.length > 0);
}

function slugify(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

function fileToDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

type DownloadFormat = "pdf" | "excel" | "doc";

function loadBundleFromStorage(fallback: ContentBundle): ContentBundle {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as ContentBundle;
    if (!parsed?.site || !parsed?.projects || !parsed?.learning) return fallback;
    return parsed;
  } catch {
    return fallback;
  }
}

export function BuilderClient() {
  const importRef = useRef<HTMLInputElement | null>(null);
  const avatarUploadRef = useRef<HTMLInputElement | null>(null);

  const defaults = useMemo<ContentBundle>(
    () => ({
      site: siteDefault,
      projects: projectsDefault,
      learning: learningDefault,
    }),
    [],
  );

  const initialBundle = useMemo(() => loadBundleFromStorage(defaults), [defaults]);
  const [bundle, setBundle] = useState<ContentBundle>(initialBundle);
  const [activeTab, setActiveTab] = useState<"site" | "experience" | "projects" | "learning">("site");
  const [selectedExperience, setSelectedExperience] = useState<string | null>(
    initialBundle.site.experience[0]?.slug ?? null,
  );
  const [selectedProject, setSelectedProject] = useState<string | null>(
    initialBundle.projects[0]?.slug ?? null,
  );
  const [selectedLearning, setSelectedLearning] = useState<string | null>(
    initialBundle.learning[0]?.slug ?? null,
  );
  const [dirty, setDirty] = useState(false);

  const [showDownloadDialog, setShowDownloadDialog] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<DownloadFormat>("pdf");
  const [saveToPortfolio, setSaveToPortfolio] = useState(true);

  const selectedExperienceItem = useMemo(() => {
    return bundle.site.experience.find((e) => e.slug === selectedExperience) ?? null;
  }, [bundle.site.experience, selectedExperience]);

  const selectedProjectItem = useMemo(() => {
    return bundle.projects.find((p) => p.slug === selectedProject) ?? null;
  }, [bundle.projects, selectedProject]);

  const selectedLearningItem = useMemo(() => {
    return bundle.learning.find((n) => n.slug === selectedLearning) ?? null;
  }, [bundle.learning, selectedLearning]);

  const markDirty = () => setDirty(true);

  const save = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bundle));
    setDirty(false);
  };

  const reset = () => {
    localStorage.removeItem(STORAGE_KEY);
    setBundle(defaults);
    setSelectedExperience(defaults.site.experience[0]?.slug ?? null);
    setSelectedProject(defaults.projects[0]?.slug ?? null);
    setSelectedLearning(defaults.learning[0]?.slug ?? null);
    setDirty(false);
  };

  const onImportFile = async (file: File) => {
    const text = await file.text();
    const parsed = JSON.parse(text) as ContentBundle;
    if (!parsed?.site || !parsed?.projects || !parsed?.learning) return;
    setBundle(parsed);
    setSelectedExperience(parsed.site.experience[0]?.slug ?? null);
    setSelectedProject(parsed.projects[0]?.slug ?? null);
    setSelectedLearning(parsed.learning[0]?.slug ?? null);
    setDirty(true);
  };

  const updateSite = (patch: Partial<SiteConfig>) => {
    setBundle((prev) => ({ ...prev, site: { ...prev.site, ...patch } }));
    markDirty();
  };

  const updateSkills = (skills: SiteSkillGroup[]) => {
    setBundle((prev) => ({ ...prev, site: { ...prev.site, skills } }));
    markDirty();
  };

  const upsertExperience = (exp: SiteExperience) => {
    setBundle((prev) => {
      const next = prev.site.experience.some((x) => x.slug === exp.slug)
        ? prev.site.experience.map((x) => (x.slug === exp.slug ? exp : x))
        : [...prev.site.experience, exp];
      return { ...prev, site: { ...prev.site, experience: next } };
    });
    setSelectedExperience(exp.slug);
    markDirty();
  };

  const removeExperience = (slug: string) => {
    setBundle((prev) => {
      const next = prev.site.experience.filter((x) => x.slug !== slug);
      return { ...prev, site: { ...prev.site, experience: next } };
    });
    setSelectedExperience((prev) => (prev === slug ? null : prev));
    markDirty();
  };

  const upsertProject = (p: Project) => {
    setBundle((prev) => {
      const next = prev.projects.some((x) => x.slug === p.slug)
        ? prev.projects.map((x) => (x.slug === p.slug ? p : x))
        : [...prev.projects, p];
      return { ...prev, projects: next };
    });
    setSelectedProject(p.slug);
    markDirty();
  };

  const removeProject = (slug: string) => {
    setBundle((prev) => ({ ...prev, projects: prev.projects.filter((x) => x.slug !== slug) }));
    setSelectedProject((prev) => (prev === slug ? null : prev));
    markDirty();
  };

  const upsertLearning = (n: LearningNote) => {
    setBundle((prev) => {
      const next = prev.learning.some((x) => x.slug === n.slug)
        ? prev.learning.map((x) => (x.slug === n.slug ? n : x))
        : [...prev.learning, n];
      return { ...prev, learning: next };
    });
    setSelectedLearning(n.slug);
    markDirty();
  };

  const removeLearning = (slug: string) => {
    setBundle((prev) => ({ ...prev, learning: prev.learning.filter((x) => x.slug !== slug) }));
    setSelectedLearning((prev) => (prev === slug ? null : prev));
    markDirty();
  };

  const handleDownload = () => {
    if (saveToPortfolio) {
      save();
    }
    window.location.href = "/resume";
    setShowDownloadDialog(false);
  };

  const handleAvatarUpload = async (file: File) => {
    try {
      const dataUrl = await fileToDataURL(file);
      updateSite({ avatarUrl: dataUrl });
    } catch {
      alert("头像上传失败，请重试");
    }
  };

  return (
    <main>
      <section className="border-b border-white/10">
        <Container className="py-10 sm:py-12">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">简历制作器</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/65 sm:text-base">
                在浏览器里编辑内容（CRUD），本地保存、选择格式下载简历，再用于生成静态站点。
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className={cn(
                  "inline-flex h-11 items-center justify-center rounded-full px-5 text-sm font-semibold",
                  "border border-white/15 bg-white/5 text-white hover:bg-white/10",
                )}
                onClick={() => setShowDownloadDialog(true)}
              >
                下载简历
              </button>
              <button
                type="button"
                className={cn(
                  "inline-flex h-11 items-center justify-center rounded-full px-5 text-sm font-semibold",
                  "border border-white/15 bg-white/5 text-white hover:bg-white/10",
                )}
                onClick={() => importRef.current?.click()}
              >
                导入
              </button>
              <button
                type="button"
                className={cn(
                  "inline-flex h-11 items-center justify-center rounded-full px-5 text-sm font-semibold",
                  dirty ? "bg-indigo-500 text-white hover:bg-indigo-400" : "bg-white/10 text-white/60",
                )}
                disabled={!dirty}
                onClick={save}
              >
                保存到本地
              </button>
              <button
                type="button"
                className={cn(
                  "inline-flex h-11 items-center justify-center rounded-full px-5 text-sm font-semibold",
                  "border border-white/15 bg-transparent text-white/75 hover:bg-white/5",
                )}
                onClick={reset}
              >
                重置
              </button>
              <PrimaryLink href="/" label="返回站点" variant="secondary" />
              <input
                ref={importRef}
                type="file"
                accept="application/json"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  void onImportFile(file);
                  e.currentTarget.value = "";
                }}
              />
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-2">
            {(
              [
                { key: "site", label: "站点信息" },
                { key: "experience", label: "成长轨迹" },
                { key: "projects", label: "作品集" },
                { key: "learning", label: "学习" },
              ] as const
            ).map((t) => (
              <button
                key={t.key}
                type="button"
                className={cn(
                  "rounded-full border px-4 py-2 text-sm font-semibold transition-colors",
                  activeTab === t.key
                    ? "border-indigo-400/30 bg-indigo-500/20 text-white"
                    : "border-white/10 bg-white/5 text-white/75 hover:bg-white/10",
                )}
                onClick={() => setActiveTab(t.key)}
              >
                {t.label}
              </button>
            ))}
          </div>
        </Container>
      </section>

      {activeTab === "site" ? (
        <section>
          <Container className="py-10 sm:py-12">
            <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="grid gap-6">
                <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                  <div className="text-base font-semibold">基础信息</div>
                  <div className="mt-4 grid gap-4">
                    <div className="grid gap-2">
                      <label className="text-xs font-semibold text-white/70">姓名</label>
                      <input
                        value={bundle.site.name}
                        onChange={(e) => updateSite({ name: e.target.value })}
                        className="h-11 w-full rounded-2xl border border-white/10 bg-zinc-950/60 px-4 text-sm text-white outline-none focus:border-indigo-400/60"
                      />
                    </div>
                    <div className="grid gap-2">
                      <label className="text-xs font-semibold text-white/70">Title</label>
                      <input
                        value={bundle.site.title}
                        onChange={(e) => updateSite({ title: e.target.value })}
                        className="h-11 w-full rounded-2xl border border-white/10 bg-zinc-950/60 px-4 text-sm text-white outline-none focus:border-indigo-400/60"
                      />
                    </div>
                    <div className="grid gap-2">
                      <label className="text-xs font-semibold text-white/70">城市</label>
                      <select
                        value={bundle.site.location}
                        onChange={(e) => updateSite({ location: e.target.value })}
                        className="h-11 w-full rounded-2xl border border-white/10 bg-zinc-950/60 px-4 text-sm text-white outline-none focus:border-indigo-400/60"
                      >
                        {CITIES.map((city) => (
                          <option key={city} value={city}>
                            {city}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="grid gap-2">
                      <label className="text-xs font-semibold text-white/70">一句话定位（tagline）</label>
                      <input
                        value={bundle.site.tagline}
                        onChange={(e) => updateSite({ tagline: e.target.value })}
                        className="h-11 w-full rounded-2xl border border-white/10 bg-zinc-950/60 px-4 text-sm text-white outline-none focus:border-indigo-400/60"
                      />
                    </div>
                    <div className="grid gap-2">
                      <label className="text-xs font-semibold text-white/70">描述（description）</label>
                      <textarea
                        value={bundle.site.description}
                        onChange={(e) => updateSite({ description: e.target.value })}
                        className="min-h-24 w-full rounded-2xl border border-white/10 bg-zinc-950/60 px-4 py-3 text-sm text-white outline-none focus:border-indigo-400/60"
                      />
                    </div>
                    <div className="grid gap-2">
                      <label className="text-xs font-semibold text-white/70">Email</label>
                      <input
                        value={bundle.site.email}
                        onChange={(e) => updateSite({ email: e.target.value })}
                        className="h-11 w-full rounded-2xl border border-white/10 bg-zinc-950/60 px-4 text-sm text-white outline-none focus:border-indigo-400/60"
                      />
                    </div>
                  </div>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                  <div className="text-base font-semibold">头像</div>
                  <div className="mt-4 grid gap-3">
                    <div className="grid gap-2">
                      <label className="text-xs font-semibold text-white/70">上传头像（支持 jpg/png/jpeg）</label>
                      <div className="flex gap-3 items-center">
                        <input
                          ref={avatarUploadRef}
                          type="file"
                          accept="image/jpeg,image/png"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            void handleAvatarUpload(file);
                            e.currentTarget.value = "";
                          }}
                        />
                        <button
                          type="button"
                          className={cn(
                            "inline-flex h-11 items-center justify-center rounded-full px-5 text-sm font-semibold",
                            "border border-white/15 bg-white/5 text-white hover:bg-white/10",
                          )}
                          onClick={() => avatarUploadRef.current?.click()}
                        >
                          选择图片
                        </button>
                        <div className="text-xs text-white/60">或直接粘贴 URL</div>
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <label className="text-xs font-semibold text-white/70">头像 URL</label>
                      <input
                        value={bundle.site.avatarUrl}
                        onChange={(e) => updateSite({ avatarUrl: e.target.value })}
                        className="h-11 w-full rounded-2xl border border-white/10 bg-zinc-950/60 px-4 text-sm text-white outline-none focus:border-indigo-400/60"
                      />
                    </div>
                  </div>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                  <div className="flex items-center justify-between gap-4">
                    <div className="text-base font-semibold">技能分组</div>
                    <button
                      type="button"
                      className="text-xs font-semibold text-white/60 hover:text-white"
                      onClick={() => {
                        updateSkills([
                          ...bundle.site.skills,
                          { group: "New Group", items: [] },
                        ]);
                      }}
                    >
                      添加分组
                    </button>
                  </div>
                  <div className="mt-4 grid gap-4">
                    {bundle.site.skills.map((g, idx) => (
                      <div key={`${g.group}-${idx}`} className="rounded-2xl border border-white/10 bg-zinc-950/30 p-4">
                        <div className="flex items-center justify-between gap-4">
                          <input
                            value={g.group}
                            onChange={(e) => {
                              const next = bundle.site.skills.map((x, i) =>
                                i === idx ? { ...x, group: e.target.value } : x,
                              );
                              updateSkills(next);
                            }}
                            className="h-10 w-full rounded-2xl border border-white/10 bg-zinc-950/60 px-4 text-sm font-semibold text-white outline-none focus:border-indigo-400/60"
                          />
                          <button
                            type="button"
                            className="text-xs font-semibold text-white/60 hover:text-white"
                            onClick={() => {
                              const next = bundle.site.skills.filter((_, i) => i !== idx);
                              updateSkills(next);
                            }}
                          >
                            删除
                          </button>
                        </div>
                        <div className="mt-3 grid gap-2">
                          <div className="text-xs font-semibold text-white/60">每行一个技能</div>
                          <textarea
                            value={toLines(g.items)}
                            onChange={(e) => {
                              const next = bundle.site.skills.map((x, i) =>
                                i === idx ? { ...x, items: fromLines(e.target.value) } : x,
                              );
                              updateSkills(next);
                            }}
                            className="min-h-24 w-full rounded-2xl border border-white/10 bg-zinc-950/60 px-4 py-3 text-sm text-white outline-none focus:border-indigo-400/60"
                          />
                          <div className="flex flex-wrap gap-2">
                            {g.items.slice(0, 12).map((t) => (
                              <Tag key={`${g.group}-${t}`} label={t} />
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <aside className="h-fit rounded-3xl border border-white/10 bg-white/5 p-6">
                <div className="text-xs font-semibold text-white/60">预览</div>
                <div className="mt-4 flex items-center gap-4">
                  <div className="h-16 w-16 overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                    <img
                      alt={bundle.site.name}
                      src={bundle.site.avatarUrl}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="text-sm font-semibold">{bundle.site.name}</div>
                    <div className="mt-1 text-sm text-white/65">{bundle.site.title}</div>
                  </div>
                </div>
                <div className="mt-5 text-sm text-white/70">{bundle.site.tagline}</div>
              </aside>
            </div>
          </Container>
        </section>
      ) : null}

      {activeTab === "experience" ? (
        <section>
          <Container className="py-10 sm:py-12">
            <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                <div className="flex items-center justify-between gap-4">
                  <div className="text-base font-semibold">成长轨迹</div>
                  <button
                    type="button"
                    className="text-xs font-semibold text-white/60 hover:text-white"
                    onClick={() => {
                      const slugBase = slugify(`${bundle.site.name}-${Date.now()}`);
                      upsertExperience({
                        slug: slugBase || `exp-${Date.now()}`,
                        title: "后端工程师",
                        org: "Company",
                        period: "YYYY - YYYY",
                        bullets: [],
                        highlights: [],
                        overview: "",
                        stack: [],
                        links: [],
                      });
                    }}
                  >
                    新增
                  </button>
                </div>
                <div className="mt-4 grid gap-2">
                  {bundle.site.experience.map((e) => {
                    const active = e.slug === selectedExperience;
                    return (
                      <button
                        key={e.slug}
                        type="button"
                        className={cn(
                          "rounded-2xl border p-4 text-left transition-colors",
                          active
                            ? "border-indigo-400/30 bg-indigo-500/15"
                            : "border-white/10 bg-zinc-950/30 hover:bg-white/7",
                        )}
                        onClick={() => setSelectedExperience(e.slug)}
                      >
                        <div className="text-sm font-semibold">{e.org}</div>
                        <div className="mt-1 text-xs text-white/60">{e.title}</div>
                        <div className="mt-1 text-xs font-semibold text-white/45">{e.period}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                {selectedExperienceItem ? (
                  <div className="grid gap-4">
                    <div className="flex items-center justify-between gap-4">
                      <div className="text-base font-semibold">编辑</div>
                      <button
                        type="button"
                        className="text-xs font-semibold text-white/60 hover:text-white"
                        onClick={() => removeExperience(selectedExperienceItem.slug)}
                      >
                        删除这段
                      </button>
                    </div>

                    <div className="grid gap-2">
                      <label className="text-xs font-semibold text-white/70">slug（用于详情页 URL）</label>
                      <input
                        value={selectedExperienceItem.slug}
                        onChange={(e) => {
                          const nextSlug = slugify(e.target.value) || e.target.value.trim();
                          const next: SiteExperience = { ...selectedExperienceItem, slug: nextSlug };
                          upsertExperience(next);
                        }}
                        className="h-11 w-full rounded-2xl border border-white/10 bg-zinc-950/60 px-4 text-sm text-white outline-none focus:border-indigo-400/60"
                      />
                    </div>

                    <div className="grid gap-2">
                      <label className="text-xs font-semibold text-white/70">公司</label>
                      <input
                        value={selectedExperienceItem.org}
                        onChange={(e) =>
                          upsertExperience({ ...selectedExperienceItem, org: e.target.value })
                        }
                        className="h-11 w-full rounded-2xl border border-white/10 bg-zinc-950/60 px-4 text-sm text-white outline-none focus:border-indigo-400/60"
                      />
                    </div>
                    <div className="grid gap-2">
                      <label className="text-xs font-semibold text-white/70">岗位</label>
                      <input
                        value={selectedExperienceItem.title}
                        onChange={(e) =>
                          upsertExperience({ ...selectedExperienceItem, title: e.target.value })
                        }
                        className="h-11 w-full rounded-2xl border border-white/10 bg-zinc-950/60 px-4 text-sm text-white outline-none focus:border-indigo-400/60"
                      />
                    </div>
                    <div className="grid gap-2">
                      <label className="text-xs font-semibold text-white/70">时间</label>
                      <input
                        value={selectedExperienceItem.period}
                        onChange={(e) =>
                          upsertExperience({ ...selectedExperienceItem, period: e.target.value })
                        }
                        className="h-11 w-full rounded-2xl border border-white/10 bg-zinc-950/60 px-4 text-sm text-white outline-none focus:border-indigo-400/60"
                      />
                    </div>
                    <div className="grid gap-2">
                      <label className="text-xs font-semibold text-white/70">概览</label>
                      <textarea
                        value={selectedExperienceItem.overview ?? ""}
                        onChange={(e) =>
                          upsertExperience({ ...selectedExperienceItem, overview: e.target.value })
                        }
                        className="min-h-24 w-full rounded-2xl border border-white/10 bg-zinc-950/60 px-4 py-3 text-sm text-white outline-none focus:border-indigo-400/60"
                      />
                    </div>
                    <div className="grid gap-2">
                      <label className="text-xs font-semibold text-white/70">重点成果（卡片展示，最多 3 条）</label>
                      <textarea
                        value={toLines(selectedExperienceItem.highlights)}
                        onChange={(e) =>
                          upsertExperience({
                            ...selectedExperienceItem,
                            highlights: fromLines(e.target.value),
                          })
                        }
                        className="min-h-28 w-full rounded-2xl border border-white/10 bg-zinc-950/60 px-4 py-3 text-sm text-white outline-none focus:border-indigo-400/60"
                      />
                    </div>
                    <div className="grid gap-2">
                      <label className="text-xs font-semibold text-white/70">详细工作（详情页展示）</label>
                      <textarea
                        value={toLines(selectedExperienceItem.bullets)}
                        onChange={(e) =>
                          upsertExperience({
                            ...selectedExperienceItem,
                            bullets: fromLines(e.target.value),
                          })
                        }
                        className="min-h-40 w-full rounded-2xl border border-white/10 bg-zinc-950/60 px-4 py-3 text-sm text-white outline-none focus:border-indigo-400/60"
                      />
                    </div>
                    <div className="grid gap-2">
                      <label className="text-xs font-semibold text-white/70">技术栈（每行一个）</label>
                      <textarea
                        value={toLines(selectedExperienceItem.stack)}
                        onChange={(e) =>
                          upsertExperience({
                            ...selectedExperienceItem,
                            stack: fromLines(e.target.value),
                          })
                        }
                        className="min-h-24 w-full rounded-2xl border border-white/10 bg-zinc-950/60 px-4 py-3 text-sm text-white outline-none focus:border-indigo-400/60"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-white/65">请选择一段成长轨迹。</div>
                )}
              </div>
            </div>
          </Container>
        </section>
      ) : null}

      {activeTab === "projects" ? (
        <section>
          <Container className="py-10 sm:py-12">
            <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                <div className="flex items-center justify-between gap-4">
                  <div className="text-base font-semibold">作品</div>
                  <button
                    type="button"
                    className="text-xs font-semibold text-white/60 hover:text-white"
                    onClick={() => {
                      const slug = `project-${Date.now()}`;
                      upsertProject({
                        slug,
                        title: "新项目",
                        summary: "",
                        period: "2026",
                        role: "",
                        tags: [],
                        featured: false,
                        links: [],
                        coverImageUrl: "",
                        content: {
                          background: "",
                          responsibilities: [],
                          results: [],
                          tradeoffs: [],
                        },
                        gallery: [],
                      });
                    }}
                  >
                    新增
                  </button>
                </div>
                <div className="mt-4 grid gap-2">
                  {bundle.projects.map((p) => {
                    const active = p.slug === selectedProject;
                    return (
                      <button
                        key={p.slug}
                        type="button"
                        className={cn(
                          "rounded-2xl border p-4 text-left transition-colors",
                          active
                            ? "border-indigo-400/30 bg-indigo-500/15"
                            : "border-white/10 bg-zinc-950/30 hover:bg-white/7",
                        )}
                        onClick={() => setSelectedProject(p.slug)}
                      >
                        <div className="text-sm font-semibold">{p.title}</div>
                        <div className="mt-1 text-xs text-white/60">{p.period}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                {selectedProjectItem ? (
                  <div className="grid gap-4">
                    <div className="flex items-center justify-between gap-4">
                      <div className="text-base font-semibold">编辑</div>
                      <button
                        type="button"
                        className="text-xs font-semibold text-white/60 hover:text-white"
                        onClick={() => removeProject(selectedProjectItem.slug)}
                      >
                        删除这个项目
                      </button>
                    </div>
                    <div className="grid gap-2">
                      <label className="text-xs font-semibold text-white/70">slug</label>
                      <input
                        value={selectedProjectItem.slug}
                        onChange={(e) =>
                          upsertProject({ ...selectedProjectItem, slug: slugify(e.target.value) || e.target.value })
                        }
                        className="h-11 w-full rounded-2xl border border-white/10 bg-zinc-950/60 px-4 text-sm text-white outline-none focus:border-indigo-400/60"
                      />
                    </div>
                    <div className="grid gap-2">
                      <label className="text-xs font-semibold text-white/70">标题</label>
                      <input
                        value={selectedProjectItem.title}
                        onChange={(e) => upsertProject({ ...selectedProjectItem, title: e.target.value })}
                        className="h-11 w-full rounded-2xl border border-white/10 bg-zinc-950/60 px-4 text-sm text-white outline-none focus:border-indigo-400/60"
                      />
                    </div>
                    <div className="grid gap-2">
                      <label className="text-xs font-semibold text-white/70">摘要</label>
                      <textarea
                        value={selectedProjectItem.summary}
                        onChange={(e) => upsertProject({ ...selectedProjectItem, summary: e.target.value })}
                        className="min-h-24 w-full rounded-2xl border border-white/10 bg-zinc-950/60 px-4 py-3 text-sm text-white outline-none focus:border-indigo-400/60"
                      />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="grid gap-2">
                        <label className="text-xs font-semibold text-white/70">时间</label>
                        <input
                          value={selectedProjectItem.period}
                          onChange={(e) => upsertProject({ ...selectedProjectItem, period: e.target.value })}
                          className="h-11 w-full rounded-2xl border border-white/10 bg-zinc-950/60 px-4 text-sm text-white outline-none focus:border-indigo-400/60"
                        />
                      </div>
                      <div className="grid gap-2">
                        <label className="text-xs font-semibold text-white/70">角色</label>
                        <input
                          value={selectedProjectItem.role}
                          onChange={(e) => upsertProject({ ...selectedProjectItem, role: e.target.value })}
                          className="h-11 w-full rounded-2xl border border-white/10 bg-zinc-950/60 px-4 text-sm text-white outline-none focus:border-indigo-400/60"
                        />
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <label className="text-xs font-semibold text-white/70">标签（每行一个）</label>
                      <textarea
                        value={toLines(selectedProjectItem.tags)}
                        onChange={(e) => upsertProject({ ...selectedProjectItem, tags: fromLines(e.target.value) })}
                        className="min-h-24 w-full rounded-2xl border border-white/10 bg-zinc-950/60 px-4 py-3 text-sm text-white outline-none focus:border-indigo-400/60"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-white/65">请选择一个项目。</div>
                )}
              </div>
            </div>
          </Container>
        </section>
      ) : null}

      {activeTab === "learning" ? (
        <section>
          <Container className="py-10 sm:py-12">
            <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                <div className="flex items-center justify-between gap-4">
                  <div className="text-base font-semibold">学习记录</div>
                  <button
                    type="button"
                    className="text-xs font-semibold text-white/60 hover:text-white"
                    onClick={() => {
                      const slug = `note-${Date.now()}`;
                      upsertLearning({
                        slug,
                        title: "新记录",
                        summary: "",
                        date: new Date().toISOString().slice(0, 10),
                        tags: [],
                        links: [],
                        featured: false,
                      });
                    }}
                  >
                    新增
                  </button>
                </div>
                <div className="mt-4 grid gap-2">
                  {bundle.learning.map((n) => {
                    const active = n.slug === selectedLearning;
                    return (
                      <button
                        key={n.slug}
                        type="button"
                        className={cn(
                          "rounded-2xl border p-4 text-left transition-colors",
                          active
                            ? "border-indigo-400/30 bg-indigo-500/15"
                            : "border-white/10 bg-zinc-950/30 hover:bg-white/7",
                        )}
                        onClick={() => setSelectedLearning(n.slug)}
                      >
                        <div className="text-sm font-semibold">{n.title}</div>
                        <div className="mt-1 text-xs text-white/60">{n.date}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                {selectedLearningItem ? (
                  <div className="grid gap-4">
                    <div className="flex items-center justify-between gap-4">
                      <div className="text-base font-semibold">编辑</div>
                      <button
                        type="button"
                        className="text-xs font-semibold text-white/60 hover:text-white"
                        onClick={() => removeLearning(selectedLearningItem.slug)}
                      >
                        删除这条
                      </button>
                    </div>
                    <div className="grid gap-2">
                      <label className="text-xs font-semibold text-white/70">slug</label>
                      <input
                        value={selectedLearningItem.slug}
                        onChange={(e) =>
                          upsertLearning({ ...selectedLearningItem, slug: slugify(e.target.value) || e.target.value })
                        }
                        className="h-11 w-full rounded-2xl border border-white/10 bg-zinc-950/60 px-4 text-sm text-white outline-none focus:border-indigo-400/60"
                      />
                    </div>
                    <div className="grid gap-2">
                      <label className="text-xs font-semibold text-white/70">标题</label>
                      <input
                        value={selectedLearningItem.title}
                        onChange={(e) => upsertLearning({ ...selectedLearningItem, title: e.target.value })}
                        className="h-11 w-full rounded-2xl border border-white/10 bg-zinc-950/60 px-4 text-sm text-white outline-none focus:border-indigo-400/60"
                      />
                    </div>
                    <div className="grid gap-2">
                      <label className="text-xs font-semibold text-white/70">摘要</label>
                      <textarea
                        value={selectedLearningItem.summary}
                        onChange={(e) => upsertLearning({ ...selectedLearningItem, summary: e.target.value })}
                        className="min-h-24 w-full rounded-2xl border border-white/10 bg-zinc-950/60 px-4 py-3 text-sm text-white outline-none focus:border-indigo-400/60"
                      />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="grid gap-2">
                        <label className="text-xs font-semibold text-white/70">日期</label>
                        <input
                          value={selectedLearningItem.date}
                          onChange={(e) => upsertLearning({ ...selectedLearningItem, date: e.target.value })}
                          className="h-11 w-full rounded-2xl border border-white/10 bg-zinc-950/60 px-4 text-sm text-white outline-none focus:border-indigo-400/60"
                        />
                      </div>
                      <div className="grid gap-2">
                        <label className="text-xs font-semibold text-white/70">推荐</label>
                        <button
                          type="button"
                          className={cn(
                            "h-11 rounded-2xl border px-4 text-sm font-semibold transition-colors",
                            selectedLearningItem.featured
                              ? "border-indigo-400/30 bg-indigo-500/20 text-white"
                              : "border-white/10 bg-zinc-950/60 text-white/70 hover:bg-white/7",
                          )}
                          onClick={() =>
                            upsertLearning({ ...selectedLearningItem, featured: !selectedLearningItem.featured })
                          }
                        >
                          {selectedLearningItem.featured ? "已推荐" : "未推荐"}
                        </button>
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <label className="text-xs font-semibold text-white/70">标签（每行一个）</label>
                      <textarea
                        value={toLines(selectedLearningItem.tags)}
                        onChange={(e) => upsertLearning({ ...selectedLearningItem, tags: fromLines(e.target.value) })}
                        className="min-h-24 w-full rounded-2xl border border-white/10 bg-zinc-950/60 px-4 py-3 text-sm text-white outline-none focus:border-indigo-400/60"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-white/65">请选择一条学习记录。</div>
                )}
              </div>
            </div>
          </Container>
        </section>
      ) : null}

      {showDownloadDialog ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="w-full max-w-md rounded-3xl border border-white/10 bg-zinc-950 p-6">
            <div className="flex items-center justify-between gap-4">
              <div className="text-base font-semibold">下载简历</div>
              <button
                type="button"
                className="text-xs font-semibold text-white/60 hover:text-white"
                onClick={() => setShowDownloadDialog(false)}
              >
                关闭
              </button>
            </div>

            <div className="mt-6 grid gap-4">
              <div className="grid gap-2">
                <div className="text-xs font-semibold text-white/70">选择下载格式</div>
                <div className="flex flex-wrap gap-2">
                  {(
                    [
                      { key: "pdf", label: "PDF" },
                      { key: "excel", label: "Excel" },
                      { key: "doc", label: "Word (Doc)" },
                    ] as const
                  ).map((f) => (
                    <button
                      key={f.key}
                      type="button"
                      className={cn(
                        "rounded-full border px-4 py-2 text-sm font-semibold transition-colors",
                        selectedFormat === f.key
                          ? "border-indigo-400/30 bg-indigo-500/20 text-white"
                          : "border-white/10 bg-white/5 text-white/75 hover:bg-white/10",
                      )}
                      onClick={() => setSelectedFormat(f.key)}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <input
                  id="save-to-portfolio"
                  type="checkbox"
                  checked={saveToPortfolio}
                  onChange={(e) => setSaveToPortfolio(e.target.checked)}
                  className="h-4 w-4 rounded border-white/20 bg-zinc-950 text-indigo-500 focus:ring-indigo-500"
                />
                <label htmlFor="save-to-portfolio" className="text-sm text-white/80">
                  同时保存到作品集
                </label>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  className={cn(
                    "inline-flex h-11 flex-1 items-center justify-center rounded-full px-5 text-sm font-semibold",
                    "border border-white/15 bg-white/5 text-white hover:bg-white/10",
                  )}
                  onClick={() => setShowDownloadDialog(false)}
                >
                  取消
                </button>
                <button
                  type="button"
                  className={cn(
                    "inline-flex h-11 flex-1 items-center justify-center rounded-full px-5 text-sm font-semibold",
                    "bg-indigo-500 text-white hover:bg-indigo-400",
                  )}
                  onClick={handleDownload}
                >
                  确认下载
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
