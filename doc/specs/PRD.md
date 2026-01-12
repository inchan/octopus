# AI Tool Configurator (통합 관리 및 동기화 서비스)

## 1. 개요 및 비전 (Overview & Vision)
본 서비스는 다양한 AI 도구(Rules, MCP Servers)의 설정이 각 도구와 프로젝트별로 파편화되어 발생하는 관리의 비효율을 해결하기 위해 기획되었습니다. 사용자가 정의한 룰과 서버 설정을 전역(Global) 및 프로젝트(Project) 단위로 통합 관리하고 일괄 동기화하는 것을 목표로 합니다.

## 2. 핵심 가치 (Core Values)
- **통합 관리 (Integrated Management):** Rules(3단계)와 MCP(2단계)의 계층적 구조화를 통해 설정을 체계적으로 관리합니다.
- **유연한 배포 (Flexible Deployment):** 전역 설정과 프로젝트별 로컬 설정을 명확히 구분하여 필요한 범위에 즉시 동기화합니다.
- **자동화된 경험 (Automated Experience):** 프로젝트 스캔 기능을 통해 맞춤형 환경을 자동으로 탐지하고 등록합니다.

## 3. 핵심 기능 요약 (Functional Summary)
- **Tools:** 도구별 설치 상태 확인 및 룰/MCP 세트 매핑.
- **Sync Engine:** Global/Project/Project-Local 범위를 선택하여 설정 일괄 배포 및 자동 백업.
- **Rules/MCP Management:** 태그와 드래그 앤 드롭을 활용한 우선순위 및 카테고리 관리.
- **Project Scanner:** CLI 마커 기반의 프로젝트 자동 탐지 및 전용 환경 구성.

## 4. 목표 사용자 (Target Users)
- 여러 IDE(Cursor, Windsurf 등)와 CLI 도구를 병행 사용하는 개발자.
- 프로젝트마다 다른 규칙과 MCP 서버 설정이 필요한 팀 또는 개인.

## 5. 성공 지표 (Success Metrics)
- 설정 구축에 소요되는 시간 단축.
- 동기화 히스토리 및 백업을 통한 설정 유실 방지.
