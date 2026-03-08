# OMOPLUS

> 增强版 OpenCode 插件，提供接待员 Agent 以获得更好的用户体验和更高的成本效益

[![npm version](https://img.shields.io/npm/v/omoplus?color=369eff&labelColor=black&logo=npm&style=flat-square)](https://www.npmjs.com/package/omoplus)
[![GitHub Release](https://img.shields.io/github/v/release/jcy321/OMOPLUS?color=369eff&labelColor=black&logo=github&style=flat-square)](https://github.com/jcy321/OMOPLUS/releases)
[![License](https://img.shields.io/badge/license-SUL--1.0-white?labelColor=black&style=flat-square)](https://github.com/jcy321/OMOPLUS/blob/main/LICENSE.md)

[English](README.md) | [简体中文](README.zh-cn.md) | [日本語](README.ja.md) | [한국어](README.ko.md)

---

## 1. 背景与目的

### 问题所在

[Oh My OpenCode (OMO)](https://github.com/code-yeongyu/oh-my-opencode) 是一个优秀的 OpenCode 插件，提供了强大的多 Agent 编排能力。然而，我们在使用过程中发现了两个关键问题：

1. **Token 消耗高**：OMO 使用 Sisyphus（顶级推理模型）作为默认 Agent。虽然功能强大，但即使是"2+2等于几？"这样的简单交互也会产生显著的 token 成本。

2. **学习曲线陡峭**：OMO 假设用户是能够精确表达需求的熟练开发者。新用户常常因为需求模糊而不知所措，不知道如何有效利用系统。

### 我们的解决方案

OMOPLUS 引入了**"编程外包公司"**模型：

```
用户（客户）
    ↓
Receptionist（前台接待）← 默认 Agent，低成本模型
    ↓
Sisyphus（总经理）← 仅在需要时激活
    ↓
Prometheus（顾问）← 需求分析
    ↓
Agent 团队（开发者）← Hephaestus、explore、librarian 等
    ↓
Secretary（秘书）← 结果汇总、异常处理
    ↓
Sisyphus（最终确认）
```

### 新 Agent 设计理念

#### Receptionist Agent：友好的把关人

**设计理念**：在 OMO 中，用户直接进入 Sisyphus 的复杂编排系统。这对不知道有哪些 Agent 可用或如何有效表达请求的新手来说是难以承受的。

**Receptionist 如何帮助用户**：
- **引导式入门**：用户不再面对空白状态，而是收到友好的问候："你好！我是 Receptionist。今天想做什么？"
- **复杂度评估**：Receptionist 评估任务是否需要 Sisyphus 的编排，还是可以直接处理
- **智能路由**：简单查询（"修复 README 中的拼写错误"）直接执行；复杂任务（"重构认证系统"）升级到 Sisyphus
- **用户教育**：Receptionist 解释正在发生什么："这是一个复杂任务，我将移交给我们的技术负责人 Sisyphus。"

**用户体验改善**：用户不再感到迷茫。他们有清晰的入口点，能理解系统的行为。

#### Secretary Agent：沉默的协调者

**设计理念**：在 OMO 中，Sisyphus 主动轮询后台任务以检查其状态。这会产生不必要的 token 消耗，而且 Sisyphus 频繁报告中间进度会让用户感到"嘈杂"。

**Secretary 如何帮助用户**：
- **结果聚合**：Secretary 收集所有工作 Agent（explore、librarian、Hephaestus 等）的输出
- **异常检测**：识别失败的任务、超时和不一致，无需打扰 Sisyphus
- **结构化摘要**：仅在所有任务完成或需要干预时，向 Sisyphus 呈现清晰、有组织的报告
- **降噪**：Sisyphus 不再发出"任务 X 仍在运行..."的消息

**用户体验改善**：用户获得更清晰、更专注的交互。Sisyphus 仅在有意义的决策时出现，而非状态更新。

#### 与 OMO 对比

| 方面 | OMO | OMOPLUS |
|------|-----|---------|
| **首次交互** | 直接进入 Sisyphus（可能令人畏惧） | Receptionist 引导你（友好且亲切） |
| **简单任务** | 完整编排开销 | 直接执行，最小仪式感 |
| **后台任务** | Sisyphus 频繁轮询 | Secretary 静默聚合 |
| **状态更新** | 频繁的中间报告 | 清晰的最终摘要 |
| **学习曲线** | 陡峭（必须理解所有 Agent） | 平缓（Receptionist 按需解释） |
| **错误处理** | Sisyphus 处理所有异常 | Secretary 分类并仅升级关键问题 |

**核心优势**：
- 🎯 **成本降低 90%**：日常交互使用低成本模型，复杂决策使用高级模型
- 🚀 **更好的用户体验**：从模糊需求到明确方案的引导式需求收集
- 🔄 **智能升级**：自动复杂度检测和 Agent 路由

---

## 2. 开发日志

### 阶段 0：基础设施（2026 年 3 月 8 日）

我们从 OMO v3.11.0 开始分叉，理解其架构：

- 1268 个 TypeScript 文件，160k+ 行代码
- 11 个内置 Agent，采用工厂模式
- 46 个生命周期 Hook，分 5 层
- 26 个工具，配有完善的注册系统

关键发现：OMO 使用 `config-handler.ts` 设置 `default_agent = "sisyphus"`。这是我们主要的修改目标。

### 阶段 1：新增 Agent（2026 年 3 月 8 日）

按照 OMO 的工厂模式创建了两个新 Agent：

**Receptionist Agent** (`src/agents/receptionist.ts`)：
- 模式：`primary`（可作为默认）
- 角色：第一接触点，复杂度评估
- 成本：CHEAP（使用经济型模型）

**Secretary Agent** (`src/agents/secretary.ts`)：
- 模式：`subagent`（内部协调者）
- 角色：汇总结果，处理异常
- 防止 Sisyphus 频繁轮询

### 阶段 2：基础设施（2026 年 3 月 8 日）

构建 `secretary-queue` 特性模块：
- `SecretaryQueueManager`：结果排队和汇总
- 异常检测和报告
- 结构化摘要生成

### 阶段 3：独立化（2026 年 3 月 8 日）

**关键决策**：OMOPLUS 需要独立配置以与 OMO 共存。

更改所有引用：
| 原版 | OMOPLUS |
|------|---------|
| `oh-my-opencode.json` | `omoplus.json` |
| `oh-my-opencode.log` | `omoplus.log` |
| `oh-my-opencode.schema.json` | `omoplus.schema.json` |

这使用户可以独立运行两个插件而不产生冲突。

### 发布时间线

- **v0.0.1**（2026 年 3 月 8 日）：初始版本，包含 Receptionist 和 Secretary
- **v0.0.2**（2026 年 3 月 8 日）：独立配置系统

---

## 3. 许可与归属

### 基于 Oh My OpenCode

OMOPLUS 是基于 [@code-yeongyu](https://github.com/code-yeongyu) 开发的 [Oh My OpenCode](https://github.com/code-yeongyu/oh-my-opencode) 的二次开发项目。

### 许可证

OMOPLUS 继承与 OMO 相同的许可证：**SUL-1.0（源代码使用许可证 1.0）**

主要条款：
- ✅ 免费使用、修改和分发
- ✅ 允许商业用途
- ✅ 鼓励二次开发
- ❌ 不提供担保
- ❌ 必须保留原始许可证和归属声明

### 我们的更改

1. 新增两个 Agent：`receptionist` 和 `secretary`
2. 创建 `secretary-queue` 特性模块
3. 将默认 Agent 从 `sisyphus` 改为 `receptionist`
4. 重命名配置文件以实现独立
5. 更新包品牌为 OMOPLUS

所有核心功能（hooks、tools、MCPs、其他 agents）均来自 OMO。

---

## 4. 配置指南

### 安装

```bash
npm install omoplus
# 或
bun add omoplus
```

### 在 OpenCode 中启用

添加到 `~/.config/opencode/opencode.json`：

```json
{
  "plugin": ["omoplus"]
}
```

### 配置文件

创建 `~/.config/opencode/omoplus.json`：

```json
{
  "$schema": "https://raw.githubusercontent.com/jcy321/OMOPLUS/main/assets/omoplus.schema.json",
  
  "agents": {
    "receptionist": {
      "model": "anthropic/claude-haiku-4-5",
      "temperature": 0.3,
      "description": "前台接待 Agent - 用户交互的第一接触点"
    },
    "secretary": {
      "model": "anthropic/claude-sonnet-4-5",
      "temperature": 0.2,
      "description": "秘书 Agent - 汇总结果和处理异常"
    },
    "sisyphus": {
      "model": "anthropic/claude-opus-4-5",
      "temperature": 0.3,
      "description": "主编排器 - 复杂任务时激活"
    }
  }
}
```

### 配置选项

#### Agent 配置

| 字段 | 类型 | 描述 |
|------|------|------|
| `model` | string | 模型 ID，格式为 `provider/model` |
| `temperature` | number | 采样温度（0-2） |
| `description` | string | Agent 描述，显示在 UI 中 |
| `variant` | string | 模型变体（如 "high"、"medium"） |
| `prompt_append` | string | 附加到系统提示的额外指令 |

#### Receptionist 专属设置

Receptionist Agent 判断任务复杂度并进行路由：

```json
{
  "agents": {
    "receptionist": {
      "model": "your-preferred-model",
      "temperature": 0.3,
      "prompt_append": "特定领域的额外指令..."
    }
  }
}
```

#### Secretary 专属设置

Secretary 汇总来自工作 Agent 的结果：

```json
{
  "agents": {
    "secretary": {
      "model": "your-preferred-model",
      "temperature": 0.2
    }
  }
}
```

### 项目级配置

你也可以在项目目录中创建 `.opencode/omoplus.json` 进行项目特定设置：

```json
{
  "agents": {
    "receptionist": {
      "model": "project-specific-model"
    }
  }
}
```

### 禁用 Agent

要禁用 Receptionist 并使用 Sisyphus 作为默认：

```json
{
  "disabled_agents": ["receptionist"]
}
```

### 完整配置示例

```json
{
  "$schema": "https://raw.githubusercontent.com/jcy321/OMOPLUS/main/assets/omoplus.schema.json",
  
  "sisyphus_agent": {
    "disabled": false,
    "default_builder_enabled": true,
    "planner_enabled": true
  },
  
  "agents": {
    "receptionist": {
      "model": "anthropic/claude-haiku-4-5",
      "temperature": 0.3,
      "description": "前台接待 Agent - 第一接触点"
    },
    "secretary": {
      "model": "anthropic/claude-sonnet-4-5",
      "temperature": 0.2,
      "description": "秘书 - 结果汇总"
    },
    "sisyphus": {
      "model": "anthropic/claude-opus-4-5",
      "temperature": 0.3
    },
    "oracle": {
      "model": "openai/gpt-5.2",
      "temperature": 0.2
    },
    "librarian": {
      "model": "google/gemini-3-flash",
      "temperature": 0.3
    },
    "explore": {
      "model": "xai/grok-code-fast-1",
      "temperature": 0.3
    }
  },
  
  "categories": {
    "quick": {
      "model": "anthropic/claude-haiku-4-5",
      "temperature": 0.3,
      "description": "简单任务"
    },
    "ultrabrain": {
      "model": "anthropic/claude-opus-4-5",
      "temperature": 0.2,
      "description": "复杂推理任务"
    }
  }
}
```

---

## 5. 致谢与邀请

### 感谢

我们向以下人员致以最深切的感谢：

- **[@code-yeongyu](https://github.com/code-yeongyu)** - [Oh My OpenCode](https://github.com/code-yeongyu/oh-my-opencode) 的创造者，其优秀的架构使这次二次开发成为可能
- **OpenCode 团队** - 构建了一个可扩展、强大的 AI 编程助手
- **开源社区** - 提供工具、库和灵感

### 为什么我们分叉

我们分叉 OMO 不是因为它有所欠缺，而是因为我们看到了机会：
1. 为预算敏感的用户降低成本
2. 改善新用户的入门体验
3. 探索 Agent 编排的不同设计理念

### 加入我们

我们欢迎社区贡献！

**贡献方式**：
- 🐛 通过 [GitHub Issues](https://github.com/jcy321/OMOPLUS/issues) 报告 bug
- 💡 提出功能建议或改进
- 🔧 提交 pull request
- 📖 改进文档
- 🌍 帮助翻译

**开始开发**：
```bash
git clone https://github.com/jcy321/OMOPLUS.git
cd OMOPLUS
bun install
bun run build
```

**开发命令**：
```bash
bun run typecheck    # 类型检查
bun run build        # 构建项目
bun test             # 运行测试
```

### 社区

- **GitHub**: [jcy321/OMOPLUS](https://github.com/jcy321/OMOPLUS)
- **npm**: [omoplus](https://www.npmjs.com/package/omoplus)

---

## 许可证

SUL-1.0 - 详见 [LICENSE.md](LICENSE.md)

---

<p align="center">
  <strong>OMOPLUS</strong> - 让 AI 辅助开发更易获取、更具成本效益。
</p>

<p align="center">
  基于 <a href="https://github.com/code-yeongyu/oh-my-opencode">Oh My OpenCode</a> 用心构建
</p>