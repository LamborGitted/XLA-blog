---
subtitle:  Rust 所有权系统
date:  2026-01-17
---

# Rust 所有权系统深度解析

> 理解 Rust 最核心也最独特的特性

---

## 什么是所有权

所有权（Ownership）是 Rust 最独特的特性，它让 Rust 无需垃圾回收（GC）就能保证内存安全。

### 三条核心规则

1. **每个值都有一个所有者（owner）**
2. **一个值同时只能有一个所有者**
3. **当所有者离开作用域，值被丢弃**

```rust
{
    let s = String::from("hello"); // s 是所有者
    // 使用 s
} // s 离开作用域，内存被自动释放
```

---

## 栈与堆

理解所有权的首要前提是理解栈（Stack）和堆（Heap）：

| 栈 (Stack) | 堆 (Heap) |
|-----------|----------|
| 固定大小 | 可变大小 |
| 分配速度快 | 分配速度较慢 |
| LIFO 访问模式 | 任意访问 |
| 编译时确定大小 | 运行时分配 |

```rust
// 栈分配
let x: i32 = 5;
let y: i32 = 10;

// 堆分配
let s: String = String::from("hello");
// ↑ 在栈上存储指针、长度、容量
//   实际数据在堆上
```

---

## 移动语义（Move Semantics）

### 变量绑定

```rust
let s1 = String::from("hello");
let s2 = s1; // s1 的所有权移动到 s2

// println!("{}", s1); // ❌ 编译错误：s1 已失效
println!("{}", s2); // ✅
```

为什么？因为 String 包含：
* 指向堆数据的指针
* 长度
* 容量

如果简单复制，会导致双重释放（double free）！

### 函数调用中的移动

```rust
fn main() {
    let s = String::from("hello");
    takes_ownership(s); // s 的所有权被移动
    // println!("{}", s); // ❌ s 不再有效
}

fn takes_ownership(some_string: String) {
    println!("{}", some_string);
} // some_string 被释放
```

---

## 克隆（Clone）

如果需要深度复制，使用 `clone()`：

```rust
let s1 = String::from("hello");
let s2 = s1.clone(); // 深拷贝

println!("{}", s1); // ✅
println!("{}", s2); // ✅
```

注意：`clone()` 可能很昂贵，因为涉及堆数据复制。

---

## 拷贝类型（Copy Types）

实现了 `Copy` trait 的类型在赋值时会自动拷贝：

```rust
let x: i32 = 5;
let y = x; // 拷贝，不是移动

println!("{}", x); // ✅ x 仍然有效
println!("{}", y); // ✅
```

哪些类型实现了 `Copy`？

* 所有整数类型
* 浮点类型
* 布尔类型
* 字符类型
* 元组（如果所有元素都是 Copy）
* 不可变引用 `&T`

**注意**：任何需要分配内存或某种资源的类型都不是 `Copy`。

---

## 引用与借用（References & Borrowing）

### 不可变引用

```rust
fn main() {
    let s1 = String::from("hello");
    let len = calculate_length(&s1); // 借用 s1

    println!("Length of '{}' is {}.", s1, len); // ✅ s1 仍然有效
}

fn calculate_length(s: &String) -> usize {
    s.len()
} // s 离开作用域，但因为它不拥有值，所以不会释放
```

### 可变引用

```rust
fn main() {
    let mut s = String::from("hello");
    change(&mut s);
}

fn change(some_string: &mut String) {
    some_string.push_str(", world");
}
```

### 引用规则

1. **同一作用域内，只能有一个可变引用**
2. **可以有多个不可变引用**
3. **不可变引用和可变引用不能同时存在**

```rust
let mut s = String::from("hello");

let r1 = &s;     // ✅
let r2 = &s;     // ✅
let r3 = &mut s; // ❌ 不能同时拥有可变和不可变引用

println!("{} and {}", r1, r2);
// r1, r2 不再使用后，可以创建可变引用
let r3 = &mut s; // ✅
```

这称为**非词法作用域生命周期（Non-Lexical Lifetimes, NLL）**。

---

## 悬垂引用（Dangling References）

Rust 编译器保证不会出现悬垂引用：

```rust
fn dangle() -> &String { // ❌ 编译错误
    let s = String::from("hello");
    &s // 返回指向 s 的引用，但 s 将被释放
}

// ✅ 正确做法：直接返回 String
fn no_dangle() -> String {
    let s = String::from("hello");
    s // s 的所有权被移动到调用者
}
```

---

## 生命周期（Lifetimes）

### 显式生命周期标注

```rust
fn longest<'a>(x: &'a str, y: &'a str) -> &'a str {
    if x.len() > y.len() {
        x
    } else {
        y
    }
}
```

`'a` 表示：返回的引用生命周期与输入参数中较短的那个相同。

### 结构体中的生命周期

```rust
struct ImportantExcerpt<'a> {
    part: &'a str,
}
```

### 生命周期省略规则

编译器在以下情况可以自动推断生命周期：

1. 每个引用参数都有自己的生命周期
2. 如果只有一个输入生命周期，它被赋予所有输出生命周期
3. 如果有多个输入生命周期，但其中一个是 `&self` 或 `&mut self`，那么 `self` 的生命周期被赋予所有输出生命周期

```rust
// 无需显式标注，编译器可以推断
fn first_word(s: &str) -> &str {
    let bytes = s.as_bytes();
    for (i, &item) in bytes.iter().enumerate() {
        if item == b' ' {
            return &s[0..i];
        }
    }
    &s[..]
}
```

---

## 'static 生命周期

`'static` 表示引用在整个程序运行期间都有效：

```rust
let s: &'static str = "I have a static lifetime.";
```

常见场景：
* 字符串字面量
* 全局常量
* 静态变量

---

## 智能指针

### Box<T>

堆分配，有单一所有者：

```rust
let b = Box::new(5);
println!("b = {}", b);
```

### Rc<T>

引用计数，允许多重所有权：

```rust
use std::rc::Rc;

let a = Rc::new(5);
let b = Rc::clone(&a); // 增加引用计数
let c = Rc::clone(&a); // 再次增加
```

### Arc<T>

线程安全的 `Rc`：

```rust
use std::sync::Arc;
use std::thread;

let a = Arc::new(5);
let a_clone = Arc::clone(&a);

thread::spawn(move || {
    println!("{}", a_clone);
}).join().unwrap();
```

---

## 总结

所有权的优势：

* ✅ 内存安全，无需 GC
* ✅ 防止数据竞争
* ✅ 编译时捕获错误
* ✅ 零成本抽象

所有权的代价：

* ❌ 学习曲线陡峭
* ❌ 初期开发速度较慢
* ❌ 需要理解生命周期

但一旦掌握，你会发现：

> Rust 让你写出既安全又高效的代码，而这在其他语言中往往难以兼得。

---

*继续学习：*

* Rust 并发编程
* Rust 异步编程：async/await
* 使用 Cargo 和 crates.io 生态
