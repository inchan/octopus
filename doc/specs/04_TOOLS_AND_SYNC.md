# 04. Tools & Sync Spec

**Status**: Draft
**Phase**: Phase 4 & 5

이 문서는 "Tools" 및 "Sync" 메뉴의 구성과 동작 방식을 정의합니다.

## 1. Menu Structure (전체 메뉴 구성)

1. **Tools**
2. **Sync**
3. **Rules**
4. **Mcp Servers**
5. **Projects**
6. **Logs**
7. **Settings**

---

## 2. Menu Details: Tools

시스템에 설치된 도구(Tool)들을 관리하고, 전역(Global) 및 개별 설정을 확인하는 화면입니다.

### 2.1 UI 구성
1.  **Card Grid View**: 모든 Tool은 카드(Card) 형태의 그리드로 나열됩니다.
2.  **Card Information**:
    -   **이름 (Name)**
    -   **설명 (Description)**
    -   **공식 사이트 아이콘** (있을 경우 표시)
    -   **공식 저장소 아이콘** (있을 경우 표시)
    -   **Rule 설정 버튼**: 현재 적용된 Rule을 보여주고 변경 가능.
    -   **MCP Server 설정 버튼**: 현재 적용된 MCP Server를 보여주고 변경 가능.
    -   **설치됨 표시 (Indicator)**: 초록색(설치됨) / 회색(미설치) 동그라미.

### 2.2 정렬 및 순서 (Sorting & Order)
1.  **Global Tool**: 가장 첫 번째 카드는 항상 **전체(Global)** 전역 설정 카드입니다.
2.  **Order Logic**: Global 이후의 도구들은 다음 우선순위로 정렬되며 서브 순서는 변경 불가능합니다.
    -   `Installation Status` (설치됨 우선) > `Category` (CLI > IDE > Desktop)

### 2.3 기능 상세 (Features)
-   **Rule 설정**:
    -   버튼 클릭 시 현재 설정된 전역 Rule(Global Rule)을 표시합니다.
    -   사용 가능한 **Rules 리스트**에서 선택하여 변경할 수 있습니다.
    -   변경 시 **즉시 적용**됩니다.
-   **MCP Server 설정**:
    -   버튼 클릭 시 현재 설정된 전역 MCP Server 구성을 표시합니다.
    -   사용 가능한 **MCP Server Set**에서 선택하거나, 개별 Server를 추가/제거할 수 있습니다.
    -   변경 시 **즉시 적용**됩니다.
-   **카드 편집**:
    -   Global 카드를 제외한 모든 개별 Tool 카드는 **편집**이 가능해야 합니다.

---

## 3. Menu Details: Sync

설정된 Tool Set, Rule Set, MCP Server Set을 조합하여 동기화(Sync)를 수행하는 화면입니다.

### 3.1 구성 요소 (Components)

#### A. Tool Set
1.  **기본 셋 (Default Sets)**: 다음 셋은 기본적으로 생성되며 삭제할 수 없습니다.
    -   `All Tools`
    -   `CLI Tools`
    -   `IDE Tools`
    -   `Desktop Apps`
2.  **커스텀 셋 (Custom Sets)**:
    -   새로운 Tool Set을 추가할 수 있습니다.
    -   추가된 Custom Tool Set은 편집 및 삭제가 가능합니다.
3.  **동작**:
    -   Tool Set을 선택하면 하위의 **Rules Set 리스트**와 **Mcp Server Set 리스트**가 선택 가능한 상태가 됩니다.

#### B. Rules Set
1.  **None 옵션**: 리스트 최상위에 `None`(선택 안 함)이 존재합니다.
2.  **리스트**: 생성된 모든 Rules Set(Rules)을 불러와 선택할 수 있게 합니다.

#### C. Mcp Server Set
1.  **None 옵션**: 리스트 최상위에 `None`(선택 안 함)이 존재합니다.
2.  **리스트**: 생성된 모든 Mcp Server Set을 불러와 선택할 수 있게 합니다.

### 3.2 동기화 동작 (Sync Workflow)
1.  **Activation**:
    -   Tool Set을 선택하고 -> Rule Set과 Mcp Server Set을 각각 선택합니다.
    -   Rule Set과 Mcp Server Set 중 **하나라도 `None`이 아닐 경우** 동기화 버튼이 활성화됩니다.
2.  **버튼 동작**:
    -   동기화 버튼은 기본적으로 **전역(Global)** 맥락에서 동작합니다.
    -   **Overwrite 전략**이 기본값으로 선택되어 있습니다.
3.  **전략 (Strategies)**:
    -   **쓰기 전략 (Write Strategy)**: `Overwrite` (덮어쓰기), `Smart Update` (지능형 업데이트)를 지원합니다.
    -   **백업 및 히스토리**: 동기화 실행 시 **자동으로 백업**되며 히스토리가 기록됩니다 (기본 전략).
