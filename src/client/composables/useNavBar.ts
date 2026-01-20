// src/client/composables/useNavBar.ts
import { NavBar, type NavItem } from '@/client/domain/view/NavBar.ts'
import { ref } from 'vue'

export function useNavBar() {
    const items = ref<NavItem[]>(NavBar)
    return { items }
}
