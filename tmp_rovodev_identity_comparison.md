# electron-builder identity 옵션 비교

## 1. identity: null (서명 없음)

```json
"identity": null
```

**의미**: 코드 서명을 완전히 건너뜁니다.

**결과**:
- `codesign -dv MyApp.app` → "code object is not signed at all"
- 서명이 전혀 없는 상태

**제약사항**:
- ❌ `hardenedRuntime: true` 적용 불가
- ❌ `entitlements` 적용 불가
- ❌ Apple Silicon에서 실행 불가능할 수 있음
- ❌ Gatekeeper 즉시 차단

**사용 케이스**: 
- 거의 사용하지 않음
- 내부 테스트용 빌드

---

## 2. identity: "-" (Ad-hoc 서명)

```json
"identity": "-"
```

**의미**: 자체 서명 (Self-signed, Ad-hoc signature)

**동작**: `codesign --sign - MyApp.app` 실행

**결과**:
- `codesign -dv MyApp.app` → "Signature=adhoc"
- Apple 인증서 없이 로컬에서 서명됨

**장점**:
- ✅ `hardenedRuntime: true` 적용 가능
- ✅ `entitlements` 적용 가능
- ✅ Apple Silicon (M1/M2/M3)에서 실행 가능
- ✅ 로컬 개발 시 정상 작동

**제약사항**:
- ⚠️ 인터넷에서 다운로드 시 Gatekeeper 차단 (quarantine 속성)
- ⚠️ 사용자가 "우클릭 → 열기" 필요

**사용 케이스**:
- ✅ **무료 개발자 배포 (추천!)**
- ✅ 로컬 개발 및 테스트
- ✅ 내부 배포

---

## 3. identity: "Developer ID Application: ..." (Apple 인증서)

```json
"identity": "Developer ID Application: Your Name (TEAM_ID)"
```

**의미**: Apple에서 발급한 인증서로 서명

**요구사항**: 
- Apple Developer Program ($99/년)
- Developer ID Application 인증서

**결과**:
- `codesign -dv MyApp.app` → "Authority=Developer ID Application: ..."

**장점**:
- ✅ Gatekeeper 통과 (공증 시)
- ✅ 사용자가 추가 작업 없이 실행 가능
- ✅ 전문적인 배포

**사용 케이스**:
- 상용 앱 배포
- 공개 배포

---

## electron-builder 기본 동작

```json
// identity를 명시하지 않으면
"mac": {
  // identity 없음
}
```

**동작**: 
1. Keychain에서 "Developer ID Application" 인증서 자동 탐색
2. 없으면 Ad-hoc 서명 (identity: "-"와 동일)
3. `CSC_IDENTITY_AUTO_DISCOVERY=false`로 비활성화 가능

---

## 우리의 선택: identity: "-" (Ad-hoc)

### 이전 설정 (잘못된 이해)
```json
"identity": null  // ❌ 서명 없음 = entitlements 적용 불가
```

### 올바른 설정
```json
"identity": "-",  // ✅ Ad-hoc 서명 = entitlements 적용 가능
"hardenedRuntime": true,
"entitlements": "build/entitlements.mac.plist"
```

### 왜 "-"가 더 나은가?

1. **Apple Silicon 호환성**
   - M1/M2/M3 Mac에서 안정적 실행
   - hardenedRuntime + entitlements 필요

2. **Electron 안정성**
   - JIT 컴파일 허용
   - Native 모듈 실행 허용

3. **동일한 사용자 경험**
   - null이든 "-"이든 사용자는 "우클릭 → 열기" 필요
   - 하지만 "-"는 실행 후 더 안정적

