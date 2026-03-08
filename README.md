# OMOPLUS

> Enhanced OpenCode Plugin with Receptionist Agent for Better UX and Cost Efficiency

[![npm version](https://img.shields.io/npm/v/omoplus?color=369eff&labelColor=black&logo=npm&style=flat-square)](https://www.npmjs.com/package/omoplus)
[![GitHub Release](https://img.shields.io/github/v/release/jcy321/OMOPLUS?color=369eff&labelColor=black&logo=github&style=flat-square)](https://github.com/jcy321/OMOPLUS/releases)
[![License](https://img.shields.io/badge/license-SUL--1.0-white?labelColor=black&style=flat-square)](https://github.com/jcy321/OMOPLUS/blob/main/LICENSE.md)

[English](README.md) | [简体中文](README.zh-cn.md) | [日本語](README.ja.md) | [한국어](README.ko.md)

---

## 1. Background & Purpose

### The Problem

[Oh My OpenCode (OMO)](https://github.com/code-yeongyu/oh-my-opencode) is an excellent OpenCode plugin that provides powerful multi-agent orchestration capabilities. However, we identified two key issues during usage:

1. **High Token Consumption**: OMO uses Sisyphus (a top-tier reasoning model) as the default agent. While powerful, this leads to significant token costs even for simple interactions like "what is 2+2?".

2. **Steep Learning Curve**: OMO assumes users are experienced developers who can articulate their needs precisely. New users often struggle with vague requirements and don't know how to leverage the system effectively.

### Our Solution

OMOPLUS introduces a **"Programming Outsourcing Company"** model:

```
User (Client)
    ↓
Receptionist (Front Desk) ← Default Agent, Low-Cost Model
    ↓
Sisyphus (Manager) ← Activated only when needed
    ↓
Prometheus (Consultant) ← Requirement Analysis
    ↓
Agent Team (Developers) ← Hephaestus, explore, librarian, etc.
    ↓
Secretary (Assistant) ← Result Aggregation, Exception Handling
    ↓
Sisyphus (Final Confirmation)
```

**Key Benefits**:
- 🎯 **90% Cost Reduction**: Low-cost models for routine interactions, premium models for complex decisions
- 🚀 **Better UX**: Guided requirement collection from vague ideas to clear plans
- 🔄 **Smart Escalation**: Automatic complexity detection and agent routing

---

## 2. Development Journey

### Phase 0: Foundation (March 8, 2026)

We started by forking OMO v3.11.0 and understanding its architecture:

- 1268 TypeScript files, 160k+ lines of code
- 11 built-in agents with factory pattern
- 46 lifecycle hooks in 5 tiers
- 26 tools with sophisticated registration system

Key insight: OMO uses `config-handler.ts` to set `default_agent = "sisyphus"`. This was our primary modification target.

### Phase 1: New Agents (March 8, 2026)

Created two new agents following OMO's factory pattern:

**Receptionist Agent** (`src/agents/receptionist.ts`):
- Mode: `primary` (can be default)
- Role: First contact point, complexity assessment
- Cost: CHEAP (uses budget-friendly models)

**Secretary Agent** (`src/agents/secretary.ts`):
- Mode: `subagent` (internal coordinator)
- Role: Aggregate results, handle exceptions
- Prevents Sisyphus from polling repeatedly

### Phase 2: Infrastructure (March 8, 2026)

Built `secretary-queue` feature module:
- `SecretaryQueueManager`: Result queuing and aggregation
- Exception detection and reporting
- Structured summary generation

### Phase 3: Independence (March 8, 2026)

**Critical Decision**: OMOPLUS needed its own configuration to coexist with OMO.

Changed all references:
| Original | OMOPLUS |
|----------|---------|
| `oh-my-opencode.json` | `omoplus.json` |
| `oh-my-opencode.log` | `omoplus.log` |
| `oh-my-opencode.schema.json` | `omoplus.schema.json` |

This allows users to run both plugins independently without conflicts.

### Release Timeline

- **v0.0.1** (March 8, 2026): Initial release with Receptionist and Secretary
- **v0.0.2** (March 8, 2026): Independent configuration system

---

## 3. License & Attribution

### Based on Oh My OpenCode

OMOPLUS is a secondary development based on [Oh My OpenCode](https://github.com/code-yeongyu/oh-my-opencode) by [@code-yeongyu](https://github.com/code-yeongyu).

### License

OMOPLUS inherits the same license as OMO: **SUL-1.0 (Source Use License 1.0)**

Key terms:
- ✅ Free to use, modify, and distribute
- ✅ Commercial use permitted
- ✅ Secondary development encouraged
- ❌ No warranty provided
- ❌ Must retain original license and attribution

### What We Changed

1. Added two new agents: `receptionist` and `secretary`
2. Created `secretary-queue` feature module
3. Changed default agent from `sisyphus` to `receptionist`
4. Renamed configuration files for independence
5. Updated package branding to OMOPLUS

All core functionality (hooks, tools, MCPs, other agents) remains from OMO.

---

## 4. Configuration Guide

### Installation

```bash
npm install omoplus
# or
bun add omoplus
```

### Enable in OpenCode

Add to your `~/.config/opencode/opencode.json`:

```json
{
  "plugin": ["omoplus"]
}
```

### Configuration File

Create `~/.config/opencode/omoplus.json`:

```json
{
  "$schema": "https://raw.githubusercontent.com/jcy321/OMOPLUS/main/assets/omoplus.schema.json",
  
  "agents": {
    "receptionist": {
      "model": "anthropic/claude-haiku-4-5",
      "temperature": 0.3,
      "description": "Front desk agent - first contact point for user interactions"
    },
    "secretary": {
      "model": "anthropic/claude-sonnet-4-5",
      "temperature": 0.2,
      "description": "Secretary agent - aggregates results and handles exceptions"
    },
    "sisyphus": {
      "model": "anthropic/claude-opus-4-5",
      "temperature": 0.3,
      "description": "Main orchestrator - activated for complex tasks"
    }
  }
}
```

### Configuration Options

#### Agent Configuration

| Field | Type | Description |
|-------|------|-------------|
| `model` | string | Model ID in format `provider/model` |
| `temperature` | number | Sampling temperature (0-2) |
| `description` | string | Agent description shown in UI |
| `variant` | string | Model variant (e.g., "high", "medium") |
| `prompt_append` | string | Additional instructions appended to system prompt |

#### Receptionist-Specific Settings

The Receptionist agent determines task complexity and routes accordingly:

```json
{
  "agents": {
    "receptionist": {
      "model": "your-preferred-model",
      "temperature": 0.3,
      "prompt_append": "Additional domain-specific instructions..."
    }
  }
}
```

#### Secretary-Specific Settings

The Secretary aggregates results from worker agents:

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

### Project-Level Configuration

You can also create `.opencode/omoplus.json` in your project directory for project-specific settings:

```json
{
  "agents": {
    "receptionist": {
      "model": "project-specific-model"
    }
  }
}
```

### Disabling Agents

To disable the Receptionist and use Sisyphus as default:

```json
{
  "disabled_agents": ["receptionist"]
}
```

### Full Configuration Example

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
      "description": "Front desk agent - first contact point"
    },
    "secretary": {
      "model": "anthropic/claude-sonnet-4-5",
      "temperature": 0.2,
      "description": "Secretary - result aggregation"
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
      "description": "Simple tasks"
    },
    "ultrabrain": {
      "model": "anthropic/claude-opus-4-5",
      "temperature": 0.2,
      "description": "Complex reasoning tasks"
    }
  }
}
```

---

## 5. Acknowledgments & Invitation

### Thank You

We extend our deepest gratitude to:

- **[@code-yeongyu](https://github.com/code-yeongyu)** - Creator of [Oh My OpenCode](https://github.com/code-yeongyu/oh-my-opencode), whose excellent architecture made this secondary development possible
- **The OpenCode Team** - For building an extensible, powerful AI coding assistant
- **The Open Source Community** - For the tools, libraries, and inspiration

### Why We Forked

We forked OMO not because it was lacking, but because we saw an opportunity to:
1. Reduce costs for budget-conscious users
2. Improve the onboarding experience for new users
3. Explore different design philosophies in agent orchestration

### Join Us

We welcome contributions from the community!

**Ways to contribute**:
- 🐛 Report bugs via [GitHub Issues](https://github.com/jcy321/OMOPLUS/issues)
- 💡 Suggest features or improvements
- 🔧 Submit pull requests
- 📖 Improve documentation
- 🌍 Help with translations

**Getting started**:
```bash
git clone https://github.com/jcy321/OMOPLUS.git
cd OMOPLUS
bun install
bun run build
```

**Development commands**:
```bash
bun run typecheck    # Type checking
bun run build        # Build the project
bun test             # Run tests
```

### Community

- **GitHub**: [jcy321/OMOPLUS](https://github.com/jcy321/OMOPLUS)
- **npm**: [omoplus](https://www.npmjs.com/package/omoplus)

---

## 6. Roadmap

### Short-Term Goals

#### 6.1 Remote Robot Control (Inspired by OpenClow)

We plan to implement remote development capabilities:
- Telegram/Discord bot integration for remote commands
- Natural language to development task translation
- Real-time progress updates via messaging platforms

**Example workflow**:
```
User (Telegram): "Fix the bug in auth.ts that's causing login failures"
Bot: "Starting analysis... Found 3 potential issues. Creating fix..."
Bot: "PR created: https://github.com/..."
```

#### 6.2 Web Dashboard

A visualization dashboard for monitoring:
- Active sessions and their status
- Agent utilization and model usage
- Token consumption analytics
- Background task queue visualization

**Features**:
- Real-time session monitoring
- Agent activity timeline
- Cost tracking and budgeting
- Historical analytics

### Long-Term Vision

#### 6.3 Intelligent Model Selection

Automatic model selection based on:
- Task complexity analysis
- Budget constraints
- Time requirements
- Historical performance

#### 6.4 Multi-Language Support

Expand the Receptionist's natural language understanding:
- Support for non-English queries
- Cultural context awareness
- Localized error messages

#### 6.5 Plugin Ecosystem

Enable community extensions:
- Custom agent templates
- Domain-specific skills
- Integration with external services

---

## License

SUL-1.0 - See [LICENSE.md](LICENSE.md) for details.

---

<p align="center">
  <strong>OMOPLUS</strong> - Making AI-assisted development more accessible and cost-effective.
</p>

<p align="center">
  Built with ❤️ on top of <a href="https://github.com/code-yeongyu/oh-my-opencode">Oh My OpenCode</a>
</p>