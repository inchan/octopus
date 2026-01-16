# 배포 체크리스트

서명되지 않은 macOS 앱 배포를 위한 체크리스트입니다.

## 배포 전 검증

### 1. 코드 품질
- [ ] `npx tsc --noEmit` - 타입 오류 없음
- [ ] `npm run lint` - 린트 통과 (경고는 허용)
- [ ] `npm run test` - 단위 테스트 통과

### 2. 빌드 설정 확인
- [ ] `package.json`
  - [ ] `mac.target: ["dmg"]` - DMG 배포
  - [ ] `mac.identity: "-"` - Ad-hoc 서명 (자체 서명)
  - [ ] `mac.hardenedRuntime: true` - Apple Silicon 호환
  - [ ] `mac.entitlements` 경로 설정됨
- [ ] `build/entitlements.mac.plist` 파일 존재
- [ ] `.github/workflows/release.yml`
  - [ ] `CSC_IDENTITY_AUTO_DISCOVERY: false` 설정됨
  - [ ] DMG 아티팩트 업로드 설정됨

### 3. 문서 확인
- [ ] `README.md`에 macOS 설치 가이드 포함
- [ ] `doc/UNSIGNED_APP_DISTRIBUTION.md` 문서 존재
- [ ] `doc/배포.md` 업데이트됨
- [ ] Release Notes에 설치 가이드 포함 예정

### 4. 로컬 빌드 테스트 (선택사항)

```bash
# 아이콘 생성
npm run icons:generate
npm run icons:ico

# Native 모듈 빌드
npm run prebuild

# 전체 빌드 (macOS만)
npm run build
```

빌드 성공 시 다음 위치에 파일 생성:
```
release/0.0.7/
  ├── Octopus_0.0.7_arm64.dmg
  ├── Octopus_0.0.7_x64.dmg
  └── mac/Octopus.app
```

### 5. 버전 관리
- [ ] `package.json` 버전 확인
- [ ] `CHANGELOG.md` 업데이트
- [ ] Git 태그 생성 준비: `v0.0.7`

## 배포 절차

### 방법 1: Git 태그로 자동 배포 (권장)

```bash
# 1. 모든 변경사항 커밋
git add -A
git commit -m "chore: update unsigned app distribution setup"

# 2. 태그 생성 및 푸시
git tag v0.0.7
git push origin main --tags

# 3. GitHub Actions 자동 실행 대기
# 4. https://github.com/inchan/octopus/actions 에서 진행 상황 확인
```

### 방법 2: 수동 워크플로우 실행

1. GitHub 저장소의 **Actions** 탭 이동
2. **Release** 워크플로우 선택
3. **Run workflow** 클릭
4. 버전 입력 (예: `0.0.7`)
5. **Run workflow** 실행

## 배포 후 확인

### 1. GitHub Actions 확인
- [ ] Test 작업 성공
- [ ] macOS 빌드 성공
- [ ] Windows 빌드 성공 (선택사항)
- [ ] Linux 빌드 성공 (선택사항)
- [ ] Artifacts 업로드 성공

### 2. GitHub Release 확인
- [ ] Release 페이지 생성됨
- [ ] DMG 파일 업로드됨
- [ ] Release Notes에 설치 가이드 포함
- [ ] 다운로드 링크 작동

### 3. 다운로드 및 설치 테스트
- [ ] DMG 파일 다운로드
- [ ] DMG 마운트 성공
- [ ] 드래그 앤 드롭 UI 확인
- [ ] 앱을 Applications로 복사
- [ ] 우클릭 → 열기로 첫 실행 성공
- [ ] 앱 정상 작동 확인

## 트러블슈팅

### 빌드 실패

**문제**: `better-sqlite3` 빌드 실패
```bash
# 해결: Native 모듈 재빌드
npm run prebuild
```

**문제**: 아이콘 파일 없음
```bash
# 해결: 아이콘 재생성
npm run icons:generate
npm run icons:ico
```

### "손상됨" 오류 여전히 발생

**원인**: 
1. DMG로 빌드된 경우
2. 사용자가 더블클릭으로 실행한 경우

**해결**:
1. ZIP으로 빌드되었는지 확인
2. 사용자에게 "우클릭 → 열기" 방법 안내

### GitHub Actions 실패

**문제**: CSC 관련 오류
```
Error: CSC_LINK is not set
```

**해결**: `CSC_IDENTITY_AUTO_DISCOVERY: false`가 설정되었는지 확인

## 참고 문서

- [서명되지 않은 앱 배포 가이드](./UNSIGNED_APP_DISTRIBUTION.md)
- [릴리즈 프로세스](./core/RELEASE_PROCESS.md)
- [코드 서명 가이드](./core/CODE_SIGNING.md)

## 엔트로피 경로 점수

**현재 점수: 1/10** (매우 낮음 - 안전)

체크리스트를 따르면 안정적인 배포가 가능합니다.
