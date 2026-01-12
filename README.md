# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

# Align Agents v2

**[Start Here: 프로젝트 마스터 가이드 (Project Constitution)](doc/GUIDE.md)**

Align Agents v2는 Electron 기반의 프리미엄 AI 도구 관리 데스크탑 애플리케이션입니다.
Clean Architecture, SOLID 원칙, 그리고 TDD를 기반으로 개발되고 있습니다.

## 문서 및 가이드
이 프로젝트는 철저한 문서화 중심 개발(Documentation-Driven Development)을 따릅니다.
모든 개발자와 에이전트는 작업을 시작하기 전에 **[마스터 가이드](doc/GUIDE.md)**를 숙지해야 합니다.

- **[Core Principles](doc/core/01_PRINCIPLES.md)**: 핵심 원칙
- **[Project Structure](doc/core/02_STRUCTURE.md)**: 아키텍처 구조
- **[Workflow](doc/core/03_WORKFLOW.md)**: 개발 절차

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
