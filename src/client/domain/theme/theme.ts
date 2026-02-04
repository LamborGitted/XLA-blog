// src/client/domain/theme/theme.ts
import { hueToDegrees } from '@/client/composables/useColorUtils'

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
                // 背景色 - 极暗，低饱和度
                bg: hslToRgb(degrees, 15, 2),

                // 表面色 - 稍微亮一点
                surface: hslToRgb(degrees, 12, 6),

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

