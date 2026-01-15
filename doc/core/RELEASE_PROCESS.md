# 릴리즈 프로세스

Octopus의 릴리즈는 GitHub Actions를 통해 자동화되어 있습니다.

## 버전 관리 전략

- **Semantic Versioning**: `MAJOR.MINOR.PATCH` 형식을 따릅니다
  - **MAJOR**: 하위 호환성이 없는 API 변경
  - **MINOR**: 하위 호환성이 있는 기능 추가
  - **PATCH**: 하위 호환성이 있는 버그 수정

## 릴리즈 절차

### 1. 버전 업데이트

```bash
# Patch 버전 업데이트 (0.0.1 -> 0.0.2)
npm run version:patch

# Minor 버전 업데이트 (0.0.1 -> 0.1.0)
npm run version:minor

# Major 버전 업데이트 (0.0.1 -> 1.0.0)
npm run version:major

# 특정 버전으로 설정
node scripts/bump-version.js 1.2.3
```

이 명령은 자동으로:
- `package.json`의 버전 업데이트
- `CHANGELOG.md`에 새 버전 섹션 추가

### 2. CHANGELOG 업데이트

`CHANGELOG.md`의 `[Unreleased]` 섹션을 편집하여 변경사항을 작성합니다:

```markdown
## [Unreleased]

### Added
- 새로운 기능 설명

### Fixed
- 버그 수정 내용

### Changed
- 변경된 사항
```

### 3. 변경사항 커밋 및 태그

```bash
# 변경사항 커밋
git add -A
git commit -m "chore: bump version to 0.1.0"

# 태그 생성
git tag -a v0.1.0 -m "Release v0.1.0"

# 푸시
git push origin main
git push origin v0.1.0
```

### 4. 자동 빌드 및 배포

태그가 푸시되면 GitHub Actions가 자동으로:

1. **테스트 실행**
   - Lint 검사
   - Unit 테스트
   - E2E 테스트

2. **멀티 플랫폼 빌드**
   - macOS (dmg, zip)
   - Windows (exe)
   - Linux (AppImage)

3. **GitHub Release 생성**
   - CHANGELOG에서 릴리즈 노트 추출
   - 빌드된 바이너리 자동 업로드

## 수동 트리거

긴급하게 릴리즈가 필요한 경우, GitHub Actions UI에서 수동으로 워크플로우를 실행할 수 있습니다:

1. GitHub 저장소의 **Actions** 탭으로 이동
2. **Release** 워크플로우 선택
3. **Run workflow** 클릭
4. 버전 입력 (예: `0.1.0`)
5. **Run workflow** 버튼 클릭

## 릴리즈 체크리스트

릴리즈 전에 다음 사항을 확인하세요:

- [ ] 모든 테스트가 통과하는가?
- [ ] CHANGELOG.md가 업데이트되었는가?
- [ ] 주요 변경사항이 문서화되었는가?
- [ ] 브레이킹 체인지가 있다면 마이그레이션 가이드가 있는가?
- [ ] 버전 번호가 Semantic Versioning을 따르는가?

## 빌드 산출물

릴리즈 빌드는 다음 위치에 생성됩니다:

```
release/
  └── 0.1.0/
      ├── Octopus_0.1.0_arm64.dmg      # macOS Apple Silicon
      ├── Octopus_0.1.0_x64.dmg        # macOS Intel
      ├── Octopus_0.1.0_arm64.zip      # macOS Apple Silicon (zip)
      ├── Octopus_0.1.0_x64.zip        # macOS Intel (zip)
      ├── Octopus Setup 0.1.0.exe      # Windows
      └── Octopus-0.1.0.AppImage       # Linux
```

## 트러블슈팅

### 빌드 실패

- **Node 버전 문제**: `.github/workflows/release.yml`에서 Node 버전 확인
- **의존성 문제**: `npm ci` 대신 `npm install` 시도
- **권한 문제**: `GH_TOKEN` secret이 올바르게 설정되었는지 확인

### 릴리즈 생성 실패

- `GITHUB_TOKEN` 권한 확인 (contents: write 필요)
- 태그 형식 확인 (v*.*.* 형식이어야 함)
- CHANGELOG.md 형식 확인

## 코드 서명 (선택사항)

프로덕션 배포를 위해서는 코드 서명을 권장합니다.
자세한 내용은 [코드 서명 가이드](./CODE_SIGNING.md)를 참조하세요.

**요약:**
- macOS: Apple Developer 계정 및 Developer ID 인증서 필요
- Windows: Code Signing Certificate (선택사항)
- GitHub Secrets에 인증서 정보 저장

## 참고 자료

- [Keep a Changelog](https://keepachangelog.com/)
- [Semantic Versioning](https://semver.org/)
- [electron-builder Documentation](https://www.electron.build/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [코드 서명 가이드](./CODE_SIGNING.md)
