# Scripts

## generate-scenario-stats.ts

시나리오 파일을 분석하여 통계를 생성하는 TypeScript 스크립트입니다.

### 기능

1. **파일별 시나리오 수 카운트**
   - 정규식으로 `### TC-` 패턴 매칭
   - 파일별 시나리오 수 집계

2. **Priority 분포 분석**
   - High / Medium / Low 비율 계산
   - 메뉴별 Priority 분포

3. **계층별 커버리지**
   - R / S / H / C / U / E / K 각 계층별 시나리오 수
   - 커버리지 매트릭스 생성 (진행률 바 포함)

4. **출력 형식**
   - Markdown 테이블 (기본)
   - JSON (CI/CD 연동용)

### 사용법

```bash
# 전체 통계
npm run scenario-stats

# 특정 메뉴만 분석
npm run scenario-stats -- --menu=mcp
npm run scenario-stats -- --menu=tools

# JSON 형식으로 출력
npm run scenario-stats -- --json

# 특정 메뉴를 JSON으로 출력
npm run scenario-stats -- --menu=tools --json

# 도움말
npm run scenario-stats -- --help
```

### 출력 예제

#### Markdown 형식 (기본)

```
## 시나리오 통계

### 전체 요약

| Metric | Value |
|--------|-------|
| 총 시나리오 수 | 8 |
| High Priority | 4 (50%) |
| Medium Priority | 3 (38%) |
| Low Priority | 1 (12%) |

### 파일별 통계

| Menu | File | Total | High | Medium | Low |
|------|------|-------|------|--------|-----|
| Tools | unit-tests.md | 8 | 4 | 3 | 1 |

### 계층별 커버리지

| Layer | Count | Coverage |
|-------|-------|----------|
| Repository | 2 | ██░░░░░░░░ 25% |
| Service | 2 | ██░░░░░░░░ 25% |
| Handler | 1 | █░░░░░░░░░ 12% |
| Component | 2 | ██░░░░░░░░ 25% |
| Hook | 1 | █░░░░░░░░░ 12% |
```

#### JSON 형식

```json
{
  "summary": {
    "totalFiles": 1,
    "totalScenarios": 8,
    "totalHigh": 4,
    "totalMedium": 3,
    "totalLow": 1
  },
  "files": [
    {
      "menu": "Tools",
      "file": "scenarios/tools/unit-tests.md",
      "total": 8,
      "byPriority": {
        "high": 4,
        "medium": 3,
        "low": 1
      },
      "byLayer": {
        "Repository": 2,
        "Service": 2,
        "Handler": 1,
        "Component": 2,
        "Hook": 1
      }
    }
  ],
  "generatedAt": "2025-12-23T10:30:00.000Z"
}
```

### 시나리오 ID 형식

스크립트는 다음 형식의 ID를 인식합니다:

```
TC-{MENU}-{LAYER}{NUMBER}
```

- **TC**: Test Case
- **MENU**: TOOLS, SYNC, PROJ, RULES, MCP, HIST, SET
- **LAYER**:
  - R: Repository
  - S: Service
  - H: Handler
  - C: Component
  - U: Utility
  - E: E2E
  - K: Hook
- **NUMBER**: 001-999

예: `TC-TOOLS-R001`, `TC-MCP-E005`, `TC-SYNC-S042`

### 의존성

- `tsx`: TypeScript 실행을 위해 사용
- Node.js 내장 모듈만 사용 (fs, path)
- 추가 패키지 설치 불필요

### 관련 파일

- `tasks/streams/T5-metadata.md`: T5-A-001 작업 명세
- `scenarios/`: 시나리오 파일이 위치하는 디렉토리
- `package.json`: `scenario-stats` 스크립트 정의

---

## 기타 스크립트

### convert-scenario-ids.cjs

시나리오 ID를 표준 형식으로 변환하는 스크립트 (레거시)

### inspect-db.cjs

SQLite 데이터베이스 구조를 검사하는 스크립트
