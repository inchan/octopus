const Database = require('better-sqlite3');
const path = require('path');
const os = require('os');
const fs = require('fs');

// Try to find the DB in standard location
const userDataPath = path.join(os.homedir(), 'Library', 'Application Support', 'align-agents-v2');
const dbPath = path.join(userDataPath, 'align-agents-v2.db');

console.log('Checking DB at:', dbPath);

if (!fs.existsSync(dbPath)) {
    console.error('Database file not found!');
    process.exit(1);
}

const db = new Database(dbPath);

console.log('\n--- Tool Configs ---');
try {
    const rows = db.prepare('SELECT * FROM tool_configs').all();
    if (rows.length === 0) {
        console.log('No configurations found.');
    } else {
        console.table(rows);
    }
} catch (e) {
    console.error('Error reading tool_configs:', e.message);
}

console.log('\n--- Rule Sets (for reference) ---');
try {
    const rules = db.prepare('SELECT id, name FROM rule_sets').all();
    console.table(rules);
} catch (e) {
    console.error('Error reading rule_sets:', e.message);
}

console.log('\n--- MCP Sets (for reference) ---');
try {
    const mcp = db.prepare('SELECT id, name FROM mcp_sets').all();
    console.table(mcp);
} catch (e) {
    console.error('Error reading mcp_sets:', e.message);
}

db.close();
