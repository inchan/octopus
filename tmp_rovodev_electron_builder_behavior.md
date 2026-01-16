# electron-builder의 identity 처리 방식

## electron-builder 코드 서명 로직

### 1. identity 값에 따른 동작

```javascript
// electron-builder 내부 로직 (의사 코드)

if (CSC_IDENTITY_AUTO_DISCOVERY === 'false') {
  // 인증서 자동 탐색 비활성화
  if (config.identity === null) {
    // 서명하지 않음
  } else if (config.identity === '-') {
    // Ad-hoc 서명 실행
    exec('codesign --sign - --force ...')
  } else if (config.identity === 'Developer ID...') {
    // 지정된 인증서로 서명
    exec('codesign --sign "Developer ID..." ...')
  }
} else {
  // 자동 탐색 활성화 (기본값)
  // Keychain에서 Developer ID 인증서 찾기
  // 없으면 identity 값 사용
}
```

### 2. 환경 변수 우선순위

1. `CSC_LINK` + `CSC_KEY_PASSWORD` (가장 높음)
2. `CSC_IDENTITY_AUTO_DISCOVERY` 
3. `package.json`의 `identity` 값

### 3. GitHub Actions에서 필요한 조건

✅ **충분한 조건**:
- `identity: "-"` in package.json
- `CSC_IDENTITY_AUTO_DISCOVERY: false` (선택사항, 하지만 권장)
- macOS runner (codesign 명령어 사용 가능)

❌ **필요 없는 조건**:
- CSC_LINK / CSC_KEY_PASSWORD (인증서가 없으므로)
- Keychain 설정 (Ad-hoc 서명은 인증서 불필요)

### 4. 실제 동작 예상

```bash
# GitHub Actions macOS runner에서 실행됨
npm run build

# electron-builder 내부에서 실행
codesign --sign - \
  --force \
  --options runtime \
  --entitlements build/entitlements.mac.plist \
  --timestamp \
  Octopus.app/Contents/Frameworks/...

codesign --sign - \
  --force \
  --options runtime \
  --entitlements build/entitlements.mac.plist \
  Octopus.app
```

### 5. 잠재적 문제점

**문제 1**: hardenedRuntime + Ad-hoc 서명
- Ad-hoc 서명에서 `--options runtime`이 작동하는가?
- 답: ✅ 작동함 (Apple Silicon 필수)

**문제 2**: entitlements + Ad-hoc 서명
- Ad-hoc 서명에 entitlements를 붙일 수 있는가?
- 답: ✅ 가능함

**문제 3**: timestamp + Ad-hoc 서명
- electron-builder가 timestamp를 시도할 수 있음
- Ad-hoc 서명에는 timestamp 불가능
- electron-builder가 자동으로 처리해야 함

