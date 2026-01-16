# 자동 업데이트 로직 검토 - ZIP 배포 시

## 현재 설정 (electron/main.ts)

### 1. macOS 설정
```typescript
if (process.platform === 'darwin') {
    autoUpdater.autoDownload = false;  // 수동 다운로드
}
```

**의미**: macOS에서는 자동 다운로드하지 않음

### 2. 이벤트 핸들러
- `update-available`: 업데이트 발견 → 프론트엔드에 알림
- `update-downloaded`: 다운로드 완료 → 재시작 요청
- `open-download-page`: GitHub Releases 페이지 열기

## electron-updater의 ZIP 지원

### ✅ 좋은 소식: ZIP 완벽 지원!

electron-updater는 다음 형식을 지원:
- macOS: `.zip`, `.dmg` (둘 다 가능!)
- Windows: `.exe`
- Linux: `.AppImage`

### 작동 방식

1. **업데이트 확인**
   ```
   autoUpdater.checkForUpdates()
   ↓
   GitHub Releases API 호출
   ↓
   latest.yml 또는 latest-mac.yml 확인
   ```

2. **파일 탐색**
   ```
   GitHub Release에서 다음 순서로 파일 찾기:
   1. *.zip (macOS)
   2. *.dmg (macOS - ZIP 없을 때)
   3. *.exe (Windows)
   4. *.AppImage (Linux)
   ```

3. **macOS ZIP 업데이트 프로세스**
   ```
   업데이트 발견
   ↓
   autoDownload: false이므로 자동 다운로드 안 함
   ↓
   프론트엔드에 'update-available' 이벤트 전송
   ↓
   사용자가 "다운로드" 클릭
   ↓
   open-download-page 호출
   ↓
   GitHub Releases 페이지 열림
   ↓
   사용자가 수동으로 ZIP 다운로드
   ```

## 문제점 분석

### ❌ 현재 설정의 문제

**macOS에서 `autoDownload: false`**:
- 자동 다운로드하지 않음
- 사용자가 수동으로 GitHub에서 다운로드해야 함
- **ZIP 파일의 자동 업데이트를 활용하지 못함!**

### ✅ ZIP의 장점을 살리려면

ZIP 파일은 **인플레이스 업데이트(in-place update)** 가능:
- 앱이 실행 중에도 ZIP 다운로드 및 압축 해제
- 자동으로 교체 가능
- 재시작만 하면 업데이트 완료!

## 권장 설정

### 옵션 1: macOS도 자동 다운로드 (ZIP 장점 활용!)

```typescript
function setupAutoUpdater(win: BrowserWindow) {
    // macOS도 자동 다운로드 활성화 (ZIP이므로 가능!)
    // autoDownload는 기본값 true 사용
    
    autoUpdater.on('update-available', (info) => {
        log.info('Update available.', info);
        win.webContents.send('update-available', info);
        // ZIP은 자동 다운로드 시작됨
    });
    
    autoUpdater.on('update-downloaded', (info) => {
        log.info('Update downloaded');
        win.webContents.send('update-downloaded', info);
        // 사용자에게 재시작 요청
    });
}
```

**장점**:
- ✅ 진정한 자동 업데이트
- ✅ 사용자가 GitHub 방문 불필요
- ✅ ZIP의 인플레이스 업데이트 활용

**단점**:
- ⚠️ 서명되지 않은 앱의 자동 업데이트 (보안 경고 가능)
- ⚠️ 하지만 이미 앱을 신뢰했으므로 큰 문제 없음

### 옵션 2: 현재 유지 (수동 다운로드)

```typescript
if (process.platform === 'darwin') {
    autoUpdater.autoDownload = false;
}
```

**장점**:
- ✅ 사용자가 직접 제어
- ✅ 예상치 못한 다운로드 없음

**단점**:
- ❌ 자동 업데이트의 의미 없음
- ❌ 사용자가 수동으로 GitHub 방문 필요
- ❌ ZIP의 장점 활용 못함

## electron-updater의 latest.yml

### 자동 생성

electron-builder가 빌드 시 자동 생성:

```yaml
# latest-mac.yml (macOS)
version: 0.0.7
files:
  - url: Octopus_0.0.7_arm64.zip
    sha512: ...
    size: 123456
  - url: Octopus_0.0.7_x64.zip
    sha512: ...
    size: 123456
path: Octopus_0.0.7_arm64.zip
sha512: ...
releaseDate: '2026-01-16T...'
```

**중요**: ZIP 파일이 있으면 자동으로 ZIP을 사용!

## 결론

### ✅ ZIP + 자동 업데이트 = 완벽한 조합!

**추천**: macOS도 `autoDownload: true` 설정

```typescript
function setupAutoUpdater(win: BrowserWindow) {
    // macOS 특별 설정 제거 - 모든 플랫폼에서 자동 다운로드
    // if (process.platform === 'darwin') {
    //     autoUpdater.autoDownload = false;
    // }
    
    autoUpdater.on('update-available', (info) => {
        log.info('Update available.', info);
        win.webContents.send('update-available', info);
    });
    
    autoUpdater.on('update-downloaded', (info) => {
        log.info('Update downloaded');
        win.webContents.send('update-downloaded', info);
    });
    
    setTimeout(() => {
        autoUpdater.checkForUpdates();
    }, 3000);
}
```

### 변경 사항

```diff
function setupAutoUpdater(win: BrowserWindow) {
-   if (process.platform === 'darwin') {
-       autoUpdater.autoDownload = false;
-   }
+   // ZIP 파일 사용으로 macOS도 자동 다운로드 가능
```

### 이유

1. ✅ ZIP은 인플레이스 업데이트 지원
2. ✅ 서명되지 않아도 이미 신뢰된 앱
3. ✅ 진정한 자동 업데이트 경험
4. ✅ 사용자 편의성 극대화

