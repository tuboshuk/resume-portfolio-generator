# 页面功能清单 & 业务逻辑使用说明书

本说明面向“买到模板的人 / 维护者 / 团队成员”，用于快速理解站点有哪些页面、每个页面有哪些功能，以及这些功能背后的数据来源与业务规则。

## 1. 页面功能清单（按路由）

### `/` 首页

- 顶部导航：锚点跳转（默认：我的优势 / 成长轨迹 / 一起聊聊）
- 站点名片：头像、简介、Email 一键复制、社交链接
- 行动按钮：查看作品、查看/下载简历（可配置）
- 我的优势：技能分组展示 + 亮点卡片
- 成长轨迹：经历列表（组织/职位/时间/要点）
- 精选作品：展示精选项目卡片（按规则排序）
- 一起聊聊：邮件按钮、Email 展示与复制、社交链接

### `/projects` 作品集列表

- 搜索：按“标题/摘要/角色/标签”关键字过滤
- 标签筛选：多选 AND 过滤；支持一键清除
- 排序：精选项目优先，其次按 `period` 倒序
- 空状态：无匹配结果提示
- 项目卡片：标题/摘要/标签/封面图，点击进入详情页

### `/projects/[slug]` 作品详情

- 静态生成：构建时根据 `slug` 生成所有详情页
- 关键信息：标题、摘要、标签、封面图
- 项目信息：时间、角色
- 外链入口：项目链接按钮（数组配置），以及“联系我（mailto）”
- 内容结构：背景与目标 / 我的职责 / 关键成果 / 取舍与边界
- 媒体展示：可选 gallery（懒加载）
- 返回入口：返回作品集

### `/learning` 学习

- 搜索：按“标题/摘要/标签”关键字过滤
- 标签筛选：多选 AND 过滤；支持一键清除
- 排序：featured 优先，其次按 `date` 倒序
- 卡片内容：标题、日期、摘要、标签、外链按钮（可选）
- 空状态：无匹配结果提示

### `/_not-found` / 404

- 统一 404 页面：提示原因 + 返回首页 / 查看作品集

## 2. 业务逻辑使用说明（数据 → 页面 → 规则）

### 2.1 内容数据从哪里来

- 站点配置：`src/content/site.json`
  - `name/title/location/tagline/description/avatarUrl/email`：用于首页与全局 metadata
  - `skills/highlights/experience`：用于首页三大区块
  - `featuredProjectSlugs`：用于精选作品排序
  - `anchors`：首页锚点 id（URL `#hash`）
  - `nav`：导航文案（不影响锚点地址）
  - `resume`：简历按钮（支持外链查看或本地 PDF 下载）
- 作品数据：`src/content/projects.json`
- 学习数据：`src/content/learning.json`

这些 JSON 在构建时被直接打包进站点，因此本项目不需要后端即可运行与部署。

### 2.2 精选作品的规则

- 首页“精选作品”来源于 `getFeaturedProjects()`：
  1. 先按 `site.featuredProjectSlugs` 的顺序取项目（顺序固定）
  2. 再追加 `projects.json` 里 `featured: true` 且不重复的项目

### 2.3 作品集列表的搜索与筛选规则

- 搜索字段：`title + summary + role + tags`
- 标签筛选：多选 AND 关系（选了多个标签时，项目必须同时包含这些标签才会展示）
- 排序：`featured` 优先，其次 `period` 字符串倒序

实现位置：`src/lib/filter-projects.ts` 与 `src/app/projects/projects-client.tsx`。

### 2.4 学习页的搜索与筛选规则

- 搜索字段：`title + summary + tags`
- 标签筛选：多选 AND
- 排序：`featured` 优先，其次 `date` 字符串倒序（建议使用 `YYYY-MM-DD`）

实现位置：`src/lib/filter-learning.ts` 与 `src/app/learning/learning-client.tsx`。

### 2.5 简历入口（查看/下载）的规则

- 推荐使用 `site.resume`：
  - `href` 以 `http/https` 开头：按外链打开（新标签页）
  - `href` 为站内路径（例如 `/resume.pdf`）：支持 `download: true` 触发下载
- 兼容字段：若未提供 `resume`，则回退到旧字段 `resumeHref`

实现位置：`src/app/page.tsx` 与 `src/components/PrimaryLink.tsx`。

### 2.6 静态导出与部署

- 本项目可静态构建并导出 HTML（无后端），适合 GitHub Pages 等静态托管。
- 作品详情页通过 `generateStaticParams()` 进行 SSG 预渲染。

建议使用的本地命令：

- `npm run dev`：本地预览
- `npm test`：单元测试
- `npm run build`：生产构建（静态生成）

## 3. 常见改动指南（最短路径）

- 改导航文案：编辑 `src/content/site.json` 的 `nav`
- 改锚点地址：编辑 `src/content/site.json` 的 `anchors`
- 改技能/经历：编辑 `src/content/site.json` 的 `skills` / `experience`
- 增加作品：追加 `src/content/projects.json`，并按需把 slug 加到 `featuredProjectSlugs`
- 增加学习记录：追加 `src/content/learning.json`

