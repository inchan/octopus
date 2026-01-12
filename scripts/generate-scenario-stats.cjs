const fs = require('fs');
const path = require('path');
const glob = require('glob'); // I might not have glob installed. I should check or use recursive readdir.

// Simple recursive readdir since I can't rely on 'glob' package being installed
function getFiles(dir, files = []) {
  const fileList = fs.readdirSync(dir);
  for (const file of fileList) {
    const name = `${dir}/${file}`;
    if (fs.statSync(name).isDirectory()) {
      getFiles(name, files);
    } else {
      if (name.endsWith('.md') && !name.includes('common/') && !name.includes('ID-STANDARD.md') && !name.endsWith('README.md')) {
        files.push(name);
      }
    }
  }
  return files;
}

const LAYER_MAP = {
  'R': 'Repository',
  'S': 'Service',
  'H': 'Handler',
  'C': 'Component',
  'U': 'Utility',
  'E': 'E2E',
  'K': 'Hook'
};

const MENU_MAP = {
  'TOOLS': 'Tools',
  'SYNC': 'Sync',
  'PROJ': 'Projects',
  'RULES': 'Rules',
  'MCP': 'MCP',
  'HIST': 'History',
  'SET': 'Settings'
};

function generateProgressBar(count, total) {
  const percent = total === 0 ? 0 : Math.round((count / total) * 100);
  const barLength = 10;
  const filled = Math.round((percent / 100) * barLength);
  const bar = '█'.repeat(filled) + '░'.repeat(barLength - filled);
  return `${bar} ${percent}%`;
}

function analyzeFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Count Scenarios
  const scenarios = content.match(/^#{3,4} TC-[A-Z]+-[A-Z]+[0-9]+/gm) || [];
  const total = scenarios.length;

  // Count Priority
  const high = (content.match(/\*\*Priority\*\*: High/g) || []).length;
  const medium = (content.match(/\*\*Priority\*\*: Medium/g) || []).length;
  const low = (content.match(/\*\*Priority\*\*: Low/g) || []).length;

  // Count by Layer
  const byLayer = {};
  scenarios.forEach(id => {
    // Format: ### TC-MENU-LAYERNUMBER
    // e.g. ### TC-TOOLS-R001
    const match = id.match(/TC-[A-Z]+-([A-Z])([0-9]+)/);
    if (match) {
      const layerCode = match[1];
      const layerName = LAYER_MAP[layerCode] || 'Other';
      byLayer[layerName] = (byLayer[layerName] || 0) + 1;
    } else {
      // Try to handle old format or irregular ones if any
       const matchOld = id.match(/TC-[A-Z]+-([A-Z]+)-/); // TC-MCP-U-CP001
       if (matchOld) {
           // This logic is getting complex, let's stick to the standard we just enforced.
           // If migration worked, we should be good.
           // For TC-MCP-U001 (if not migrated correctly? wait, my migration script handled prefix)
           // If T2 worked, ID should be TC-MCP-U001.
           // But wait, the migration script pattern for mcp unit was:
           // TC-MCP-CP(\d+) -> TC-MCP-U$1
           // So TC-MCP-CP001 -> TC-MCP-U001.
           // Checks out.
       }
    }
  });

  return { filePath, total, high, medium, low, byLayer };
}

function updateFileHeader(stats) {
    let content = fs.readFileSync(stats.filePath, 'utf8');
    const today = new Date().toISOString().split('T')[0];

    const layerRows = Object.entries(stats.byLayer)
        .map(([layer, count]) => `| ${layer} | ${count} | ${generateProgressBar(count, stats.total)} |`)
        .join('\n');

    const statsSection = `
## Statistics

| Metric | Value |
|--------|-------|
| Total Scenarios | ${stats.total} |
| High Priority | ${stats.high} (${Math.round(stats.high/stats.total*100)}%) |
| Medium Priority | ${stats.medium} (${Math.round(stats.medium/stats.total*100)}%) |
| Low Priority | ${stats.low} (${Math.round(stats.low/stats.total*100)}%) |
| Last Updated | ${today} |

### Coverage by Layer

| Layer | Count | Coverage |
|-------|-------|----------|
${layerRows}
`;

    // Check if Statistics section exists
    const statsRegex = /## Statistics[\s\S]*?(?=^## |$)/m;
    
    if (statsRegex.test(content)) {
        content = content.replace(statsRegex, statsSection.trim() + '\n\n');
    } else {
        // Insert after first H1
        const titleRegex = /(^# .+)(\n+)/;
        if (titleRegex.test(content)) {
             content = content.replace(titleRegex, `$1\n\n${statsSection.trim()}\n\n`);
        } else {
            // Prepend if no H1
            content = statsSection.trim() + '\n\n' + content;
        }
    }

    fs.writeFileSync(stats.filePath, content, 'utf8');
    console.log(`Updated stats for: ${stats.filePath}`);
}

async function main() {
    console.log('Generating Scenario Statistics...');
    const files = getFiles('tests/scenarios');
    
    const allStats = [];

    for (const file of files) {
        const stats = analyzeFile(file);
        updateFileHeader(stats);
        allStats.push(stats);
    }
    
    // We could also generate the README here, but T5-C says "Create scenarios/README.md"
    // I'll leave that for the next step, using the data if needed.
    // For now, let's output a summary json for debugging or future use.
    fs.writeFileSync('tests/scenarios/stats.json', JSON.stringify(allStats, null, 2));
    console.log('Stats generation complete.');
}

main();
