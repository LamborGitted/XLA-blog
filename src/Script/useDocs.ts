import type { DocMeta } from "./types";

const modules = import.meta.glob("../docs/*.md", { eager: true });

export const docs: DocMeta[] = Object.entries(modules).map(([path, mod]) => {
    const fm = (mod as any).frontmatter || {};
    return {
        title: fm.title /*|| path.split("/").pop()?.replace(".md", "") || "未命名"*/,
        subtitle: fm.subtitle /*|| ""*/,  // 确保空字符串而不是 undefined
        path,
    };
});
