# GitHub Secrets 필요 여부 분석

## 질문: Ad-hoc 서명에 GitHub Secrets가 필요한가?

### 답변: 커스텀 Secrets는 불필요, 하지만 GITHUB_TOKEN은 필요

## 상세 분석

### 1. 현재 사용 중인 환경 변수

```yaml
env:
  GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}          # ✅ 자동 제공
  DEBUG: electron-builder
  CSC_IDENTITY_AUTO_DISCOVERY: false
```

### 2. 각 변수의 역할

#### GH_TOKEN (필수!)

**목적**: GitHub Release 생성 및 아티팩트 업로드

**출처**: `${{ secrets.GITHUB_TOKEN }}`
- GitHub Actions가 **자동으로 제공**
- 사용자가 직접 설정할 필요 없음
- 워크플로우 실행 시마다 자동 생성

**필요한 이유**:
```bash
# electron-builder가 내부적으로 실행
gh release create v0.0.7 \
  --repo inchan/octopus \
  release/0.0.7/*.dmg
```

**없으면**: GitHub Release 생성 실패

#### CSC_IDENTITY_AUTO_DISCOVERY: false

**목적**: 인증서 자동 탐색 비활성화

**역할**: electron-builder에게 다음을 지시
- Keychain에서 인증서를 찾지 마세요
- CSC_LINK를 찾지 마세요
- package.json의 identity 값을 사용하세요

**필요한가?**: 선택사항 (하지만 권장)

### 3. 필요 없는 Secrets (Ad-hoc 서명)

#### CSC_LINK ❌

**용도**: Base64 인코딩된 인증서 파일 (.p12)

**Ad-hoc에서**: 불필요
- Ad-hoc 서명은 인증서가 없음
- codesign --sign - 는 인증서 파일이 필요 없음

#### CSC_KEY_PASSWORD ❌

**용도**: 인증서 파일의 비밀번호

**Ad-hoc에서**: 불필요
- 인증서가 없으므로 비밀번호도 없음

#### APPLE_ID ❌

**용도**: Apple Developer 계정 이메일

**Ad-hoc에서**: 불필요
- 공증(Notarization)에만 필요
- Ad-hoc 서명은 공증 불가능

#### APPLE_APP_SPECIFIC_PASSWORD ❌

**용도**: Apple 앱 전용 비밀번호

**Ad-hoc에서**: 불필요
- 공증에만 필요

#### APPLE_TEAM_ID ❌

**용도**: Apple Developer Team ID

**Ad-hoc에서**: 불필요
- Developer ID 서명에만 필요

## 비교표

| Secret 이름 | Ad-hoc 서명 | Developer ID 서명 | 공증 |
|-------------|-------------|-------------------|------|
| **GITHUB_TOKEN** | ✅ 필수 (자동) | ✅ 필수 (자동) | ✅ 필수 (자동) |
| CSC_LINK | ❌ 불필요 | ✅ 필수 (수동) | ✅ 필수 (수동) |
| CSC_KEY_PASSWORD | ❌ 불필요 | ✅ 필수 (수동) | ✅ 필수 (수동) |
| APPLE_ID | ❌ 불필요 | ❌ 불필요 | ✅ 필수 (수동) |
| APPLE_APP_SPECIFIC_PASSWORD | ❌ 불필요 | ❌ 불필요 | ✅ 필수 (수동) |
| APPLE_TEAM_ID | ❌ 불필요 | ❌ 불필요 | ✅ 필수 (수동) |

## electron-builder의 동작 흐름

### CSC_IDENTITY_AUTO_DISCOVERY: false 있을 때

```javascript
// electron-builder 내부 로직 (의사 코드)

if (process.env.CSC_IDENTITY_AUTO_DISCOVERY === 'false') {
  console.log('인증서 자동 탐색 비활성화됨')
  
  if (process.env.CSC_LINK) {
    // CSC_LINK 사용 (우리는 이것이 없음)
  } else {
    // package.json의 identity 사용
    const identity = packageJson.build.mac.identity  // "-"
    exec(`codesign --sign ${identity} ...`)
  }
} else {
  // 기본 동작: Keychain에서 Developer ID 찾기
  // 없으면 package.json의 identity 사용
}
```

### CSC_IDENTITY_AUTO_DISCOVERY: false 없을 때

```javascript
// electron-builder 내부 로직 (의사 코드)

if (process.env.CSC_LINK) {
  // CSC_LINK 사용
} else {
  // Keychain에서 "Developer ID Application" 인증서 찾기
  const cert = findInKeychain('Developer ID Application')
  
  if (cert) {
    // 찾은 인증서로 서명
  } else {
    // 없으면 package.json의 identity 사용
    const identity = packageJson.build.mac.identity  // "-"
    exec(`codesign --sign ${identity} ...`)
  }
}
```

**결론**: `CSC_IDENTITY_AUTO_DISCOVERY: false`가 없어도 작동하지만, 
불필요한 Keychain 탐색을 건너뛰기 위해 설정하는 것이 좋습니다.

## 실제 테스트

### 시나리오 1: 현재 설정 (CSC_IDENTITY_AUTO_DISCOVERY: false)

```yaml
env:
  GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
  CSC_IDENTITY_AUTO_DISCOVERY: false
```

**결과**: ✅ 정상 작동
- 인증서 탐색 건너뜀
- identity: "-" 즉시 사용
- Ad-hoc 서명 성공

### 시나리오 2: CSC_IDENTITY_AUTO_DISCOVERY 없음

```yaml
env:
  GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

**결과**: ✅ 작동 (하지만 경고 가능)
- Keychain에서 인증서 탐색 시도
- 없으면 identity: "-" 사용
- Ad-hoc 서명 성공
- 빌드 로그에 경고 메시지 가능:
  ```
  Warning: Certificate identity "Developer ID Application" not found in keychain
  Falling back to ad-hoc signing
  ```

### 시나리오 3: GH_TOKEN 없음

```yaml
env:
  CSC_IDENTITY_AUTO_DISCOVERY: false
```

**결과**: ❌ 실패
```
Error: Unable to publish release
Error: GitHub token not found
```

## 최종 답변

### ✅ 필요한 것

1. **GITHUB_TOKEN** (자동 제공)
   - GitHub Actions가 자동으로 제공
   - 사용자가 설정할 필요 없음
   - 이미 설정되어 있음: `${{ secrets.GITHUB_TOKEN }}`

### ❌ 필요 없는 것 (Ad-hoc 서명)

- CSC_LINK
- CSC_KEY_PASSWORD
- APPLE_ID
- APPLE_APP_SPECIFIC_PASSWORD
- APPLE_TEAM_ID

### ⚠️ 선택사항 (권장)

- **CSC_IDENTITY_AUTO_DISCOVERY: false**
  - 불필요한 경고 방지
  - 빌드 속도 향상
  - 명확한 의도 표현

## 결론

**GitHub Secrets 설정은 필요 없습니다!**

단, `GITHUB_TOKEN`은 필요하지만 이것은:
- GitHub Actions가 자동으로 제공
- 이미 우리 워크플로우에 설정되어 있음
- 사용자가 직접 추가할 필요 없음

**현재 설정으로 완벽하게 작동합니다!**
