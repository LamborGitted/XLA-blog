// src/client/domain/controlPanel/controlPanel.ts

/**
 * 控制项类型
 */
export enum ControlItemType {
  BUTTON = 'button',           // 普通按钮
  THEME_TOGGLE = 'theme-toggle',  // 主题切换
  THEME_COLOR = 'theme-color',    // 主题色选择
  DIVIDER = 'divider',         // 分隔线
  LINK = 'link',               // 外部链接
  NAVIGATION = 'navigation',    // 导航项
}

/**
 * 控制项配置
 */
export interface ControlItem {
  id: string;
  type: ControlItemType;
  icon?: string;               // 图标名称或SVG内容
  label?: string;              // 显示文本
  title?: string;              // 提示文本
  link?: string;               // 链接地址
  action?: () => void;         // 点击回调
  visible?: boolean;           // 是否可见
  disabled?: boolean;          // 是否禁用
}

/**
 * 控制组配置
 */
export interface ControlSection {
  id: string;
  items: ControlItem[];
  visible?: boolean;
}

/**
 * 控制面板配置
 */
export interface ControlPanelConfig {
  id: string;
  sections: ControlSection[];
  expandable?: boolean;        // 是否可扩展
}

// ==================== 预设配置 ====================

/**
 * 默认控制面板配置
 */
export const DEFAULT_CONTROL_PANEL: ControlPanelConfig = {
  id: 'default',
  sections: [
    {
      id: 'theme',
      items: [
        {
          id: 'theme-toggle',
          type: ControlItemType.THEME_TOGGLE,
          title: '切换亮暗模式',
        },
        {
          id: 'theme-color',
          type: ControlItemType.THEME_COLOR,
          title: '选择主题色',
        },
      ],
    },
    {
      id: 'navigation',
      items: [
        {
          id: 'divider-1',
          type: ControlItemType.DIVIDER,
        },
        {
          id: 'github',
          type: ControlItemType.LINK,
          icon: 'github',
          label: 'GitHub',
          title: '访问 GitHub 主页',
          link: 'https://github.com/LamborGitted/XL-Blog',
        },
      ],
    },
  ],
  expandable: true,
};

/**
 * 获取控制面板配置
 */
export function getControlPanelConfig(configId: string): ControlPanelConfig | undefined {
  // 目前只返回默认配置，后续可以从数据库或配置文件读取
  if (configId === 'default') {
    return DEFAULT_CONTROL_PANEL;
  }
  return undefined;
}

/**
 * 图标映射
 */
export const ICON_MAP = {
  github: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1 5.09a5.07 5.07 0 0 0 5.09 1.09 5.44 5.44 0 0 0 3.5 8c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 15 16.16V19"/>
  </svg>`,
  sun: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="12" r="5"/>
    <line x1="12" y1="1" x2="12" y2="3"/>
    <line x1="12" y1="21" x2="12" y2="23"/>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
    <line x1="1" y1="12" x2="3" y2="12"/>
    <line x1="21" y1="12" x2="23" y2="12"/>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
  </svg>`,
  moon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>`,
};

/**
 * 获取图标内容
 */
export function getIcon(iconName: string): string {
  return ICON_MAP[iconName as keyof typeof ICON_MAP] || '';
}
