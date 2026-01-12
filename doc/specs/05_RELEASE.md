# Phase 5: 릴리스 엔지니어링 및 폴리싱

## 1. 목표
보안, 안정성, 빌드 자동화에 중점을 두어 `Octopus`를 프로덕션 배포 가능한 상태로 준비합니다.

## 2. 보안 (Security)
### 콘텐츠 보안 정책 (Content Security Policy, CSP)
XSS 및 승인되지 않은 리소스 로딩을 방지하기 위한 엄격한 CSP 설정.
```html
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:;">
```

## 3. 에러 핸들링 (Error Handling)
### 전역 에러 바운더리 (Global Error Boundary)
- React 렌더링 에러 포착.
- 사용자 친화적인 "문제가 발생했습니다" UI 표시.
- "새로고침(Reload)" 버튼 제공.

### Main 프로세스 에러
- `uncaughtException` 및 `unhandledRejection` 포착.
- 에러 로그 기록 (현재는 콘솔, 추후 파일 로거 도입).

## 4. 빌드 구성 (Build Configuration)
- 타겟: macOS (`dmg`, `zip`).
- App ID: `com.octopus.app`
- 제품명: `Octopus`

## 5. CI/CD
- GitHub Actions 워크플로우: `main` 브랜치 푸시 시 빌드 및 테스트 수행.
