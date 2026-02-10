import { ref, onUnmounted } from 'vue'

/**
 * 代码块复制功能的配置选项
 */
export interface UseCodeCopyOptions {
    containerSelector?: string    // 容器选择器，默认 '.markdown-body'
    buttonPosition?: 'top-right' | 'top-left'  // 按钮位置
    showTooltip?: boolean         // 是否显示提示，默认 true
    tooltipDuration?: number      // 提示显示时长（毫秒），默认 2000
}

/**
 * 代码块复制 Composable
 * 为 Markdown 渲染的代码块添加复制按钮
 */
export function useCodeCopy(options: UseCodeCopyOptions = {}) {
    const {
        containerSelector = '.markdown-body',
        showTooltip = true,
        tooltipDuration = 2000
    } = options

    // MutationObserver 实例
    let observer: MutationObserver | null = null

    // 已处理的代码块集合（避免重复添加按钮）
    let processedBlocks: WeakSet<HTMLPreElement> | null = new WeakSet<HTMLPreElement>()

    /**
     * 创建复制按钮元素
     */
    function createCopyButton(): HTMLButtonElement {
        const button = document.createElement('button')
        button.className = 'code-copy-button'
        button.type = 'button'
        button.setAttribute('aria-label', '复制代码')

        // 创建 SVG 图标
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
        svg.setAttribute('width', '16')
        svg.setAttribute('height', '16')
        svg.setAttribute('viewBox', '0 0 24 24')
        svg.setAttribute('fill', 'none')
        svg.setAttribute('stroke', 'currentColor')
        svg.setAttribute('stroke-width', '2')
        svg.setAttribute('stroke-linecap', 'round')
        svg.setAttribute('stroke-linejoin', 'round')

        // 复制图标路径
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
        path.setAttribute('d', 'M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2')
        path.setAttribute('class', 'copy-icon-default')

        const polyPath = document.createElementNS('http://www.w3.org/2000/svg', 'path')
        polyPath.setAttribute('d', 'M16 4h2a2 2 0 0 1 2 2v4')
        polyPath.setAttribute('class', 'copy-icon-arrow')

        const checkPath = document.createElementNS('http://www.w3.org/2000/svg', 'path')
        checkPath.setAttribute('d', 'M20 6L9 17l-5-5')
        checkPath.setAttribute('class', 'copy-icon-check')

        svg.appendChild(path)
        svg.appendChild(polyPath)
        svg.appendChild(checkPath)
        button.appendChild(svg)

        return button
    }

    /**
     * 为代码块添加复制按钮
     */
    function attachButtonToCodeBlock(preElement: HTMLPreElement): void {
        // 检查是否已经处理过
        if (processedBlocks && processedBlocks.has(preElement)) {
            return
        }

        // 确保代码块有 position: relative
        const computedStyle = window.getComputedStyle(preElement)
        if (computedStyle.position === 'static') {
            preElement.style.position = 'relative'
        }

        // 创建按钮
        const button = createCopyButton()

        // 添加点击事件
        button.addEventListener('click', async (event) => {
            event.preventDefault()
            event.stopPropagation()

            // 获取代码内容
            const codeElement = preElement.querySelector('code')
            if (!codeElement) return

            const code = codeElement.textContent || ''
            if (!code) return

            // 复制到剪贴板
            const success = await copyToClipboard(code)

            // 显示提示
            if (showTooltip) {
                showCopyTooltip(button, success ? '已复制' : '复制失败')
            }
        })

        // 添加按钮到代码块
        preElement.appendChild(button)

        // 标记为已处理
        if (processedBlocks) {
            processedBlocks.add(preElement)
        }
    }

    /**
     * 复制文本到剪贴板
     * 支持 Clipboard API 和降级方案
     */
    async function copyToClipboard(text: string): Promise<boolean> {
        if (!text) return false

        // 尝试使用现代 Clipboard API
        if (navigator.clipboard && window.isSecureContext) {
            try {
                await navigator.clipboard.writeText(text)
                return true
            } catch (error) {
                console.warn('Clipboard API failed, falling back to execCommand', error)
                // 降级到 execCommand
                return fallbackCopy(text)
            }
        }

        // 直接使用降级方案
        return fallbackCopy(text)
    }

    /**
     * 降级复制方案（兼容旧浏览器）
     */
    function fallbackCopy(text: string): boolean {
        try {
            // 创建临时文本域
            const textarea = document.createElement('textarea')
            textarea.value = text
            textarea.style.position = 'fixed'
            textarea.style.top = '-9999px'
            textarea.style.left = '-9999px'
            document.body.appendChild(textarea)

            // 选中文本
            textarea.select()
            textarea.setSelectionRange(0, text.length)

            // 执行复制命令
            const successful = document.execCommand('copy')

            // 清理
            document.body.removeChild(textarea)

            return successful
        } catch (error) {
            console.error('Fallback copy failed', error)
            return false
        }
    }

    /**
     * 显示复制状态提示
     */
    function showCopyTooltip(button: HTMLButtonElement, message: string): void {
        // 移除现有的提示
        const existingTooltip = button.querySelector('.code-copy-tooltip')
        if (existingTooltip) {
            existingTooltip.remove()
        }

        // 创建提示元素
        const tooltip = document.createElement('span')
        tooltip.className = 'code-copy-tooltip'
        tooltip.textContent = message

        button.appendChild(tooltip)

        // 添加显示类
        requestAnimationFrame(() => {
            tooltip.classList.add('show')
        })

        // 定时移除
        setTimeout(() => {
            tooltip.classList.remove('show')
            setTimeout(() => {
                tooltip.remove()
            }, 200) // 等待动画结束
        }, tooltipDuration)
    }

    /**
     * 为所有现有代码块添加复制按钮
     */
    function initCodeCopy(): void {
        // 查找所有容器
        const containers = document.querySelectorAll(containerSelector)
        if (containers.length === 0) {
            console.warn(`useCodeCopy: No containers found with selector "${containerSelector}"`)
            return
        }

        // 为每个容器中的代码块添加按钮
        containers.forEach(container => {
            const codeBlocks = container.querySelectorAll('pre')
            codeBlocks.forEach(pre => {
                if (pre instanceof HTMLPreElement) {
                    attachButtonToCodeBlock(pre)
                }
            })
        })

        // 启动 MutationObserver 监听动态添加的代码块
        observeNewCodeBlocks()
    }

    /**
     * 使用 MutationObserver 监听动态添加的代码块
     */
    function observeNewCodeBlocks(): void {
        // 如果已经存在 observer，先断开
        if (observer) {
            observer.disconnect()
            observer = null
        }

        // 查找所有容器
        const containers = document.querySelectorAll(containerSelector)
        if (containers.length === 0) return

        // 创建 MutationObserver
        const newObserver = new MutationObserver((mutations) => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    // 只处理元素节点
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        const element = node as Element

                        // 检查添加的节点是否是代码块
                        if (element.tagName === 'PRE') {
                            attachButtonToCodeBlock(element as HTMLPreElement)
                        }

                        // 检查添加的节点内部是否包含代码块
                        const codeBlocks = element.querySelectorAll?.('pre') || []
                        codeBlocks.forEach(pre => {
                            if (pre instanceof HTMLPreElement) {
                                attachButtonToCodeBlock(pre)
                            }
                        })
                    }
                })
            })
        })

        // 开始观察每个容器
        containers.forEach(container => {
            newObserver.observe(container, {
                childList: true,    // 观察子节点的添加
                subtree: true       // 观察所有后代节点
            })
        })

        // 保存 observer 引用
        observer = newObserver
    }

    /**
     * 清理事件监听和观察器
     */
    function destroyCodeCopy(): void {
        // 断开 MutationObserver
        if (observer) {
            observer.disconnect()
            observer = null
        }

        // 移除所有复制按钮
        const buttons = document.querySelectorAll('.code-copy-button')
        buttons.forEach(button => button.remove())

        // 清空已处理的代码块集合（创建新的 WeakSet）
        processedBlocks = new WeakSet<HTMLPreElement>()
    }

    // 组件卸载时自动清理
    onUnmounted(() => {
        destroyCodeCopy()
    })

    return {
        initCodeCopy,
        destroyCodeCopy,
        copyToClipboard
    }
}
