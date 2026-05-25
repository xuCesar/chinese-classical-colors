# AGENTS.md

## 项目定位

`chinese-classical-colors` 是一个面向前端开发者、UI 设计师和创作者的中国传统色工具。

核心能力：

- 基于传统色种子生成接近 Tailwind 体系的 `50-950` 色阶
- 提供传统色搜索、筛选、随机选择与色阶导出
- 同时承载产品 UI 预览与东方视觉表达

协作时优先目标：

- 保持类型安全与小步修改
- 保持东方视觉语言一致性
- 不破坏颜色数据链路与导出能力
- 不让页面之间出现风格漂移

---

## 技术栈与运行方式

- 框架：Next.js App Router
- 语言：TypeScript
- UI：React + Tailwind CSS + 自定义全局样式
- 色彩计算：`culori`
- 测试：Vitest
- 包管理器：`pnpm`

常用命令：

```bash
pnpm dev
pnpm typecheck
pnpm test
pnpm lint
pnpm build
pnpm data:generate
pnpm data:check
```

---

## 目录结构

主要目录：

- `app/`：Next.js 入口与全局样式
- `components/color-workbench/`：主要界面与交互逻辑
- `lib/`：类型、导出、存储、色彩工具、设计规范
- `data/`：颜色数据与精选语义数据
- `docs/`：设计文档与参考稿
- `tests/`：Vitest 测试

关键文件：

- `components/color-workbench.tsx`：主工作台视图切换入口
- `components/color-workbench/landing-view.tsx`：首屏 Hero 与品牌表达
- `components/color-workbench/explorer-view.tsx`：色谱浏览主界面
- `components/color-workbench/exporter-view.tsx`：导出与保存面板
- `components/color-workbench/guide-view.tsx`：设计指南页面
- `lib/design-spec.ts`：项目级设计规范源数据
- `app/globals.css`：全局视觉 token 与核心样式

---

## 数据与生成约束

- `data/color-seeds.ts` 是生成文件，不要手改。
- 调整颜色源数据时，优先修改：
  - `data/raw/`
  - `data/curated-color-seeds.ts`
  - `data/featured-color-semantics.ts`
  - `scripts/generate-color-seeds.mjs`
- 修改数据源后，执行：

```bash
pnpm data:generate
pnpm data:check
```

如果改动影响色阶生成、筛选、导出或默认展示，需要补跑：

```bash
pnpm test
pnpm typecheck
```

---

## UI 设计规范

后续所有 UI 改动默认遵循以下规范来源：

1. `lib/design-spec.ts`
2. `docs/design-spec.md`
3. `app/globals.css`
4. `components/color-workbench/guide-view.tsx`

如果这几处出现冲突，以 `lib/design-spec.ts` 和 `app/globals.css` 为准。

### 视觉原则

- 用现代精确网格承载古典意味，不堆砌“古风元素”
- 背景以宣纸素底与白瓷表层为主
- 前景文字保持克制，强调只在关键处使用朱砂
- 留白、细边框、轻阴影优先于重装饰

### 色彩规则

- 优先复用 `:root` 中已有 token
- 不为局部页面新增新的主色体系
- 高饱和色只用于强调动作、导航状态和落印位置

### 字体规则

- 标题、章名、纵向文字优先使用衬线
- 色值、导出文本、技术说明优先使用等宽字体
- 普通交互与说明文字沿用系统无衬线

### 组件规则

- 优先复用：`spec-card`、`cinnabar-seal`、`vertical-text`
- 卡片默认细边框、轻阴影、较克制的圆角
- 不为单一页面临时造一套新的视觉风格

### 动效规则

- 默认沿用缓入缓出
- 优先使用位移、透明度、轻微缩放
- 避免旋转、剧烈弹跳、高频闪烁
- 修改动效时，尽量沿用当前页面已存在的周期与 easing

如果你修改了指南页涉及的规范内容：

- 同步更新 `lib/design-spec.ts`
- 同步更新 `docs/design-spec.md`
- 保证 `guide-view.tsx` 的展示与规范一致

---

## 代码修改偏好

- 优先做最小闭环改动，不顺手大重构
- 优先复用现有工具函数、组件和样式类
- 非必要不要新增依赖
- 非必要不要改公开导出名和文件结构
- 能通过调 token、间距、比例解决的问题，不先新增复杂抽象

对于 React 代码：

- 组件职责尽量单一
- 避免把大量业务逻辑直接堆进 JSX
- 可推导状态优先推导，不重复存 state
- `useEffect` 只做真正副作用

对于样式代码：

- 优先改 `app/globals.css` 中已有 token 或已有组件样式
- 不轻易引入与当前视觉语言冲突的局部样式
- 对首页 Hero、色签轮播、纵向色柱等高识别度组件要谨慎修改

---

## 验证要求

完成改动后，按影响范围至少执行：

```bash
pnpm typecheck
pnpm lint
pnpm test
```

如果只改了局部，也至少说明你实际执行了哪些命令。

涉及以下改动时要特别验证：

- 色彩计算逻辑：`tests/color-utils.test.ts`
- 数据生成与种子：`tests/color-seeds.test.ts`
- 首页与工作台状态：`tests/landing-view.test.ts`、`tests/color-workbench-state.test.ts`
- 导出与存储：`tests/exporters.test.ts`、`tests/storage.test.ts`

如果无法做浏览器实机验证，要明确说明。

---

## 不要做的事

- 不手改 `data/color-seeds.ts`
- 不随意新增与项目气质不一致的 UI 风格
- 不为了“更炫”牺牲可读性、留白和信息层级
- 不用临时覆盖样式把规范绕过去
- 不在未说明的情况下修改项目级设计规范

---

## 推荐协作方式

处理 UI 需求时，建议按这个顺序：

1. 先确认是否触及 `lib/design-spec.ts` 的规则
2. 再判断是改 token、改布局、还是改组件结构
3. 优先做样式级微调
4. 必要时再改组件逻辑
5. 最后补验证与说明

处理数据需求时，建议按这个顺序：

1. 先判断是原始数据问题、精选语义问题还是生成逻辑问题
2. 修改源数据或脚本
3. 重新生成数据
4. 执行校验与测试
