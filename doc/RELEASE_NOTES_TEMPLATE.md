# Release Notes Template

GitHub Releases에 포함할 릴리즈 노트 템플릿입니다.

---

## 📦 다운로드

### macOS

⚠️ **중요**: 개발자 서명이 없는 앱이므로 첫 실행 시 특별한 방법이 필요합니다.

**다운로드**:
- **Apple Silicon (M1/M2/M3)**: `Octopus_x.x.x_arm64.zip`
- **Intel Mac**: `Octopus_x.x.x_x64.zip`

**설치 방법** (터미널 명령어 불필요):

1. ZIP 파일을 다운로드하고 압축을 풉니다
2. `Octopus.app`을 Applications 폴더로 이동합니다
3. **첫 실행** (중요 ⚠️):
   - ❌ 더블클릭하지 마세요 ("손상됨" 오류 발생)
   - ✅ **앱 아이콘을 우클릭 (또는 Control + 클릭)**
   - ✅ 메뉴에서 **"열기"** 선택
   - ✅ 경고창에서 **"열기"** 버튼 클릭
4. 한 번 실행한 후에는 평소처럼 더블클릭으로 실행 가능합니다

**왜 이런 과정이 필요한가요?**

Apple Developer Program($99/년)에 가입하지 않아 앱이 공식 서명/공증을 받지 못했습니다. 
"우클릭 → 열기"는 Apple이 공식적으로 제공하는 방법으로, 사용자가 앱을 신뢰한다는 것을 시스템에 알립니다.

**고급 사용자를 위한 터미널 방법**:
```bash
xattr -cr /Applications/Octopus.app
```

### Windows

- `Octopus Setup x.x.x.exe` 다운로드 후 일반적인 방법으로 설치

### Linux

- `Octopus-x.x.x.AppImage` 다운로드 후 실행 권한 부여:
  ```bash
  chmod +x Octopus-x.x.x.AppImage
  ./Octopus-x.x.x.AppImage
  ```

---

## ✨ 주요 변경사항

### Added
- 새로운 기능 설명

### Fixed
- 버그 수정 내용

### Changed
- 변경된 사항

### Deprecated
- 향후 제거될 기능

---

## 📝 전체 변경 로그

[CHANGELOG.md](./CHANGELOG.md)에서 전체 변경 로그를 확인하세요.

---

## 🐛 문제 신고

이슈가 있으시면 [GitHub Issues](https://github.com/inchan/octopus/issues)에 신고해주세요.
