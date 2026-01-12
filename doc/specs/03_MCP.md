# 03. MCP 관리 기능 사양서 (MCP Management Spec)

**상태**: 승인됨
**단계**: Phase 3

이 문서는 "MCP 서버 관리" 기능에 대한 기술적인 명세를 정의합니다. 이 기능은 사용자가 외부 MCP 서버를 등록하고 설정을 관리할 수 있게 해줍니다.

## 1. 데이터베이스 스키마 (Database Schema)

`id`는 UUID v4를 사용합니다. `args`와 `env`는 JSON 문자열로 저장됩니다.

```sql
CREATE TABLE IF NOT EXISTS mcp_servers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    command TEXT NOT NULL,
    args TEXT, -- JSON array string e.g. '["--arg1", "val1"]'
    env TEXT,  -- JSON object string e.g. '{"KEY": "VALUE"}'
    isActive INTEGER DEFAULT 1,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL
);
```

## 2. 도메인 엔티티 (Domain Entities)

`shared/types.ts`:

```typescript
export interface McpServer {
    id: string;
    name: string;
    command: string;
    args: string[]; // 파싱된 문자열 배열
    env: Record<string, string>; // 파싱된 객체
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export type CreateMcpServerParams = Pick<McpServer, 'name' | 'command' | 'args' | 'env'>;
export type UpdateMcpServerParams = Partial<CreateMcpServerParams> & { id: string; isActive?: boolean };
```

## 3. API 계약 (API Contract)

`shared/api.ts`:

```typescript
export interface IMcpAPI {
    list(): Promise<Result<McpServer[]>>;
    get(id: string): Promise<Result<McpServer | null>>;
    create(params: CreateMcpServerParams): Promise<Result<McpServer>>;
    update(params: UpdateMcpServerParams): Promise<Result<McpServer>>;
    delete(id: string): Promise<Result<void>>;
}
```

## 4. 아키텍처 구현 (Architecture Implementation)

-   **Service**: `electron/usecases/mcp/McpService.ts`
    -   DB의 JSON string <-> Entity의 Object 변환을 담당합니다.
-   **Handler**: `electron/handlers/McpHandler.ts`
    -   `zod`를 사용하여 입력값을 검증합니다.
    -   `args`는 문자열 배열, `env`는 객체 형태임이 보장되어야 합니다.

## 5. 사용자 인터페이스 (User Interface)

-   **목록 보기 (List View)**: 서버 이름, 명령어, 상태 표시.
-   **생성/수정 폼 (Form)**:
    -   단순 텍스트 필드: Name, Command.
    -   동적 필드 또는 JSON 에디터: Args, Env. (초기 버전은 JSON 텍스트 입력으로 단순화 가능)
