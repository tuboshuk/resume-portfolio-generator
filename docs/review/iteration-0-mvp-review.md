# Iteration 0 (MVP) Review Checklist

本清单用于团队评审当前 MVP 是否满足“可演示、可交付、可售卖”的标准，并决定是否进入下一次迭代。

## 1. 范围确认

- 本项目为纯静态站点导出（无后端）。
- 目标路由：`/`、`/projects`、`/projects/[slug]`。
- 内容来源：本地 `src/content/*.json`。

## 2. 本地运行与质量门禁

### 2.1 本地预览

```bash
npm install
npm run dev
```

打开 `http://localhost:3000`。

### 2.2 静态导出

```bash
npm run build
```

确认生成 `out/` 且页面可被静态托管访问。

### 2.3 质量检查

```bash
npm run lint
npm run typecheck
npm test
```

验收标准：无错误；允许少量可解释的告警（需在本清单记录原因与处理计划）。

## 3. 功能验收（Given/When/Then）

### 3.1 首页（/）

- Given `src/content/site.json` 配置完整
  - When 打开首页
  - Then 能看到姓名/定位/一句话价值主张、技能分组、经历时间线、精选作品、联系方式

### 3.2 作品集列表（/projects）

- Given `src/content/projects.json` 有多条项目数据
  - When 打开作品集列表页
  - Then 能看到作品卡片列表

- Given 我输入搜索关键词
  - When 关键词匹配标题或摘要
  - Then 列表过滤出匹配项目

- Given 我选择多个标签
  - When 过滤规则为 AND
  - Then 仅展示同时命中全部标签的项目

### 3.3 作品详情（/projects/[slug]）

- Given `projects.json` 中存在某个 `slug`
  - When 打开对应详情页
  - Then 展示背景、职责、成果、取舍、外链与媒体画廊（若配置）

- Given `slug` 不存在
  - When 打开该详情页
  - Then 返回 404 页面

## 4. 交付与售卖视角检查

- 配置入口是否足够少（理想：只改 `site.json` 与 `projects.json`）
- README 是否能让买家 5 分钟跑起来
- 是否具备 30-60 秒可演示素材（录屏/动图）
- 是否明确许可协议与复用边界（LICENSE/README）

## 5. 结论

- 是否达到“可售卖 MVP”：是 / 否
- 下一次迭代是否需要：需要 / 不需要
- 若需要：优先级最高的 3 件事：
  1.
  2.
  3.

