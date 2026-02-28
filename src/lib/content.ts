import projectsJson from "@/content/projects.json";
import siteJson from "@/content/site.json";
import learningJson from "@/content/learning.json";
import blogJson from "@/content/blog.json";
import type { BlogPost, LearningNote, Project, SiteConfig } from "@/lib/types";

export const site = siteJson as SiteConfig;
export const projects = projectsJson as Project[];
export const learning = learningJson as LearningNote[];
export const blog = blogJson as BlogPost[];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getFeaturedProjects(): Project[] {
  const featured = new Set(site.featuredProjectSlugs);
  const ordered: Project[] = [];
  for (const slug of site.featuredProjectSlugs) {
    const p = projects.find((x) => x.slug === slug);
    if (p) ordered.push(p);
  }
  for (const p of projects) {
    if (p.featured && !featured.has(p.slug)) ordered.push(p);
  }
  return ordered;
}

export function getAllTags(): string[] {
  const set = new Set<string>();
  for (const p of projects) {
    for (const t of p.tags) set.add(t);
  }
  return Array.from(set).sort((a, b) => a.localeCompare(b));
}

export function getAllLearningTags(): string[] {
  const set = new Set<string>();
  for (const n of learning) {
    for (const t of n.tags) set.add(t);
  }
  return Array.from(set).sort((a, b) => a.localeCompare(b));
}

export function getBlogBySlug(slug: string): BlogPost | undefined {
  return blog.find((p) => p.slug === slug);
}

export function getAllBlogTags(): string[] {
  const set = new Set<string>();
  for (const p of blog) {
    for (const t of p.tags) set.add(t);
  }
  return Array.from(set).sort((a, b) => a.localeCompare(b));
}

export function groupTags(allTags: string[], skillGroups: { group: string; items: string[] }[]): { group: string; items: string[] }[] {
  const used = new Set(allTags);
  const groups: { group: string; items: string[] }[] = [];
  const assigned = new Set<string>();

  for (const g of skillGroups) {
    const items = g.items.filter((t) => used.has(t));
    if (items.length > 0) {
      groups.push({ group: g.group, items });
      items.forEach((t) => assigned.add(t));
    }
  }

  const others = allTags.filter((t) => !assigned.has(t));
  if (others.length > 0) {
    groups.push({ group: "其他", items: others });
  }

  return groups;
}
