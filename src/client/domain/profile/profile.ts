// src/client/domain/profile/profile.ts

/**
 * 个人简介数据接口
 */
export interface Profile {
  name: string;           // 姓名
  title: string;          // 职位/头衔
  avatar?: string;        // 头像 URL
  bio: string;            // 个人简介
  skills?: string[];      // 技能列表
  social?: {              // 社交媒体链接
    name: string;         // 平台名称
    url: string;          // 链接地址
    icon?: string;        // 图标名称
  }[];
  contacts?: {            // 联系方式
    label: string;        // 标签（如：邮箱、微信）
    value: string;        // 值
    icon?: string;        // 图标
  }[];
}

/**
 * 默认个人简介数据
 */
export const DEFAULT_PROFILE: Profile = {
  name: 'Lantxx',
  title: '全栈开发者',
  avatar: 'https://github.com/LamborGitted.png', // GitHub 头像（格式：https://github.com/{username}.png）
  bio: '热爱技术，专注于前端开发与用户体验设计。喜欢探索新技术，分享开发经验。',
  skills: [
    'Vue.js',
    'TypeScript',
    'Node.js',
    'UI/UX Design',
    'Qt/C++'

  ],
  social: [
    {
      name: 'GitHub',
      url: 'https://github.com/LamborGitted',
      icon: 'github'
    },
    {
      name: 'Email',
      url: 'lambor.lambda@gmail.com',
      icon: 'envelope'
    }
  ],
  contacts: [
    {
      label: '邮箱',
      value: 'your-email@example.com',
      icon: 'envelope'
    }
  ]
};

/**
 * 获取个人简介数据
 */
export function getProfile(profileId?: string): Profile {
  // 目前只返回默认配置，后续可以从数据库或配置文件读取
  return DEFAULT_PROFILE;
}
