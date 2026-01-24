// src/client/domain/widgets/widgets.ts

/**
 * 时钟刷新模式
 */
export enum ClockRefreshMode {
  /** 秒级刷新 */
  Seconds = 'seconds',
  /** 分钟级刷新 */
  Minutes = 'minutes',
}

/**
 * 小组件类型
 */
export enum WidgetType {
  /** 时钟 */
  Clock = 'clock',
  /** 文章数 */
  ArticleCount = 'article-count',
  /** 开站时长 */
  SiteAge = 'site-age',
  /** GitHub 项目数 */
  GithubRepos = 'github-repos',
}

/**
 * 小组件配置
 */
export interface WidgetConfig {
  /** 小组件类型 */
  type: WidgetType;
  /** 是否启用 */
  enabled: boolean;
  /** 显示顺序 */
  order: number;
  /** 自定义标题 */
  title?: string;
  /** 图标 */
  icon?: string;
}

/**
 * 时钟小组件配置
 */
export interface ClockWidgetConfig extends WidgetConfig {
  type: WidgetType.Clock;
  /** 刷新模式 */
  refreshMode: ClockRefreshMode;
  /** 是否显示日期 */
  showDate: boolean;
  /** 是否显示秒数 */
  showSeconds: boolean;
  /** 时间格式 */
  format: '12h' | '24h';
}

/**
 * 文章数小组件配置
 */
export interface ArticleCountWidgetConfig extends WidgetConfig {
  type: WidgetType.ArticleCount;
  /** 是否显示已发布/未发布 */
  showDetails: boolean;
}

/**
 * 开站时长小组件配置
 */
export interface SiteAgeWidgetConfig extends WidgetConfig {
  type: WidgetType.SiteAge;
  /** 显示格式 */
  format: 'text' | 'detailed';
}

/**
 * GitHub 项目数小组件配置
 */
export interface GithubReposWidgetConfig extends WidgetConfig {
  type: WidgetType.GithubRepos;
  /** 是否显示星标数 */
  showStars: boolean;
  /** 是否显示 fork 数 */
  showForks: boolean;
}

/**
 * 默认小组件配置
 */
export const DEFAULT_WIDGET_CONFIGS: WidgetConfig[] = [
  {
    type: WidgetType.Clock,
    enabled: true,
    order: 1,
    title: '当前时间',
    icon: '🕐',
  },
  {
    type: WidgetType.ArticleCount,
    enabled: true,
    order: 2,
    title: '文章总数',
    icon: '📝',
  },
  {
    type: WidgetType.SiteAge,
    enabled: true,
    order: 3,
    title: '开站时长',
    icon: '🚀',
  },
  {
    type: WidgetType.GithubRepos,
    enabled: true,
    order: 4,
    title: 'GitHub 项目',
    icon: '💻',
  },
];

/**
 * 默认时钟配置
 */
export const DEFAULT_CLOCK_CONFIG: ClockWidgetConfig = {
  type: WidgetType.Clock,
  enabled: true,
  order: 1,
  title: '当前时间',
  icon: '🕐',
  refreshMode: ClockRefreshMode.Seconds,
  showDate: true,
  showSeconds: true,
  format: '24h',
};

/**
 * 默认文章数配置
 */
export const DEFAULT_ARTICLE_COUNT_CONFIG: ArticleCountWidgetConfig = {
  type: WidgetType.ArticleCount,
  enabled: true,
  order: 2,
  title: '文章总数',
  icon: '📝',
  showDetails: false,
};

/**
 * 默认开站时长配置
 */
export const DEFAULT_SITE_AGE_CONFIG: SiteAgeWidgetConfig = {
  type: WidgetType.SiteAge,
  enabled: true,
  order: 3,
  title: '开站时长',
  icon: '🚀',
  format: 'text',
};

/**
 * 默认 GitHub 配置
 */
export const DEFAULT_GITHUB_REPOS_CONFIG: GithubReposWidgetConfig = {
  type: WidgetType.GithubRepos,
  enabled: true,
  order: 4,
  title: 'GitHub 项目',
  icon: '💻',
  showStars: false,
  showForks: false,
};

/**
 * 小组件配置管理器
 */
class WidgetConfigManager {
  private configs: Map<WidgetType, WidgetConfig> = new Map();

  constructor() {
    // 初始化默认配置
    this.setConfig(DEFAULT_CLOCK_CONFIG);
    this.setConfig(DEFAULT_ARTICLE_COUNT_CONFIG);
    this.setConfig(DEFAULT_SITE_AGE_CONFIG);
    this.setConfig(DEFAULT_GITHUB_REPOS_CONFIG);
  }

  /**
   * 设置小组件配置
   */
  setConfig(config: WidgetConfig): void {
    this.configs.set(config.type, config);
  }

  /**
   * 获取小组件配置
   */
  getConfig<T extends WidgetConfig>(type: WidgetType): T | undefined {
    return this.configs.get(type) as T | undefined;
  }

  /**
   * 获取所有启用的配置（按顺序）
   */
  getEnabledConfigs(): WidgetConfig[] {
    return Array.from(this.configs.values())
      .filter(config => config.enabled)
      .sort((a, b) => a.order - b.order);
  }

  /**
   * 启用/禁用小组件
   */
  setEnabled(type: WidgetType, enabled: boolean): void {
    const config = this.configs.get(type);
    if (config) {
      config.enabled = enabled;
    }
  }

  /**
   * 更新小组件顺序
   */
  setOrder(type: WidgetType, order: number): void {
    const config = this.configs.get(type);
    if (config) {
      config.order = order;
    }
  }

  /**
   * 重置为默认配置
   */
  reset(): void {
    this.configs.clear();
    this.setConfig(DEFAULT_CLOCK_CONFIG);
    this.setConfig(DEFAULT_ARTICLE_COUNT_CONFIG);
    this.setConfig(DEFAULT_SITE_AGE_CONFIG);
    this.setConfig(DEFAULT_GITHUB_REPOS_CONFIG);
  }
}

/**
 * 导出单例实例
 */
export const widgetConfigManager = new WidgetConfigManager();

/**
 * 获取小组件配置
 */
export function getWidgetConfig<T extends WidgetConfig>(type: WidgetType): T | undefined {
  return widgetConfigManager.getConfig<T>(type);
}

/**
 * 获取所有启用的配置
 */
export function getEnabledWidgetConfigs(): WidgetConfig[] {
  return widgetConfigManager.getEnabledConfigs();
}

/**
 * 启用/禁用小组件
 */
export function setWidgetEnabled(type: WidgetType, enabled: boolean): void {
  widgetConfigManager.setEnabled(type, enabled);
}
