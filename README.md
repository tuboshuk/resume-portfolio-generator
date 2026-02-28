## Resume / Portfolio Generator Template

输入本地配置与内容文件，输出可部署的静态作品集站点（支持 `/`、`/projects`、`/projects/[slug]`）。

## Quick Start

```bash
npm install
npm run dev
```

打开 `http://localhost:3000` 预览。

## Content Editing

- 站点信息：`src/content/site.json`
- 作品列表：`src/content/projects.json`
- 学习记录：`src/content/learning.json`

你只需要改这些内容文件，就能生成属于你的站点。

### Resume (View / Download)

你可以在 `src/content/site.json` 里配置简历入口：

```json
{
  "resume": {
    "label": "下载简历",
    "href": "/resume.pdf",
    "download": true
  }
}
```

把你的 PDF 放到 `public/resume.pdf` 即可（静态导出可用）。

### Skills

技能支持按分组配置，直接编辑 `site.json` 的 `skills`：

```json
{
  "skills": [
    { "group": "Backend", "items": ["Go", "MySQL", "Redis"] },
    { "group": "Frontend", "items": ["React", "TypeScript"] }
  ]
}
```

### Anchor IDs (URL #hash)

首页导航使用锚点滚动，默认会显示 `/#skills` 这种地址，这是页面 section 的 `id`。你可以在 `src/content/site.json` 里用 `anchors` 自定义：

```json
{
  "anchors": {
    "skills": "abilities",
    "experience": "timeline",
    "contact": "contact"
  }
}
```

### Navigation Labels

导航文案可以在 `src/content/site.json` 里配置（不影响锚点地址）：

```json
{
  "nav": {
    "skills": "我的优势",
    "experience": "成长轨迹",
    "contact": "一起聊聊",
    "projects": "作品集",
    "learning": "学习"
  }
}
```

## Sitemap

站点地图 `sitemap.xml` 会在 `npm run build` 时自动生成。

请修改 `src/app/sitemap.ts` 中的 `baseUrl` 为你的实际部署域名：

```typescript
const baseUrl = "https://your-portfolio-url.com";
```

## Build (Static Export)

```bash
npm run build
```

构建完成后会生成静态导出目录 `out/`，可直接部署到任意静态托管平台。

## Checks

```bash
npm run lint
npm run typecheck
npm test
```

## Team Review

- MVP Review Checklist: `docs/review/iteration-0-mvp-review.md`
- Iteration 1 Candidates: `docs/backlog/iteration-1-candidates.md`

## Manual

- Pages & Business Logic: `docs/manual/pages-and-business-logic.md`

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
