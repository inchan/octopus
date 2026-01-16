# DMG + Ad-hoc 서명 분석

## 시나리오: DMG로 배포, Ad-hoc 서명

### DMG 배포 프로세스

1. **빌드**: electron-builder가 Ad-hoc 서명된 앱 생성
2. **DMG 생성**: 서명된 앱을 DMG에 패키징
3. **다운로드**: 사용자가 GitHub Release에서 DMG 다운로드
4. **마운트**: 사용자가 DMG 더블클릭 → 마운트
5. **설치**: 앱을 Applications 폴더로 드래그
6. **실행**: Applications에서 앱 실행 시도

### Gatekeeper가 작동하는 시점

- **DMG 마운트 시**: DMG 파일 자체 검증
- **앱 실행 시**: DMG에서 복사한 앱 검증 ← 주요 시점!

### Ad-hoc 서명 + DMG 조합의 문제

**문제점**:
- DMG를 마운트하면 내부 앱에 quarantine 속성이 전파됨
- Applications로 복사된 앱도 quarantine 속성을 가짐
- 사용자가 앱 실행 시도 → Gatekeeper 차단 → "손상됨" 오류

**ZIP과의 차이**:
- ZIP: 압축 해제 후 "우클릭 → 열기"로 우회 가능
- DMG: 동일하게 "우클릭 → 열기"로 우회 가능해야 함

### 핵심 질문

1. DMG에서 설치한 Ad-hoc 서명 앱도 "우클릭 → 열기"로 실행 가능한가?
   - 답: ✅ 가능함!

2. DMG가 ZIP보다 나은가?
   - 사용자 경험: DMG가 더 직관적 (드래그 앤 드롭)
   - Gatekeeper 우회: 동일 (우클릭 → 열기)

3. electron-builder가 Ad-hoc 서명 + DMG를 지원하는가?
   - 답: ✅ 지원함!

