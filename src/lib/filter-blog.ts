import type { BlogPost } from "@/lib/types";

export function filterBlog(input: {
  posts: BlogPost[];
  query: string;
  selectedTags: string[];
}): BlogPost[] {
  const q = input.query.trim().toLowerCase();
  const selected = new Set(
    input.selectedTags.map((t) => t.trim()).filter((t) => t.length > 0),
  );

  return input.posts.filter((p) => {
    if (selected.size > 0) {
      let ok = true;
      for (const t of selected) {
        if (!p.tags.includes(t)) {
          ok = false;
          break;
        }
      }
      if (!ok) return false;
    }

    if (!q) return true;
    const hay = `${p.title} ${p.summary} ${p.tags.join(" ")}`.toLowerCase();
    return hay.includes(q);
  });
}
