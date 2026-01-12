const fs = require('fs');
const path = require('path');

// Configuration for conversions
const CONFIG = {
  'tests/scenarios/tools/unit-tests.md': [
    { pattern: /TC-TD-(\d+)/g, prefix: 'TC-TOOLS-R', offset: 0 },
    { pattern: /TC-TS-(\d+)/g, prefix: 'TC-TOOLS-S', offset: 0 }, // If TS exists
    { pattern: /TC-TC-(\d+)/g, prefix: 'TC-TOOLS-S', offset: 0 }, // Mapping TC-TC to Service
    { pattern: /TC-TCH-(\d+)/g, prefix: 'TC-TOOLS-H', offset: 0 },
    { pattern: /TC-FC-(\d+)/g, prefix: 'TC-TOOLS-C', offset: 0 },
    { pattern: /TC-EC-(\d+)/g, prefix: 'TC-TOOLS-S', offset: 50 }, // Offset to avoid collision with TC-TC
  ],
  'tests/scenarios/tools/e2e-tests.md': [
    { pattern: /TC-E2E-(\d+)/g, prefix: 'TC-TOOLS-E', offset: 0 },
  ],
  'tests/scenarios/sync/unit-tests.md': [
    { pattern: /TC-SYNC-U(\d+)/g, prefix: 'TC-SYNC-S', offset: 0 },
    { pattern: /TC-SYNC-G(\d+)/g, prefix: 'TC-SYNC-U', offset: 0 },
    { pattern: /TC-SYNC-H(\d+)/g, prefix: 'TC-SYNC-H', offset: 0 },
    { pattern: /TC-SYNC-I(\d+)/g, prefix: 'TC-SYNC-S', offset: 50 }, // Offset
  ],
  'tests/scenarios/sync/e2e-tests.md': [
    { pattern: /TC-SYNC-E(\d{4})/g, prefix: 'TC-SYNC-E', offset: 0 }, // Just reformat to 3 digits
    { pattern: /TC-SYNC-E(\d{3})/g, prefix: 'TC-SYNC-E', offset: 0 },
  ],
  'tests/scenarios/projects/unit-tests.md': [
    { pattern: /TC-PR-(\d+)/g, prefix: 'TC-PROJ-R', offset: 0 },
    { pattern: /TC-PS-(\d+)/g, prefix: 'TC-PROJ-S', offset: 0 },
    { pattern: /TC-SV-(\d+)/g, prefix: 'TC-PROJ-S', offset: 20 },
    { pattern: /TC-PH-(\d+)/g, prefix: 'TC-PROJ-H', offset: 0 },
    { pattern: /TC-FC-(\d+)/g, prefix: 'TC-PROJ-C', offset: 0 },
  ],
  'tests/scenarios/projects/e2e-tests.md': [
    { pattern: /TC-E2E-(\d+)/g, prefix: 'TC-PROJ-E', offset: 0 },
    { pattern: /TC-E2E-1(\d{2})/g, prefix: 'TC-PROJ-E', offset: 100 },
    { pattern: /TC-E2E-2(\d{2})/g, prefix: 'TC-PROJ-E', offset: 200 },
    { pattern: /TC-E2E-3(\d{2})/g, prefix: 'TC-PROJ-E', offset: 300 },
    { pattern: /TC-E2E-4(\d{2})/g, prefix: 'TC-PROJ-E', offset: 400 },
    { pattern: /TC-E2E-5(\d{2})/g, prefix: 'TC-PROJ-E', offset: 500 },
  ],
  'tests/scenarios/rules/unit-tests.md': [
    { pattern: /TC-RS-(\d+)/g, prefix: 'TC-RULES-R', offset: 0 },
    { pattern: /TC-RSS-(\d+)/g, prefix: 'TC-RULES-R', offset: 20 },
    { pattern: /TC-RH-(\d+)/g, prefix: 'TC-RULES-H', offset: 0 },
    { pattern: /TC-SH-(\d+)/g, prefix: 'TC-RULES-H', offset: 20 },
    { pattern: /TC-UR-(\d+)/g, prefix: 'TC-RULES-K', offset: 0 },
    { pattern: /TC-URS-(\d+)/g, prefix: 'TC-RULES-K', offset: 20 },
    { pattern: /TC-RE-(\d+)/g, prefix: 'TC-RULES-C', offset: 0 },
    { pattern: /TC-RD-(\d+)/g, prefix: 'TC-RULES-C', offset: 20 },
    { pattern: /TC-RSL-(\d+)/g, prefix: 'TC-RULES-C', offset: 40 },
    { pattern: /TC-RSD-(\d+)/g, prefix: 'TC-RULES-C', offset: 60 },
    { pattern: /TC-RP-(\d+)/g, prefix: 'TC-RULES-C', offset: 80 },
    { pattern: /TC-RID-(\d+)/g, prefix: 'TC-RULES-C', offset: 100 },
    { pattern: /TC-PERF-(\d+)/g, prefix: 'TC-RULES-C', offset: 200 },
    { pattern: /TC-A11Y-(\d+)/g, prefix: 'TC-RULES-C', offset: 210 },
    { pattern: /TC-ERR-(\d+)/g, prefix: 'TC-RULES-C', offset: 220 },
    { pattern: /TC-RI-(\d+)/g, prefix: 'TC-RULES-U', offset: 0 },
    { pattern: /TC-INT-(\d+)/g, prefix: 'TC-RULES-S', offset: 0 },
  ],
  'tests/scenarios/rules/e2e-tests.md': [
    { pattern: /TC-E2E-RS-(\d+)/g, prefix: 'TC-RULES-E', offset: 0 },
    { pattern: /TC-E2E-RM-(\d+)/g, prefix: 'TC-RULES-E', offset: 20 },
    { pattern: /TC-E2E-SRA-(\d+)/g, prefix: 'TC-RULES-E', offset: 40 },
    { pattern: /TC-E2E-IE-(\d+)/g, prefix: 'TC-RULES-E', offset: 60 },
    { pattern: /TC-E2E-FW-(\d+)/g, prefix: 'TC-RULES-E', offset: 80 },
    { pattern: /TC-E2E-SP-(\d+)/g, prefix: 'TC-RULES-E', offset: 100 },
    { pattern: /TC-E2E-ES-(\d+)/g, prefix: 'TC-RULES-E', offset: 120 },
    { pattern: /TC-E2E-LS-(\d+)/g, prefix: 'TC-RULES-E', offset: 140 },
    { pattern: /TC-E2E-VE-(\d+)/g, prefix: 'TC-RULES-E', offset: 160 },
    { pattern: /TC-E2E-UI-(\d+)/g, prefix: 'TC-RULES-E', offset: 180 },
    { pattern: /TC-E2E-A11Y-(\d+)/g, prefix: 'TC-RULES-E', offset: 200 },
    { pattern: /TC-E2E-DI-(\d+)/g, prefix: 'TC-RULES-E', offset: 220 },
    { pattern: /TC-E2E-PERF-(\d+)/g, prefix: 'TC-RULES-E', offset: 240 },
    { pattern: /TC-E2E-CB-(\d+)/g, prefix: 'TC-RULES-E', offset: 260 },
    { pattern: /TC-E2E-REG-(\d+)/g, prefix: 'TC-RULES-E', offset: 280 },
  ],
  'tests/scenarios/mcp/unit-tests.md': [
    { pattern: /TC-MCP-R(\d+)/g, prefix: 'TC-MCP-R', offset: 0 },
    { pattern: /TC-MCP-SS(\d+)/g, prefix: 'TC-MCP-R', offset: 20 },
    { pattern: /TC-MCP-S(\d+)/g, prefix: 'TC-MCP-S', offset: 0 },
    { pattern: /TC-MCP-H(\d+)/g, prefix: 'TC-MCP-H', offset: 0 },
    { pattern: /TC-MCP-HK(\d+)/g, prefix: 'TC-MCP-K', offset: 0 },
    { pattern: /TC-MCP-CP(\d+)/g, prefix: 'TC-MCP-U', offset: 0 },
    { pattern: /TC-MCP-C(\d+)/g, prefix: 'TC-MCP-C', offset: 0 },
  ],
  'tests/scenarios/mcp/e2e-tests.md': [
    { pattern: /TC-MCP-E(\d+)/g, prefix: 'TC-MCP-E', offset: 0 },
  ],
  'tests/scenarios/history/unit-tests.md': [
    { pattern: /TC-H-R(\d+)/g, prefix: 'TC-HIST-R', offset: 0 },
    { pattern: /TC-H-S(\d+)/g, prefix: 'TC-HIST-S', offset: 0 },
    { pattern: /TC-H-I(\d+)/g, prefix: 'TC-HIST-S', offset: 50 },
    { pattern: /TC-H-H(\d+)/g, prefix: 'TC-HIST-H', offset: 0 },
    { pattern: /TC-H-C(\d+)/g, prefix: 'TC-HIST-C', offset: 0 },
    { pattern: /TC-H-P(\d+)/g, prefix: 'TC-HIST-C', offset: 50 },
    { pattern: /TC-H-E(\d+)/g, prefix: 'TC-HIST-U', offset: 0 },
  ],
  'tests/scenarios/history/e2e-tests.md': [
    { pattern: /TC-H-E2E(\d+)/g, prefix: 'TC-HIST-E', offset: 0 },
  ],
  'tests/scenarios/settings/unit-tests.md': [
    { pattern: /TC-SETTINGS-(\d+)/g, prefix: 'TC-SET-S', offset: 0 },
  ],
  'tests/scenarios/settings/e2e-tests.md': [
    { pattern: /TC-SETTINGS-E2E-(\d+)/g, prefix: 'TC-SET-E', offset: 0 },
  ],
};

async function processFile(filePath, replacements) {
  try {
    const fullPath = path.resolve(filePath);
    if (!fs.existsSync(fullPath)) {
      console.warn(`File not found: ${filePath}`);
      return;
    }

    let content = fs.readFileSync(fullPath, 'utf8');
    let hasChanges = false;
    let backupContent = content;

    // Sort replacements to handle longer matches first if necessary
    // But here we rely on regex specificities. 
    // Important: we need to replace all occurrences.

    for (const rule of replacements) {
      content = content.replace(rule.pattern, (match, number) => {
        hasChanges = true;
        const newNumber = parseInt(number, 10) + rule.offset;
        const newNumberStr = newNumber.toString().padStart(3, '0');
        return `${rule.prefix}${newNumberStr}`;
      });
    }

    if (hasChanges) {
      fs.writeFileSync(fullPath, content, 'utf8');
      console.log(`Updated: ${filePath}`);
    } else {
      console.log(`No changes for: ${filePath}`);
    }

  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
  }
}

async function main() {
  console.log('Starting Scenario ID Conversion...');
  for (const [filePath, replacements] of Object.entries(CONFIG)) {
    await processFile(filePath, replacements);
  }
  console.log('Conversion Complete.');
}

main();
