# 릴리즈 모니터링 가이드

릴리즈가 푸시된 후 GitHub Actions 워크플로우를 모니터링하는 방법입니다.

---

## 🔍 워크플로우 상태 확인

### 1. GitHub Actions 페이지 접속

**URL**: https://github.com/inchan/octopus/actions

또는:
- 저장소 메인 페이지
- "Actions" 탭 클릭

### 2. Release 워크플로우 찾기

- 좌측 사이드바에서 "Release" 클릭
- 또는 최근 실행 목록에서 찾기

### 3. 상태 아이콘 이해

| 아이콘 | 의미 | 설명 |
|--------|------|------|
| 🟡 노란색 원 | 진행 중 | 워크플로우 실행 중 |
| 🟢 녹색 체크 | 성공 | 모든 작업 완료 |
| 🔴 빨간색 X | 실패 | 에러 발생 |
| ⚪ 회색 원 | 대기 중 | 이전 작업 완료 대기 |

---

## 📊 워크플로우 단계별 모니터링

### Stage 1: Test Job (~5분)

**목적**: 코드 품질 검증

```
✓ Checkout code
✓ Setup Node.js 20
✓ Install dependencies (npm ci)
✓ Run lint
✓ Run unit tests
✓ Cache Playwright browsers
✓ Install Playwright (필요시)
✓ Run E2E tests
```

**예상 시간**: 3-7분  
**실패 가능성**: 중간 (테스트 실패 가능)

**일반적인 실패 원인**:
- Lint 에러
- 테스트 실패
- Playwright 브라우저 설치 실패

### Stage 2: Release Jobs (병렬, ~15-20분)

**목적**: 멀티 플랫폼 빌드

#### 2-1. macOS Build

```
✓ Checkout code
✓ Setup Node.js 20
✓ Install dependencies (npm ci)
✓ Rebuild native modules (better-sqlite3)
✓ Build app (electron-builder)
✓ Upload artifacts (dmg, zip)
```

**예상 시간**: 10-15분  
**실패 가능성**: 높음 (네이티브 모듈)

**일반적인 실패 원인**:
- electron-rebuild 실패
- 메모리 부족
- 코드 서명 문제 (설정된 경우)

#### 2-2. Windows Build

```
✓ Checkout code
✓ Setup Node.js 20
✓ Install dependencies (npm ci)
✓ Rebuild native modules (better-sqlite3)
✓ Build app (electron-builder)
✓ Upload artifacts (exe)
```

**예상 시간**: 12-18분  
**실패 가능성**: 높음

**일반적인 실패 원인**:
- Windows 빌드 환경 문제
- 네이티브 모듈 컴파일 실패
- NSIS 설치 문제

#### 2-3. Linux Build

```
✓ Checkout code
✓ Setup Node.js 20
✓ Install dependencies (npm ci)
✓ Rebuild native modules (better-sqlite3)
✓ Build app (electron-builder)
✓ Upload artifacts (AppImage)
```

**예상 시간**: 8-12분  
**실패 가능성**: 낮음 (가장 안정적)

### Stage 3: Create Release (~2분)

**목적**: GitHub Release 생성

```
✓ Checkout code
✓ Download all artifacts
✓ Extract version from tag
✓ Generate changelog
✓ Create GitHub Release
✓ Upload binaries
```

**예상 시간**: 1-3분  
**실패 가능성**: 낮음

**일반적인 실패 원인**:
- GITHUB_TOKEN 권한 부족
- Artifact 다운로드 실패
- CHANGELOG 파싱 오류

---

## 🎯 각 단계별 체크리스트

### Test Job 완료 시

- [ ] 모든 테스트 통과 확인
- [ ] Lint 에러 없음 확인
- [ ] E2E 테스트 스크린샷 확인 (실패 시)

### Release Jobs 완료 시

- [ ] macOS artifacts 업로드 확인 (dmg, zip)
- [ ] Windows artifacts 업로드 확인 (exe)
- [ ] Linux artifacts 업로드 확인 (AppImage)
- [ ] 각 플랫폼 빌드 시간 확인

### Create Release 완료 시

- [ ] Release 페이지 생성 확인
- [ ] 모든 바이너리 첨부 확인
- [ ] 릴리즈 노트 자동 생성 확인
- [ ] 버전 태그 정확성 확인

---

## 🔧 문제 해결

### 워크플로우가 시작되지 않음

**증상**: Actions 페이지에 아무것도 표시되지 않음

**해결 방법**:

1. **Settings > Actions > General** 확인
   - "Allow all actions and reusable workflows" 선택 확인
   - "Read and write permissions" 확인

2. **태그 형식 확인**
   ```bash
   git tag -l
   # v0.0.2 형식이어야 함 (v*.*.*)
   ```

3. **워크플로우 파일 확인**
   ```bash
   cat .github/workflows/release.yml | grep "tags:"
   # - 'v*.*.*' 확인
   ```

4. **수동 실행 시도**
   - Actions > Release 워크플로우
   - "Run workflow" 버튼 클릭

### Test Job 실패

**증상**: 빨간색 X 표시

**해결 방법**:

1. **로그 확인**
   - Job 클릭 → 실패한 단계 펼치기
   - 에러 메시지 복사

2. **로컬 테스트**
   ```bash
   npm run lint
   npm run test
   npm run test:e2e
   ```

3. **일반적인 수정**
   - Lint 에러: 코드 수정 후 재푸시
   - 테스트 실패: 테스트 수정 후 재푸시
   - E2E 실패: Playwright 버전 확인

### Build Job 실패

**증상**: macOS/Windows/Linux 빌드 실패

**해결 방법**:

1. **네이티브 모듈 문제**
   ```bash
   # 로컬에서 테스트
   npm run prebuild
   npm run build
   ```

2. **메모리 부족**
   - 워크플로우에 메모리 설정 추가 필요
   - 또는 빌드 최적화

3. **의존성 문제**
   ```bash
   # package-lock.json 동기화 확인
   npm ci
   ```

### Create Release 실패

**증상**: Release 생성 안 됨

**해결 방법**:

1. **권한 확인**
   - Settings > Actions > General
   - Workflow permissions: "Read and write permissions"

2. **CHANGELOG 확인**
   ```bash
   cat CHANGELOG.md | grep "## \[0.0.2\]"
   ```

3. **수동 Release 생성**
   - Releases > "Draft a new release"
   - Tag: v0.0.2 선택
   - 수동으로 바이너리 업로드

---

## 📱 실시간 알림 설정

### GitHub 알림 활성화

1. **저장소 설정**
   - "Watch" 버튼 클릭
   - "Custom" 선택
   - "Actions" 체크

2. **이메일 알림**
   - Settings > Notifications
   - "Actions" 섹션 확인

3. **모바일 앱**
   - GitHub 모바일 앱 설치
   - 알림 활성화

---

## ⏱️ 예상 타임라인

```
00:00  🚀 Tag v0.0.2 푸시
00:01  🟡 Workflow 시작
00:02  🟡 Test Job 시작
00:07  ✅ Test Job 완료
00:08  🟡 Build Jobs 시작 (병렬)
       ├─ macOS Build
       ├─ Windows Build
       └─ Linux Build
00:20  ✅ Linux Build 완료
00:23  ✅ macOS Build 완료
00:25  ✅ Windows Build 완료
00:26  🟡 Create Release 시작
00:28  ✅ Create Release 완료
       🎉 릴리즈 완료!
```

**총 소요 시간**: 20-30분

---

## 📋 완료 후 체크리스트

릴리즈가 완료되면 다음을 확인하세요:

### Release 페이지

- [ ] https://github.com/inchan/octopus/releases/tag/v0.0.2 접속
- [ ] 릴리즈 제목 확인: "v0.0.2"
- [ ] 릴리즈 노트 자동 생성 확인
- [ ] 다운로드 섹션 확인

### 다운로드 가능한 파일

- [ ] **macOS (Apple Silicon)**: `Octopus_0.0.2_arm64.dmg`
- [ ] **macOS (Intel)**: `Octopus_0.0.2_x64.dmg`
- [ ] **macOS (Zip)**: `Octopus_0.0.2_arm64.zip`, `Octopus_0.0.2_x64.zip`
- [ ] **Windows**: `Octopus Setup 0.0.2.exe`
- [ ] **Linux**: `Octopus-0.0.2.AppImage`

### 파일 크기 확인

예상 크기:
- macOS dmg: ~100-150MB
- macOS zip: ~100-150MB
- Windows exe: ~80-120MB
- Linux AppImage: ~100-140MB

### 다운로드 테스트

- [ ] 하나의 바이너리 다운로드
- [ ] 파일 무결성 확인
- [ ] 설치/실행 테스트 (가능한 경우)

---

## 🎉 성공 시 다음 단계

릴리즈가 성공적으로 완료되면:

1. **공지**
   - GitHub Discussions에 릴리즈 공지
   - README.md 다운로드 링크 업데이트

2. **문서화**
   - Confluence에 릴리즈 노트 공유
   - Jira에 완료 티켓 생성

3. **마케팅**
   - 소셜 미디어 공유
   - 블로그 포스트 작성

4. **피드백 수집**
   - 이슈 모니터링
   - 사용자 피드백 수집

---

## 📞 도움말

문제가 해결되지 않으면:

- **GitHub Issues**: https://github.com/inchan/octopus/issues
- **GitHub Discussions**: https://github.com/inchan/octopus/discussions
- **Actions 문서**: https://docs.github.com/en/actions

---

**작성일**: 2025-01-15  
**버전**: 1.0
