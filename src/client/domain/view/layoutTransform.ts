
// src/client/domain/view/layoutTransform.ts

/**
 * 布局模式枚举
 */
export enum LayoutMode {
  /** 默认布局 */
  Default = 'default',
  /** 小组件布局 */
  Widgets = 'widgets',
  /** 链接列表布局 */
  LinkList = 'link-list'
}

/**
 * 布局状态
 */
export interface LayoutState {
  /** 当前布局模式 */
  mode: LayoutMode;
  /** 是否正在变换中 */
  isTransforming: boolean;
  /** 文章列表滚动位置 */
  articleListScrollTop?: number;
}

/**
 * 布局变换配置
 */
export interface LayoutTransformConfig {
  /** 动画持续时间（毫秒） */
  animationDuration: number;
  /** 缓动函数 */
  easing: string;
}

/**
 * 默认布局状态
 */
export const DEFAULT_LAYOUT_STATE: LayoutState = {
  mode: LayoutMode.Default,
  isTransforming: false,
  articleListScrollTop: 0,
};

/**
 * 默认布局变换配置
 */
export const DEFAULT_LAYOUT_TRANSFORM_CONFIG: LayoutTransformConfig = {
  animationDuration: 600,
  easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
};

/**
 * 布局状态管理（单例）
 */
class LayoutStateManager {
  private state: LayoutState = { ...DEFAULT_LAYOUT_STATE };
  private config: LayoutTransformConfig = { ...DEFAULT_LAYOUT_TRANSFORM_CONFIG };

  /**
   * 获取当前布局状态
   */
  getState(): LayoutState {
    return { ...this.state };
  }

  /**
   * 获取当前布局模式
   */
  getMode(): LayoutMode {
    return this.state.mode;
  }

  /**
   * 切换布局模式
   */
  toggleMode(): LayoutMode {
    this.state.isTransforming = true;
    this.state.mode =
      this.state.mode === LayoutMode.Default
        ? LayoutMode.Widgets
        : LayoutMode.Default;

    // 动画结束后重置 isTransforming
    setTimeout(() => {
      this.state.isTransforming = false;
    }, this.config.animationDuration);

    return this.state.mode;
  }

  /**
   * 设置布局模式
   */
  setMode(mode: LayoutMode): void {
    this.state.isTransforming = true;
    this.state.mode = mode;

    setTimeout(() => {
      this.state.isTransforming = false;
    }, this.config.animationDuration);
  }

  /**
   * 是否正在变换中
   */
  isTransforming(): boolean {
    return this.state.isTransforming;
  }

  /**
   * 是否为小组件布局
   */
  isWidgetsMode(): boolean {
    return this.state.mode === LayoutMode.Widgets;
  }

  /**
   * 是否为默认布局
   */
  isDefaultMode(): boolean {
    return this.state.mode === LayoutMode.Default;
  }

  /**
   * 获取配置
   */
  getConfig(): LayoutTransformConfig {
    return { ...this.config };
  }

  /**
   * 更新配置
   */
  updateConfig(config: Partial<LayoutTransformConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * 保存文章列表滚动位置
   */
  saveArticleListScrollTop(scrollTop: number): void {
    this.state.articleListScrollTop = scrollTop
  }

  /**
   * 获取保存的文章列表滚动位置
   */
  getArticleListScrollTop(): number {
    return this.state.articleListScrollTop ?? 0
  }

  /**
   * 清除文章列表滚动位置
   */
  clearArticleListScrollTop(): void {
    this.state.articleListScrollTop = 0
  }

  /**
   * 重置为默认状态
   */
  reset(): void {
    this.state = { ...DEFAULT_LAYOUT_STATE };
  }
}

/**
 * 导出单例实例
 */
export const layoutStateManager = new LayoutStateManager();

/**
 * 获取布局状态
 */
export function getLayoutState(): LayoutState {
  return layoutStateManager.getState();
}

/**
 * 获取布局模式
 */
export function getLayoutMode(): LayoutMode {
  return layoutStateManager.getMode();
}

/**
 * 切换布局模式
 */
export function toggleLayoutMode(): LayoutMode {
  return layoutStateManager.toggleMode();
}

/**
 * 设置布局模式
 */
export function setLayoutMode(mode: LayoutMode): void {
  layoutStateManager.setMode(mode);
}
