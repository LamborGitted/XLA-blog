// src/client/composables/useTheme.ts
import { ref } from 'vue'
import { lightTheme, darkTheme, type Theme } from '@/client/domain/theme/theme.ts'

const currentTheme = ref<Theme>(lightTheme)

export function useTheme() {
    const setTheme = (theme: Theme) => {
        currentTheme.value = theme
        // 注入 CSS 变量
        const root = document.documentElement
        Object.entries(theme.colors).forEach(([key, value]) => {
            root.style.setProperty(`--color-${key}`, value)
        })
        // 可选 radius 和 spacing
        if (theme.radius) root.style.setProperty(`--radius-md`, theme.radius)
        if (theme.space) {
            Object.entries(theme.space).forEach(([key, value]) => {
                root.style.setProperty(`--space-${key}`, value)
            })
        }
    }

    const toggleTheme = () => {
        setTheme(currentTheme.value.name === 'light' ? darkTheme : lightTheme)
    }

    return { currentTheme, setTheme, toggleTheme }
}
