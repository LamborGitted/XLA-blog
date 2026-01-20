// src/client/domain/theme.ts

export interface ThemeColors {
    bg: string;
    surface: string;
    surfaceBlur: string;
    text: string;
    muted: string;
    primary: string;
    accent: string;
    border: string;
    shadow: string;
}

export interface Theme {
    name: string;
    colors: ThemeColors;
    radius?: string;
    space?: {
        xs: string;
        sm: string;
        md: string;
        lg: string;
    }
}

// 亮色主题
export const lightTheme: Theme = {
    name: 'light',
    colors: {
        bg: '#f0f2f5',
        surface: '#ffffff',
        surfaceBlur: 'rgba(255,255,255,0.16)',
        text: '#312a2a',
        muted: '#8b949e',
        primary: '#59aad5',
        accent: '#e758bd',
        border: 'rgba(255,255,255,0.3)',
        shadow: '0 4px 12px rgba(0,0,0,0.1)',
    },
    radius: '10px',
    space: {
        xs: '4px',
        sm: '8px',
        md: '16px',
        lg: '24px',
    }
}

// 暗色主题
export const darkTheme: Theme = {
    name: 'dark',
    colors: {
        bg: '#1e1e2f',
        surface: '#2a2a3b',
        surfaceBlur: 'rgba(40,40,50,0.3)',
        text: '#f0f0f0',
        muted: '#a0a0b0',
        primary: '#59aad5',
        accent: '#e758bd',
        border: 'rgba(255,255,255,0.15)',
        shadow: '0 4px 12px rgba(0,0,0,0.3)',
    },
    radius: '10px',
    space: {
        xs: '4px',
        sm: '8px',
        md: '16px',
        lg: '24px',
    }
}
