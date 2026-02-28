import { describe, expect, it } from "vitest";
import { filterLearning } from "@/lib/filter-learning";

describe("filterLearning", () => {
  const notes = [
    {
      slug: "a",
      title: "Resume Writing",
      summary: "How to write a resume",
      date: "2026-02-01",
      tags: ["Resume", "Job"],
      links: [],
      featured: false,
    },
    {
      slug: "b",
      title: "Learning Plan",
      summary: "A study plan template",
      date: "2026-02-02",
      tags: ["Study", "Method"],
      links: [],
      featured: false,
    },
  ];

  it("filters by query", () => {
    expect(filterLearning({ notes, query: "resume", selectedTags: [] })).toHaveLength(1);
    expect(filterLearning({ notes, query: "plan", selectedTags: [] })).toHaveLength(1);
  });

  it("filters by selected tags (AND)", () => {
    expect(filterLearning({ notes, query: "", selectedTags: ["Resume"] })).toHaveLength(1);
    expect(filterLearning({ notes, query: "", selectedTags: ["Resume", "Job"] })).toHaveLength(1);
    expect(filterLearning({ notes, query: "", selectedTags: ["Resume", "Study"] })).toHaveLength(0);
  });
});

