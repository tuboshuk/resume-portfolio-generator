import type { LearningNote } from "@/lib/types";

export function filterLearning(input: {
  notes: LearningNote[];
  query: string;
  selectedTags: string[];
}): LearningNote[] {
  const q = input.query.trim().toLowerCase();
  const selected = new Set(
    input.selectedTags.map((t) => t.trim()).filter((t) => t.length > 0),
  );

  return input.notes.filter((n) => {
    if (selected.size > 0) {
      let ok = true;
      for (const t of selected) {
        if (!n.tags.includes(t)) {
          ok = false;
          break;
        }
      }
      if (!ok) return false;
    }

    if (!q) return true;
    const hay = `${n.title} ${n.summary} ${n.tags.join(" ")}`.toLowerCase();
    return hay.includes(q);
  });
}

