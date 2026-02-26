import { describe, expect, it } from "vitest";
import { filterProjects } from "@/lib/filter-projects";
import type { Project } from "@/lib/types";

const p = (overrides: Partial<Project>): Project => ({
  slug: "x",
  title: "x",
  summary: "x",
  period: "2026",
  role: "owner",
  tags: [],
  featured: false,
  links: [],
  coverImageUrl: "https://example.com",
  content: {
    background: "",
    responsibilities: [],
    results: [],
    tradeoffs: [],
  },
  gallery: [],
  ...overrides,
});

describe("filterProjects", () => {
  it("filters by query", () => {
    const projects: Project[] = [
      p({ slug: "a", title: "Feishu Bot", summary: "Notify" }),
      p({ slug: "b", title: "Portfolio", summary: "Static site" }),
    ];
    const out = filterProjects({ projects, query: "feishu", selectedTags: [] });
    expect(out.map((x) => x.slug)).toEqual(["a"]);
  });

  it("filters by selected tags (AND)", () => {
    const projects: Project[] = [
      p({ slug: "a", tags: ["Next.js", "TypeScript"] }),
      p({ slug: "b", tags: ["Next.js"] }),
    ];
    const out = filterProjects({
      projects,
      query: "",
      selectedTags: ["Next.js", "TypeScript"],
    });
    expect(out.map((x) => x.slug)).toEqual(["a"]);
  });
});

