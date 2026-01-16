# ✅ ZIP 배포 설정 완료!

## 변경된 파일

1. ✅ `package.json` - target을 "zip"으로 변경
2. ✅ `.github/workflows/release.yml` - ZIP 아티팩트 (2곳)
3. ✅ `README.md` - ZIP 설치 방법으로 업데이트

## 핵심 설정

```json
{
  "mac": {
    "target": ["zip"],           // ZIP 배포
    "identity": "-",             // Ad-hoc 서명
    "hardenedRuntime": true,
    "entitlements": "build/entitlements.mac.plist"
  }
}
```

## 사용자가 볼 메시지

**"확인되지 않은 개발자"** (덜 무섭고, 우클릭 → 열기로 해결 가능)

## 배포 절차

```bash
git add -A
git commit -m "feat: switch to ZIP distribution for better compatibility"
git tag v0.0.7
git push origin main --tags
```

## 결과

- `Octopus_0.0.7_arm64.zip`
- `Octopus_0.0.7_x64.zip`

**바로 배포 가능합니다!** 🚀
