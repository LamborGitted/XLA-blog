import { ref, onMounted, onUnmounted } from 'vue'
import { backgrounds, type Background } from '@/client/domain/theme/backgrounds'

export function useBackground(intervalMs = 10000) {
    const currentIndex = ref(0)
    const currentBg = ref<Background>(backgrounds[0]!)
    let timer: number | null = null

    const next = () => {
        currentIndex.value = (currentIndex.value + 1) % backgrounds.length
        currentBg.value = backgrounds[currentIndex.value]!
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
