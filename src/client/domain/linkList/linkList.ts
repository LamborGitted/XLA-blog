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
 * 默认外链配置（备用）
 * 站长的外链合集
 */
const DEFAULT_LINK_LIST: LinkSection[] = [
  {
    id: 'social-site',
    title: '社交媒体',
    links: [
      {
        title: 'GitHub',
        description: '代码托管平台',
        url: 'https://github.com/LamborGitted/XLA-Blog',
      },
      {
        title: 'Twitter',
        description: 'X (原推特)',
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
    id: 'learn-resources',
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
  {
    id: 'resources-site',
    title: '资源网站',
    links: [
      {
        title: '瑟狐下载站',
        description: '瑟狐编曲下载站',
        url: 'https://cloud.leafing.xyz/',
      },
    ],
  }
];

/**
 * 解析 Markdown 格式的友链配置
 */
function parseMarkdownLinks(markdown: string): LinkSection[] {
  const sections: LinkSection[] = [];
  const lines = markdown.split('\n');

  let currentSection: LinkSection | null = null;

  for (const line of lines) {
    const trimmedLine = line.trim();

    // 跳过空行和注释
    if (!trimmedLine || trimmedLine.startsWith('>')) continue;

    // 解析分组标题 (## 标题)
    const headingMatch = trimmedLine.match(/^##\s+(.+)$/);
    if (headingMatch && headingMatch[1]) {
      const title = headingMatch[1].trim();
      // 生成 ID（将中文转换为拼音或使用简单的方式）
      const id = title
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w\u4e00-\u9fa5-]/g, '');

      currentSection = {
        id,
        title,
        links: []
      };
      sections.push(currentSection);
      continue;
    }

    // 解析链接列表项 (- [标题](URL) - 描述)
    const linkMatch = trimmedLine.match(/^-\s*\[([^\]]+)\]\(([^)]+)\)\s*-\s*(.+)$/);
    if (linkMatch && currentSection && linkMatch[1] && linkMatch[2] && linkMatch[3]) {
      const [, title, url, description] = linkMatch;
      currentSection.links.push({
        title: title.trim(),
        url: url.trim(),
        description: description.trim()
      });
    }
  }

  return sections;
}

/**
 * 缓存已加载的配置
 */
let cachedConfig: LinkSection[] | null = null;

/**
 * 获取外链配置
 * 优先从 /src/contact/links.md 读取，失败则使用默认配置
 */
export async function getLinkListConfig(): Promise<LinkSection[]> {
  // 如果已有缓存，直接返回
  if (cachedConfig) {
    return cachedConfig;
  }

  try {
    const response = await fetch('/src/contact/links.md');
    if (!response.ok) {
      throw new Error(`Failed to load links.md: ${response.status}`);
    }

    const markdown = await response.text();
    const parsed = parseMarkdownLinks(markdown);

    // 如果解析结果为空，使用默认配置
    if (parsed.length === 0) {
      console.warn('links.md is empty or invalid, using default config');
      cachedConfig = DEFAULT_LINK_LIST;
    } else {
      cachedConfig = parsed;
    }
  } catch (error) {
    console.error('Failed to load links.md, using default config:', error);
    cachedConfig = DEFAULT_LINK_LIST;
  }

  return cachedConfig;
}

/**
 * 同步获取外链配置（返回缓存或默认配置）
 * 用于组件初始化
 */
export function getLinkListConfigSync(): LinkSection[] {
  return cachedConfig || DEFAULT_LINK_LIST;
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
