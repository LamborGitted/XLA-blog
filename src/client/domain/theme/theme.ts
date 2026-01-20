// src/client/domain/theme/theme.ts

export interface ThemeColors {
    bg: string;
    surface: string;
    surfaceBlur: string;
    text: string;
    textSecondary: string;
    muted: string;
    primary: string;
    accent: string;
    border: string;
    shadow: string;
}

export interface Theme {
    id: string;
    name: string;
    mode: 'light' | 'dark';
    scheme: string;
    colors: ThemeColors;
    radius?: string;
    space?: {
        xs: string;
        sm: string;
        md: string;
        lg: string;
    };
}

// ==================== 主题配置接口 ====================

/**
 * 主题配置 - 用于动态生成主题
 */
export interface ThemeConfig {
    mode: 'light' | 'dark';  // 亮色或暗色模式
    hue: number;             // 色调值 0-255 (对应色相环 0-360度)
}

// ==================== 颜色生成工具函数 ====================

/**
 * HSL转RGB
 * @param h 色相 0-360
 * @param s 饱和度 0-100
 * @param l 亮度 0-100
 */
function hslToRgb(h: number, s: number, l: number): string {
    s /= 100;
    l /= 100;
    const a = s * Math.min(l, 1 - l);
    const f = (n: number) => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
}

/**
 * 将0-255的色调值转换为0-360的色相角度
 */
function hueToDegrees(hue: number): number {
    return Math.round((hue / 255) * 360);
}

/**
 * 生成主题色调的颜色
 * @param hue 0-255的色调值
 * @param mode 亮色或暗色模式
 */
export function generateThemeFromConfig(config: ThemeConfig): Theme {
    const { mode, hue } = config;
    const degrees = hueToDegrees(hue);

    // 根据亮暗模式生成不同的颜色
    if (mode === 'light') {
        return {
            id: `custom-light-${hue}`,
            name: '自定义',
            mode: 'light',
            scheme: 'custom',
            colors: {
                // 背景色 - 使用非常低的饱和度和高亮度
                bg: hslToRgb(degrees, 15, 97),

                // 表面色 - 白色带一点点色调
                surface: hslToRgb(degrees, 5, 100),

                // 模糊表面色
                surfaceBlur: 'rgba(255, 255, 255, 0.65)',

                // 文字色 - 深色，低饱和度
                text: hslToRgb(degrees, 30, 15),

                // 次要文字色
                textSecondary: hslToRgb(degrees, 25, 35),

                // 静音色 - 中等饱和度
                muted: hslToRgb(degrees, 20, 50),

                // 主色 - 高饱和度，中等亮度
                primary: hslToRgb(degrees, 75, 45),

                // 强调色 - 更亮的版本
                accent: hslToRgb(degrees, 70, 70),

                // 边框色
                border: 'rgba(0, 0, 0, 0.1)',

                // 阴影
                shadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            },
            radius: '12px',
            space: {
                xs: '4px',
                sm: '8px',
                md: '16px',
                lg: '24px',
            }
        };
    } else {
        return {
            id: `custom-dark-${hue}`,
            name: '自定义',
            mode: 'dark',
            scheme: 'custom',
            colors: {
                // 背景色 - 非常暗，低饱和度
                bg: hslToRgb(degrees, 20, 5),

                // 表面色 - 稍微亮一点
                surface: hslToRgb(degrees, 15, 12),

                // 模糊表面色
                surfaceBlur: 'rgba(26, 16, 37, 0.75)',

                // 文字色 - 亮色
                text: hslToRgb(degrees, 10, 92),

                // 次要文字色
                textSecondary: hslToRgb(degrees, 15, 75),

                // 静音色
                muted: hslToRgb(degrees, 30, 60),

                // 主色 - 高饱和度，高亮度
                primary: hslToRgb(degrees, 80, 65),

                // 强调色 - 稍微暗一点的版本
                accent: hslToRgb(degrees, 75, 55),

                // 边框色
                border: 'rgba(255, 255, 255, 0.1)',

                // 阴影
                shadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
            },
            radius: '12px',
            space: {
                xs: '4px',
                sm: '8px',
                md: '16px',
                lg: '24px',
            }
        };
    }
}

/**
 * 默认主题配置
 */
export const DEFAULT_THEME_CONFIG: ThemeConfig = {
    mode: 'light',
    hue: 210,  // 蓝色系 (210/255 * 360 ≈ 297度，接近蓝色)
};

export interface ThemePreset {
    id: string;
    name: string;
    description: string;
    theme: Theme;
}

// ==================== 亮色主题 ====================

// 蓝色主题
export const blueLightTheme: Theme = {
    id: 'blue-light',
    name: '蓝色',
    mode: 'light',
    scheme: 'blue',
    colors: {
        bg: '#f0f4f8',
        surface: '#ffffff',
        surfaceBlur: 'rgba(255, 255, 255, 0.65)',
        text: '#1a202c',
        textSecondary: '#4a5568',
        muted: '#718096',
        primary: '#3182ce',
        accent: '#63b3ed',
        border: 'rgba(0, 0, 0, 0.1)',
        shadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    },
    radius: '12px',
    space: {
        xs: '4px',
        sm: '8px',
        md: '16px',
        lg: '24px',
    }
};

// 绿色主题
export const greenLightTheme: Theme = {
    id: 'green-light',
    name: '绿色',
    mode: 'light',
    scheme: 'green',
    colors: {
        bg: '#f0fdf4',
        surface: '#ffffff',
        surfaceBlur: 'rgba(255, 255, 255, 0.65)',
        text: '#14532d',
        textSecondary: '#166534',
        muted: '#15803d',
        primary: '#22c55e',
        accent: '#86efac',
        border: 'rgba(0, 0, 0, 0.1)',
        shadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    },
    radius: '12px',
    space: {
        xs: '4px',
        sm: '8px',
        md: '16px',
        lg: '24px',
    }
};

// 紫色主题
export const purpleLightTheme: Theme = {
    id: 'purple-light',
    name: '紫色',
    mode: 'light',
    scheme: 'purple',
    colors: {
        bg: '#faf5ff',
        surface: '#ffffff',
        surfaceBlur: 'rgba(255, 255, 255, 0.65)',
        text: '#44337a',
        textSecondary: '#5b21b6',
        muted: '#6d28d9',
        primary: '#a855f7',
        accent: '#c4b5fd',
        border: 'rgba(0, 0, 0, 0.1)',
        shadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    },
    radius: '12px',
    space: {
        xs: '4px',
        sm: '8px',
        md: '16px',
        lg: '24px',
    }
};

// 橙色主题
export const orangeLightTheme: Theme = {
    id: 'orange-light',
    name: '橙色',
    mode: 'light',
    scheme: 'orange',
    colors: {
        bg: '#fff7ed',
        surface: '#ffffff',
        surfaceBlur: 'rgba(255, 255, 255, 0.65)',
        text: '#431407',
        textSecondary: '#7c2d12',
        muted: '#9a3412',
        primary: '#f97316',
        accent: '#fdba74',
        border: 'rgba(0, 0, 0, 0.1)',
        shadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    },
    radius: '12px',
    space: {
        xs: '4px',
        sm: '8px',
        md: '16px',
        lg: '24px',
    }
};

// 粉色主题
export const pinkLightTheme: Theme = {
    id: 'pink-light',
    name: '粉色',
    mode: 'light',
    scheme: 'pink',
    colors: {
        bg: '#fdf2f8',
        surface: '#ffffff',
        surfaceBlur: 'rgba(255, 255, 255, 0.65)',
        text: '#500724',
        textSecondary: '#831843',
        muted: '#9d174d',
        primary: '#ec4899',
        accent: '#f9a8d4',
        border: 'rgba(0, 0, 0, 0.1)',
        shadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    },
    radius: '12px',
    space: {
        xs: '4px',
        sm: '8px',
        md: '16px',
        lg: '24px',
    }
};

// ==================== 暗色主题 ====================

// 蓝色暗色主题
export const blueDarkTheme: Theme = {
    id: 'blue-dark',
    name: '蓝色',
    mode: 'dark',
    scheme: 'blue',
    colors: {
        bg: '#0a0e1a',
        surface: '#1a1f2e',
        surfaceBlur: 'rgba(26, 31, 46, 0.75)',
        text: '#e2e8f0',
        textSecondary: '#94a3b8',
        muted: '#64748b',
        primary: '#60a5fa',
        accent: '#3b82f6',
        border: 'rgba(255, 255, 255, 0.1)',
        shadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
    },
    radius: '12px',
    space: {
        xs: '4px',
        sm: '8px',
        md: '16px',
        lg: '24px',
    }
};

// 绿色暗色主题
export const greenDarkTheme: Theme = {
    id: 'green-dark',
    name: '绿色',
    mode: 'dark',
    scheme: 'green',
    colors: {
        bg: '#052e16',
        surface: '#14532d',
        surfaceBlur: 'rgba(20, 83, 45, 0.75)',
        text: '#dcfce7',
        textSecondary: '#86efac',
        muted: '#4ade80',
        primary: '#22c55e',
        accent: '#16a34a',
        border: 'rgba(255, 255, 255, 0.1)',
        shadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
    },
    radius: '12px',
    space: {
        xs: '4px',
        sm: '8px',
        md: '16px',
        lg: '24px',
    }
};

// 紫色暗色主题
export const purpleDarkTheme: Theme = {
    id: 'purple-dark',
    name: '紫色',
    mode: 'dark',
    scheme: 'purple',
    colors: {
        bg: '#0f0a1a',
        surface: '#1a1025',
        surfaceBlur: 'rgba(26, 16, 37, 0.75)',
        text: '#e9d5ff',
        textSecondary: '#c084fc',
        muted: '#a855f7',
        primary: '#c084fc',
        accent: '#a855f7',
        border: 'rgba(255, 255, 255, 0.1)',
        shadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
    },
    radius: '12px',
    space: {
        xs: '4px',
        sm: '8px',
        md: '16px',
        lg: '24px',
    }
};

// 橙色暗色主题
export const orangeDarkTheme: Theme = {
    id: 'orange-dark',
    name: '橙色',
    mode: 'dark',
    scheme: 'orange',
    colors: {
        bg: '#1a0f05',
        surface: '#2d1f0f',
        surfaceBlur: 'rgba(45, 31, 15, 0.75)',
        text: '#ffedd5',
        textSecondary: '#fdba74',
        muted: '#f97316',
        primary: '#fb923c',
        accent: '#ea580c',
        border: 'rgba(255, 255, 255, 0.1)',
        shadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
    },
    radius: '12px',
    space: {
        xs: '4px',
        sm: '8px',
        md: '16px',
        lg: '24px',
    }
};

// 粉色暗色主题
export const pinkDarkTheme: Theme = {
    id: 'pink-dark',
    name: '粉色',
    mode: 'dark',
    scheme: 'pink',
    colors: {
        bg: '#1a0510',
        surface: '#2d0f1a',
        surfaceBlur: 'rgba(45, 15, 26, 0.75)',
        text: '#fce7f3',
        textSecondary: '#f9a8d4',
        muted: '#ec4899',
        primary: '#f472b6',
        accent: '#db2777',
        border: 'rgba(255, 255, 255, 0.1)',
        shadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
    },
    radius: '12px',
    space: {
        xs: '4px',
        sm: '8px',
        md: '16px',
        lg: '24px',
    }
};

// ==================== 主题集合 ====================

export const THEME_PRESETS: ThemePreset[] = [
    // 亮色主题
    { id: 'blue-light', name: '蓝色', description: '清新明亮', theme: blueLightTheme },
    { id: 'green-light', name: '绿色', description: '自然舒适', theme: greenLightTheme },
    { id: 'purple-light', name: '紫色', description: '优雅神秘', theme: purpleLightTheme },
    { id: 'orange-light', name: '橙色', description: '温暖活力', theme: orangeLightTheme },
    { id: 'pink-light', name: '粉色', description: '柔和浪漫', theme: pinkLightTheme },
    // 暗色主题
    { id: 'blue-dark', name: '蓝色', description: '深邃宁静', theme: blueDarkTheme },
    { id: 'green-dark', name: '绿色', description: '森林静谧', theme: greenDarkTheme },
    { id: 'purple-dark', name: '紫色', description: '星空梦幻', theme: purpleDarkTheme },
    { id: 'orange-dark', name: '橙色', description: '夕阳暖色', theme: orangeDarkTheme },
    { id: 'pink-dark', name: '粉色', description: '霓虹夜景', theme: pinkDarkTheme },
];

export const getThemeById = (id: string): Theme | undefined => {
    return THEME_PRESETS.find(preset => preset.id === id)?.theme;
};

export const getThemesByMode = (mode: 'light' | 'dark'): Theme[] => {
    return THEME_PRESETS
        .filter(preset => preset.theme.mode === mode)
        .map(preset => preset.theme);
};

// 兼容旧的导出
export const lightTheme = blueLightTheme;
export const darkTheme = blueDarkTheme;
