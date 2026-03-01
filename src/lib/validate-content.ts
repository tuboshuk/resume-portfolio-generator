import type { LearningNote, Project, SiteConfig } from "@/lib/types";

type ValidationError = {
  path: string;
  message: string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isString(value: unknown): value is string {
  return typeof value === "string";
}

function isBoolean(value: unknown): value is boolean {
  return typeof value === "boolean";
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((x) => typeof x === "string");
}

function fail(errors: ValidationError[], path: string, message: string) {
  errors.push({ path, message });
}

function requireString(errors: ValidationError[], obj: Record<string, unknown>, key: string, path: string) {
  const v = obj[key];
  if (!isString(v) || v.trim().length === 0) {
    fail(errors, `${path}.${key}`, "必须是非空字符串");
  }
}

function requireBoolean(errors: ValidationError[], obj: Record<string, unknown>, key: string, path: string) {
  const v = obj[key];
  if (!isBoolean(v)) {
    fail(errors, `${path}.${key}`, "必须是布尔值");
  }
}

function requireStringArray(errors: ValidationError[], obj: Record<string, unknown>, key: string, path: string) {
  const v = obj[key];
  if (!isStringArray(v)) {
    fail(errors, `${path}.${key}`, "必须是字符串数组");
  }
}

function requireArray(errors: ValidationError[], obj: Record<string, unknown>, key: string, path: string) {
  const v = obj[key];
  if (!Array.isArray(v)) {
    fail(errors, `${path}.${key}`, "必须是数组");
    return [];
  }
  return v;
}

export function validateSiteConfig(input: unknown, sourceLabel: string): SiteConfig {
  const errors: ValidationError[] = [];
  if (!isRecord(input)) {
    throw new Error(`${sourceLabel}: 根节点必须是对象`);
  }
  const root = input;
  const path = "site";

  requireString(errors, root, "name", path);
  requireString(errors, root, "title", path);
  requireString(errors, root, "location", path);
  requireString(errors, root, "tagline", path);
  requireString(errors, root, "description", path);
  requireString(errors, root, "avatarUrl", path);
  requireString(errors, root, "email", path);

  if ("siteUrl" in root && root.siteUrl != null && !isString(root.siteUrl)) {
    fail(errors, `${path}.siteUrl`, "必须是字符串（例如 https://your-domain.com）");
  }

  const socials = requireArray(errors, root, "socials", path);
  socials.forEach((x, i) => {
    if (!isRecord(x)) {
      fail(errors, `${path}.socials[${i}]`, "必须是对象");
      return;
    }
    requireString(errors, x, "label", `${path}.socials[${i}]`);
    requireString(errors, x, "href", `${path}.socials[${i}]`);
  });

  const highlights = requireArray(errors, root, "highlights", path);
  highlights.forEach((x, i) => {
    if (!isRecord(x)) {
      fail(errors, `${path}.highlights[${i}]`, "必须是对象");
      return;
    }
    requireString(errors, x, "title", `${path}.highlights[${i}]`);
    requireString(errors, x, "desc", `${path}.highlights[${i}]`);
  });

  const skills = requireArray(errors, root, "skills", path);
  skills.forEach((x, i) => {
    if (!isRecord(x)) {
      fail(errors, `${path}.skills[${i}]`, "必须是对象");
      return;
    }
    requireString(errors, x, "group", `${path}.skills[${i}]`);
    requireStringArray(errors, x, "items", `${path}.skills[${i}]`);
  });

  const experience = requireArray(errors, root, "experience", path);
  experience.forEach((x, i) => {
    if (!isRecord(x)) {
      fail(errors, `${path}.experience[${i}]`, "必须是对象");
      return;
    }
    requireString(errors, x, "slug", `${path}.experience[${i}]`);
    requireString(errors, x, "title", `${path}.experience[${i}]`);
    requireString(errors, x, "org", `${path}.experience[${i}]`);
    requireString(errors, x, "period", `${path}.experience[${i}]`);
    requireStringArray(errors, x, "bullets", `${path}.experience[${i}]`);
    if ("highlights" in x && x.highlights != null && !isStringArray(x.highlights)) {
      fail(errors, `${path}.experience[${i}].highlights`, "必须是字符串数组");
    }
    if ("overview" in x && x.overview != null && !isString(x.overview)) {
      fail(errors, `${path}.experience[${i}].overview`, "必须是字符串");
    }
    if ("stack" in x && x.stack != null && !isStringArray(x.stack)) {
      fail(errors, `${path}.experience[${i}].stack`, "必须是字符串数组");
    }
    if ("links" in x && x.links != null) {
      if (!Array.isArray(x.links)) {
        fail(errors, `${path}.experience[${i}].links`, "必须是数组");
      } else {
        x.links.forEach((l, j) => {
          if (!isRecord(l)) {
            fail(errors, `${path}.experience[${i}].links[${j}]`, "必须是对象");
            return;
          }
          requireString(errors, l, "label", `${path}.experience[${i}].links[${j}]`);
          requireString(errors, l, "href", `${path}.experience[${i}].links[${j}]`);
        });
      }
    }
  });

  requireStringArray(errors, root, "featuredProjectSlugs", path);

  if ("resumeHref" in root && root.resumeHref != null && !isString(root.resumeHref)) {
    fail(errors, `${path}.resumeHref`, "必须是字符串");
  }
  if ("resume" in root && root.resume != null) {
    if (!isRecord(root.resume)) {
      fail(errors, `${path}.resume`, "必须是对象");
    } else {
      requireString(errors, root.resume, "href", `${path}.resume`);
      if ("label" in root.resume && root.resume.label != null && !isString(root.resume.label)) {
        fail(errors, `${path}.resume.label`, "必须是字符串");
      }
      if ("download" in root.resume && root.resume.download != null && !isBoolean(root.resume.download)) {
        fail(errors, `${path}.resume.download`, "必须是布尔值");
      }
    }
  }
  if ("anchors" in root && root.anchors != null && !isRecord(root.anchors)) {
    fail(errors, `${path}.anchors`, "必须是对象");
  }
  if ("nav" in root && root.nav != null && !isRecord(root.nav)) {
    fail(errors, `${path}.nav`, "必须是对象");
  }

  if (errors.length > 0) {
    const detail = errors.map((e) => `- ${e.path}: ${e.message}`).join("\n");
    throw new Error(`${sourceLabel}: 内容格式不正确\n${detail}`);
  }
  return root as SiteConfig;
}

export function validateProjects(input: unknown, sourceLabel: string): Project[] {
  const errors: ValidationError[] = [];
  if (!Array.isArray(input)) {
    throw new Error(`${sourceLabel}: 根节点必须是数组`);
  }
  input.forEach((x, i) => {
    const path = `projects[${i}]`;
    if (!isRecord(x)) {
      fail(errors, path, "必须是对象");
      return;
    }
    requireString(errors, x, "slug", path);
    requireString(errors, x, "title", path);
    requireString(errors, x, "summary", path);
    requireString(errors, x, "period", path);
    requireString(errors, x, "role", path);
    requireStringArray(errors, x, "tags", path);
    requireBoolean(errors, x, "featured", path);

    const links = requireArray(errors, x, "links", path);
    links.forEach((l, j) => {
      if (!isRecord(l)) {
        fail(errors, `${path}.links[${j}]`, "必须是对象");
        return;
      }
      requireString(errors, l, "label", `${path}.links[${j}]`);
      requireString(errors, l, "href", `${path}.links[${j}]`);
    });

    requireString(errors, x, "coverImageUrl", path);

    if (!("content" in x) || !isRecord(x.content)) {
      fail(errors, `${path}.content`, "必须是对象");
    } else {
      requireString(errors, x.content, "background", `${path}.content`);
      requireArray(errors, x.content, "responsibilities", `${path}.content`).forEach((r, j) => {
        if (!isString(r)) fail(errors, `${path}.content.responsibilities[${j}]`, "必须是字符串");
      });
      requireArray(errors, x.content, "results", `${path}.content`).forEach((r, j) => {
        if (!isString(r)) fail(errors, `${path}.content.results[${j}]`, "必须是字符串");
      });
      requireArray(errors, x.content, "tradeoffs", `${path}.content`).forEach((r, j) => {
        if (!isString(r)) fail(errors, `${path}.content.tradeoffs[${j}]`, "必须是字符串");
      });
    }

    requireStringArray(errors, x, "gallery", path);
  });

  if (errors.length > 0) {
    const detail = errors.map((e) => `- ${e.path}: ${e.message}`).join("\n");
    throw new Error(`${sourceLabel}: 内容格式不正确\n${detail}`);
  }
  return input as Project[];
}

export function validateLearning(input: unknown, sourceLabel: string): LearningNote[] {
  const errors: ValidationError[] = [];
  if (!Array.isArray(input)) {
    throw new Error(`${sourceLabel}: 根节点必须是数组`);
  }
  input.forEach((x, i) => {
    const path = `learning[${i}]`;
    if (!isRecord(x)) {
      fail(errors, path, "必须是对象");
      return;
    }
    requireString(errors, x, "slug", path);
    requireString(errors, x, "title", path);
    requireString(errors, x, "summary", path);
    requireString(errors, x, "date", path);
    requireStringArray(errors, x, "tags", path);
    requireBoolean(errors, x, "featured", path);

    const links = requireArray(errors, x, "links", path);
    links.forEach((l, j) => {
      if (!isRecord(l)) {
        fail(errors, `${path}.links[${j}]`, "必须是对象");
        return;
      }
      requireString(errors, l, "label", `${path}.links[${j}]`);
      requireString(errors, l, "href", `${path}.links[${j}]`);
    });
  });

  if (errors.length > 0) {
    const detail = errors.map((e) => `- ${e.path}: ${e.message}`).join("\n");
    throw new Error(`${sourceLabel}: 内容格式不正确\n${detail}`);
  }
  return input as LearningNote[];
}
