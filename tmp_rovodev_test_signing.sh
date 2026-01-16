#!/bin/bash
# macOS 코드 서명 레벨 테스트

echo "=== macOS Code Signing Levels ==="
echo ""
echo "1. No Signature (완전히 서명 없음)"
echo "   - codesign output: code object is not signed at all"
echo "   - Gatekeeper: 즉시 차단"
echo ""
echo "2. Ad-hoc Signature (자체 서명)"
echo "   - codesign --sign - MyApp.app"
echo "   - codesign output: adhoc"
echo "   - Gatekeeper: 다운로드 시 quarantine 속성으로 차단, 로컬 빌드는 허용"
echo ""
echo "3. Developer ID Signature (Apple 인증서)"
echo "   - codesign --sign \"Developer ID Application: ...\" MyApp.app"
echo "   - codesign output: Developer ID Application: ..."
echo "   - Gatekeeper: 공증 없이는 경고, 공증 시 완전 허용"
echo ""
