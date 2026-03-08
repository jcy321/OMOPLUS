# OMOPLUS

> 더 나은 UX와 비용 효율성을 위한 Receptionist Agent 탑재 OpenCode 플러그인

[![npm version](https://img.shields.io/npm/v/omoplus?color=369eff&labelColor=black&logo=npm&style=flat-square)](https://www.npmjs.com/package/omoplus)
[![GitHub Release](https://img.shields.io/github/v/release/jcy321/OMOPLUS?color=369eff&labelColor=black&logo=github&style=flat-square)](https://github.com/jcy321/OMOPLUS/releases)
[![License](https://img.shields.io/badge/license-SUL--1.0-white?labelColor=black&style=flat-square)](https://github.com/jcy321/OMOPLUS/blob/main/LICENSE.md)

[English](README.md) | [简体中文](README.zh-cn.md) | [日本語](README.ja.md) | [한국어](README.ko.md)

---

## 1. 배경 및 목적

### 문제점

[Oh My OpenCode (OMO)](https://github.com/code-yeongyu/oh-my-opencode)는 강력한 멀티 에이전트 오케스트레이션 기능을 제공하는 훌륭한 OpenCode 플러그인입니다. 그러나 사용 중 두 가지 핵심 문제를 발견했습니다:

1. **높은 토큰 소비**: OMO는 Sisyphus(최상위 추론 모델)를 기본 에이전트로 사용합니다. 강력하지만 "2+2는?" 같은 단순한 상호작용에도 상당한 토큰 비용이 발생합니다.

2. **가파른 학습 곡선**: OMO는 사용자가 자신의 요구를 정확히 표현할 수 있는 숙련된 개발자라고 가정합니다. 신규 사용자는 모호한 요구사항으로 어려움을 겪고 시스템을 효과적으로 활용하는 방법을 모르는 경우가 많습니다.

### 우리의 솔루션

OMOPLUS는 **"프로그래밍 아웃소싱 회사"** 모델을 도입했습니다:

```
사용자 (클라이언트)
    ↓
Receptionist (접수처) ← 기본 에이전트, 저비용 모델
    ↓
Sisyphus (관리자) ← 필요시에만 활성화
    ↓
Prometheus (컨설턴트) ← 요구사항 분석
    ↓
에이전트 팀 (개발자) ← Hephaestus, explore, librarian 등
    ↓
Secretary (비서) ← 결과 집계, 예외 처리
    ↓
Sisyphus (최종 확인)
```

**주요 이점**:
- 🎯 **90% 비용 절감**: 일상적인 상호작용에는 저비용 모델, 복잡한 결정에는 프리미엄 모델
- 🚀 **더 나은 UX**: 모호한 아이디어에서 명확한 계획까지 안내식 요구사항 수집
- 🔄 **스마트 에스컬레이션**: 자동 복잡도 감지 및 에이전트 라우팅

---

## 2. 개발 여정

### 0단계: 기반 (2026년 3월 8일)

OMO v3.11.0을 포크하여 아키텍처 이해부터 시작:

- 1268개의 TypeScript 파일, 160k+ 라인의 코드
- 팩토리 패턴을 가진 11개의 내장 에이전트
- 5계층의 46개 라이프사이클 훅
- 정교한 등록 시스템을 가진 26개의 도구

핵심 발견: OMO는 `config-handler.ts`에서 `default_agent = "sisyphus"`를 설정. 이것이 주요 수정 대상이었습니다.

### 1단계: 새로운 에이전트 (2026년 3월 8일)

OMO의 팩토리 패턴을 따라 두 개의 새로운 에이전트 생성:

**Receptionist Agent** (`src/agents/receptionist.ts`):
- 모드: `primary` (기본값 가능)
- 역할: 첫 번째 접점, 복잡도 평가
- 비용: CHEAP (경제적인 모델 사용)

**Secretary Agent** (`src/agents/secretary.ts`):
- 모드: `subagent` (내부 조정자)
- 역할: 결과 집계, 예외 처리
- Sisyphus의 빈번한 폴링 방지

### 2단계: 인프라 (2026년 3월 8일)

`secretary-queue` 기능 모듈 구축:
- `SecretaryQueueManager`: 결과 대기열 및 집계
- 예외 감지 및 보고
- 구조화된 요약 생성

### 3단계: 독립화 (2026년 3월 8일)

**중요한 결정**: OMOPLUS는 OMO와 공존하기 위해 독자적인 설정이 필요.

모든 참조 변경:
| 원본 | OMOPLUS |
|------|---------|
| `oh-my-opencode.json` | `omoplus.json` |
| `oh-my-opencode.log` | `omoplus.log` |
| `oh-my-opencode.schema.json` | `omoplus.schema.json` |

이를 통해 사용자는 충돌 없이 두 플러그인을 독립적으로 실행할 수 있습니다.

### 릴리스 타임라인

- **v0.0.1** (2026년 3월 8일): Receptionist와 Secretary를 탑재한 초기 릴리스
- **v0.0.2** (2026년 3월 8일): 독립적인 설정 시스템

---

## 3. 라이선스 및 귀속

### Oh My OpenCode 기반

OMOPLUS는 [@code-yeongyu](https://github.com/code-yeongyu)의 [Oh My OpenCode](https://github.com/code-yeongyu/oh-my-opencode)를 기반으로 한 2차 개발입니다.

### 라이선스

OMOPLUS는 OMO와 동일한 라이선스를 상속합니다: **SUL-1.0 (소스 사용 라이선스 1.0)**

주요 조항:
- ✅ 무료 사용, 수정 및 배포 가능
- ✅ 상업적 사용 허용
- ✅ 2차 개발 장려
- ❌ 보증 없음
- ❌ 원본 라이선스 및 귀속 유지 필수

### 변경 사항

1. 두 개의 새로운 에이전트 추가: `receptionist`와 `secretary`
2. `secretary-queue` 기능 모듈 생성
3. 기본 에이전트를 `sisyphus`에서 `receptionist`로 변경
4. 독립성을 위한 설정 파일명 변경
5. 패키지 브랜딩을 OMOPLUS로 업데이트

모든 핵심 기능(훅, 도구, MCP, 기타 에이전트)은 OMO에서 상속.

---

## 4. 설정 가이드

### 설치

```bash
npm install omoplus
# 또는
bun add omoplus
```

### OpenCode에서 활성화

`~/.config/opencode/opencode.json`에 추가:

```json
{
  "plugin": ["omoplus"]
}
```

### 설정 파일

`~/.config/opencode/omoplus.json` 생성:

```json
{
  "$schema": "https://raw.githubusercontent.com/jcy321/OMOPLUS/main/assets/omoplus.schema.json",
  
  "agents": {
    "receptionist": {
      "model": "anthropic/claude-haiku-4-5",
      "temperature": 0.3,
      "description": "접수 에이전트 - 사용자와의 첫 번째 접점"
    },
    "secretary": {
      "model": "anthropic/claude-sonnet-4-5",
      "temperature": 0.2,
      "description": "비서 에이전트 - 결과 집계 및 예외 처리"
    },
    "sisyphus": {
      "model": "anthropic/claude-opus-4-5",
      "temperature": 0.3,
      "description": "메인 오케스트레이터 - 복잡한 작업에서 활성화"
    }
  }
}
```

### 설정 옵션

#### 에이전트 설정

| 필드 | 타입 | 설명 |
|-----|------|------|
| `model` | string | `provider/model` 형식의 모델 ID |
| `temperature` | number | 샘플링 온도 (0-2) |
| `description` | string | UI에 표시되는 에이전트 설명 |
| `variant` | string | 모델 변형 (예: "high", "medium") |
| `prompt_append` | string | 시스템 프롬프트에 추가할 명령 |

### 프로젝트 수준 설정

프로젝트 디렉토리에 `.opencode/omoplus.json`을 생성하여 프로젝트별 설정 가능:

```json
{
  "agents": {
    "receptionist": {
      "model": "project-specific-model"
    }
  }
}
```

### 에이전트 비활성화

Receptionist를 비활성화하고 Sisyphus를 기본으로 사용:

```json
{
  "disabled_agents": ["receptionist"]
}
```

---

## 5. 감사 및 초대

### 감사의 말

다음 분들께 깊은 감사를 드립니다:

- **[@code-yeongyu](https://github.com/code-yeongyu)** - [Oh My OpenCode](https://github.com/code-yeongyu/oh-my-opencode)의 창작자, 훌륭한 아키텍처로 이 2차 개발이 가능했습니다
- **OpenCode 팀** - 확장 가능하고 강력한 AI 코딩 어시스턴트 구축
- **오픈 소스 커뮤니티** - 도구, 라이브러리, 영감 제공

### 왜 포크했나요

우리가 OMO를 포크한 것은 부족해서가 아니라 기회를 보았기 때문입니다:
1. 예산을 중시하는 사용자의 비용 절감
2. 신규 사용자의 온보딩 경험 개선
3. 에이전트 오케스트레이션의 다른 설계 철학 탐구

### 함께해주세요

커뮤니티의 기여를 환영합니다!

**기여 방법**:
- 🐛 [GitHub Issues](https://github.com/jcy321/OMOPLUS/issues)를 통해 버그 보고
- 💡 기능이나 개선 제안
- 🔧 풀 리퀘스트 제출
- 📖 문서 개선
- 🌍 번역 협력

**개발 시작**:
```bash
git clone https://github.com/jcy321/OMOPLUS.git
cd OMOPLUS
bun install
bun run build
```

**개발 명령어**:
```bash
bun run typecheck    # 타입 체크
bun run build        # 프로젝트 빌드
bun test             # 테스트 실행
```

### 커뮤니티

- **GitHub**: [jcy321/OMOPLUS](https://github.com/jcy321/OMOPLUS)
- **npm**: [omoplus](https://www.npmjs.com/package/omoplus)

---

## 라이선스

SUL-1.0 - 자세한 내용은 [LICENSE.md](LICENSE.md) 참조

---

<p align="center">
  <strong>OMOPLUS</strong> - AI 지원 개발을 더 쉽게, 더 경제적으로.
</p>

<p align="center">
  <a href="https://github.com/code-yeongyu/oh-my-opencode">Oh My OpenCode</a>를 기반으로 ❤️를 담아 구축
</p>