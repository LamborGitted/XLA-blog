---
subtitle:  TypeScript 高级技巧
date:  2026-01-16
---

# TypeScript 高级技巧与最佳实践

> 从入门到精通，写出更优雅的类型安全代码

---

## 泛型编程基础

泛型是 TypeScript 最强大的特性之一，它允许我们编写灵活且类型安全的代码。

### 基础泛型

```typescript
function identity<T>(arg: T): T {
  return arg
}

const num = identity<number>(42)
const str = identity('hello') // 类型推断
```

### 泛型约束

```typescript
interface Lengthwise {
  length: number
}

function logLength<T extends Lengthwise>(arg: T): void {
  console.log(arg.length)
}

logLength('hello')  // ✅
logLength([1, 2, 3]) // ✅
logLength(123)      // ❌
```

---

## 条件类型

条件类型让你能根据类型关系选择类型：

```typescript
type IsArray<T> = T extends any[] ? true : false

type A = IsArray<string>     // false
type B = IsArray<number[]>   // true
```

### 实用示例：提取函数返回类型

```typescript
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never

function foo() {
  return { x: 10, y: 20 }
}

type FooReturn = ReturnType<typeof foo> // { x: number; y: number }
```

---

## 映射类型

映射类型允许你基于旧类型创建新类型：

### Partial 与 Required

```typescript
interface User {
  id: number
  name: string
  email: string
}

// 所有属性变为可选
type PartialUser = Partial<User>

// 所有属性变为必需
type RequiredUser = Partial<PartialUser>
```

### Readonly

```typescript
type ReadonlyUser = Readonly<User>
const user: ReadonlyUser = { id: 1, name: 'Tom', email: 'tom@example.com' }
user.name = 'Jerry' // ❌ 无法赋值
```

### Pick 与 Omit

```typescript
// 只保留指定属性
type UserPreview = Pick<User, 'id' | 'name'>

// 移除指定属性
type CreateUserInput = Omit<User, 'id'>
```

---

## 模板字面量类型

TypeScript 4.1+ 支持模板字面量类型：

```typescript
type EventName<T extends string> = `on${Capitalize<T>}`

type ClickEvent = EventName<'click'> // 'onClick'
type HoverEvent = EventName<'hover'> // 'onHover'
```

### 实际应用：类型安全的 CSS

```typescript
type CSSValue = `${number}${'px' | 'em' | 'rem' | '%'}`

const margin: CSSValue = '10px'  // ✅
const padding: CSSValue = '1.5em' // ✅
const width: CSSValue = '100vw'   // ❌
```

---

## 递归类型

递归类型可以定义任意深度的嵌套结构：

```typescript
type JSONValue =
  | string
  | number
  | boolean
  | null
  | JSONValue[]
  | { [key: string]: JSONValue }

const data: JSONValue = {
  user: {
    name: 'Alice',
    tags: ['admin', 'editor'],
    meta: null
  }
}
```

---

## 类型守卫

类型守卫帮助你在运行时缩小类型范围：

```typescript
function isString(value: unknown): value is string {
  return typeof value === 'string'
}

function process(value: unknown) {
  if (isString(value)) {
    console.log(value.toUpperCase()) // TypeScript 知道这是 string
  }
}
```

### discriminated union

```typescript
interface SuccessResponse {
  status: 'success'
  data: string
}

interface ErrorResponse {
  status: 'error'
  error: string
}

type Response = SuccessResponse | ErrorResponse

function handleResponse(res: Response) {
  if (res.status === 'success') {
    console.log(res.data) // ✅ TypeScript 知道这是 SuccessResponse
  } else {
    console.log(res.error) // ✅ TypeScript 知道这是 ErrorResponse
  }
}
```

---

## infer 关键字

`infer` 用于在条件类型中推断类型：

```typescript
// 提取 Promise 的类型
type UnwrapPromise<T> = T extends Promise<infer U> ? U : T

type A = UnwrapPromise<Promise<string>> // string
type B = UnwrapPromise<number>          // number

// 提取数组元素类型
type ElementType<T> = T extends (infer U)[] ? U : never

type C = ElementType<string[]>  // string
type D = ElementType<number[]>  // number
```

---

## 品牌（Branded Types）

品牌类型用于创建编译时唯一类型：

```typescript
type Brand<T, B> = T & { __brand: B }

type UserId = Brand<number, 'UserId'>
type ProductId = Brand<number, 'ProductId'>

function getUserId(id: number): UserId {
  return id as UserId
}

const userId: UserId = getUserId(123)
const productId: ProductId = 456 as ProductId

function deleteUser(id: UserId) {
  // ...
}

deleteUser(userId)    // ✅
deleteUser(productId) // ❌ 类型不匹配
```

---

## 装饰器

装饰器是一种特殊声明，可以附加到类、方法、属性上：

```typescript
function log<T>(
  target: any,
  propertyKey: string,
  descriptor: TypedPropertyDescriptor<T>
) {
  const originalMethod = descriptor.value

  descriptor.value = function (this: any, ...args: any[]) {
    console.log(`Calling ${propertyKey} with`, args)
    const result = originalMethod.apply(this, args)
    console.log(`Result:`, result)
    return result
  }
}

class Calculator {
  @log
  add(a: number, b: number) {
    return a + b
  }
}

const calc = new Calculator()
calc.add(1, 2) // 自动打印日志
```

---

## 实用工具类型

### DeepPartial

```typescript
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object
    ? DeepPartial<T[P]>
    : T[P]
}

interface Config {
  database: {
    host: string
    port: number
  }
  cache: {
    enabled: boolean
    ttl: number
  }
}

const partialConfig: DeepPartial<Config> = {
  database: {
    host: 'localhost'
    // port 可选
  }
  // cache 可选
}
```

### DeepRequired

```typescript
type DeepRequired<T> = {
  [P in keyof T]-?: T[P] extends object
    ? DeepRequired<T[P]>
    : T[P]
}
```

---

## 最佳实践

### 1. 避免 any

```typescript
// ❌ 不要这样做
function processData(data: any) {
  return data.map((x: any) => x * 2)
}

// ✅ 使用泛型
function processData<T extends number[]>(data: T) {
  return data.map(x => x * 2)
}
```

### 2. 使用 readonly 提高不可变性

```typescript
interface State {
  readonly users: readonly User[]
}

const state: State = {
  users: [{ name: 'Alice' }]
}

state.users.push({ name: 'Bob' }) // ❌
state.users = [] // ❌
```

### 3. 使用 const assertion

```typescript
// ❌ 类型被推断为 string[]
const colors = ['red', 'green', 'blue']

// ✅ 类型被推断为 readonly ['red', 'green', 'blue']
const colors = ['red', 'green', 'blue'] as const
```

---

## 总结

TypeScript 的高级特性能够：

* ✅ 提供更严格的类型安全
* ✅ 改善代码可维护性
* ✅ 增强开发体验（IDE 提示）
* ✅ 减少运行时错误

掌握这些技巧，让你的 TypeScript 代码更加健壮和优雅！

---

*相关文章：*

* Vue 3 + TypeScript 实战
* 使用 Zod 进行运行时验证
* TypeScript 性能优化指南
