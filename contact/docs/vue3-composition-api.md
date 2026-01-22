---
subtitle:  Vue 3 Composition API
date:  2026-01-15
---

# Vue 3 Composition API 完全指南(测试文档)

> 深入理解 Vue 3 最核心的特性之一

---

## 为什么需要 Composition API

在 Vue 2 中，我们使用 Options API（data、methods、computed 等）来组织组件逻辑。但随着组件变得复杂，这种方式暴露出了一些问题：

* 相同功能的代码被分散在不同选项中
* 复用逻辑需要通过 mixins 或 HOC，容易产生命名冲突
* TypeScript 支持不够友好

Composition API 的诞生就是为了解决这些问题。

---

## 基础语法对比

### Options API

```javascript
export default {
  data() {
    return {
      count: 0
    }
  },
  methods: {
    increment() {
      this.count++
    }
  },
  computed: {
    doubleCount() {
      return this.count * 2
    }
  }
}
```

### Composition API

```javascript
import { ref, computed } from 'vue'

export default {
  setup() {
    const count = ref(0)

    const increment = () => {
      count.value++
    }

    const doubleCount = computed(() => count.value * 2)

    return {
      count,
      increment,
      doubleCount
    }
  }
}
```

---

## setup() 语法糖

Vue 3.2+ 引入了 `<script setup>` 语法糖，让代码更简洁：

```vue
<script setup>
import { ref, computed } from 'vue'

const count = ref(0)

const increment = () => {
  count.value++
}

const doubleCount = computed(() => count.value * 2)
</script>

<template>
  <div>
    <p>Count: {{ count }}</p>
    <p>Double: {{ doubleCount }}</p>
    <button @click="increment">+1</button>
  </div>
</template>
```

顶层声明会自动暴露给模板，无需手动 return。

---

## 响应式 API

### ref vs reactive

```javascript
import { ref, reactive } from 'vue'

// ref：适合基本类型，需要 .value 访问
const count = ref(0)
count.value++

// reactive：适合对象，直接访问
const state = reactive({
  count: 0,
  message: 'Hello'
})
state.count++
```

### toRefs

解构 reactive 对象时使用 toRefs 保持响应性：

```javascript
const state = reactive({ count: 0, name: 'Vue' })

// ❌ 失去响应性
const { count, name } = state

// ✅ 保持响应性
const { count, name } = toRefs(state)
```

---

## 生命周期对比

| Options API | Composition API |
|------------|----------------|
| beforeCreate | setup() |
| created | setup() |
| beforeMount | onBeforeMount |
| mounted | onMounted |
| beforeUpdate | onBeforeUpdate |
| updated | onUpdated |
| beforeUnmount | onBeforeUnmount |
| unmounted | onUnmounted |

```javascript
import { onMounted, onUnmounted } from 'vue'

export default {
  setup() {
    onMounted(() => {
      console.log('组件已挂载')
    })

    onUnmounted(() => {
      console.log('组件已卸载')
    })
  }
}
```

---

## Composables：逻辑复用的最佳实践

Composables 是 Composition API 的灵魂，类似于 React Hooks。

### useCounter 示例

```javascript
// composables/useCounter.js
import { ref, computed } from 'vue'

export function useCounter(initialValue = 0) {
  const count = ref(initialValue)

  const increment = () => count.value++
  const decrement = () => count.value--
  const doubleCount = computed(() => count.value * 2)

  return {
    count,
    increment,
    decrement,
    doubleCount
  }
}
```

### 使用 Composable

```vue
<script setup>
import { useCounter } from './composables/useCounter'

const { count, increment, doubleCount } = useCounter(10)
</script>

<template>
  <div>
    <p>{{ count }}</p>
    <p>Double: {{ doubleCount }}</p>
    <button @click="increment">+1</button>
  </div>
</template>
```

---

## 依赖注入

Vue 3 提供了更优雅的依赖注入方式：

```javascript
// 父组件
import { provide, ref } from 'vue'

const theme = ref('dark')
provide('theme', theme)

// 子组件
import { inject } from 'vue'

const theme = inject('theme')
```

甚至可以提供响应式默认值和修改方法：

```javascript
const theme = inject('theme', ref('light'))
const setTheme = inject('setTheme')
```

---

## TypeScript 支持

Composition API 与 TypeScript 的结合更加自然：

```typescript
import { ref, Ref } from 'vue'

interface User {
  id: number
  name: string
  email: string
}

const user: Ref<User | null> = ref(null)

async function fetchUser(id: number) {
  const response = await fetch(`/api/users/${id}`)
  user.value = await response.json()
}
```

类型推断更加准确，IDE 提示更友好。

---

## 总结

Composition API 的优势：

* ✅ 更好的逻辑组织
* ✅ 更强的 TypeScript 支持
* ✅ 更灵活的代码复用
* ✅ 更小的打包体积

虽然学习曲线稍陡，但一旦掌握，你会发现组件开发变得更加清晰和高效。

---

*推荐阅读：*

* [Vue 3 官方文档](https://vuejs.org/)
* VueUse：实用的 Vue Composables 集合
* Pinia：Vue 3 官方推荐的状态管理库
