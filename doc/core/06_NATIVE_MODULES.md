# 네이티브 모듈 가이드

## 개요

이 프로젝트는 `better-sqlite3` 네이티브 모듈을 사용합니다. 네이티브 모듈은 C/C++로 작성되어 특정 Node.js ABI 버전에 맞게 컴파일됩니다.

**문제**: Electron은 시스템 Node.js와 다른 버전의 Node.js를 내장하고 있어, 모듈 버전 불일치가 발생할 수 있습니다.

---

## 개발 환경 설정

### 1. 의존성 설치

```bash
npm install
```

### 2. 테스트 실행 (시스템 Node.js)

```bash
npm run test
```

> **참고**: 테스트는 시스템 Node.js에서 실행되므로 별도 빌드 없이 동작합니다.

### 3. 앱 실행 (Electron)

```bash
npm run dev
```

> **자동 처리**: `predev` 스크립트가 `electron-rebuild`를 자동 실행하여 Electron 버전에 맞게 네이티브 모듈을 재빌드합니다.

---

## CI/CD 환경

프로덕션 빌드 전에 반드시 Electron 헤더에 맞게 네이티브 모듈을 빌드해야 합니다:

```bash
npm run prebuild  # electron-rebuild 실행
npm run build     # 프로덕션 빌드
```

---

## 트러블슈팅

### "NODE_MODULE_VERSION XX ... requires NODE_MODULE_VERSION YY"

**원인**: 네이티브 모듈이 다른 Node.js 버전용으로 빌드됨.

**해결**:
```bash
# Electron용 재빌드
npx electron-rebuild -f -w better-sqlite3

# 또는 시스템 Node.js용 재빌드
npm rebuild better-sqlite3
```

---

## 스크립트 요약

| 스크립트 | 설명 |
|----------|------|
| `predev` | `npm run dev` 전에 자동 실행, Electron용 네이티브 모듈 빌드 |
| `prebuild` | `npm run build` 전에 자동 실행, 프로덕션 빌드용 |
