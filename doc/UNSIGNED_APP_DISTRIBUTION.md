# 서명되지 않은 앱 배포 가이드

## 문제 상황

macOS에서 유료 Apple Developer 계정($99/년) 없이 Electron 앱을 배포할 때, 사용자가 다운로드 후 다음과 같은 오류를 경험합니다:

```
"Octopus"은(는) 손상되었기 때문에 열 수 없습니다. 
해당 항목을 휴지통으로 이동해야 합니다.
```

이는 macOS **Gatekeeper**의 보안 정책 때문이며, 공증(Notarization)되지 않은 앱에 `com.apple.quarantine` 속성이 부여되어 실행이 차단됩니다.

## 해결 전략

### 핵심 원칙
1. **DMG → ZIP 배포로 전환**: DMG는 마운트 시점에 엄격한 검증이 일어나지만, ZIP은 압축 해제 후 사용자가 "우클릭 → 열기"로 Gatekeeper를 우회할 수 있습니다.
2. **명시적 Ad-hoc 서명**: `identity: "-"`로 설정하여 자체 서명을 적용합니다. 이를 통해 hardenedRuntime과 entitlements를 사용할 수 있어 Apple Silicon에서 안정적으로 실행됩니다.
3. **사용자 가이드 제공**: 터미널 명령어 없이 실행할 수 있는 방법을 안내합니다.

## 구현 방안

### 1. Entitlements 파일 생성

Apple Silicon 호환성과 안정적인 실행을 위해 필요합니다.

**파일 위치**: `build/entitlements.mac.plist`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
  <dict>
    <key>com.apple.security.cs.allow-jit</key>
    <true/>
    <key>com.apple.security.cs.allow-unsigned-executable-memory</key>
    <true/>
    <key>com.apple.security.cs.debugger</key>
    <true/>
  </dict>
</plist>
```

### 2. package.json 수정

```json
{
  "build": {
    "mac": {
      "target": ["zip"],  // dmg 제거, zip만 사용
      "identity": "-",    // Ad-hoc 서명 (자체 서명)
      "hardenedRuntime": true,  // Apple Silicon 필수
      "entitlements": "build/entitlements.mac.plist",
      "entitlementsInherit": "build/entitlements.mac.plist",
      "gatekeeperAssess": false,
      "category": "public.app-category.developer-tools"
    }
  }
}
```

### 3. GitHub Actions 워크플로우 수정

**`.github/workflows/release.yml`**

```yaml
- name: Build application
  shell: bash
  run: npm run build
  env:
    GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
    DEBUG: electron-builder
    CSC_IDENTITY_AUTO_DISCOVERY: false  # 인증서 자동 탐색 비활성화
```

### 4. 사용자 설치 가이드

README와 GitHub Releases에 다음 가이드를 포함해야 합니다:

```markdown
## macOS 설치 가이드

⚠️ **중요**: 개발자 서명이 포함되지 않은 앱이므로 보안 경고가 표시될 수 있습니다.

### 설치 방법 (터미널 명령어 불필요)

1. **ZIP 파일 다운로드**: `Octopus_x.x.x_arm64.zip` (Apple Silicon) 또는 `Octopus_x.x.x_x64.zip` (Intel)
2. **압축 해제**: 다운로드한 ZIP 파일을 더블클릭하여 압축을 풉니다
3. **Applications 폴더로 이동**: `Octopus.app`을 Applications 폴더로 드래그합니다
4. **첫 실행 (중요)**:
   - ❌ 더블클릭하지 마세요 (오류 발생)
   - ✅ **앱 아이콘을 우클릭 (또는 Control + 클릭)**
   - ✅ 메뉴에서 **"열기"** 선택
   - ✅ 경고창에서 **"열기"** 버튼 클릭
5. **이후 실행**: 한 번 이렇게 실행한 후에는 평소처럼 더블클릭으로 실행 가능합니다

### 왜 이런 과정이 필요한가요?

Apple Developer Program에 가입하지 않은 개발자가 배포한 앱은 macOS Gatekeeper의 보안 검증을 받지 않습니다. 
"우클릭 → 열기" 방식은 Apple이 공식적으로 제공하는 방법으로, 사용자가 의도적으로 앱을 신뢰한다는 것을 시스템에 알립니다.

### 고급 사용자를 위한 터미널 방법

```bash
# Quarantine 속성 제거 (선택사항)
xattr -cr /Applications/Octopus.app
```
```

## DMG vs ZIP 비교

| 항목 | DMG | ZIP |
|------|-----|-----|
| 서명 없이 배포 | ❌ 어려움 (마운트 시 차단) | ✅ 가능 (우클릭 열기로 우회) |
| 사용자 경험 | ✅ 드래그 앤 드롭 UI | ⚠️ 수동 압축 해제 |
| 파일 크기 | 비슷 | 비슷 |
| 보안 경고 | 즉시 차단 | 우회 가능 |
| 추천 | 서명된 앱 | **서명되지 않은 앱** |

## 대안: Homebrew Cask 배포

개발자 도구이므로 Homebrew를 통한 배포도 고려할 수 있습니다.

### 장점
- Homebrew가 설치 과정에서 quarantine 속성을 자동으로 처리
- 개발자 사용자에게 익숙한 설치 방법
- 업데이트 관리 용이

### 구현 (향후 계획)

1. `homebrew-octopus` 저장소 생성
2. Cask 파일 작성
3. 사용자 설치: `brew install inchan/octopus/octopus`

## 테스트 체크리스트

배포 전 다음을 확인하세요:

- [ ] `build/entitlements.mac.plist` 파일 존재
- [ ] `package.json`에서 `identity: "-"`, `target: ["zip"]` 확인
- [ ] GitHub Actions에서 `CSC_IDENTITY_AUTO_DISCOVERY: false` 설정
- [ ] README에 설치 가이드 포함
- [ ] 로컬에서 `npm run build` 성공
- [ ] 생성된 ZIP 파일 압축 해제 및 "우클릭 → 열기" 테스트

## 참고 자료

- [Apple - Safely open apps on your Mac](https://support.apple.com/en-us/102445)
- [electron-builder - Code Signing](https://www.electron.build/code-signing)
- [Gatekeeper 우회 방법](https://disable-gatekeeper.github.io/)

## 엔트로피 경로 점수

**현재 점수: 2/10** (낮음 - 안전)

- ✅ 표준 macOS 보안 모델 준수
- ✅ Apple 공식 우회 방법 사용
- ✅ 사용자에게 명확한 가이드 제공
- ⚠️ 향후 Homebrew 배포 고려 시 추가 복잡도 증가 가능
