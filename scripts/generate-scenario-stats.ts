#!/usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';

/**
 * T5-A-001: 시나리오 통계 생성 스크립트
 *
 * 기능:
 * 1. 파일별 시나리오 수 카운트 (### TC- 패턴 매칭)
 * 2. Priority 분포 분석 (High/Medium/Low)
 * 3. 계층별 커버리지 (R/S/H/C/U/E/K)
 * 4. Markdown 테이블 및 JSON 출력
 */

interface ScenarioStats {
  menu: string;
  file: string;
  total: number;
  byPriority: {
    high: number;
    medium: number;
    low: number;
  };
  byLayer: Record<string, number>;
}

interface CLIOptions {
  menu?: string;
  json: boolean;
  help: boolean;
}

const LAYER_MAP: Record<string, string> = {
  'R': 'Repository',
  'S': 'Service',
  'H': 'Handler',
  'C': 'Component',
  'U': 'Utility',
  'E': 'E2E',
  'K': 'Hook'
};

const MENU_MAP: Record<string, string> = {
  'TOOLS': 'Tools',
  'SYNC': 'Sync',
  'PROJ': 'Projects',
  'RULES': 'Rules',
  'MCP': 'MCP',
  'HIST': 'History',
  'SET': 'Settings'
};

/**
 * CLI 인자 파싱
 */
function parseArgs(): CLIOptions {
  const args = process.argv.slice(2);
  const options: CLIOptions = {
    json: false,
    help: false
  };

  for (const arg of args) {
    if (arg === '--help' || arg === '-h') {
      options.help = true;
    } else if (arg === '--json') {
      options.json = true;
    } else if (arg.startsWith('--menu=')) {
      options.menu = arg.split('=')[1].toUpperCase();
    }
  }

  return options;
}

/**
 * 도움말 출력
 */
function printHelp(): void {
  console.log(`
시나리오 통계 생성 스크립트

사용법:
  npm run scenario-stats              # 전체 통계
  npm run scenario-stats -- --menu=mcp  # 특정 메뉴만
  npm run scenario-stats -- --json     # JSON 출력
  npm run scenario-stats -- --help     # 도움말

옵션:
  --menu=<name>   특정 메뉴만 분석 (예: tools, sync, mcp)
  --json          JSON 형식으로 출력
  --help, -h      이 도움말 표시

예제:
  npm run scenario-stats -- --menu=tools --json
  `);
}

/**
 * 재귀적으로 디렉토리에서 .md 파일 찾기
 */
function getMarkdownFiles(dir: string, files: string[] = []): string[] {
  if (!fs.existsSync(dir)) {
    return files;
  }

  const fileList = fs.readdirSync(dir);
  for (const file of fileList) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      getMarkdownFiles(filePath, files);
    } else if (file.endsWith('.md') &&
               !filePath.includes('common/') &&
               !file.includes('ID-STANDARD.md') &&
               file !== 'README.md') {
      files.push(filePath);
    }
  }

  return files;
}

/**
 * 진행률 바 생성
 */
function generateProgressBar(count: number, total: number): string {
  const percent = total === 0 ? 0 : Math.round((count / total) * 100);
  const barLength = 10;
  const filled = Math.round((percent / 100) * barLength);
  const bar = '█'.repeat(filled) + '░'.repeat(barLength - filled);
  return `${bar} ${percent}%`;
}

/**
 * 파일에서 메뉴 이름 추출
 */
function extractMenuFromPath(filePath: string): string {
  // scenarios/mcp/unit-tests.md -> MCP
  const parts = filePath.split(path.sep);
  const menuIndex = parts.findIndex(p => p === 'scenarios') + 1;

  if (menuIndex < parts.length) {
    const menuFolder = parts[menuIndex].toUpperCase();
    return MENU_MAP[menuFolder] || menuFolder;
  }

  return 'Unknown';
}

/**
 * 파일 분석
 */
function analyzeFile(filePath: string): ScenarioStats {
  const content = fs.readFileSync(filePath, 'utf8');
  const menu = extractMenuFromPath(filePath);

  // 시나리오 카운트 (### TC- 또는 #### TC- 패턴)
  const scenarioRegex = /^#{3,4} TC-[A-Z]+-[A-Z]+[0-9]+/gm;
  const scenarios = content.match(scenarioRegex) || [];
  const total = scenarios.length;

  // Priority 카운트
  const high = (content.match(/\*\*Priority\*\*: High/g) || []).length;
  const medium = (content.match(/\*\*Priority\*\*: Medium/g) || []).length;
  const low = (content.match(/\*\*Priority\*\*: Low/g) || []).length;

  // Layer별 카운트
  const byLayer: Record<string, number> = {};
  scenarios.forEach(scenarioLine => {
    // Format: ### TC-MENU-LAYERNUMBER
    // 예: ### TC-TOOLS-R001, #### TC-MCP-E001
    const match = scenarioLine.match(/TC-[A-Z]+-([A-Z])([0-9]+)/);
    if (match) {
      const layerCode = match[1];
      const layerName = LAYER_MAP[layerCode] || 'Other';
      byLayer[layerName] = (byLayer[layerName] || 0) + 1;
    }
  });

  return {
    menu,
    file: path.relative(process.cwd(), filePath),
    total,
    byPriority: { high, medium, low },
    byLayer
  };
}

/**
 * Markdown 테이블 출력
 */
function printMarkdownTable(stats: ScenarioStats[]): void {
  console.log('\n## 시나리오 통계\n');

  // 전체 요약
  const totalScenarios = stats.reduce((sum, s) => sum + s.total, 0);
  const totalHigh = stats.reduce((sum, s) => sum + s.byPriority.high, 0);
  const totalMedium = stats.reduce((sum, s) => sum + s.byPriority.medium, 0);
  const totalLow = stats.reduce((sum, s) => sum + s.byPriority.low, 0);

  console.log('### 전체 요약\n');
  console.log('| Metric | Value |');
  console.log('|--------|-------|');
  console.log(`| 총 시나리오 수 | ${totalScenarios} |`);
  console.log(`| High Priority | ${totalHigh} (${Math.round(totalHigh/totalScenarios*100 || 0)}%) |`);
  console.log(`| Medium Priority | ${totalMedium} (${Math.round(totalMedium/totalScenarios*100 || 0)}%) |`);
  console.log(`| Low Priority | ${totalLow} (${Math.round(totalLow/totalScenarios*100 || 0)}%) |`);

  // 파일별 통계
  console.log('\n### 파일별 통계\n');
  console.log('| Menu | File | Total | High | Medium | Low |');
  console.log('|------|------|-------|------|--------|-----|');

  stats.forEach(s => {
    console.log(`| ${s.menu} | ${path.basename(s.file)} | ${s.total} | ${s.byPriority.high} | ${s.byPriority.medium} | ${s.byPriority.low} |`);
  });

  // 계층별 통계
  console.log('\n### 계층별 커버리지\n');
  const allLayers = Object.keys(LAYER_MAP).map(k => LAYER_MAP[k]);
  const layerTotals: Record<string, number> = {};

  stats.forEach(s => {
    Object.entries(s.byLayer).forEach(([layer, count]) => {
      layerTotals[layer] = (layerTotals[layer] || 0) + count;
    });
  });

  console.log('| Layer | Count | Coverage |');
  console.log('|-------|-------|----------|');

  allLayers.forEach(layer => {
    const count = layerTotals[layer] || 0;
    console.log(`| ${layer} | ${count} | ${generateProgressBar(count, totalScenarios)} |`);
  });

  console.log('\n');
}

/**
 * JSON 출력
 */
function printJSON(stats: ScenarioStats[]): void {
  const output = {
    summary: {
      totalFiles: stats.length,
      totalScenarios: stats.reduce((sum, s) => sum + s.total, 0),
      totalHigh: stats.reduce((sum, s) => sum + s.byPriority.high, 0),
      totalMedium: stats.reduce((sum, s) => sum + s.byPriority.medium, 0),
      totalLow: stats.reduce((sum, s) => sum + s.byPriority.low, 0)
    },
    files: stats,
    generatedAt: new Date().toISOString()
  };

  console.log(JSON.stringify(output, null, 2));
}

/**
 * 메인 함수
 */
async function main(): Promise<void> {
  const options = parseArgs();

  if (options.help) {
    printHelp();
    return;
  }

  const scenariosDir = path.join(process.cwd(), 'scenarios');
  const files = getMarkdownFiles(scenariosDir);

  if (files.length === 0) {
    console.log('⚠️  시나리오 파일을 찾을 수 없습니다.');
    console.log(`경로: ${scenariosDir}`);
    return;
  }

  // 파일 분석
  let allStats = files.map(analyzeFile);

  // 메뉴 필터링
  if (options.menu) {
    const targetMenu = MENU_MAP[options.menu] || options.menu;
    allStats = allStats.filter(s =>
      s.menu.toLowerCase() === targetMenu.toLowerCase()
    );

    if (allStats.length === 0) {
      console.log(`⚠️  메뉴 '${options.menu}'에 해당하는 시나리오를 찾을 수 없습니다.`);
      return;
    }
  }

  // 출력
  if (options.json) {
    printJSON(allStats);
  } else {
    printMarkdownTable(allStats);
  }
}

// 스크립트 실행
main().catch(err => {
  console.error('❌ 에러 발생:', err.message);
  process.exit(1);
});
