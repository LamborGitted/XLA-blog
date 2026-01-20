// src/client/composables/useTheme.ts
import { ref, computed } from 'vue'
import { generateThemeFromConfig, DEFAULT_THEME_CONFIG, type Theme, type ThemeConfig } from '@/client/domain/theme/theme.ts'

// ==================== LocalStorage 键名 ====================
const STORAGE_KEY = 'xl-blog-theme-config'

// ==================== 主题配置状态 ====================
const currentConfig = ref<ThemeConfig>(DEFAULT_THEME_CONFIG)

// ==================== 工具函数 ====================

/**
 * 从 LocalStorage 加载主题配置
 */
function loadConfigFromStorage(): ThemeConfig | null {
    if (typeof window === 'undefined') return null

    try {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (!stored) return null

        const parsed = JSON.parse(stored)

        // 验证数据结构
        if (
            typeof parsed === 'object' &&
            (parsed.mode === 'light' || parsed.mode === 'dark') &&
            typeof parsed.hue === 'number' &&
            parsed.hue >= 0 && parsed.hue <= 255
        ) {
            return parsed as ThemeConfig
        }
    } catch (error) {
        console.warn('Failed to load theme config from storage:', error)
    }

    return null
}

/**
 * 保存主题配置到 LocalStorage
 */
function saveConfigToStorage(config: ThemeConfig): void {
    if (typeof window === 'undefined') return

    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(config))
    } catch (error) {
        console.warn('Failed to save theme config to storage:', error)
    }
}

// ==================== 主题 Composable ====================

/**
 * 初始化主题系统
 */
function initializeTheme() {
    const storedConfig = loadConfigFromStorage()
    if (storedConfig) {
        currentConfig.value = storedConfig
    }

    // 应用初始主题
    applyTheme(generateThemeFromConfig(currentConfig.value))
}

/**
 * 应用主题到 DOM
 */
function applyTheme(theme: Theme) {
    if (typeof window === 'undefined') return

    const root = document.documentElement

    // 注入颜色 CSS 变量
    Object.entries(theme.colors).forEach(([key, value]) => {
        root.style.setProperty(`--color-${key}`, value)
    })

    // 注入 radius 和 spacing
    if (theme.radius) {
        root.style.setProperty('--radius-md', theme.radius)
    }

    if (theme.space) {
        Object.entries(theme.space).forEach(([key, value]) => {
            root.style.setProperty(`--space-${key}`, value)
        })
    }

    // 设置 data-theme 属性（可用于 CSS 选择器）
    root.setAttribute('data-theme-mode', theme.mode)
    root.setAttribute('data-theme-hue', String(currentConfig.value.hue))
}

export function useTheme() {
    // 当前主题对象（计算属性）
    const currentTheme = computed<Theme>(() => {
        return generateThemeFromConfig(currentConfig.value)
    })

    /**
     * 设置主题配置
     */
    const setThemeConfig = (config: Partial<ThemeConfig>) => {
        // 更新配置
        if (config.mode !== undefined) {
            currentConfig.value.mode = config.mode
        }
        if (config.hue !== undefined) {
            // 确保 hue 在 0-255 范围内
            currentConfig.value.hue = Math.max(0, Math.min(255, config.hue))
        }

        // 保存到存储
        saveConfigToStorage(currentConfig.value)

        // 应用新主题
        applyTheme(currentTheme.value)
    }

    /**
     * 设置完整主题配置
     */
    const setFullThemeConfig = (config: ThemeConfig) => {
        currentConfig.value = { ...config }

        // 保存到存储
        saveConfigToStorage(currentConfig.value)

        // 应用新主题
        applyTheme(currentTheme.value)
    }

    /**
     * 切换亮暗模式
     */
    const toggleMode = () => {
        setThemeConfig({
            mode: currentConfig.value.mode === 'light' ? 'dark' : 'light'
        })
    }

    /**
     * 设置色调
     */
    const setHue = (hue: number) => {
        setThemeConfig({ hue })
    }

    /**
     * 重置为默认主题
     */
    const resetToDefault = () => {
        setFullThemeConfig(DEFAULT_THEME_CONFIG)
    }

    return {
        // 状态
        currentConfig,
        currentTheme,

        // 方法
        setThemeConfig,
        setFullThemeConfig,
        toggleMode,
        setHue,
        resetToDefault,
    }
}

// ==================== 自动初始化 ====================

// 在模块加载时初始化主题（仅在浏览器环境）
if (typeof window !== 'undefined') {
    initializeTheme()
}
