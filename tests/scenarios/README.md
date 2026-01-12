# Test Scenarios

## Overview

Octopus 프로젝트의 테스트 시나리오 문서입니다.

### Summary

| Menu | Unit Tests | E2E Tests | Total |
|------|------------|-----------|-------|
| Tools | 68 | 50 | 118 |
| Sync | 36 | 38 | 74 |
| Projects | 57 | 36 | 93 |
| Rules | 96 | 63 | 159 |
| MCP | 20 | 26 | 46 |
| History | 53 | 58 | 111 |
| Settings | 28 | 50 | 78 |
| **Total** | **358** | **321** | **679** |

### Priority Distribution

```
High:   ████████████████████ 49%
Medium: ████████████░░░░░░░░ 29%
Low:    ████████░░░░░░░░░░░░ 22%
```

## Directory Structure

```
tests/scenarios/
├── README.md           # 이 파일
├── ID-STANDARD.md      # ID 형식 표준
├── common/             # 공통 시나리오
│   ├── error-handling.md
│   ├── navigation.md
│   ├── accessibility.md
│   └── performance.md
├── tools/
│   ├── unit-tests.md
│   └── e2e-tests.md
├── sync/
│   ├── unit-tests.md
│   └── e2e-tests.md
...
```

## How to Use

### Scenario ID Format

`TC-{MENU}-{LAYER}{NUMBER}`

- TC: Test Case
- MENU: TOOLS, SYNC, PROJ, RULES, MCP, HIST, SET
- LAYER: R(Repository), S(Service), H(Handler), C(Component), U(Utility), E(E2E), K(Hook)
- NUMBER: 001-999

### Contributing

1. 새 시나리오 추가 시 ID 표준 준수
2. 기존 시나리오와 중복 여부 확인
3. 공통 시나리오는 `common/` 참조

## Links

- [ID 표준 문서](./ID-STANDARD.md)
- [상태 정의](../../tasks/STATE.md)
- [리뷰 결과](../../tasks/REVIEW.md)
