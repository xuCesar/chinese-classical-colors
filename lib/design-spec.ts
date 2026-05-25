export const designSpecIndex = [
  { id: "spec-overview", label: "00. 项目级约束" },
  { id: "spec-philosophy", label: "01. 美学哲学" },
  { id: "spec-colors", label: "02. 色彩系统" },
  { id: "spec-type", label: "03. 字体与章法" },
  { id: "spec-components", label: "04. 核心组件 Spec" },
  { id: "spec-spacing", label: "05. 间距与边框" },
  { id: "spec-mobile", label: "06. 移动端规则" },
  { id: "section-interaction", label: "07. 触觉交互规范" }
] as const;

export const designSpecPosture =
  "用现代精确网格承载古典意味。背景温润，前景克制，朱砂只在关键处落印。";

export const designSpecPhilosophyCards = [
  {
    short: "简",
    title: "拒绝多余雕饰",
    desc: "不使用大面积多色渐变，通过极细墨线与纯净留白建立边界。"
  },
  {
    short: "远",
    title: "意境深远留白",
    desc: "页面的纵向间距与留白比常规工具页更宽，让内容有呼吸空间。"
  },
  {
    short: "凝",
    title: "精准的朱砂锚点",
    desc: "高纯度的朱砂红只在关键动作、导航状态与落印位置出现。"
  },
  {
    short: "润",
    title: "润物细无声",
    desc: "交互变化使用 420-760ms 的缓入缓出，如墨入水，避免突兀闪动。"
  }
] as const;

export const designSpecColorTokens = [
  {
    title: "宣纸素底",
    token: "--bg-paper",
    value: "oklch(98% 0.005 85) / #FAF8F5",
    swatch: "#faf8f5"
  },
  {
    title: "白瓷表层",
    token: "--bg-surface",
    value: "#FFFFFF",
    swatch: "#ffffff"
  },
  {
    title: "墨色前景",
    token: "--fg-ink",
    value: "oklch(18% 0.01 70) / #2B2B2B",
    swatch: "#2b2b2b"
  },
  {
    title: "次级文字",
    token: "--fg-muted",
    value: "oklch(45% 0.008 70)",
    swatch: "#6f6b66"
  },
  {
    title: "朱砂强调",
    token: "--accent-cinnabar",
    value: "oklch(50% 0.18 30) / #C12C1F",
    swatch: "#c12c1f"
  },
  {
    title: "古金点染",
    token: "--accent-gold",
    value: "oklch(78% 0.12 85)",
    swatch: "#d8b24c"
  }
] as const;

export const designSpecRootCssCode = `:root {
  --bg-paper: oklch(98% 0.005 85);
  --bg-surface: #ffffff;
  --fg-ink: oklch(18% 0.01 70);
  --fg-muted: oklch(45% 0.008 70);
  --border-ink: oklch(20% 0.01 70 / 8%);
  --border-ink-active: oklch(20% 0.01 70 / 24%);
  --accent-cinnabar: oklch(50% 0.18 30);
  --accent-gold: oklch(78% 0.12 85);
  --transition-ease: all 0.45s cubic-bezier(0.16, 1, 0.3, 1);
}`;

export const designSpecTypography = {
  displayLabel: "DISPLAY",
  displayStack: "Songti SC / STSong / SimSun / Noto Serif CJK SC",
  monoLabel: "MONO",
  monoStack: "JetBrains Mono / SF Mono / ui-monospace",
  sampleTitle: "修竹凝妆",
  sampleAccent: "一树梅花",
  sampleCaption: "宋代用色风雅意气"
} as const;

export const designSpecComponentSnippets = {
  sealHtml: (text: string) => `<div class="cinnabar-seal">${text}</div>`,
  sealCss: `.cinnabar-seal {
  border: 2px solid #c12c1f;
  color: #c12c1f;
  writing-mode: vertical-rl;
}`,
  colorRodHtml: `<article class="color-rod">
  <div class="h-28" style="background:#8EA9B5"></div>
  <div class="flex-1 flex items-center justify-center">
    <div class="vertical-text text-2xl">天青</div>
  </div>
</article>`
} as const;

export const designSpecComponentNarratives = {
  seal:
    "印章是项目中最强的东方识别锚点，只用于关键动作、标签落款和局部说明，不做大面积重复装饰。",
  colorRod:
    "纵向色柱卡片是项目中最具辨识度的内容载体，适合首页 Hero、色彩陈列和视觉预览，不适合高密度数据表格。",
  pentatonic:
    "五声音律反馈只适合作为情绪化演示与轻提示，不承担主流程操作反馈。"
} as const;

export const designSpecToneLabels = ["宫", "商", "角", "徵", "羽"] as const;

export const designSpecSpacing =
  "主区块上下间距建议 32-64px；卡片内边距 20-24px；默认使用 1px 细墨灰线建立内容秩序边界。大卡片优先使用 16px 圆角，小组件优先使用 8-12px 圆角。";

export const designSpecMobile =
  "移动端详情交互不做复杂级联右侧栏，统一使用大容器级 Bottom Sheet 承载典故信息、复制动作和核心操作。列表页优先单列滚动，避免在小屏上强行维持桌面端多栏布局。";

export const designSpecInteraction =
  "变化响应不应突兀闪烁，默认采用 450ms 左右平滑周期函数；重点转场可放宽到 760ms，但必须保持同一套缓动节奏。Hover 位移与阴影提升应克制，避免夸张弹跳。";

export const projectDesignRules = [
  "优先复用现有 CSS 变量、spec-card、cinnabar-seal、vertical-text 等视觉基元，不为单页需求重新发明风格。",
  "背景以宣纸素底和白瓷表层为主，不新增高饱和大面积底色；强调色仅使用朱砂与古金体系。",
  "标题、章名和东方语义组件优先使用衬线体系；参数、色值、导出文本与技术说明使用等宽字体。",
  "默认组件边界使用细墨线和轻阴影，不堆叠厚描边、强投影和复杂渐变。",
  "动画统一沿用缓入缓出曲线，优先位移、透明度和轻微缩放，不使用旋转、弹簧抖动和高频闪烁。"
] as const;
