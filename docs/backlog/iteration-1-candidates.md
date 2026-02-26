# Iteration 1 Candidates

本文件用于汇总下一迭代候选需求，默认按“提升成交/降低交付成本/提高演示效果”的优先级排序。

## P0（强烈建议）

1. 内容校验与友好报错
   - 当 `site.json` / `projects.json` 缺字段或类型不对时，能在本地开发时给出清晰提示。
2. 一键发布到 GitHub Pages 的工作流
   - 增加 `GitHub Actions` 工作流，自动构建 `out/` 并发布。
3. 生成演示数据与导出模板
   - 提供 `site.example.json`、`projects.example.json` 与复制说明。

## P1（可选增强）

1. SEO 与 OpenGraph 完善
   - 首页/列表/详情的 title/description/og:image。
2. 主题切换（浅色/深色）
   - 保持内容结构不变，只换视觉。
3. 图片加载与性能
   - 静态导出下的图片策略优化（本地图片/远程图片/占位图）。

## P2（后续再说）

1. MDX/Markdown 写项目详情
2. 多语言（中英切换）
3. 表单化配置生成器（Web UI）

