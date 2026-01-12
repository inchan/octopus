# 아키텍처 및 개발 마스터 가이드 (Project Constitution)

이 문서는 프로젝트의 **"헌법(Constitution)"**입니다.
사람(Human Developer)과 AI(Agent) 모두 이 가이드에 정의된 규칙과 워크플로우를 따라야 합니다. 일관성은 타협할 수 없는 가치입니다.

---

## 1. 문서 지도 (Documentation Map)

모든 문서는 `doc/` 디렉토리 하위에 체계적으로 분류되어 있습니다.

### 🏛️ Core (불변의 법칙)
**위치**: `doc/core/`
프로젝트의 근간이 되는 원칙입니다. 함부로 수정할 수 없으며, 모든 코드 변경은 이 원칙을 준수해야 합니다.
- **[01_PRINCIPLES.md](core/01_PRINCIPLES.md)**: 핵심 철학 (Clean Architecture, TDD).
- **[02_STRUCTURE.md](core/02_STRUCTURE.md)**: 디렉토리 및 레이어 구조.
- **[03_WORKFLOW.md](core/03_WORKFLOW.md)**: 개발 절차.
- **[04_IPC_STANDARDS.md](core/04_IPC_STANDARDS.md)**: 보안 및 통신 표준.

### 📋 Specs (기획 및 명세)
**위치**: `doc/specs/`
우리가 무엇을 만들고 있는지 정의합니다.
- **[PRD.md](specs/PRD.md)**: 제품의 비전, 핵심 가치, 성공 지표.
- [Functional-Specification.md](specs/Functional-Specification.md): 상세 기능 명세 (메뉴, UI/UX 원칙, 시나리오).
- [ROADMAP.md](specs/ROADMAP.md): 개발 단계 및 일정 (Phase 1 ~ 7).
- [01~06 Spec Files](specs/): `01_FOUNDATION` ~ `06_TESTING` (구현 상세 스펙).

### ⚖️ ADRs (아키텍처 결정 기록)
**위치**: `doc/adrs/`
중요한 기술적 의사결정의 "과거, 현재, 미래"를 기록합니다.
- **[README.md](adrs/README.md)**: 결정 기록 목록.
- **[0000-template.md](adrs/0000-template.md)**: 결정 기록 양식.

---

## 2. 행동 강령 (Action Protocols)

우리는 **"강건한 성벽(Workflow System)"** 안에서 일합니다. AI 에이전트는 아래 커맨드를 통해 정의된 절차를 강제로 수행해야 합니다.

### 🚀 기능 구현 (Feature)
- **명령어**: `/feature`
- **절차**:
    1. **Core 문서 정독**: `01`, `02`, `03`번 문서를 반드시 읽습니다.
    2. **TDD (Red-Green-Refactor)**: 테스트 없는 코드는 작성하지 않습니다.
    3. **Architecture Check**: UI와 로직의 분리를 검증합니다.

### 🔧 버그 수정 (Fix)
- **명령어**: `/fix`
- **절차**:
    1. **재현 (Reproduction)**: 실패하는 테스트나 스크립트를 먼저 만듭니다.
    2. **원인 분석**: 추측하지 않고 근거를 찾습니다.
    3. **수정 및 검증**: 재현 스크립트가 통과함을 증명합니다.

### 🛠️ 리팩토링 (Refactor)
- **명령어**: `/refactor`
- **절차**:
    1. **안전 장치 확인**: 테스트가 없다면 리팩토링할 수 없습니다.
    2. **점진적 개선**: 기능을 변경하지 않고 구조만 개선합니다.

### 📝 의사결정 (Decision)
- **명령어**: `/adr`
- **절차**:
    1. **템플릿 준수**: Context(과거) -> Decision(현재) -> Consequences(미래) 구조를 따릅니다.
    2. **기록**: `doc/adrs/`에 영구 보존합니다.

---

## 3. 문서 관리 규칙 (Maintenance Rules)

1. **언어 (Language)**:
    - 모든 문서는 **한국어(Korean)**로 작성합니다.
    - 기술 용어는 원어(영어)를 병기하거나 그대로 사용할 수 있습니다.

2. **Core 문서 수정**:
    - `doc/core/` 하위 문서는 단순히 수정할 수 없습니다.
    - 수정이 필요한 경우, 반드시 **ADR**을 먼저 작성하여 합의된 결정임을 증명해야 합니다.

3. **최신화 의무**:
    - 코드가 변경되면 관련된 Spec 문서(`doc/specs/`)도 즉시 업데이트해야 합니다.
    - 문서는 죽은 기록이 아니라 살아있는 가이드여야 합니다.
