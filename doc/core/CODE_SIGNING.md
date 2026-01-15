# 코드 서명 (Code Signing) 가이드

macOS 및 Windows 배포를 위한 코드 서명 설정 가이드입니다.

## macOS 코드 서명 및 공증 (Notarization)

macOS에서 앱을 배포하려면 Apple Developer 계정이 필요하며, 코드 서명 및 공증 과정이 필수입니다.

### 1. 요구사항

- Apple Developer Program 가입 ($99/year)
- Developer ID Application 인증서
- App-specific password

### 2. 인증서 생성

1. **Keychain Access**에서 인증서 요청 생성
2. [Apple Developer](https://developer.apple.com/account/resources/certificates/add) 에서 "Developer ID Application" 인증서 생성
3. 다운로드 후 Keychain에 설치

### 3. 인증서 내보내기

```bash
# Keychain에서 인증서를 .p12 파일로 내보내기
# 비밀번호 설정 필요

# Base64로 인코딩 (GitHub Secrets에 저장하기 위함)
base64 -i certificate.p12 -o certificate_base64.txt
```

### 4. App-specific Password 생성

1. [Apple ID 계정](https://appleid.apple.com/) 접속
2. **보안** 섹션에서 **앱 암호** 생성
3. 레이블: "Octopus CI/CD"
4. 생성된 암호 복사 (한 번만 표시됨)

### 5. GitHub Secrets 설정

GitHub 저장소의 **Settings > Secrets and variables > Actions**에서 다음 secrets 추가:

| Secret 이름 | 설명 | 예시 |
|------------|------|------|
| `CSC_LINK` | Base64 인코딩된 .p12 인증서 | (base64 문자열) |
| `CSC_KEY_PASSWORD` | .p12 파일의 비밀번호 | your-password |
| `APPLE_ID` | Apple ID 이메일 | developer@example.com |
| `APPLE_APP_SPECIFIC_PASSWORD` | App-specific password | xxxx-xxxx-xxxx-xxxx |
| `APPLE_TEAM_ID` | Apple Developer Team ID | ABC123DEF4 |

### 6. electron-builder 설정 확인

`package.json`의 `build.mac` 섹션 확인:

```json
{
  "build": {
    "mac": {
      "target": ["dmg", "zip"],
      "hardenedRuntime": true,
      "gatekeeperAssess": false,
      "entitlements": "build/entitlements.mac.plist",
      "entitlementsInherit": "build/entitlements.mac.plist"
    }
  }
}
```

### 7. Entitlements 파일 생성 (필요 시)

`build/entitlements.mac.plist`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>com.apple.security.cs.allow-jit</key>
    <true/>
    <key>com.apple.security.cs.allow-unsigned-executable-memory</key>
    <true/>
    <key>com.apple.security.cs.disable-library-validation</key>
    <true/>
</dict>
</plist>
```

## Windows 코드 서명

Windows 코드 서명은 선택사항이지만, Microsoft SmartScreen 경고를 방지하려면 권장됩니다.

### 1. 인증서 구매

- DigiCert, Sectigo 등에서 Code Signing Certificate 구매
- EV (Extended Validation) 인증서 권장

### 2. GitHub Secrets 설정

| Secret 이름 | 설명 |
|------------|------|
| `WIN_CSC_LINK` | Base64 인코딩된 .pfx 인증서 |
| `WIN_CSC_KEY_PASSWORD` | .pfx 파일의 비밀번호 |

### 3. 워크플로우 업데이트 (필요 시)

```yaml
- name: Build application
  run: npm run build
  env:
    GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
    CSC_LINK: ${{ secrets.WIN_CSC_LINK }}
    CSC_KEY_PASSWORD: ${{ secrets.WIN_CSC_KEY_PASSWORD }}
```

## 코드 서명 없이 배포하기

개발 초기 단계나 내부 배포용으로는 코드 서명 없이 배포할 수 있습니다.

### 제한사항

- **macOS**: "손상된 파일" 경고, 사용자가 수동으로 보안 설정 변경 필요
- **Windows**: SmartScreen 경고, "알 수 없는 게시자" 표시

### 사용자 안내

macOS 사용자가 서명되지 않은 앱을 실행하는 방법:

```bash
# Gatekeeper 우회
sudo xattr -r -d com.apple.quarantine /Applications/Octopus.app
```

또는:

1. 앱 아이콘을 Control + 클릭
2. "열기" 선택
3. "열기" 버튼 클릭

## 테스트

로컬에서 코드 서명 테스트:

```bash
# macOS 서명 확인
codesign -dv --verbose=4 /Applications/Octopus.app

# Windows 서명 확인
signtool verify /pa "Octopus Setup.exe"
```

## 참고 자료

- [electron-builder Code Signing](https://www.electron.build/code-signing)
- [Apple Developer - Notarizing macOS Software](https://developer.apple.com/documentation/security/notarizing_macos_software_before_distribution)
- [Microsoft - Code Signing](https://docs.microsoft.com/en-us/windows/win32/seccrypto/cryptography-tools)
