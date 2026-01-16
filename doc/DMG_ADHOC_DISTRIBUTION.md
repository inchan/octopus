# DMG + Ad-hoc 서명 배포 가이드

## 개요

유료 Apple Developer 계정 없이 DMG 형식으로 macOS 앱을 배포하는 가이드입니다.

## 핵심 전략

### DMG vs ZIP 비교

| 항목 | DMG | ZIP |
|------|-----|-----|
| **사용자 경험** | ✅ 우수 (드래그 앤 드롭 UI) | ⚠️ 수동 압축 해제 |
| **배포 형식** | ✅ macOS 표준 | ⚠️ 범용 압축 |
| **Gatekeeper 우회** | "우클릭 → 열기" | "우클릭 → 열기" |
| **설치 과정** | ✅ 직관적 (드래그만) | ⚠️ 수동 (압축 해제 → 이동) |
| **전문성** | ✅ 프로페셔널 | ⚠️ 간단함 |

### 선택: DMG 배포 (Ad-hoc 서명)

**이유**:
1. **더 나은 UX**: 드래그 앤 드롭 UI
2. **macOS 표준**: 사용자에게 익숙함
3. **동일한 보안**: ZIP과 동일하게 "우클릭 → 열기" 필요
4. **프로페셔널**: 정식 배포 느낌

## 설정

### package.json

```json
{
  "build": {
    "mac": {
      "target": ["dmg"],                              // DMG 생성
      "identity": "-",                                // Ad-hoc 서명
      "hardenedRuntime": true,                        // Apple Silicon 필수
      "entitlements": "build/entitlements.mac.plist",
      "entitlementsInherit": "build/entitlements.mac.plist",
      "gatekeeperAssess": false,
      "category": "public.app-category.developer-tools"
    }
  }
}
```

### build/entitlements.mac.plist

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

### GitHub Actions (.github/workflows/release.yml)

```yaml
- name: Build application
  run: npm run build
  env:
    GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
    DEBUG: electron-builder
    CSC_IDENTITY_AUTO_DISCOVERY: false

- name: Upload artifacts (macOS)
  uses: actions/upload-artifact@v4
  with:
    name: octopus-mac
    path: |
      release/**/*.dmg
```

## 작동 원리

### 1. 빌드 프로세스

```
npm run build
    ↓
electron-builder 실행
    ↓
Octopus.app 생성 + Ad-hoc 서명
    ↓
DMG 생성 (서명된 앱 포함)
    ↓
release/0.0.7/Octopus_0.0.7_arm64.dmg
```

### 2. electron-builder의 DMG 생성 과정

```bash
# 1. 앱 번들 서명
codesign --sign - \
  --force \
  --options runtime \
  --entitlements build/entitlements.mac.plist \
  Octopus.app

# 2. DMG 이미지 생성
hdiutil create -volname "Octopus" \
  -srcfolder Octopus.app \
  -ov -format UDZO \
  Octopus_0.0.7_arm64.dmg

# 3. DMG는 서명되지 않음 (Ad-hoc 서명 불필요)
# 중요한 것은 내부 앱의 서명!
```

### 3. 사용자 다운로드 및 설치

```
사용자가 DMG 다운로드
    ↓
DMG 더블클릭 → 마운트
    ↓
드래그 앤 드롭 UI 표시
    ↓
Octopus.app을 Applications로 드래그
    ↓
앱이 복사됨 (quarantine 속성 포함)
    ↓
첫 실행 시도 → Gatekeeper 차단
    ↓
우클릭 → "열기" → 실행!
```

## 사용자 가이드

### macOS 설치 방법

⚠️ **중요**: 개발자 서명이 없는 앱이므로 특별한 실행 방법이 필요합니다.

#### 설치 단계

1. **DMG 다운로드**
   - [Releases](https://github.com/inchan/octopus/releases)에서 최신 버전 다운로드
   - Apple Silicon (M1/M2/M3): `Octopus_x.x.x_arm64.dmg`
   - Intel Mac: `Octopus_x.x.x_x64.dmg`

2. **DMG 마운트**
   - 다운로드한 DMG 파일을 더블클릭
   - Finder에 드래그 앤 드롭 창이 표시됩니다

3. **설치**
   - `Octopus.app` 아이콘을 `Applications` 폴더로 드래그
   - 복사가 완료될 때까지 대기
   - DMG 창을 닫고 언마운트

4. **첫 실행** (중요 ⚠️)
   - Applications 폴더를 엽니다
   - ❌ **Octopus 앱을 더블클릭하지 마세요** ("손상됨" 오류 발생)
   - ✅ **앱 아이콘을 우클릭 (또는 Control + 클릭)**
   - ✅ 메뉴에서 **"열기"** 선택
   - ✅ 경고창에서 **"열기"** 버튼 클릭

5. **이후 실행**
   - 한 번 이렇게 실행한 후에는 평소처럼 더블클릭으로 실행 가능합니다

### 왜 이런 과정이 필요한가요?

Apple Developer Program($99/년)에 가입하지 않아 앱이 공식 서명/공증을 받지 못했습니다.

macOS Gatekeeper는 인터넷에서 다운로드한 서명되지 않은 앱을 차단하지만, **"우클릭 → 열기"는 Apple이 공식적으로 제공하는 안전한 우회 방법**입니다.

한 번 이 방법으로 실행하면 macOS가 앱을 신뢰하며, 이후에는 평소처럼 사용할 수 있습니다.

### 고급 사용자를 위한 터미널 방법

```bash
# Applications 폴더의 앱에서 quarantine 속성 제거
xattr -cr /Applications/Octopus.app

# 이후 더블클릭으로 바로 실행 가능
```

## Gatekeeper 동작 원리

### 1. Quarantine 속성

```bash
# 다운로드된 DMG 확인
xattr Octopus_0.0.7_arm64.dmg
# 출력: com.apple.quarantine

# DMG에서 설치한 앱 확인
xattr /Applications/Octopus.app
# 출력: com.apple.quarantine (DMG에서 전파됨)
```

### 2. Gatekeeper 검증

```
앱 실행 시도
    ↓
Gatekeeper 검증
    ↓
com.apple.quarantine 확인 → 있음
    ↓
코드 서명 확인 → Ad-hoc (신뢰되지 않음)
    ↓
차단: "손상되었습니다" 오류
```

### 3. "우클릭 → 열기" 우회

```
우클릭 → "열기"
    ↓
사용자가 명시적으로 신뢰 표시
    ↓
Gatekeeper 우회
    ↓
앱 실행
    ↓
com.apple.quarantine 속성 제거됨
    ↓
이후 더블클릭으로 실행 가능
```

## DMG + Ad-hoc 서명의 장점

### 사용자 관점

1. **직관적 설치**
   - 드래그 앤 드롭 UI
   - macOS 표준 설치 방법
   - 압축 해제 불필요

2. **프로페셔널한 느낌**
   - 정식 앱처럼 보임
   - 아이콘과 배경 커스터마이징 가능

3. **한 번만 우회**
   - 첫 실행 시 "우클릭 → 열기" 한 번만
   - 이후 일반 앱처럼 사용

### 개발자 관점

1. **무료**
   - Apple Developer 계정 불필요
   - 비용 $0

2. **안정적**
   - Ad-hoc 서명으로 Apple Silicon 호환
   - hardenedRuntime + entitlements 사용

3. **자동화**
   - GitHub Actions에서 자동 빌드
   - 별도 서명 작업 불필요

4. **업그레이드 경로**
   - 향후 Developer ID로 쉽게 전환
   - 설정 변경만으로 공증 추가 가능

## GitHub Actions 설정

### 환경 변수

```yaml
env:
  GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
  DEBUG: electron-builder                    # 상세 로그
  CSC_IDENTITY_AUTO_DISCOVERY: false         # 인증서 탐색 비활성화
```

**필요 없는 것**:
- ❌ CSC_LINK
- ❌ CSC_KEY_PASSWORD
- ❌ APPLE_ID
- ❌ APPLE_APP_SPECIFIC_PASSWORD
- ❌ APPLE_TEAM_ID

### 빌드 아티팩트

```yaml
- name: Upload artifacts (macOS)
  uses: actions/upload-artifact@v4
  with:
    name: octopus-mac
    path: |
      release/**/*.dmg
```

### Release 파일

```yaml
files: |
  artifacts/**/*.dmg
  artifacts/**/*.exe
  artifacts/**/*.AppImage
```

## 테스트 체크리스트

### 로컬 빌드

- [ ] `npm run build` 성공
- [ ] `release/0.0.7/Octopus_x.x.x_arm64.dmg` 생성 확인
- [ ] DMG 마운트 성공
- [ ] 앱 서명 확인: `codesign -dv /Volumes/Octopus/Octopus.app`
  - [ ] `Signature=adhoc` 확인
- [ ] 드래그 앤 드롭 UI 확인

### GitHub Actions

- [ ] 워크플로우 성공
- [ ] DMG 아티팩트 업로드 확인
- [ ] Release에 DMG 첨부 확인

### 사용자 테스트

- [ ] DMG 다운로드
- [ ] DMG 마운트
- [ ] 앱을 Applications로 드래그
- [ ] 우클릭 → 열기로 첫 실행
- [ ] 앱 정상 작동 확인
- [ ] 두 번째 실행 (더블클릭) 성공

## 트러블슈팅

### 문제: "손상되었습니다" 오류

**증상**: DMG에서 설치 후 앱 실행 시 차단

**원인**: Gatekeeper가 Ad-hoc 서명 앱을 차단

**해결**:
1. 우클릭 → "열기" (권장)
2. 또는 터미널: `xattr -cr /Applications/Octopus.app`

### 문제: DMG 마운트 실패

**증상**: DMG를 열 수 없음

**원인**: DMG 파일 손상 또는 다운로드 불완전

**해결**:
1. DMG 파일 크기 확인
2. 재다운로드
3. 다른 브라우저 시도

### 문제: 드래그 앤 드롭 UI가 안 보임

**증상**: DMG 마운트 시 UI 없음

**원인**: electron-builder DMG 설정 문제 (드물음)

**해결**: Finder에서 마운트된 볼륨 열기

## 향후 업그레이드

### Developer ID로 전환

Apple Developer Program에 가입 후:

```json
{
  "mac": {
    "identity": "Developer ID Application: Your Name (TEAM_ID)"
  }
}
```

GitHub Secrets 추가:
- `CSC_LINK`
- `CSC_KEY_PASSWORD`

### 공증 추가

```json
{
  "mac": {
    "notarize": {
      "teamId": "TEAM_ID"
    }
  },
  "afterSign": "scripts/notarize.js"
}
```

공증 후에는 사용자가 "우클릭 → 열기" 없이 바로 실행 가능!

## 참고 자료

- [electron-builder - DMG Options](https://www.electron.build/configuration/dmg)
- [Apple - Safely open apps](https://support.apple.com/en-us/102445)
- [Ad-hoc 서명 상세 가이드](./AD_HOC_SIGNING_EXPLAINED.md)

## 결론

**DMG + Ad-hoc 서명은**:
- ✅ 무료 배포의 최선의 선택
- ✅ 프로페셔널한 사용자 경험
- ✅ "우클릭 → 열기" 한 번만 필요
- ✅ GitHub Actions에서 자동 빌드
- ✅ 향후 쉽게 업그레이드 가능

**엔트로피 경로 점수: 1/10** (매우 안전)
