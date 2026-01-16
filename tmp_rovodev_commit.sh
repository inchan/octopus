#!/bin/bash

# 배포 커밋 스크립트

git add -A

git commit -m "feat: switch to ZIP distribution with ad-hoc signing

Major Changes:
- Switch from DMG to ZIP for better Gatekeeper compatibility
- Enable ad-hoc signing for Apple Silicon support
- Enable auto-download for macOS (ZIP supports in-place updates)
- Add comprehensive distribution documentation

Benefits:
- 'Unidentified developer' instead of 'damaged' error
- Higher success rate for unsigned app distribution
- Simpler installation process
- Full auto-update support on all platforms

Technical Details:
- package.json: target=['zip'], identity='-'
- electron/main.ts: Remove macOS autoDownload=false restriction
- Add build/entitlements.mac.plist for hardenedRuntime
- Update GitHub Actions workflow for ZIP artifacts

Documentation:
- Add doc/ZIP_DISTRIBUTION_FINAL.md
- Add doc/AD_HOC_SIGNING_EXPLAINED.md
- Add doc/GITHUB_ACTIONS_ADHOC_SIGNING.md
- Update README.md with ZIP installation guide
- Update doc/배포.md with new deployment strategy"

git tag v0.0.7

echo ""
echo "✅ 커밋 및 태그 생성 완료!"
echo ""
echo "다음 명령어로 푸시하세요:"
echo "git push origin main --tags"

