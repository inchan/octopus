# Ad-hoc 서명 상세 가이드

## macOS 코드 서명의 3가지 레벨

### 레벨 0: 서명 없음 (Unsigned)

```json
"identity": null
```

또는 codesign을 전혀 실행하지 않음

**특징**:
- ❌ 서명이 전혀 없는 바이너리
- ❌ `codesign -dv MyApp.app` → "code object is not signed at all"
- ❌ hardenedRuntime 적용 불가
- ❌ entitlements 적용 불가
- ❌ Apple Silicon에서 실행 문제 발생 가능
- ❌ Gatekeeper 즉시 차단

**사용하지 않는 이유**: 현대 macOS에서는 최소한의 서명도 필요합니다.

---

### 레벨 1: Ad-hoc 서명 (Self-signed) ⭐ 우리가 사용

```json
"identity": "-"
```

또는 터미널에서:
```bash
codesign --sign - --force --deep MyApp.app
```

**특징**:
- ✅ 자체 서명 (Apple 인증서 불필요)
- ✅ `codesign -dv MyApp.app` → "Signature=adhoc"
- ✅ hardenedRuntime 적용 가능
- ✅ entitlements 적용 가능
- ✅ Apple Silicon (M1/M2/M3)에서 안정적 실행
- ✅ 로컬 빌드는 정상 실행
- ⚠️ 인터넷 다운로드 시 Gatekeeper 차단 (quarantine 속성)

**Gatekeeper 우회 방법**:
1. 사용자: "우클릭 → 열기" (한 번만)
2. 개발자: `xattr -cr MyApp.app` (quarantine 제거)

**사용 케이스**:
- ✅ **무료 개발자 배포 (가장 추천!)**
- ✅ 오픈소스 프로젝트
- ✅ 내부 배포
- ✅ 개발 및 테스트

---

### 레벨 2: Developer ID 서명 (Apple 인증)

```json
"identity": "Developer ID Application: Your Name (TEAM_ID)"
```

또는 터미널에서:
```bash
codesign --sign "Developer ID Application: ..." MyApp.app
```

**요구사항**:
- Apple Developer Program 가입 ($99/년)
- Developer ID Application 인증서

**특징**:
- ✅ Apple 공식 인증서로 서명
- ✅ `codesign -dv MyApp.app` → "Authority=Developer ID Application: ..."
- ✅ 공증(Notarization) 가능
- ✅ Gatekeeper 통과 (공증 시)
- ✅ 사용자가 추가 작업 없이 실행
- ✅ 전문적인 배포

**사용 케이스**:
- 상용 앱
- 대규모 배포
- 엔터프라이즈 배포

---

## 왜 Ad-hoc 서명을 선택했는가?

### 비교: `identity: null` vs `identity: "-"`

| 항목 | null (서명 없음) | "-" (Ad-hoc) |
|------|------------------|--------------|
| 비용 | 무료 | 무료 |
| hardenedRuntime | ❌ 불가능 | ✅ 가능 |
| entitlements | ❌ 불가능 | ✅ 가능 |
| Apple Silicon | ⚠️ 불안정 | ✅ 안정적 |
| Electron 안정성 | ⚠️ 낮음 | ✅ 높음 |
| JIT 컴파일 | ⚠️ 문제 가능 | ✅ 정상 |
| Native 모듈 | ⚠️ 문제 가능 | ✅ 정상 |
| Gatekeeper | 즉시 차단 | 우회 가능 |
| 사용자 경험 | "우클릭 → 열기" | "우클릭 → 열기" |

**결론**: 사용자 경험은 동일하지만, Ad-hoc 서명이 훨씬 더 안정적입니다.

---

## Ad-hoc 서명의 기술적 세부사항

### 1. hardenedRuntime이 필요한 이유

Apple Silicon (ARM64)에서는 hardenedRuntime이 거의 필수입니다:

```json
"hardenedRuntime": true
```

**효과**:
- 메모리 보호 강화
- 코드 인젝션 방지
- 시스템 안정성 향상

**문제**: hardenedRuntime은 일부 Electron 기능을 제한합니다.

### 2. entitlements로 제한 해제

hardenedRuntime으로 제한된 기능을 entitlements로 다시 허용:

```xml
<!-- build/entitlements.mac.plist -->
<key>com.apple.security.cs.allow-jit</key>
<true/>  <!-- V8 JavaScript JIT 컴파일 허용 -->

<key>com.apple.security.cs.allow-unsigned-executable-memory</key>
<true/>  <!-- Native 모듈 실행 허용 -->

<key>com.apple.security.cs.debugger</key>
<true/>  <!-- 개발 도구 허용 -->
```

**중요**: entitlements는 서명된 바이너리에만 적용됩니다!
- ❌ `identity: null` → entitlements 무시됨
- ✅ `identity: "-"` → entitlements 적용됨
- ✅ `identity: "Developer ID..."` → entitlements 적용됨

### 3. 실제 서명 확인 방법

```bash
# 서명 상태 확인
codesign -dv --verbose=4 /Applications/Octopus.app

# Ad-hoc 서명인 경우 출력:
# Executable=/Applications/Octopus.app/Contents/MacOS/Octopus
# Identifier=com.octopus.app
# Format=app bundle with Mach-O universal (x86_64 arm64)
# CodeDirectory v=20500 size=... flags=0x2(adhoc) hashes=...
# Signature=adhoc  👈 이것이 중요!
# Info.plist entries=...
# TeamIdentifier=not set
# Runtime Version=...
# Sealed Resources version=...

# entitlements 확인
codesign -d --entitlements - /Applications/Octopus.app
```

---

## electron-builder 설정 전체

```json
{
  "build": {
    "mac": {
      "target": ["zip"],                    // DMG 대신 ZIP
      "identity": "-",                      // Ad-hoc 서명
      "hardenedRuntime": true,              // Apple Silicon 필수
      "entitlements": "build/entitlements.mac.plist",
      "entitlementsInherit": "build/entitlements.mac.plist",
      "gatekeeperAssess": false,            // Gatekeeper 검증 건너뛰기
      "category": "public.app-category.developer-tools"
    }
  }
}
```

---

## GitHub Actions 설정

```yaml
- name: Build application
  run: npm run build
  env:
    GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
    CSC_IDENTITY_AUTO_DISCOVERY: false  # 인증서 자동 탐색 비활성화
```

**중요**: `CSC_IDENTITY_AUTO_DISCOVERY: false` 설정 이유
- electron-builder는 기본적으로 Keychain에서 "Developer ID" 인증서를 찾습니다
- 없으면 Ad-hoc 서명을 하지만, 탐색 과정에서 경고가 발생할 수 있습니다
- 명시적으로 비활성화하여 깔끔한 빌드 로그를 유지합니다

---

## 사용자에게 안내할 내용

### 간단 버전 (README)

```markdown
⚠️ **첫 실행 시 주의**:
1. 앱 아이콘을 우클릭 (또는 Control + 클릭)
2. "열기" 선택
3. 경고창에서 "열기" 버튼 클릭
4. 이후에는 일반적으로 실행 가능
```

### 자세한 버전 (Release Notes)

```markdown
이 앱은 Apple Developer Program($99/년) 없이 배포되어 
개발자 서명이 포함되지 않았습니다.

macOS Gatekeeper는 인터넷에서 다운로드한 서명되지 않은 앱을 
차단하지만, "우클릭 → 열기"는 Apple이 공식적으로 제공하는 
안전한 우회 방법입니다.

한 번 이 방법으로 실행하면 macOS가 앱을 신뢰하며, 
이후에는 평소처럼 더블클릭으로 실행할 수 있습니다.
```

---

## 향후 업그레이드 경로

### Option 1: Developer ID 서명

Apple Developer Program에 가입하면:

```json
{
  "mac": {
    "identity": "Developer ID Application: Your Name (TEAM_ID)",
    "hardenedRuntime": true,
    "entitlements": "build/entitlements.mac.plist"
  }
}
```

GitHub Secrets 추가:
- `CSC_LINK`: Base64 인코딩된 인증서
- `CSC_KEY_PASSWORD`: 인증서 비밀번호

### Option 2: 공증 (Notarization)

서명 후 공증까지 하면 Gatekeeper 완전 통과:

```json
{
  "mac": {
    "identity": "Developer ID Application: ...",
    "hardenedRuntime": true,
    "entitlements": "build/entitlements.mac.plist",
    "notarize": {
      "teamId": "TEAM_ID"
    }
  },
  "afterSign": "scripts/notarize.js"
}
```

---

## 엔트로피 경로 점수

**현재 설정 점수: 1/10** (매우 안전)

- ✅ 표준 macOS 보안 모델 준수
- ✅ Apple 공식 방법 사용
- ✅ 향후 업그레이드 경로 명확
- ✅ 최소 복잡도

---

## 참고 자료

- [Apple - Code Signing Guide](https://developer.apple.com/library/archive/documentation/Security/Conceptual/CodeSigningGuide/)
- [electron-builder - Code Signing](https://www.electron.build/code-signing)
- [Apple - Safely open apps](https://support.apple.com/en-us/102445)
- [codesign man page](https://www.manpagez.com/man/1/codesign/)

## 핵심 요약

🎯 **Ad-hoc 서명 (`identity: "-"`)은**:
- 무료 개발자가 사용할 수 있는 최선의 선택
- hardenedRuntime + entitlements 적용 가능
- Apple Silicon에서 안정적
- 사용자는 "우클릭 → 열기" 한 번만 필요
- 향후 Apple Developer로 쉽게 업그레이드 가능
