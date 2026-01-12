# 1. 개발 원칙 및 철학 (Development Principles & Philosophy)

## 1.1 핵심 철학: "웹 프론트엔드 + 로컬 백엔드"
이 프로젝트는 단순한 데스크탑 앱이 아닙니다. **"로컬 서버(Main Process)와 통신하는 웹 클라이언트(Renderer Process)"**라는 멘탈 모델을 기반으로 합니다.

## 1.2 아키텍처 패턴: 클린 아키텍처 (Clean Architecture)
우리는 유지보수성과 테스트 용이성을 위해 **Clean Architecture**를 지향하며, 의존성 규칙을 엄격히 준수합니다.

- **Dependency Rule:** 소스 코드 의존성은 오직 **안쪽(고수준 정책)**으로만 향해야 합니다.
  - UI는 Controller를 알고, Controller는 Service를 알지만, Service는 UI를 몰라야 합니다.

## 1.3 SOLID 원칙 구현 (SOLID Principles Implementation)
- **SRP (Single Responsibility):**
  - Renderer: 오직 "그리는 것"에만 집중. 로직 금지.
  - Main (Handler): 요청 검증 및 라우팅.
  - Main (Service): 순수 비즈니스 로직 수행.
- **OCP (Open-Closed):** 기능 추가 시 기존 코드를 수정하기보다 새로운 클래스/모듈을 추가하는 방식을 선호합니다.
- **ISP (Interface Segregation):** `preload.ts`는 거대한 하나의 객체가 아닌, 도메인별로 쪼개진 API를 노출합니다 (e.g., `userApi`, `fileApi`).

## 1.4 Engineering Standard: TDD (Test Driven Development)
우리는 **"검증되지 않은 코드는 작성하지 않는다"**는 원칙을 따릅니다.
- **Verification First:** 구현보다 테스트(또는 검증 계획)를 먼저 고민합니다.
- **Red-Green-Refactor:** 실패하는 테스트를 먼저 작성하고(Red), 기능을 구현하며(Green), 코드를 개선합니다(Refactor).
- **Stability:** 모든 도메인 로직은 Unit Test로 보호되어야 합니다.

## 1.5 Decision Making: Research First
중요한 기술적 의사결정 전에는 반드시 **검증된 모범 사례(Best Practices)**를 조사합니다.
- **Evidence Based:** "그냥" 정하지 않고 근거를 찾습니다.
- **Documentation:** 조사 내용은 `../researches/`에 기록하여 팀 자산으로 남깁니다.