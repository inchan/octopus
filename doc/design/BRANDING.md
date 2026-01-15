# Octopus 브랜딩 가이드

## 브랜드 아이덴티티

### 로고 & 아이콘

<div align="center">
  <img src="../../build/icons/icon.svg" alt="Octopus Logo" width="200" height="200">
</div>

### 브랜드 스토리

**Octopus**(문어)는 8개의 다리를 가진 지능적인 해양 생물입니다. 우리 제품도 마찬가지로:

- 🎯 **8개의 다리** = 여러 AI 도구를 동시에 연결하고 관리
- 🧠 **중앙 두뇌** = 하나의 중앙 집중식 설정 관리
- 🔄 **유연성** = 다양한 환경과 도구에 쉽게 적응
- 🎨 **지능** = 스마트한 동기화와 자동 최적화

### 태그라인

> **Centralized AI Tool Configuration Manager**
> 
> 한 곳에서 모든 AI 도구를 제어하세요

---

## 컬러 시스템

### Primary Colors

```css
/* Purple Gradient - Main Brand Color */
--octopus-purple: #8B5CF6;
--octopus-pink: #EC4899;

/* Gradient */
background: linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%);
```

<div style="display: flex; gap: 20px; margin: 20px 0;">
  <div style="width: 100px; height: 100px; background: #8B5CF6; border-radius: 8px;"></div>
  <div style="width: 100px; height: 100px; background: #EC4899; border-radius: 8px;"></div>
  <div style="width: 100px; height: 100px; background: linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%); border-radius: 8px;"></div>
</div>

### 컬러 의미

- **보라(#8B5CF6)**: 기술, 창의성, 혁신
- **핑크(#EC4899)**: 에너지, 열정, 접근성
- **그라디언트**: 다양성, 통합, 조화

### Supporting Colors

```css
/* Neutral Colors */
--octopus-gray-900: #1F2937;
--octopus-gray-600: #4B5563;
--octopus-gray-300: #D1D5DB;
--octopus-white: #FFFFFF;

/* Semantic Colors */
--octopus-success: #10B981;
--octopus-warning: #F59E0B;
--octopus-error: #EF4444;
--octopus-info: #3B82F6;
```

---

## 타이포그래피

### 폰트 패밀리

```css
/* Primary Font - UI */
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 
             'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 
             'Helvetica Neue', sans-serif;

/* Monospace Font - Code */
font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', 
             Consolas, 'Courier New', monospace;
```

### 타이포그래피 스케일

| 용도 | 크기 | 굵기 |
|------|------|------|
| H1 | 36px | Bold (700) |
| H2 | 30px | Semibold (600) |
| H3 | 24px | Semibold (600) |
| Body | 16px | Regular (400) |
| Small | 14px | Regular (400) |
| Caption | 12px | Regular (400) |

---

## 로고 사용 가이드

### 올바른 사용

✅ **DO**
- 충분한 여백 확보 (최소 로고 높이의 20%)
- 단색 배경에서 그라디언트 버전 사용
- 어두운 배경에서 흰색 아웃라인 버전 사용
- 명확한 가독성 유지

### 금지 사항

❌ **DON'T**
- 로고 비율 왜곡하지 않기
- 그라디언트 색상 변경하지 않기
- 너무 복잡한 배경 위에 배치하지 않기
- 16px 미만으로 축소하지 않기 (웹)

### 로고 변형

#### 1. Full Color (Primary)
- 기본 사용
- 밝은 배경에 최적화

#### 2. Monochrome White
- 어두운 배경용
- 최소 대비: 4.5:1

#### 3. Monochrome Black
- 흑백 인쇄용
- 명함, 문서

---

## 아이콘 시스템

### 아이콘 파일 위치

```
build/icons/
├── icon.svg              # 마스터 SVG
├── icon.icns            # macOS
├── icon.ico             # Windows
├── icon.png             # Linux (512x512)
├── icon.iconset/        # macOS iconset
└── icon_*x*.png        # 다양한 크기
```

### 생성된 크기

- **macOS**: 16, 32, 64, 128, 256, 512, 1024px
- **Windows**: 16, 24, 32, 48, 64, 128, 256px
- **Linux**: 16, 32, 48, 64, 128, 256, 512px
- **Web**: 16, 32, 48px (favicon)

### 아이콘 생성

```bash
# SVG에서 모든 크기 생성
npm run icons:generate

# macOS .icns 생성 (macOS에서만)
iconutil -c icns build/icons/icon.iconset
```

---

## 애플리케이션 UI

### 디자인 원칙

1. **명확성 (Clarity)**
   - 단순하고 직관적인 인터페이스
   - 명확한 액션과 피드백

2. **일관성 (Consistency)**
   - 통일된 컴포넌트 사용
   - 예측 가능한 인터랙션

3. **효율성 (Efficiency)**
   - 빠른 작업 흐름
   - 키보드 단축키 지원

4. **아름다움 (Aesthetics)**
   - 세련된 비주얼
   - 적절한 애니메이션

### UI 컴포넌트

현재 사용 중인 UI 라이브러리:
- **Radix UI**: 접근성 우선 컴포넌트
- **TailwindCSS**: 유틸리티 CSS
- **Lucide Icons**: 아이콘 세트

---

## 브랜딩 자산

### 마케팅 자산 (예정)

- [ ] GitHub Social Preview (1280x640)
- [ ] App Store Screenshots
- [ ] 프로모션 비디오
- [ ] 애니메이션 로고

### 문서 자산

- [x] README 로고
- [x] 앱 아이콘
- [ ] 슬라이드 템플릿
- [ ] 프레젠테이션 자료

---

## 브랜드 보이스

### 톤 & 매너

- **전문적이지만 친근함**: 기술 용어를 쉽게 설명
- **간결함**: 핵심만 명확하게
- **도움이 되는**: 사용자 중심 접근
- **혁신적**: 새로운 방식 제안

### 메시지 예시

❌ **Before**: "AI 도구 설정 파일 동기화 솔루션"
✅ **After**: "모든 AI 도구를 한 곳에서 관리하세요"

---

## 버전 히스토리

| 버전 | 날짜 | 변경사항 |
|------|------|----------|
| 1.0 | 2025-01-15 | 초기 브랜딩 확립 |
| | | - 문어 로고 디자인 |
| | | - 보라/핑크 컬러 시스템 |
| | | - 아이콘 세트 생성 |

---

## 참고 자료

- [SVG 마스터 파일](../../build/icons/icon.svg)
- [아이콘 생성 스크립트](../../scripts/generate-icons.js)
- [Radix UI 디자인 시스템](https://www.radix-ui.com/)
- [TailwindCSS](https://tailwindcss.com/)

---

## 연락처

브랜딩 관련 문의:
- GitHub Issues: [프로젝트 저장소]
- 디자인 개선 제안 환영!

---

<div align="center">
  <img src="../../build/icons/icon.svg" alt="Octopus" width="80" height="80">
  <p><em>Octopus - Centralized AI Tool Configuration Manager</em></p>
</div>
