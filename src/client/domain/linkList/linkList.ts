// src/client/domain/linkList/linkList.ts

/**
 * 外链项配置
 */
export interface LinkItem {
  /** 链接标题 */
  title: string;
  /** 链接描述 */
  description: string;
  /** 链接地址 */
  url: string;
}

/**
 * 外链分组配置
 */
export interface LinkSection {
  /** 分组 ID */
  id: string;
  /** 分组标题 */
  title: string;
  /** 外链列表 */
  links: LinkItem[];
}

/**
 * 默认外链配置
 * 站长的外链合集
 */
export const DEFAULT_LINK_LIST: LinkSection[] = [
  {
    id: 'social',
    title: '社交媒体',
    links: [
      {
        title: 'GitHub',
        description: '代码托管平台',
        url: 'https://github.com/LamborGitted/XLA-Blog',
      },
      {
        title: 'Twitter',
        description: '关注我的 Twitter',
        url: 'https://twitter.com',
      },
    ],
  },
  {
    id: 'tools',
    title: '常用工具',
    links: [
      {
        title: 'Google',
        description: '搜索引擎',
        url: 'https://www.google.com',
      },
      {
        title: 'ChatGPT',
        description: 'AI 助手',
        url: 'https://chat.openai.com',
      },
      {
        title: 'Stack Overflow',
        description: '开发者问答',
        url: 'https://stackoverflow.com',
      },
    ],
  },
  {
    id: 'resources',
    title: '学习资源',
    links: [
      {
        title: 'MDN Web Docs',
        description: 'Web 开发文档',
        url: 'https://developer.mozilla.org',
      },
      {
        title: 'Vue.js',
        description: 'Vue.js 官方文档',
        url: 'https://vuejs.org',
      },
      {
        title: 'TypeScript',
        description: 'TypeScript 官方文档',
        url: 'https://www.typescriptlang.org',
      },
    ],
  },
];

/**
 * 获取外链配置
 */
export function getLinkListConfig(): LinkSection[] {
  return DEFAULT_LINK_LIST;
}

/**
 * 获取网站 favicon URL
 * 使用 Google 的 favicon 服务
 */
export function getFaviconUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    return `https://www.google.com/s2/favicons?domain=${urlObj.hostname}&sz=64`;
  } catch {
    // 如果 URL 解析失败，返回默认 SVG 占位图标
    return '';
  }
}
