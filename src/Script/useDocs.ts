// src/Script/useDocs.ts
import type { Component } from "vue";

export interface DocMeta {
    title: string;
    subtitle?: string;
    path: string;
    component: Component;
}

const modules = import.meta.glob("../docs/*.md", { eager: true });

export const docs: DocMeta[] = Object.entries(modules).map(([path, mod]) => {
    const m = mod as any;

    if (!m.default) {
        console.error("Markdown module has no default export:", path);
    }

    return {
        title: m.frontmatter?.title ?? "未命名",
        subtitle: m.frontmatter?.subtitle ?? "",
        path,
        component: m.default, // ⚠️ 这里一旦是 undefined → 白屏
    };
});
