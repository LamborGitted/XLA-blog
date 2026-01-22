// src/client/domain/controlPanel/controlPanel.ts
import { useProfile } from '@/client/composables/useProfile'


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
          id: 'profile',
          type: ControlItemType.BUTTON,
          icon: 'person',
          label: 'Profile',
          title: '个人简介',
          action: () => {
            const { showProfileCard } = useProfile()
            showProfileCard()
          },
        },
        {
          id: 'github',
          type: ControlItemType.LINK,
          icon: 'github',
          label: 'GitHub',
          title: '访问 GitHub 主页',
          link: 'https://github.com/LamborGitted/XLA-Blog',
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

