# Ad-hoc 서명 배포 최종 요약

## 🎯 핵심 개념

### Ad-hoc 서명이란?

**Ad-hoc 서명**은 Apple 인증서 없이 로컬에서 자체 서명하는 방식입니다.

```bash
# 터미널에서 직접 서명
codesign --sign - MyApp.app
```

electron-builder에서는:
```json
"identity": "-"
```

### 3가지 서명 레벨 비교

| 레벨 | 설정 | 비용 | hardenedRuntime | entitlements | Apple Silicon | Gatekeeper |
|------|------|------|-----------------|--------------|---------------|------------|
| **0. 서명 없음** | `identity: null` | 무료 | ❌ | ❌ | ⚠️ 불안정 | 즉시 차단 |
| **1. Ad-hoc** ⭐ | `identity: "-"` | 무료 | ✅ | ✅ | ✅ 안정적 | 우회 가능 |
| **2. Developer ID** | `identity: "Developer ID..."` | $99/년 | ✅ | ✅ | ✅ 안정적 | 통과 (공증 시) |

## ✅ 우리의 최종 선택: Ad-hoc 서명

### 이유

1. **무료**: Apple Developer Program 불필요
2. **안정적**: hardenedRuntime + entitlements 사용 가능
3. **Apple Silicon 호환**: M1/M2/M3에서 정상 작동
4. **Electron 안정성**: JIT 컴파일, Native 모듈 지원
5. **사용자 경험**: "우클릭 → 열기" 한 번만 필요
6. **업그레이드 가능**: 향후 Developer ID로 쉽게 전환

### 설정 (package.json)

```json
{
  "build": {
    "mac": {
      "target": ["zip"],                              // ZIP 배포
      "identity": "-",                                // Ad-hoc 서명 ⭐
      "hardenedRuntime": true,                        // Apple Silicon 필수
      "entitlements": "build/entitlements.mac.plist", // 권한 설정
      "entitlementsInherit": "build/entitlements.mac.plist",
      "gatekeeperAssess": false,
      "category": "public.app-category.developer-tools"
    }
  }
}
```

### Entitlements (build/entitlements.mac.plist)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
  <dict>
    <key>com.apple.security.cs.allow-jit</key>
    <true/>  <!-- V8 JavaScript JIT 컴파일 허용 -->
    
    <key>com.apple.security.cs.allow-unsigned-executable-memory</key>
    <true/>  <!-- better-sqlite3 등 Native 모듈 허용 -->
    
    <key>com.apple.security.cs.debugger</key>
    <true/>  <!-- 개발 도구 허용 -->
  </dict>
</plist>
```

## 📦 사용자 설치 방법

### 간단 버전

1. ZIP 다운로드 및 압축 해제
2. Applications 폴더로 이동
3. **우클릭 → "열기"** (한 번만!)
4. 이후 일반적으로 사용

### 기술적 배경

**왜 "우클릭 → 열기"가 필요한가?**

- 인터넷 다운로드 파일에는 `com.apple.quarantine` 속성이 붙음
- Gatekeeper가 서명되지 않은 앱을 차단
- "우클릭 → 열기"는 Apple 공식 우회 방법
- 사용자가 앱을 신뢰한다는 의사 표시

**고급 사용자 방법**:
```bash
xattr -cr /Applications/Octopus.app  # quarantine 제거
```

## 🔄 변경 사항 요약

### 코드 변경

| 파일 | 변경 전 | 변경 후 |
|------|---------|---------|
| `package.json` | `"identity": null` | `"identity": "-"` ⭐ |
| `package.json` | `"target": ["dmg", "zip"]` | `"target": ["zip"]` |
| - | (없음) | `build/entitlements.mac.plist` 생성 |
| `.github/workflows/release.yml` | CSC_LINK 처리 로직 | `CSC_IDENTITY_AUTO_DISCOVERY: false` |

### 문서 추가

1. ✅ `doc/AD_HOC_SIGNING_EXPLAINED.md` - 기술 상세 가이드
2. ✅ `doc/UNSIGNED_APP_DISTRIBUTION.md` - 배포 전략
3. ✅ `doc/DEPLOYMENT_CHECKLIST.md` - 배포 체크리스트
4. ✅ `doc/RELEASE_NOTES_TEMPLATE.md` - 릴리즈 노트 템플릿
5. ✅ `README.md` - 사용자 설치 가이드 추가
6. ✅ `doc/배포.md` - 기존 문서 업데이트

## 🚀 배포 절차

### 1. 커밋 및 태그

```bash
git add -A
git commit -m "feat: implement ad-hoc signing for unsigned distribution

- Change from unsigned (identity: null) to ad-hoc (identity: '-')
- Enable hardenedRuntime and entitlements for Apple Silicon
- Switch from DMG to ZIP for easier Gatekeeper bypass
- Add comprehensive documentation for unsigned app distribution
- Update user installation guide with right-click method"

git tag v0.0.7
git push origin main --tags
```

### 2. GitHub Actions 자동 빌드

- ✅ Test 실행
- ✅ macOS/Windows/Linux 빌드
- ✅ Artifacts 업로드
- ✅ GitHub Release 생성

### 3. Release Notes 작성

`doc/RELEASE_NOTES_TEMPLATE.md`를 참고하여:
- ⚠️ macOS 설치 방법 안내
- 📦 다운로드 링크
- ✨ 변경사항

## 🔍 검증 방법

### 로컬 빌드 테스트

```bash
# 타입 체크
npx tsc --noEmit

# 린트
npm run lint

# 빌드 (macOS만)
npm run build

# 빌드 결과 확인
ls -lh release/0.0.7/

# 서명 확인
codesign -dv release/0.0.7/mac/Octopus.app
# 출력에서 "Signature=adhoc" 확인!

# Entitlements 확인
codesign -d --entitlements - release/0.0.7/mac/Octopus.app
```

### 사용자 테스트

1. ZIP 파일 다운로드
2. 압축 해제
3. Applications로 이동
4. 우클릭 → 열기
5. 정상 실행 확인

## 📊 비교: 이전 vs 현재

### 이전 설정 (identity: null)

```json
"identity": null  // ❌ 서명 없음
```

**문제점**:
- ❌ hardenedRuntime 적용 불가
- ❌ entitlements 무시됨
- ⚠️ Apple Silicon에서 불안정
- ⚠️ Native 모듈 실행 문제 가능

### 현재 설정 (identity: "-")

```json
"identity": "-"   // ✅ Ad-hoc 서명
```

**장점**:
- ✅ hardenedRuntime 적용
- ✅ entitlements 적용
- ✅ Apple Silicon 안정적
- ✅ Native 모듈 정상 작동
- ✅ 사용자 경험 동일 (우클릭 → 열기)

## 🎓 기술적 깊이

### Ad-hoc 서명의 작동 원리

1. **서명 생성**:
   ```bash
   codesign --sign - --options runtime \
     --entitlements entitlements.plist \
     MyApp.app
   ```

2. **서명 검증**:
   - macOS는 바이너리의 코드 서명을 확인
   - Ad-hoc 서명은 "Signature=adhoc" 상태
   - TeamIdentifier 없음 (Apple 인증서가 아니므로)

3. **Gatekeeper 동작**:
   - Quarantine 속성 + Ad-hoc 서명 = 차단
   - 우클릭 → 열기 = 사용자 신뢰 표시 = 허용
   - 한 번 허용 후 quarantine 속성 제거됨

4. **hardenedRuntime + entitlements**:
   - hardenedRuntime: 메모리 보호, 보안 강화
   - entitlements: 특정 권한 재허용 (JIT, Native 모듈 등)
   - 서명 없으면 entitlements 적용 안 됨 ⚠️
   - Ad-hoc 서명이면 entitlements 적용됨 ✅

## 🔮 향후 업그레이드

### Developer ID로 전환 시

```json
{
  "mac": {
    "identity": "Developer ID Application: Your Name (TEAM_ID)",
    "hardenedRuntime": true,
    "entitlements": "build/entitlements.mac.plist"  // 동일 사용!
  }
}
```

GitHub Secrets:
- `CSC_LINK`: Base64 인증서
- `CSC_KEY_PASSWORD`: 인증서 비밀번호

### 공증 추가 시

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

## 📚 참고 문서

- [Ad-hoc 서명 상세 가이드](./AD_HOC_SIGNING_EXPLAINED.md)
- [서명되지 않은 앱 배포](./UNSIGNED_APP_DISTRIBUTION.md)
- [배포 체크리스트](./DEPLOYMENT_CHECKLIST.md)
- [릴리즈 프로세스](./core/RELEASE_PROCESS.md)

## 🏁 결론

**Ad-hoc 서명 (`identity: "-"`)은**:
- 🆓 무료 개발자를 위한 최선의 선택
- 🛡️ 보안과 안정성을 모두 확보
- 🍎 Apple Silicon 완벽 지원
- 👥 사용자 친화적 (우클릭 한 번)
- 🔄 향후 업그레이드 용이

## 엔트로피 경로 점수: 0.5/10 (매우 안전)

- ✅ 표준 방법 사용
- ✅ 최소 복잡도
- ✅ 명확한 문서화
- ✅ 검증 가능
- ✅ 유지보수 용이
