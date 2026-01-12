# Markdown 아키텍처 결정 기록(ADR) 사용

## Status (상태)
Accepted (수락됨)

## Context (과거)
프로젝트는 아키텍처 결정("과거, 현재, 미래")을 기록하고, 깊은 생각 없이 쉽게 수정되는 것을 방지할 방법이 필요합니다.
- **Problem (문제)**: 결정 사항들이 종종 잊혀지거나 유실됩니다. 핵심 규칙의 수정은 추적되어야 합니다.
- **Constraints (제약)**: 버전 관리(Git)가 가능해야 하고, 텍스트 기반이어야 하며, 읽기 쉬워야 합니다.

## Decision (현재)
우리는 결정을 추적하기 위해 Markdown Architectural Decision Records (MADR)를 사용할 것입니다.
- **Choice (선택)**: ADR을 `doc/adrs/`에 저장합니다.
- **Reasoning (근거)**: Markdown은 범용적이고 버전 관리가 용이하며 개발자 워크플로우에 적합합니다. Michael Nygard의 형식에서 파생된 "문맥(Context), 결정(Decision), 결과(Consequences)" 구조는 우리의 "과거, 현재, 미래" 요구사항에 완벽하게 부합합니다.

## Consequences (미래)
- **Positive (긍정적)**: 우리는 왜 현재 상태가 되었는지에 대한 영구적인 기록을 갖게 됩니다.
- **Negative (부정적)**: 의사결정 과정에 약간의 오버헤드(문서 작성)가 추가됩니다.
