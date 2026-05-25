# 国色 ccc

`ccc - chinese classical colors` 是一个面向前端开发者、UI 设计师和创作者的中国传统色工具。它从传统色种子出发，生成接近 Tailwind 体系的 50-950 色阶，并提供产品 UI 与东方视觉场景预览。

## 功能

- 传统色搜索、色系筛选与随机选择
- HEX 输入生成 OKLCH 色阶
- 50-950 色阶复制
- 产品 UI / 东方视觉双场景预览
- JSON、Tailwind config、CSS variables 导出
- 浏览器本地色板保存

## 技术栈

- Next.js App Router
- TypeScript
- Tailwind CSS
- culori
- Vitest

## 设计规范

项目级 UI 设计规范见：

- [docs/design-spec.md](docs/design-spec.md)

设计指南页面与后续 UI 调整应以这份规范为准，避免页面之间风格漂移。

## 本地开发

```bash
pnpm install
pnpm dev
```

默认本地地址：

```text
http://localhost:3000
```

## 数据生成

颜色数据由原始数据和精选补充数据生成：

```bash
pnpm data:generate
```

生成目标文件：

```text
data/color-seeds.ts
```

请不要手动编辑生成文件。需要调整数据时，优先修改：

- `data/raw/`
- `data/curated-color-seeds.ts`
- `scripts/generate-color-seeds.mjs`

发布前可检查生成文件是否与数据源同步：

```bash
pnpm data:check
```

## 验证

```bash
pnpm typecheck
pnpm test
pnpm lint
pnpm build
```

## 部署

当前项目是静态导出友好的 Next.js 应用，适合部署到 Vercel、Cloudflare Pages 或其他静态托管平台。

## License

MIT
