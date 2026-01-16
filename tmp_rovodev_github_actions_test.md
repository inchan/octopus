# GitHub Actions에서 Ad-hoc 서명 테스트

## 질문: GitHub Actions에서 Ad-hoc 서명이 자동으로 되나요?

### 현재 설정 분석

```yaml
- name: Build application
  run: npm run build
  env:
    GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
    DEBUG: electron-builder
    CSC_IDENTITY_AUTO_DISCOVERY: false  # 인증서 자동 탐색 비활성화
```

### 예상 동작

1. `CSC_IDENTITY_AUTO_DISCOVERY: false` 설정으로 인증서 탐색 안 함
2. `package.json`에 `identity: "-"` 설정
3. electron-builder가 Ad-hoc 서명 실행

### 하지만...

**문제 가능성**: macOS runner에서 codesign이 정상 작동하는가?

- GitHub Actions의 macOS runner는 Keychain이 비어있음
- Ad-hoc 서명은 인증서가 필요 없으므로 문제없어야 함
- 하지만 명시적 확인 필요

### 테스트 필요 항목

1. electron-builder가 identity: "-"를 올바르게 처리하는가?
2. CSC_IDENTITY_AUTO_DISCOVERY: false와 함께 작동하는가?
3. GitHub Actions macOS runner에서 codesign 가능한가?

