# 05. Feature Spec: Stability & History (Phase 5)

**Status**: Draft
**Version**: 1.0

## 1. Goal
사용자의 데이터 안전성을 보장하기 위해 변경 이력을 기록하고, 실수 시 이전 상태로 되돌릴 수 있는(Rollback) 기능을 제공합니다. 또한, 전체 데이터를 백업하고 복원하는 기능을 통해 데이터 손실을 방지합니다.

## 2. Scope

### 2.1 History & Audit
- **Automatic Logging**: Rule 및 MCP 서버의 생성, 수정, 삭제 시 자동으로 이력을 기록합니다.
- **Diff Storage**: 변경 전/후의 데이터(Snapshot)를 저장하여 무엇이 바뀌었는지 추적합니다.
- **Viewer**: UI에서 타임라인 형태로 변경 이력을 조회합니다.

### 2.2 Rollback (Revert)
- **Entity Revert**: 특정 이력 시점으로 데이터를 되돌립니다 (Undo).
- **Safety Check**: 되돌리기 수행 전 확인 절차를 거칩니다.

### 2.3 Backup & Restore (Optional for Phase 5.x)
- **Export**: 전체 DB 또는 설정을 JSON/ZIP으로 내보내기.
- **Import**: 백업 파일로 데이터 복원.

## 3. Architecture Design

### 3.1 Data Model
`history` 테이블을 신설하여 이력을 관리합니다.

```sql
CREATE TABLE history (
    id TEXT PRIMARY KEY,
    entityType TEXT NOT NULL, -- 'rule' | 'mcp'
    entityId TEXT NOT NULL,
    action TEXT NOT NULL,     -- 'create' | 'update' | 'delete'
    data TEXT NOT NULL,       -- JSON Snapshot of the entity at that time
    createdAt TEXT NOT NULL
);
```

### 3.2 Domain Layer (`electron/services/history`)
- **HistoryService**:
    - `log(entityType, entityId, action, data)`: 이력 기록.
    - `list(entityType?, entityId?)`: 이력 조회.
    - `revert(historyId)`: 핵심 로직. 해당 History의 `data`를 현재 상태로 덮어씌웁니다.
        - *주의*: `delete`된 아이템을 Revert하면 `create` 동작을 수행해야 합니다.
        - *주의*: `create`된 아이템을 Revert하면 `delete` 동작을 수행해야 합니다.

### 3.3 Integration
- **Generic Hooks**: `RulesService`, `McpService`의 CUD 메서드 내에서 `HistoryService.log()`를 호출하도록 통합 (이미 초기 구현 완료).

## 4. API Contract (`shared/api.ts`)

```typescript
export interface HistoryEntry {
    id: string;
    entityType: 'rule' | 'mcp';
    entityId: string;
    action: 'create' | 'update' | 'delete';
    data: any; // Snapshot
    createdAt: string;
}

export interface IHistoryAPI {
    list(): Promise<Result<HistoryEntry[]>>;
    revert(historyId: string): Promise<Result<void>>;
}
```

## 5. UI Design
- **History Panel**: 우측 Drawer 또는 별도 탭으로 제공.
- **List Item**:
    - `[Update] Rule: "Coding Style" (2 mins ago)`
    - 클릭 시 Diff Modal 표시 (Current vs Snapshot).
    - "Revert" 버튼 제공.

## 6. Implementation Plan
1.  **Backend Core** (완료): DB Table 및 Service 구현.
2.  **Revert Logic**: `HistoryService.revert` 구현 (Service 간 의존성 해결 필요).
    - *Strategy*: `HistoryService`가 `RulesService`, `McpService`를 직접 호출하면 순환 참조 우려가 있음.
    - *Alternative*: `Facade` 패턴 사용 or `EntityType`에 따른 Handler 매핑.
3.  **Frontend**: History Viewer UI 구현.
