---
subtitle:  NixOS
date:  2026-01-13
---


# NixOS 入门介绍

> 一篇面向开发者与 Linux 爱好者的 NixOS 基础介绍

---

## 什么是 NixOS

**NixOS** 是一个基于 Linux 内核、以 **Nix 包管理器** 为核心构建的声明式 Linux 发行版。与传统发行版（如 Ubuntu、Arch Linux）最大的不同在于：

* 系统配置是 **声明式** 的，而不是命令式的
* 系统状态是 **可复现的、可回滚的**
* 软件安装、系统配置、服务管理都由同一套机制统一描述

一句话概括：

> **NixOS 把整个操作系统当作一个可构建、可版本化的“程序”。**

---

## Nix 包管理器的核心思想

NixOS 的基础是 **Nix**，它并不仅仅是一个包管理器，而是一套完整的软件构建与依赖管理系统。

### 1. 纯函数式构建

在 Nix 的世界里：

* 每个软件包都是一个“纯函数”
* 构建结果只取决于输入（源码 + 依赖）
* 不依赖系统全局状态

因此，只要输入一致，输出就一定一致。

### 2. /nix/store：不可变的软件仓库

所有软件都会被安装到：

```
/nix/store/<hash>-<package-name>-<version>
```

特点：

* 不可变（immutable）
* 不同版本可以并存
* 不会发生“库被覆盖”“升级破坏环境”的问题

---

## NixOS 的声明式系统配置

在传统发行版中，系统配置通常通过一系列命令完成，例如：

```bash
apt install nginx
systemctl enable nginx
vim /etc/nginx/nginx.conf
```

而在 NixOS 中，你只需要**描述你想要的最终状态**。

### configuration.nix 示例

```nix
{ config, pkgs, ... }:

{
  networking.hostName = "nixos";

  time.timeZone = "Asia/Shanghai";

  users.users.lin = {
    isNormalUser = true;
    extraGroups = [ "wheel" "networkmanager" ];
  };

  environment.systemPackages = with pkgs; [
    vim
    git
    curl
  ];

  services.openssh.enable = true;
}
```

执行：

```bash
sudo nixos-rebuild switch
```

系统就会自动：

* 安装所需软件
* 创建用户
* 启用服务
* 应用配置

---

## 可回滚（Rollback）是 NixOS 的杀手级特性

每一次 `nixos-rebuild` 都会生成一个新的 **系统世代（generation）**。

如果你：

* 更新系统后无法启动
* 改坏了配置文件
* 驱动升级翻车

你可以在 **启动菜单中一键回滚** 到任意一个历史版本。

这使得 NixOS 非常适合：

* 服务器
* 开发机
* 对稳定性要求极高的生产环境

---

## Flakes：新一代 Nix 配置方式

**Flakes** 是 Nix 生态中逐渐成为主流的配置与分发标准。

它的优势包括：

* 明确的输入（inputs）和输出（outputs）
* 自动锁定依赖版本（flake.lock）
* 更适合多人协作和长期维护

### flake.nix 示例

```nix
{
  description = "My NixOS system";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-24.05";
  };

  outputs = { self, nixpkgs }: {
    nixosConfigurations.myhost = nixpkgs.lib.nixosSystem {
      system = "x86_64-linux";
      modules = [ ./configuration.nix ];
    };
  };
}
```

Flakes 让 NixOS 更像一个：

> **可复现、可分享、可版本控制的基础设施项目**

---

## NixOS 的优缺点

### 优点

* ✅ 系统高度可复现
* ✅ 天然支持回滚
* ✅ 不会“装着装着就坏掉”
* ✅ 非常适合 DevOps / Infra / Server

### 缺点

* ❌ 学习曲线陡峭
* ❌ 文档分散（但在不断改善）
* ❌ 与传统 Linux 思维差异较大

---

## 谁适合使用 NixOS

NixOS 非常适合以下人群：

* 开发者（尤其是多语言、多项目环境）
* DevOps / SRE
* 想要**完全掌控系统状态**的人
* 厌倦了“环境崩坏”的 Linux 用户

如果你追求的是：

> **稳定、可控、可复现，而不是“即装即用”**

那么 NixOS 值得你投入时间学习。

---

## 结语

NixOS 并不是一款“轻松”的发行版，但它在理念和工程实现上都极具前瞻性。

一旦你理解并接受了它的思维方式，你会发现：

> 维护系统，本就应该像维护代码一样。

---

*后续文章计划：*

* NixOS 安装与磁盘分区实践
* 从零构建你的第一个 flake
* 用 Rust 编写 NixOS TUI 配置生成器
