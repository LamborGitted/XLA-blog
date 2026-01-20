<script setup lang="ts">
import { inject, computed, ref } from 'vue'
import type { useArticleList } from '@/client/composables/useArticleList'
import { SORT_OPTIONS, type SortOption } from '@/client/composables/useArticleList'

const articleListState = inject<ReturnType<typeof useArticleList>>('articleListState')!
const { query, searchArticles, sortBy, setSort } = articleListState

// 当前排序选项的元数据
const currentSortOption = computed(() =>
    SORT_OPTIONS.find(opt => opt.value === sortBy.value)
)

// 排序菜单显示状态
const showSortMenu = ref(false)

function toggleSortMenu() {
    showSortMenu.value = !showSortMenu.value
}

function selectSort(option: SortOption) {
    setSort(option)
    showSortMenu.value = false
}
</script>

<template>
    <div class="filter-panel">
        <!-- 搜索框 -->
        <div class="search-wrapper">
            <input
                v-model="query"
                class="search-input"
                type="text"
                placeholder="搜索文章..."
                @input="searchArticles(query)"
            />
            <div class="search-icon"></div>
        </div>

        <!-- 排序按钮 -->
        <div class="sort-wrapper">
            <button class="sort-button" @click="toggleSortMenu">
                <span class="sort-icon">{{ currentSortOption?.icon }}</span>
                <span class="sort-label">{{ currentSortOption?.label }}</span>
            </button>

            <!-- 排序下拉菜单 -->
            <Transition name="fade">
                <div v-if="showSortMenu" class="sort-menu">
                    <div
                        v-for="option in SORT_OPTIONS"
                        :key="option.value"
                        class="sort-option"
                        :class="{ 'is-active': option.value === sortBy }"
                        @click="selectSort(option.value)"
                    >
                        <span class="option-icon">{{ option.icon }}</span>
                        <span class="option-label">{{ option.label }}</span>
                    </div>
                </div>
            </Transition>
        </div>
    </div>
</template>

<style scoped>
.filter-panel {
    position: absolute;
    top: 3vh;
    left: 50%;
    display: flex;
    align-items: center;
    gap: 15px;
    z-index: 10;
    transform: /*skew(-19deg)*/ translateX(20vw);
}

/* 搜索框样式 */
.search-wrapper {
    position: relative;
    display: flex;
    align-items: center;
    background: rgba(255, 255, 255, 0.63);
    backdrop-filter: blur(12px) saturate(160%);
    -webkit-backdrop-filter: blur(12px) saturate(160%);
    border-radius: 25px;
    padding: 0 20px;
    height: 50px;
    transition: all 0.3s ease;
}

.search-wrapper:hover {
    background: rgba(255, 255, 255, 0.35);
}

.search-wrapper:focus-within {
    background: rgba(255, 255, 255, 0.4);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.search-input {
    width: 200px;
    padding: 0;
    border: none;
    outline: none;
    background: transparent;
    font-size: 16px;
    color: #292929;
    //transform: skew(19deg);
}

.search-input::placeholder {
    color: rgba(41, 41, 41, 0.5);
}

.search-icon {
    font-size: 18px;
    //transform: skew(19deg);
}

/* 排序按钮样式 */
.sort-wrapper {
    position: relative;
}

.sort-button {
    display: flex;
    align-items: center;
    gap: 8px;
    background: rgba(255, 255, 255, 0.25);
    backdrop-filter: blur(12px) saturate(160%);
    -webkit-backdrop-filter: blur(12px) saturate(160%);
    border: none;
    border-radius: 25px;
    padding: 0 20px;
    height: 50px;
    cursor: pointer;
    transition: all 0.3s ease;
    //transform: skew(19deg);
}

.sort-button:hover {
    background: rgba(255, 255, 255, 0.35);
    transform: /*skew(19deg)*/ scale(1.05);
}

.sort-button:active {
    transform: /*skew(19deg)*/ scale(0.95);
}

.sort-icon {
    font-size: 16px;
    font-weight: bold;
    color: #292929;
}

.sort-label {
    font-size: 14px;
    font-weight: 500;
    color: #292929;
}

/* 排序下拉菜单 */
.sort-menu {
    position: absolute;
    top: 60px;
    left: 0;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(20px) saturate(160%);
    -webkit-backdrop-filter: blur(20px) saturate(160%);
    border-radius: 15px;
    padding: 10px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
    min-width: 150px;
    //transform: skew(19deg);
}

.sort-option {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 15px;
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.2s ease;
    transform: skew(-19deg);
}

.sort-option:hover {
    background: rgba(0, 0, 0, 0.05);
}

.sort-option.is-active {
    background: rgba(0, 0, 0, 0.1);
}

.option-icon {
    font-size: 16px;
    font-weight: bold;
    color: #292929;
    width: 20px;
    text-align: center;
}

.option-label {
    font-size: 14px;
    color: #292929;
    font-weight: 500;
}

/* 过渡动画 */
.fade-enter-active,
.fade-leave-active {
    transition: all 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
    transform: /*skew(19deg)*/ translateY(-10px);
}

/* 响应式设计 */
@media (max-width: 1024px) {
    .filter-panel {
        left: 2vw;
        flex-direction: column;
        align-items: flex-start;
        gap: 10px;
    }

    .search-input {
        width: 150px;
    }
}

@media (max-width: 768px) {
    .filter-panel {
        left: 50%;
        transform: skew(-19deg) translateX(-50%);
    }

    .search-wrapper,
    .sort-button {
        height: 45px;
    }

    .search-input {
        width: 200px;
        font-size: 14px;
    }
}
</style>
