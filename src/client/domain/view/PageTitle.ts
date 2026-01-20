// src/client/domain/view/PageTitle.ts

/**
 * 字体配置
 */
export interface FontConfig {
  family: string;              // 字体族
  weight: string | number;     // 字重
  size: string;               // 字体大小
  lineHeight: string;          // 行高
}

/**
 * 打字效果配置
 */
export interface TypewriterConfig {
  speed: number;              // 打字速度（毫秒/字符）
  delay: number;              // 开始延迟（毫秒）
  blinkSpeed: number;         // 光标闪烁速度（毫秒）
  showCursor: boolean;        // 是否显示光标
  cursorChar: string;         // 光标字符
}

/**
 * 标题配置
 */
export interface TitleConfig {
  id: string;
  text: string;               // 标题文本
  subtitle?: string;          // 副标题文本
  visible?: boolean;          // 是否可见
  animated?: boolean;         // 是否使用打字动画
  font?: FontConfig;          // 字体配置
  typewriter?: TypewriterConfig; // 打字效果配置
}

/**
 * 页面标题配置
 */
export interface PageTitleConfig {
  title: TitleConfig;
  subtitle: TitleConfig;
}

// ==================== 预设配置 ====================

/**
 * 默认标题字体配置
 */
const DEFAULT_FONT: FontConfig = {
  family: "'Inter', 'Helvetica Neue', Arial, sans-serif",
  weight: '700',
  size: '5rem',
  lineHeight: '1.2',
};

/**
 * 默认副标题字体配置
 */
const DEFAULT_SUBTITLE_FONT: FontConfig = {
  family: "'Inter', 'Helvetica Neue', Arial, sans-serif",
  weight: '400',
  size: '1.8rem',
  lineHeight: '1.5',
};

/**
 * 默认打字效果配置
 */
const DEFAULT_TYPEWRITER: TypewriterConfig = {
  speed: 100,
  delay: 500,
  blinkSpeed: 700,
  showCursor: true,
  cursorChar: '|',
};

/**
 * 默认页面标题配置
 */
export const DEFAULT_PAGE_TITLE: PageTitleConfig = {
  title: {
    id: 'main-title',
    text: 'XL-Blog',
    visible: true,
    animated: true,
    font: DEFAULT_FONT,
    typewriter: DEFAULT_TYPEWRITER,
  },
  subtitle: {
    id: 'subtitle',
    text: 'Explore the Code',
    visible: true,
    animated: true,
    font: DEFAULT_SUBTITLE_FONT,
    typewriter: {
      ...DEFAULT_TYPEWRITER,
      delay: 1500, // 副标题延迟更长时间开始
    },
  },
};

/**
 * 获取页面标题配置
 */
export function getPageTitleConfig(configId?: string): PageTitleConfig {
  // 目前只返回默认配置
  return DEFAULT_PAGE_TITLE;
}

/**
 * 字体预设
 */
export const FONT_PRESETS = {
  modern: {
    family: "'Inter', 'Helvetica Neue', Arial, sans-serif",
    title: { weight: '700', size: '3.5rem' },
    subtitle: { weight: '400', size: '1.5rem' },
  },
  elegant: {
    family: "'Georgia', 'Times New Roman', serif",
    title: { weight: '700', size: '4rem' },
    subtitle: { weight: '400', size: '1.6rem' },
  },
  tech: {
    family: "'JetBrains Mono', 'Consolas', 'Courier New', monospace",
    title: { weight: '700', size: '3rem' },
    subtitle: { weight: '400', size: '1.2rem' },
  },
  bold: {
    family: "'Arial Black', 'Impact', sans-serif",
    title: { weight: '900', size: '4rem' },
    subtitle: { weight: '700', size: '1.8rem' },
  },
};

/**
 * 应用字体预设到标题配置
 */
export function applyFontPreset(config: PageTitleConfig, preset: keyof typeof FONT_PRESETS): PageTitleConfig {
  const fontPreset = FONT_PRESETS[preset];

  return {
    ...config,
    title: {
      ...config.title,
      font: {
        ...fontPreset.title,
        family: fontPreset.family,
      },
    },
    subtitle: config.subtitle ? {
      ...config.subtitle,
      font: {
        ...fontPreset.subtitle,
        family: fontPreset.family,
      },
    } : undefined,
  };
}
