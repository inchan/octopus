# 2. 프로젝트 구조 및 계층 정의 (Project Structure & Layer Definition)

## 2.1 개념적 계층 (Conceptual Layers)
```text
[Renderer Process]      [Bridge]           [Main Process]
+----------------+    +----------+    +------------------------+
|  Presentation  | -> |  IPC     | -> |  Controller (Handler)  |
|  (React/View)  |    | (Preload)|    |      (Input Validation)|
+----------------+    +----------+    +-----------+------------+
                                                  |
                                          +-------v-------+
                                          |  Service Layer| <--- 핵심 비즈니스 로직
                                          |  (Use Cases)  |      (Pure TypeScript)
                                          +-------+-------+
                                                  |
                                          +-------v-------+
                                          | Infrastructure|
                                          | (DB/FS/System)|
                                          +---------------+

```

## 2.2 디렉토리 구조 (Directory Structure)

이 구조는 모노레포 스타일을 따르며, 관심사를 물리적으로 분리합니다.

* **`electron/` (Backend Scope)**
* `main.ts`: 앱의 생명주기(Lifecycle) 관리.
* `preload.ts`: `contextBridge` 정의.
* `handlers/`: IPC 요청을 받아 Service로 연결하는 계층.
* `services/`: 핵심 비즈니스 로직 (외부 의존성 최소화).
* `repositories/`: 실제 DB/파일 시스템 접근 구현체.


* **`src/` (Frontend Scope)**
* `components/`: 재사용 가능한 UI 컴포넌트 (Presentational).
* `features/`: 도메인별 기능 단위 (Container/Smart Components).
* `hooks/queries/`: TanStack Query를 사용한 서버 상태 동기화 훅.
* `store/`: 클라이언트 전용 상태 (Zustand).


* **`shared/` (Common Scope)**
* `types/`: IPC 통신에 사용되는 DTO(Data Transfer Object) 및 인터페이스 정의.
