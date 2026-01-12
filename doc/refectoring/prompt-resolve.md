# 🚀 시스템 리팩토링 실행 전략 (Resolve Phase)

본 문서는 `doc/refectoring/logs/005-final-report.md`의 분석 결과를 실행하기 위한 구체적인 액션 플랜입니다.

---

## 🏎️ Track 1: Fast Track (병렬 처리 가능)
*리스크가 낮고 코드 정리 및 가독성 향상에 집중하는 단계입니다.*

### 1. 프론트엔드 비즈니스 로직 추출 (Cleaner 🧹)
- **목표**: `RulesPage.tsx` 등에서 TanStack Query 로직을 `useRules.ts` 등의 커스텀 훅으로 이동.
- **결과**: UI 컴포넌트는 오직 '렌더링'과 '이벤트 바인딩'에만 집중.

### 2. BaseRepository 강화 (Cleaner 🧹 + Sprinter ⚡)
- **목표**: JSON 직렬화/역직렬화 및 `randomUUID`, `ISOString` 처리를 `BaseRepository`로 캡슐화.
- **결과**: 개별 Repository 코드가 50% 이상 감소하고 일관성 확보.

---

## 🛡️ Track 2: Safe Track (순차 및 정밀 처리)
*아키텍처 변경이 수반되며 철저한 테스트가 필요한 단계입니다.*

### 1. 서비스-핸들러 책임 재정립 (Guardian 🛡️ + Cleaner 🧹)
- **단계**:
    1. `safeHandler`가 비즈니스 에러를 `Result`로 변환하는 로직을 고도화.
    2. `RulesService` 등에서 `try-catch`와 `Result` 반환을 제거하고 순수 데이터 또는 에러를 던지도록 수정.
    3. 기존 단위 테스트가 통과하는지 확인.
- **결과**: 계층 간 책임 분리 명확화 및 중복 코드 제거.

### 2. DB 마이그레이션 및 스키마 관리 (Guardian 🛡️)
- **목표**: 하드코딩된 SQL 문자열을 별도 파일로 분리하고, `_migrations` 테이블을 통한 버전 관리 로직 도입.
- **결과**: 향후 앱 업데이트 시 데이터 손실 없이 안전하게 스키마 변경 가능.

---

## 🚦 실행 순서 (Execution Sequence)
1.  **Preparation**: `BaseRepository` 개선 (개별 Repo 영향 최소화).
2.  **Service Refactor**: 도메인별 서비스 계층 경량화 (단위 테스트 병행).
3.  **Frontend Hooking**: 컴포넌트 로직 추출.
4.  **Infra Stability**: DB 마이그레이션 체계 구축.

---

## ⚠️ 주의사항
- 모든 리팩토링은 **기존 테스트 케이스를 통과**하는 것을 전제로 합니다.
- IPC 채널 명칭이나 반환 데이터의 최종 구조(`Result<T>`)는 절대 변경하지 않습니다. (Renderer 호환성 유지)
