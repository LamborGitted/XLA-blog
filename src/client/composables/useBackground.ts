import { ref, onMounted, onUnmounted } from 'vue'
import { backgrounds, type Background } from '@/client/domain/theme/backgrounds'

export function useBackground(intervalMs = 10000) {
    const currentIndex = ref(0)
    const currentBg = ref<Background>(backgrounds[0]!)
    let timer: number | null = null
    let isLoadingNext = false

    const next = () => {
        // Prevent duplicate loading
        if (isLoadingNext) return

        const nextIndex = (currentIndex.value + 1) % backgrounds.length
        const nextBg = backgrounds[nextIndex]!

        // First screen image displays immediately
        if (currentIndex.value === 0) {
            currentIndex.value = nextIndex
            currentBg.value = nextBg
            return
        }

        // Preload the next image
        isLoadingNext = true
        const img = new Image()

        img.onload = () => {
            // Switch after loading completes
            currentIndex.value = nextIndex
            currentBg.value = nextBg
            isLoadingNext = false
        }

        img.onerror = () => {
            // Load failed, skip this image
            console.warn(`Failed to load background: ${nextBg.src}`)
            isLoadingNext = false
        }

        // Start loading
        img.src = nextBg.src
    }

    onMounted(() => {
        timer = window.setInterval(next, intervalMs)
    })

    onUnmounted(() => {
        if (timer) clearInterval(timer)
    })

    return {
        currentBg
    }
}
