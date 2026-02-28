export type SiteHighlight = {
  title: string;
  desc: string;
};

export type SiteSkillGroup = {
  group: string;
  items: string[];
};

export type SiteExperience = {
  title: string;
  org: string;
  period: string;
  bullets: string[];
};

export type SiteSocial = {
  label: string;
  href: string;
};

export type SiteResume = {
  href: string;
  label?: string;
  download?: boolean;
};

export type SiteAnchors = {
  skills?: string;
  experience?: string;
  contact?: string;
};

export type SiteConfig = {
  name: string;
  title: string;
  location: string;
  tagline: string;
  description: string;
  avatarUrl: string;
  email: string;
  resumeHref?: string;
  resume?: SiteResume;
  anchors?: SiteAnchors;
  socials: SiteSocial[];
  highlights: SiteHighlight[];
  skills: SiteSkillGroup[];
  experience: SiteExperience[];
  featuredProjectSlugs: string[];
};

export type ProjectLink = {
  label: string;
  href: string;
};

export type ProjectContent = {
  background: string;
  responsibilities: string[];
  results: string[];
  tradeoffs: string[];
};

export type Project = {
  slug: string;
  title: string;
  summary: string;
  period: string;
  role: string;
  tags: string[];
  featured: boolean;
  links: ProjectLink[];
  coverImageUrl: string;
  content: ProjectContent;
  gallery: string[];
};
