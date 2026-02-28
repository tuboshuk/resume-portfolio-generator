import projectsJson from "@/content/projects.json";
import siteJson from "@/content/site.json";
import learningJson from "@/content/learning.json";
import type { LearningNote, Project, SiteConfig } from "@/lib/types";

export const site = siteJson as SiteConfig;
export const projects = projectsJson as Project[];
export const learning = learningJson as LearningNote[];

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
