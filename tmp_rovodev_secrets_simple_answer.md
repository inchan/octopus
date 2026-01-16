# GitHub Secrets 필요 여부 - 간단 답변

## ✅ 답변: 커스텀 Secrets 설정은 필요 없습니다!

### 이유

**Ad-hoc 서명은 인증서가 필요 없기 때문입니다.**

```bash
# Ad-hoc 서명 명령어
codesign --sign -  MyApp.app
                ↑
            인증서 없이 서명!
```

## 현재 설정 분석

```yaml
env:
  GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}          # ← 자동 제공됨!
  DEBUG: electron-builder
  CSC_IDENTITY_AUTO_DISCOVERY: false
```

### GH_TOKEN

- **목적**: GitHub Release 생성 및 파일 업로드
- **출처**: GitHub Actions가 **자동으로 제공**
- **사용자 설정**: ❌ 불필요

`secrets.GITHUB_TOKEN`은 GitHub Actions가 모든 워크플로우에 자동으로 제공하는 토큰입니다.
Settings > Secrets에 직접 추가할 필요가 없습니다!

## 필요 없는 Secrets

### Developer ID 서명에만 필요한 것들 (우리는 Ad-hoc)

| Secret 이름 | 용도 | Ad-hoc에 필요? |
|-------------|------|----------------|
| `CSC_LINK` | 인증서 파일 (.p12) | ❌ 불필요 |
| `CSC_KEY_PASSWORD` | 인증서 비밀번호 | ❌ 불필요 |
| `APPLE_ID` | Apple 계정 | ❌ 불필요 |
| `APPLE_APP_SPECIFIC_PASSWORD` | 앱 전용 비밀번호 | ❌ 불필요 |
| `APPLE_TEAM_ID` | Team ID | ❌ 불필요 |

## 확인 방법

### GitHub 저장소 확인

1. **Settings > Secrets and variables > Actions** 로 이동
2. **아무것도 설정되어 있지 않아도 됩니다!**
3. GITHUB_TOKEN은 자동 제공되므로 목록에 없는 것이 정상입니다

### 워크플로우가 작동하는 이유

```
npm run build 실행
    ↓
electron-builder 실행
    ↓
CSC_LINK 확인 → 없음
    ↓
package.json의 identity 확인 → "-" (Ad-hoc)
    ↓
codesign --sign - 실행 (인증서 불필요!)
    ↓
✅ 서명 성공
    ↓
DMG 생성
    ↓
GITHUB_TOKEN으로 Release 업로드 (자동 제공됨!)
    ↓
✅ 배포 완료
```

## 결론

**Settings > Secrets에 아무것도 추가하지 않아도 됩니다!**

- ✅ GITHUB_TOKEN: 자동 제공
- ✅ Ad-hoc 서명: 인증서 불필요
- ✅ 현재 설정: 완벽함

**바로 배포 가능합니다!**

