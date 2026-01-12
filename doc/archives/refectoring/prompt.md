# 🔍 시스템 리팩토링 & 오류 분석 프롬프트

**(Tree of Thought & Graph of Thought 포함 버전)**

당신은 **전문 소프트웨어 아키텍트**이자 **리팩토링 전문가**입니다. 이 프로젝트의 코드베이스를 **Tree of Thought (ToT)** 와 **Graph of Thought (GoT)** 를 활용하여, 가장 낮은 계층(Foundation)부터 가장 높은 계층(UI)까지 단계별로 분석하고, 잠재된 오류를 찾아 구조를 개선한 뒤 실제 코드에 적용해야 합니다.

---

## 📊 사고 전략: ToT & GoT

### 🧠 ToT (Tree of Thought) 적용 원칙

각 분석 단계에서 **여러 가지 해결 경로를 분기 탐색**한 뒤, 그 중 **최적의 경로를 선택**합니다.

**기본 패턴:**
1. **문제 인식**: 현재 계층에서의 문제/위험 요소 파악
2. **경로 분기**: 3개 이상의 대안(Path A, B, C) 제시
3. **경로 평가**: 각 경로의 장단점 분석
4. **경로 선택**: 비즈니스 목표에 최적의 경로 선택
5. **근거 기록**: 선택 이유를 문서화

### 🔗 GoT (Graph of Thought) 적용 원칙

계층 간 **의존성 관계를 그래프**로 매핑하고, 한 계층의 변경이 상위 계층에 미치는 영향을 **역추적(Backpropagation)**합니다.

**의존성 그래프:**
```
┌─────────────────────────────────────────────┐
│                   UI Layer                   │
│             (React Components)               │
└────────────────────┬────────────────────────┘
                     │ (IPC 호출)
┌────────────────────▼────────────────────────┐
│            Handler/IPC Layer                 │
│      (Electron IPC Handlers)                 │
└────────────────────┬────────────────────────┘
                     │ (비즈니스 로직 호출)
┌────────────────────▼────────────────────────┐
│            Service Layer                     │
│        (비즈니스 로직 구현)                   │
└────────────────────┬────────────────────────┘
                     │ (DB 쿼리 호출)
┌────────────────────▼────────────────────────┐
│            Repository Layer                  │
│            (데이터 접근 계층)                 │
└────────────────────┬────────────────────────┘
                     │ (인터페이스 사용)
┌────────────────────▼────────────────────────┐
│            Foundation Layer                  │
│     (타입 정의, API, 상수, 설정)             │
└─────────────────────────────────────────────┘
```

---

## 🛠️ Step 0: Preparation (준비)

### 0.1 분석 문서 생성

프로젝트 루트에 `doc/log/` 디렉토리를 생성하고, 파일명 앞에 **순차적 번호(Numbering)**를 부여하여 관리하십시오 (예: `001-`, `002-`).

```
doc/log/
├── 001-error.md              # 발견된 모든 오류 및 근본 원인 분석
├── 001-improvement.md        # 개선 사항 및 구현 계획
├── 001-dependency-graph.md   # 계층 간 의존성 그래프 (GoT)
├── 001-decision-tree.md      # 각 단계별 선택지 및 의사결정 (ToT)
└── 001-verification.md       # 최종 검증 체크리스트
```

### 0.2 초기 설정

다음 항목을 확인하십시오:

- [ ] 프로젝트 루트 디렉토리 구조 확인
- [ ] `package.json`, `tsconfig.json`, `vitest.config.ts` 검증
- [ ] 의존성 관계 초기 지도화 (GoT 시작)
- [ ] `git` 저장소 상태 확인 및 백업 생성
- [ ] 현재 빌드 상태 확인 (`npm run build`)

---

## 🏗️ Step 1: Foundation Layer Analysis (기반 계층 분석)

### 1.1 대상 파일

- `shared/types.ts` - 공유 타입 정의
- `shared/api.ts` - API 응답/요청 인터페이스
- `shared/constants.ts` - 상수 정의
- `shared/utils.ts` - 유틸리티 함수
- `electron/infra/` - 인프라 설정 (DB, Logger 등)
- `electron/infra/database.ts` - 데이터베이스 연결
- `electron/infra/logger.ts` - 로깅 설정

### 1.2 ToT 분석 방법 (의사결정 트리)

```
Foundation Layer 검증
│
├─ Type 안전성 검사
│  ├─ Path A: `any` 타입 사용 여부 확인 → 치환 필요 여부 판단
│  ├─ Path B: 제네릭 사용 일관성 확인 → 재설계 필요 여부 판단
│  └─ Path C: Union 타입 정의 명확성 확인 → 추상화 여부 판단
│
├─ DTO vs API Interface 분리
│  ├─ Path A: 구조적 중복 감지 → 통합 필요성 판단
│  ├─ Path B: 변환 로직 위치 확인 → 매퍼 패턴 도입 필요성 판단
│  └─ Path C: 버전 관리 여부 확인 → 마이그레이션 필요성 판단
│
└─ 인프라 설정 안전성
   ├─ Path A: `@ts-ignore` 사용 여부 → 타입 선언 파일(d.ts) 필요성 판단
   ├─ Path B: 환경 변수 타입화 → 런타임 안전성 개선 판단
   └─ Path C: 싱글톤 패턴 일관성 → 의존성 주입 구조 개선 판단
```

### 1.3 검증 항목

| 검증 항목 | 오류 유형 | 영향받는 계층 | 심각도 |
|---------|---------|------------|--------|
| `any` 타입 남용 | Type Safety | Repository, Service, Handler | 🔴 High |
| DTO 중복 정의 | Maintainability | Repository, Handler | 🟡 Medium |
| `@ts-ignore` 사용 | Type Safety | 전체 계층 | 🔴 High |
| 상수 분산 | Maintainability | Service, Handler | 🟡 Medium |
| 제네릭 불일치 | Type Safety | Service, Handler | 🔴 High |
| 환경 변수 타입화 부재 | Runtime Safety | Infra Layer | 🔴 High |

### 1.4 액션: 분석 결과 기록

**doc/log/XXX-error.md** 에 다음 내용을 기록하십시오:

```markdown
## Step 1: Foundation Layer 오류 분석

### 1.1 Type 안전성 오류

#### 발견 사항
- [ ] `any` 타입 사용 위치 및 개수
- [ ] 제네릭 정의의 일관성
- [ ] Union 타입의 명확성

#### 상세 오류 목록
| 파일 | 라인 | 오류 | 심각도 | 해결 방법 |
|------|------|------|--------|---------|
| shared/types.ts | 15 | any 타입 사용 | High | 구체적 타입 정의 |
| shared/api.ts | 22 | @ts-ignore 사용 | High | d.ts 파일 생성 |

### 1.2 DTO 중복 정의 오류

#### 발견 사항
- User 타입 정의: shared/types.ts 와 shared/api.ts 에서 중복
- Project 타입 정의: shared/types.ts 와 shared/api.ts 에서 중복

### 1.3 인프라 설정 오류

#### 발견 사항
- @ts-ignore 사용 횟수: X개
- 환경 변수 타입화 부재: Y개
```

**doc/log/XXX-decision-tree.md** 에 다음 내용을 기록하십시오:

```markdown
## Step 1: Foundation Layer 의사결정 (ToT)

### Type 안전성 개선

#### 선택지 분석
- **Path A: 제네릭 확장**
  - 장점: 재사용성 높음, 타입 안전성 강함
  - 단점: 초기 구현 복잡도 높음
  - 비용: 중간

- **Path B: 구체적 타입 정의**
  - 장점: 구현 간단, 명확함
  - 단점: 중복 코드 증가
  - 비용: 낮음

- **Path C: Union 타입 조합**
  - 장점: 유연함
  - 단점: 타입 좁히기 필요
  - 비용: 중간

#### 최종 선택: **Path A** (제네릭 확장)
- 근거: 장기적 유지보수성과 타입 안전성이 중요
- 예상 효과: any 타입 사용 100% 제거
- 적용 범위: shared/types.ts, shared/api.ts
```

---

## 💾 Step 2: Repository Layer Analysis (데이터 계층 분석)

### 2.1 대상 파일

- `electron/repositories/UserRepository.ts`
- `electron/repositories/ProjectRepository.ts`
- `electron/repositories/*.ts` (모든 Repository)
- `electron/repositories/BaseRepository.ts` (존재 여부 확인)

### 2.2 ToT 분석 방법

```
Repository Layer 검증
│
├─ Entity 매핑 로직
│  ├─ Path A: 직접 매핑 → 수동 유지보수 복잡도 높음
│  ├─ Path B: mapToEntity 헬퍼 함수 → 중복 제거, 유지보수 용이
│  └─ Path C: 자동 매퍼 라이브러리 (class-transformer) 
│     → 타입 안전성 강화, 런타임 오버헤드
│
├─ DB 쿼리 타입 안전성
│  ├─ Path A: 수동 타입 캐스팅 (as) → 오류 위험 높음
│  ├─ Path B: 쿼리 결과 검증 함수 → 런타임 안전성 제공
│  └─ Path C: ORM 기반 타입 자동 보장 (TypeORM/Prisma) 
│     → 최적, 마이그레이션 필요
│
└─ 코드 중복 제거
   ├─ Path A: 각 Repository에서 반복되는 로직 추출 → 부분 해결
   ├─ Path B: 기본 Repository 클래스 구현 (Generic) → 완전 해결
   └─ Path C: Mixin 패턴 활용 → 복잡도 높음
```

### 2.3 검증 항목

| 항목 | 검증 방법 | 기준 | 현황 |
|------|---------|------|------|
| 중복 매핑 로직 | Regex 검색 + 수동 코드 리뷰 | 3회 이상 반복 = 추출 필요 | ? |
| 타입 캐스팅 안전성 | `as` 사용 여부 | `as` 제거 및 검증 함수 도입 | ? |
| 에러 처리 | `try/catch` 감싸짐 | 100% 커버리지 목표 | ? |
| 쿼리 성능 | SQL 분석 | N+1 문제 여부 | ? |
| BaseRepository 존재 여부 | 파일 존재 확인 | 존재해야 함 | ? |

### 2.4 액션: 리팩토링 계획 수립

**doc/log/XXX-improvement.md** 에 다음 내용을 기록하십시오:

```markdown
## Step 2: Repository Layer 리팩토링 계획

### 2.1 중복 로직 분석

#### 발견된 패턴
- mapToUserEntity (반복 횟수: X회)
- mapToProjectEntity (반복 횟수: Y회)
- 기타 중복 패턴들 ...

### 2.2 리팩토링 계획 (ToT)

#### 선택지 분석
- **Path A:** BaseRepository<Entity> 추상 클래스
  - 장점: 재사용성 높음, 타입 안전
  - 단점: 상속 구조로 인한 복잡도
  
- **Path B:** mapEntity 헬퍼 함수 모음
  - 장점: 간단함
  - 단점: 중복 감소 제한적

#### 최종 선택: **Path A** (BaseRepository 구현)
- 근거: 장기적 유지보수성 고려
- 예상 효과: 코드 중복 X% 감소, 타입 안전성 강화

### 2.3 구현 계획
1. BaseRepository<T> 추상 클래스 생성
2. 공통 메서드 추출 (find, findOne, create, update, delete)
3. 각 Repository에서 상속 및 특화된 메서드만 구현
4. 테스트 코드 추가

### 2.4 영향도 분석 (GoT)
- UserRepository: 변경 필요 (5-10줄 감소 예상)
- ProjectRepository: 변경 필요 (5-10줄 감소 예상)
- Service Layer: 변경 최소화 (인터페이스 동일 유지)
```

---

## ⚙️ Step 3: Service Layer Analysis (비즈니스 계층 분석)

### 3.1 대상 파일

- `electron/services/UserService.ts`
- `electron/services/ProjectService.ts`
- `electron/services/*.ts` (모든 Service)

### 3.2 ToT 분석 방법

```
Service Layer 검증
│
├─ 의존성 주입 (Dependency Injection)
│  ├─ Path A: Constructor Injection → 테스트 용이, 명시적
│  ├─ Path B: Setter Injection → 선택적 의존성
│  └─ Path C: Property Injection → 간단하지만 테스트 어려움
│     선택: **Path A** (권장)
│
├─ 비동기 처리 안전성
│  ├─ Path A: Promise 기반 → 가독성 낮음
│  ├─ Path B: async/await → 가독성 높음, 에러 처리 명확
│  └─ Path C: RxJS Observable → 복잡한 흐름에 유용
│     선택: **Path B** (현재 권장)
│
└─ 에러 전파 메커니즘
   ├─ Path A: throw Error → 호출자에서 처리
   ├─ Path B: Result<T> 패턴 → 명시적 성공/실패 구분
   └─ Path C: Either<Error, T> 모나드 → 함수형 프로그래밍
      선택: **Path B** (현재) → Path C (향후 고도화)
```

### 3.3 검증 항목

| 항목 | 검증 방법 | 기준 | 현황 |
|------|---------|------|------|
| 의존성 주입 정확성 | 생성자 분석 | Constructor Injection 사용 | ? |
| 비동기 에러 처리 | `async/await` + `try/catch` | 모든 비동기 함수 포함 | ? |
| 비즈니스 로직 순수성 | 부작용(Side Effect) 분석 | 최소화 | ? |
| 로깅 일관성 | Logger 호출 지점 | 주요 지점에 로그 존재 | ? |
| Result<T> 패턴 준수 | 응답 타입 확인 | 모든 메서드 준수 | ? |

### 3.4 액션: 의존성 그래프 작성 (GoT)

**doc/log/XXX-dependency-graph.md** 에 다음 내용을 기록하십시오:

```markdown
## Step 3: Service Layer 의존성 분석 (GoT)

### 3.1 의존성 그래프

#### UserService 의존성
```
UserService
├── UserRepository (발견된 의존성) ✓
├── Logger (발견된 의존성) ✓
├── ValidationService (발견된 의존성) ✓
└── ConfigService (발견된 의존성) ✓
```

#### ProjectService 의존성
```
ProjectService
├── ProjectRepository (발견된 의존성) ✓
├── UserService (발견된 의존성) ⚠️ 순환 의존성 위험?
└── Logger (발견된 의존성) ✓
```

### 3.2 순환 의존성 검출
- [ ] UserService ↔ ProjectService 순환 여부
- [ ] Repository ↔ Service 순환 여부
- [ ] 결과: 순환 의존성 없음 ✅ / 있음 ❌

### 3.3 개선 계획
- 의존성 방향: Handler → Service → Repository (단방향 준수)
- 필요 시 중간 계층(예: EventBus) 도입
- 테스트 가능성 강화를 위한 Interface 분리
```

---

## 🔌 Step 4: Handler & IPC Layer Analysis (인터페이스 계층 분석)

### 4.1 대상 파일

- `electron/handlers/UserHandler.ts`
- `electron/handlers/ProjectHandler.ts`
- `electron/handlers/*.ts` (모든 Handler)
- `electron/preload.ts`
- `electron/main.ts` (IPC 등록)

### 4.2 ToT 분석 방법

```
Handler/IPC Layer 검증
│
├─ 예외 처리 (Exception Handling)
│  ├─ Path A: try/catch 미사용 → 앱 크래시 위험 ❌
│  ├─ Path B: try/catch 부분 사용 → 불완전한 보호 ⚠️
│  └─ Path C: try/catch 전체 사용 + Result<T> 패턴 
│     → 완전 보호 ✅ (선택)
│
├─ 응답 포맷 일관성
│  ├─ Path A: 각 핸들러마다 다른 포맷 → 클라이언트 혼란 ❌
│  ├─ Path B: Result<T> = { ok: boolean; data?: T; error?: string } ✅
│  └─ Path C: JSON-RPC 2.0 표준 (향후 개선)
│     선택: **Path B** (현재)
│
└─ Preload 타입 안전성
   ├─ Path A: `any` 사용 → 타입 검사 불가 ❌
   ├─ Path B: 명시적 인터페이스 정의 → 타입 안전 ✅
   └─ Path C: ContextBridge API 타입화 (향후 개선)
      선택: **Path B** (현재)
```

### 4.3 검증 항목

| 항목 | 검증 방법 | 기준 | 현황 |
|------|---------|------|------|
| try/catch 커버리지 | 핸들러별 점검 | 100% 필수 | ? |
| Result<T> 패턴 준수 | 응답 포맷 검사 | 모든 핸들러 통일 | ? |
| Preload `any` 타입 | Regex 검색 | 0개 목표 | ? |
| IPC 채널명 일관성 | 채널명 규칙 검사 | snake_case 통일 | ? |
| 에러 메시지 일관성 | 에러 응답 형식 | 동일한 구조 | ? |

### 4.4 액션: 예외 처리 로직 추출 (ToT)

**doc/log/XXX-error.md** 에 다음 내용을 추가하십시오:

```markdown
## Step 4: Handler & IPC Layer 오류 분석

### 4.1 예외 처리 상태 분석

#### 발견 사항
- UserHandler.createUser: try/catch 없음 ❌
- UserHandler.getUser: try/catch 있음 ✅
- ProjectHandler.createProject: try/catch 없음 ❌
- 기타 핸들러들 ...

#### 상세 오류 목록
| 파일 | 메서드 | try/catch | Result<T> | 심각도 |
|------|--------|----------|-----------|--------|
| UserHandler | createUser | ❌ | ❌ | 🔴 High |
| UserHandler | getUser | ✅ | ✅ | 🟢 OK |
| ProjectHandler | createProject | ❌ | ❌ | 🔴 High |

### 4.2 Preload 타입 안전성 오류

#### 발견 사항
- `any` 타입 사용 지점: X개
- ContextBridge 타입화 부재
```

**doc/log/XXX-improvement.md** 에 다음 내용을 추가하십시오:

```markdown
## Step 4: Handler & IPC Layer 리팩토링 계획

### 4.1 공통 핸들러 래퍼 함수 생성

#### 구현 계획
1. `electron/handlers/wrapper.ts` 생성
2. 다음 함수 구현:
   ```typescript
   export async function safeHandler<T>(
     fn: () => Promise<T>
   ): Promise<Result<T>> {
     try {
       const data = await fn();
       return { ok: true, data };
     } catch (error) {
       logger.error('Handler error:', error);
       return {
         ok: false,
         error: error instanceof Error ? error.message : 'Unknown error'
       };
     }
   }
   ```

### 4.2 모든 핸들러에 적용

#### 적용 순서
1. 래퍼 함수 생성
2. 각 핸들러 메서드 래핑
3. 테스트 코드 추가
4. 타입 검증

### 4.3 Preload 타입화

#### 구현 계획
1. `electron/preload.types.ts` 생성
2. IPC API 인터페이스 정의
3. `preload.ts` 타입화

### 4.4 영향도 (GoT)
- preload.ts: 응답 타입 변경 필요
- UI Layer: 에러 처리 로직 강화 필요
- Service Layer: 인터페이스 변경 없음 (호환성 유지)
```

---

## 🚀 Step 5: Execution & Fix (실행 및 수정)

### 5.1 수정 우선순위 (토폴로지 정렬)

**반드시 이 순서를 준수하십시오:**

```
1단계: Shared Layer (기반)
   ├─ types.ts 정리 및 타입화
   ├─ api.ts 정리 및 중복 제거
   └─ @ts-ignore 제거 및 d.ts 파일 생성
   └─ git 커밋: "refactor: foundation layer type safety"

2단계: Infra Layer (인프라)
   ├─ DB 연결 설정의 타입 안전성 확보
   ├─ Logger 설정의 타입 안전성 확보
   └─ 환경 변수 검증
   └─ git 커밋: "refactor: infra layer type definitions"

3단계: Repository Layer (데이터)
   ├─ BaseRepository<T> 추상 클래스 생성
   ├─ 중복 매핑 로직 제거
   └─ 각 Repository에서 상속 구현
   └─ git 커밋: "refactor: repository layer consolidation"

4단계: Service Layer (비즈니스)
   ├─ 의존성 주입 리팩토링
   ├─ async/await 패턴 적용
   └─ Result<T> 패턴 통일
   └─ git 커밋: "refactor: service layer error handling"

5단계: Handler Layer (인터페이스)
   ├─ 공통 핸들러 래퍼 생성
   ├─ try/catch 적용
   └─ Result<T> 패턴 통일
   └─ git 커밋: "refactor: handler layer exception handling"

6단계: Preload & Type (타입화)
   ├─ Preload 타입화
   ├─ 미사용 변수 제거
   └─ 전체 타입 검증
   └─ git 커밋: "refactor: preload type definitions"

7단계: Code Cleanup (정리)
   ├─ 미사용 import 제거
   ├─ 불필요한 주석 정리
   └─ 코드 스타일 통일
   └─ git 커밋: "chore: code cleanup"
```

### 5.2 각 단계별 수정 기준

#### 수정 전 체크리스트
- [ ] 기존 코드 백업 완료
- [ ] 변경 사항 git branch 생성
- [ ] 영향받는 테스트 식별
- [ ] 롤백 계획 수립

#### 수정 후 체크리스트
- [ ] 타입 컴파일 오류 0개
- [ ] 린트 오류 0개
- [ ] 테스트 통과율 100%
- [ ] 성능 저하 없음
- [ ] 문서 업데이트 완료

### 5.3 수정 템플릿

#### 각 단계마다 이 템플릿을 사용하여 진행 상황 기록:

```markdown
## Step X: [계층명] 수정 실행 기록

### 상태: ⏳ 진행 중 / ✅ 완료

### 5.X.1 수정 전 상태
- 발견된 오류: X개
- 영향받는 파일: Y개
- 예상 수정 시간: Z시간

### 5.X.2 수정 내용
1. [ ] 첫 번째 작업
2. [ ] 두 번째 작업
3. [ ] 세 번째 작업

### 5.X.3 수정 파일 목록
| 파일 | 변경 사항 | 라인 수 변화 |
|------|---------|-----------|
| file1.ts | 함수 추출 | -10줄 |
| file2.ts | 타입 수정 | +5줄 |

### 5.X.4 컴파일 검증
- TypeScript 컴파일: ✅ 0 errors
- ESLint 검사: ✅ 0 errors
- 빌드: ✅ SUCCESS

### 5.X.5 테스트 검증
- 기존 테스트: ✅ X/X passed
- 새로운 테스트: ✅ Y개 추가
- 커버리지: X% → Y%

### 5.X.6 Git 커밋
```bash
git add .
git commit -m "refactor: [계층명] - [주요 변경 사항]"
```

### 5.X.7 GoT 역추적 검증
- [ ] 하위 계층의 변경 영향 확인
- [ ] 상위 계층의 호환성 확인
- [ ] 타입 정의 일치 확인
```

---

## ✅ Step 6: Verification (검증)

### 6.1 정적 분석

```bash
# 1단계: 린트 검사
npm run lint
# 예상 결과: 0 errors, 0 warnings

# 2단계: 타입 검사
npx tsc --noEmit
# 예상 결과: 0 errors

# 3단계: 빌드 검사
npm run build
# 예상 결과: BUILD SUCCESSFUL

# 4단계: 테스트 검사
npm run test
# 예상 결과: All tests passed

# 5단계: 커버리지 확인
npm run test:coverage
# 예상 결과: 커버리지 X% 이상
```

### 6.2 동적 분석

```bash
# 1단계: 애플리케이션 실행
npm start
# 예상 결과: 애플리케이션 정상 실행

# 2단계: 주요 기능 테스트
# - 사용자 생성/수정/삭제
# - 프로젝트 생성/수정/삭제
# - IPC 통신 정상 작동

# 3단계: 성능 프로파일링
# - 메모리 사용량 확인
# - CPU 사용량 확인
# - 번들 크기 확인
```

### 6.3 검증 리포트 작성

**doc/log/XXX-verification.md** 에 다음 내용을 기록하십시오:

```markdown
## 검증 결과 리포트

### 📊 정적 분석 결과

#### ESLint 검사
- [ ] 오류: 0개 ✅
- [ ] 경고: 0개 ✅
- 실행 시간: X.XXs

#### TypeScript 컴파일
- [ ] 오류: 0개 ✅
- [ ] 경고: 0개 ✅
- 실행 시간: X.XXs

#### 빌드 검사
- [ ] 오류: 0개 ✅
- [ ] 빌드 크기: XXX KB
- [ ] 실행 시간: X.XXs

#### 테스트 검사
- [ ] 테스트 통과: X/Y ✅
- [ ] 커버리지: XX% ✅
- [ ] 실행 시간: X.XXs

### 🔄 동적 분석 결과

#### 애플리케이션 기능
- [ ] 사용자 관리: ✅ 작동
- [ ] 프로젝트 관리: ✅ 작동
- [ ] IPC 통신: ✅ 작동

#### 성능 지표
- [ ] 메모리: X MB (안정적)
- [ ] CPU: X% (정상)
- [ ] 번들 크기: XXX KB (최적화됨)

### 🔗 GoT 최종 검증 (의존성 그래프)

#### 의존성 체인 확인
```
Handler Layer (IPC 응답) ✅
    ↓
Service Layer (비즈니스 로직) ✅
    ↓
Repository Layer (DB 쿼리) ✅
    ↓
Foundation Layer (타입 정의) ✅
```

- [ ] 모든 계층 간 인터페이스 일치: ✅
- [ ] 순환 의존성: 없음 ✅
- [ ] 타입 안전성: 확보됨 ✅

### 🌳 ToT 최종 검증 (의사결정 기록)

#### Step 1: Foundation Layer
- [ ] 선택 경로: Path A (제네릭 확장) ✅
- [ ] 근거 기록: doc/log/XXX-decision-tree.md ✅
- [ ] 대안 검토 완료: ✅

#### Step 2: Repository Layer
- [ ] 선택 경로: Path B (BaseRepository) ✅
- [ ] 근거 기록: doc/log/XXX-decision-tree.md ✅
- [ ] 대안 검토 완료: ✅

#### Step 3: Service Layer
- [ ] 선택 경로: Path A (Constructor Injection) ✅
- [ ] 근거 기록: doc/log/XXX-decision-tree.md ✅
- [ ] 대안 검토 완료: ✅

#### Step 4: Handler Layer
- [ ] 선택 경로: Path C (try/catch + Result<T>) ✅
- [ ] 근거 기록: doc/log/XXX-decision-tree.md ✅
- [ ] 대안 검토 완료: ✅

### 📋 최종 검증 결과

| 항목 | 상태 | 비고 |
|------|------|------|
| 코드 품질 | ✅ 합격 | 린트/타입 0 오류 |
| 테스트 | ✅ 합격 | 100% 통과 |
| 성능 | ✅ 합격 | 저하 없음 |
| 문서 | ✅ 완료 | 모든 결정 기록 |

**최종 검증: ✅ PASSED**
```

---

## 📋 최종 산출물

### Step 7: Final Report (최종 보고서)

**doc/log/XXX-final-report.md** 생성:

```markdown
# 🎯 시스템 리팩토링 완료 보고서

## 1. 리팩토링 개요

### 1.1 목표
- Type Safety 강화
- 코드 중복 제거
- 예외 처리 개선
- 계층 간 의존성 정리

### 1.2 기간
- 시작: YYYY-MM-DD
- 종료: YYYY-MM-DD
- 소요 시간: X시간

### 1.3 참여자
- 아키텍트: [이름]
- 개발자: [이름]

---

## 2. 변경된 파일 목록

### 2.1 생성된 파일
| 파일 | 목적 | 라인 수 |
|------|------|--------|
| electron/repositories/BaseRepository.ts | 기본 Repository 클래스 | 150 |
| electron/handlers/wrapper.ts | 핸들러 래퍼 함수 | 30 |
| electron/preload.types.ts | Preload 타입 정의 | 80 |
| shared/mappers.ts | 엔티티 매퍼 함수 | 100 |
| doc/log/XXX-dependency-graph.md | 의존성 그래프 | - |
| doc/log/XXX-decision-tree.md | 의사결정 기록 | - |

### 2.2 수정된 파일
| 파일 | 주요 변경 | 라인 수 변화 |
|------|---------|-----------|
| shared/types.ts | any 타입 제거 | -20줄 |
| electron/repositories/UserRepository.ts | BaseRepository 상속 | -30줄 |
| electron/services/UserService.ts | DI 리팩토링 | -10줄 |
| electron/handlers/*.ts | try/catch 추가 | +50줄 |
| electron/preload.ts | 타입화 | -15줄 |

### 2.3 삭제된 파일
| 파일 | 이유 |
|------|------|
| electron/repositories/legacy-mapper.ts | 중복된 매퍼 함수 |
| electron/utils/old-utils.ts | 미사용 유틸리티 |

---

## 3. 해결된 이슈

### 3.1 Type Safety (타입 안전성)
- [x] `any` 타입 사용 제거 (발견: 25개 → 해결: 25개) ✅
- [x] `@ts-ignore` 제거 (발견: 12개 → 해결: 12개) ✅
- [x] DTO 중복 정의 통합 (발견: 5개 → 해결: 5개) ✅
- [x] 제네릭 타입 일관성 확보 ✅

### 3.2 Error Handling (오류 처리)
- [x] Handler 예외 처리 미흡 (발견: 15개 → 해결: 15개) ✅
- [x] Result<T> 패턴 통일 (미적용: 20개 → 적용: 20개) ✅
- [x] IPC 에러 응답 일관성 확보 ✅

### 3.3 Code Quality (코드 품질)
- [x] 중복 매핑 로직 제거 (절감: 150줄) ✅
- [x] 미사용 변수 정리 (제거: 25개) ✅
- [x] 미사용 import 정리 (제거: 40개) ✅
- [x] 코드 스타일 통일 ✅

### 3.4 Architecture (아키텍처)
- [x] 순환 의존성 제거 (발견: 2개 → 해결: 2개) ✅
- [x] BaseRepository 추상화 도입 ✅
- [x] 공통 핸들러 래퍼 함수 도입 ✅

---

## 4. 성능 개선

### 4.1 빌드 성능
- 빌드 속도: 4500ms → 3200ms (-28.9%) ⚡
- 번들 크기: 2.5MB → 2.1MB (-16.0%) 📦
- Tree-shaking 효율: +15% ✅

### 4.2 런타임 성능
- 메모리 사용량: 변화 없음 (130MB) ✅
- IPC 통신 지연: 변화 없음 (<10ms) ✅
- 앱 시작 시간: 변화 없음 (<2s) ✅

### 4.3 개발 생산성
- 타입 검사 시간: 2000ms → 1800ms (-10%) ⚡
- 린트 검사 시간: 3000ms → 2500ms (-16.7%) ⚡
- 테스트 실행 시간: 5000ms → 4200ms (-16.0%) ⚡

---

## 5. ToT & GoT 의사결정 기록

### 5.1 Tree of Thought (ToT) - 의사결정 경로

#### Step 1: Foundation Layer
- **선택: Path A (제네릭 확장)**
- 근거: 장기적 유지보수성 최대화
- 효과: any 타입 100% 제거, 타입 안전성 강화

#### Step 2: Repository Layer
- **선택: Path B (BaseRepository 추상 클래스)**
- 근거: 코드 중복 제거 + 타입 안전성
- 효과: 150줄 절감, 재사용성 증대

#### Step 3: Service Layer
- **선택: Path A (Constructor Injection)**
- 근거: 테스트 용이성, 명시적 의존성
- 효과: 의존성 추적 용이, 모킹 편의성 향상

#### Step 4: Handler Layer
- **선택: Path C (try/catch + Result<T>)**
- 근거: 완전한 예외 처리 + 일관된 응답 포맷
- 효과: 앱 크래시 위험 제거, 클라이언트 호환성 향상

### 5.2 Graph of Thought (GoT) - 의존성 관계

#### 최종 의존성 그래프
```
┌─────────────────┐
│   UI Layer      │
└────────┬────────┘
         │ (IPC)
┌────────▼────────┐
│  Handler Layer  │ (try/catch + Result<T> ✅)
└────────┬────────┘
         │ (비즈니스 로직)
┌────────▼────────┐
│  Service Layer  │ (Constructor Injection ✅)
└────────┬────────┘
         │ (DB 쿼리)
┌────────▼────────┐
│ Repository Lyr  │ (BaseRepository ✅)
└────────┬────────┘
         │ (인터페이스)
┌────────▼────────┐
│ Foundation Lyr  │ (Generic Types ✅)
└─────────────────┘

✅ 모든 의존성 정리 완료
✅ 순환 의존성 0개
✅ 타입 안전성 확보
```

#### 역추적(Backpropagation) 검증
- Foundation 변경 → Repository: ✅ 호환
- Repository 변경 → Service: ✅ 호환
- Service 변경 → Handler: ✅ 호환
- Handler 변경 → UI: ✅ 호환

---

## 6. 테스트 결과

### 6.1 단위 테스트 (Unit Tests)
```
✅ shared/types.test.ts: 15/15 passed
✅ repositories/*.test.ts: 45/45 passed
✅ services/*.test.ts: 38/38 passed
✅ handlers/*.test.ts: 22/22 passed

전체: 120/120 passed (100%)
커버리지: 92% (+5%)
```

### 6.2 통합 테스트 (Integration Tests)
```
✅ IPC Communication: PASS
✅ Database Queries: PASS
✅ Error Handling: PASS
✅ End-to-End Flow: PASS

전체: 4/4 passed (100%)
```

---

## 7. 다음 단계 (향후 개선)

### 7.1 단기 (1-2주)
- [ ] E2E 테스트 추가 (Playwright/Cypress)
- [ ] API 문서화 (OpenAPI/Swagger)
- [ ] 성능 모니터링 도구 추가

### 7.2 중기 (1-2개월)
- [ ] ORM 마이그레이션 (TypeORM/Prisma)
- [ ] JSON-RPC 2.0 표준 채택
- [ ] 마이크로서비스 아키텍처 검토

### 7.3 장기 (3-6개월)
- [ ] GraphQL 도입 검토
- [ ] 클라우드 배포 자동화
- [ ] 모니터링 및 로깅 고도화

---

## 8. 결론

이번 리팩토링을 통해 다음과 같은 성과를 달성했습니다:

✅ **Type Safety**: any 타입 100% 제거, 타입 안전성 강화
✅ **Error Handling**: 예외 처리 개선, 앱 크래시 위험 제거
✅ **Code Quality**: 중복 제거, 코드 품질 향상
✅ **Architecture**: 의존성 정리, 계층 분리 개선
✅ **Performance**: 빌드 시간 28.9% 단축, 번들 크기 16% 감소

**최종 평가: ⭐⭐⭐⭐⭐ EXCELLENT**

---

## 9. 참고 문서

- 오류 분석 리포트: doc/log/XXX-error.md
- 리팩토링 계획: doc/log/XXX-improvement.md
- 의존성 그래프: doc/log/XXX-dependency-graph.md
- 의사결정 기록: doc/log/XXX-decision-tree.md
- 검증 체크리스트: doc/log/XXX-verification.md
```

---

## 🎯 핵심 원칙 (절대 준수)

| 원칙 | 설명 | 체크 |
|------|------|------|
| **순차 진행** | 단계를 건너뛰지 말 것 | ☐ |
| **ToT 활용** | 각 단계에서 여러 선택지 탐색 후 최선 선택 | ☐ |
| **GoT 추적** | 한 계층의 변경이 상위 계층에 미치는 영향 추적 | ☐ |
| **역 추적** | 변경 후 영향받는 모든 계층 검증 | ☐ |
| **문서화** | 모든 의사결정 및 근거 기록 | ☐ |
| **자동화 검증** | 린트, 타입 검사, 테스트 자동화 | ☐ |
| **단위 커밋** | 각 리팩토링 단계마다 git 커밋 | ☐ |
| **No Rollback** | 충분한 검증 후 진행 (롤백 최소화) | ☐ |

---

## 📞 문제 발생 시 체크리스트

### 컴파일 오류 발생
```bash
# 1. 타입 정의 확인
grep -r "any" src/

# 2. import 확인
npm run lint

# 3. 컴파일 재시도
npx tsc --noEmit

# 4. 빌드 재시도
npm run build
```

### 테스트 실패
```bash
# 1. 테스트 실행 (상세 로그)
npm run test -- --verbose

# 2. 특정 테스트만 실행
npm run test -- --testNamePattern="pattern"

# 3. 커버리지 확인
npm run test:coverage
```

### 의존성 순환 감지
```bash
# 1. 의존성 그래프 생성
npm run analyze:dependencies

# 2. 순환 의존성 확인
npm run check:circular

# 3. 의존성 시각화
npm run visualize:deps
```

---

**이 프롬프트는 전문가 수준의 시스템 리팩토링을 위해 Tree of Thought와 Graph of Thought를 체계적으로 적용합니다.**

**각 단계에서 의사결정을 명시화하고느느  계층 간 영향도를 추적하여 안전하고 효율적인 리팩토링을 보장합니다.**
