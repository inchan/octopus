#!/usr/bin/env node

/**
 * Version bump script for Octopus
 * Usage: node scripts/bump-version.js <major|minor|patch|version>
 * 
 * Examples:
 *   node scripts/bump-version.js patch    # 0.0.1 -> 0.0.2
 *   node scripts/bump-version.js minor    # 0.0.1 -> 0.1.0
 *   node scripts/bump-version.js major    # 0.0.1 -> 1.0.0
 *   node scripts/bump-version.js 1.2.3    # Set to specific version
 */

import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

function parseVersion(version) {
  const match = version.match(/^(\d+)\.(\d+)\.(\d+)$/);
  if (!match) {
    throw new Error(`Invalid version format: ${version}`);
  }
  return {
    major: parseInt(match[1], 10),
    minor: parseInt(match[2], 10),
    patch: parseInt(match[3], 10),
  };
}

function formatVersion({ major, minor, patch }) {
  return `${major}.${minor}.${patch}`;
}

function bumpVersion(currentVersion, bumpType) {
  const version = parseVersion(currentVersion);
  
  switch (bumpType) {
    case 'major':
      version.major += 1;
      version.minor = 0;
      version.patch = 0;
      break;
    case 'minor':
      version.minor += 1;
      version.patch = 0;
      break;
    case 'patch':
      version.patch += 1;
      break;
    default:
      // Assume it's a specific version
      return parseVersion(bumpType);
  }
  
  return version;
}

function updatePackageJson(newVersion) {
  const packagePath = join(rootDir, 'package.json');
  const packageJson = JSON.parse(readFileSync(packagePath, 'utf8'));
  const oldVersion = packageJson.version;
  
  packageJson.version = formatVersion(newVersion);
  
  writeFileSync(packagePath, JSON.stringify(packageJson, null, 2) + '\n');
  
  return oldVersion;
}

function updateChangelog(version) {
  const changelogPath = join(rootDir, 'CHANGELOG.md');
  let changelog = readFileSync(changelogPath, 'utf8');
  
  const today = new Date().toISOString().split('T')[0];
  const versionString = formatVersion(version);
  
  // Replace [Unreleased] with the new version
  changelog = changelog.replace(
    /## \[Unreleased\]/,
    `## [Unreleased]\n\n## [${versionString}] - ${today}`
  );
  
  writeFileSync(changelogPath, changelog);
}

function syncPackageLock() {
  try {
    console.log('Syncing package-lock.json...');
    execSync('npm install --package-lock-only --ignore-scripts', {
      cwd: rootDir,
      stdio: 'inherit'
    });
  } catch (error) {
    console.warn('Warning: Failed to sync package-lock.json:', error.message);
  }
}

function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.error('Usage: node bump-version.js <major|minor|patch|version>');
    process.exit(1);
  }
  
  const bumpType = args[0];
  
  try {
    // Read current version
    const packagePath = join(rootDir, 'package.json');
    const packageJson = JSON.parse(readFileSync(packagePath, 'utf8'));
    const currentVersion = packageJson.version;
    
    console.log(`Current version: ${currentVersion}`);
    
    // Calculate new version
    const newVersion = bumpVersion(currentVersion, bumpType);
    const newVersionString = formatVersion(newVersion);
    
    console.log(`New version: ${newVersionString}`);
    
    // Update files
    updatePackageJson(newVersion);
    console.log('✓ Updated package.json');
    
    syncPackageLock();
    console.log('✓ Synced package-lock.json');
    
    updateChangelog(newVersion);
    console.log('✓ Updated CHANGELOG.md');
    
    console.log('\nNext steps:');
    console.log('1. Review the changes');
    console.log('2. Update CHANGELOG.md with release notes');
    console.log(`3. Commit: git add -A && git commit -m "chore: bump version to ${newVersionString}"`);
    console.log(`4. Tag: git tag -a v${newVersionString} -m "Release v${newVersionString}"`);
    console.log('5. Push: git push && git push --tags');
    
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

main();
