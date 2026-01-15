#!/usr/bin/env node

/**
 * Icon generation script for Octopus
 * Converts SVG to various formats required for Electron app
 * 
 * Requirements:
 *   npm install -D sharp png2icons
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');
const buildDir = join(rootDir, 'build');
const iconsDir = join(buildDir, 'icons');

// Ensure directories exist
if (!existsSync(buildDir)) {
  mkdirSync(buildDir, { recursive: true });
}
if (!existsSync(iconsDir)) {
  mkdirSync(iconsDir, { recursive: true });
}

const svgPath = join(iconsDir, 'icon.svg');
const svgBuffer = readFileSync(svgPath);

// Icon sizes for different platforms
const sizes = {
  // macOS icns sizes
  mac: [16, 32, 64, 128, 256, 512, 1024],
  // Windows ico sizes
  win: [16, 24, 32, 48, 64, 128, 256],
  // Linux sizes
  linux: [16, 32, 48, 64, 128, 256, 512],
  // Web favicon sizes
  web: [16, 32, 48],
};

async function generatePNGs() {
  console.log('Generating PNG files from SVG...');
  
  const allSizes = new Set([...sizes.mac, ...sizes.win, ...sizes.linux]);
  
  for (const size of allSizes) {
    const outputPath = join(iconsDir, `icon_${size}x${size}.png`);
    
    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(outputPath);
    
    console.log(`✓ Generated ${size}x${size} PNG`);
  }
}

async function generateFavicon() {
  console.log('\nGenerating favicon...');
  
  // Generate 32x32 favicon
  const faviconPath = join(rootDir, 'public', 'favicon.ico');
  
  // For now, just copy the 32x32 PNG as favicon.png
  await sharp(svgBuffer)
    .resize(32, 32)
    .png()
    .toFile(join(rootDir, 'public', 'favicon.png'));
  
  console.log('✓ Generated favicon.png (32x32)');
  console.log('ℹ For .ico conversion, use online tools or install additional dependencies');
}

async function copyToPublic() {
  console.log('\nCopying icon to public directory...');
  
  const publicIconPath = join(rootDir, 'public', 'icon.svg');
  writeFileSync(publicIconPath, svgBuffer);
  
  console.log('✓ Copied icon.svg to public/');
}

async function generateMacIcons() {
  console.log('\nGenerating macOS .icns format...');
  console.log('ℹ For .icns generation, use iconutil on macOS or png2icons:');
  console.log('  npm install -D png2icons');
  console.log('  or manually: iconutil -c icns build/icons/icon.iconset');
  
  // Create iconset directory structure
  const iconsetDir = join(iconsDir, 'icon.iconset');
  if (!existsSync(iconsetDir)) {
    mkdirSync(iconsetDir, { recursive: true });
  }
  
  // macOS iconset naming convention
  const macSizes = [
    { size: 16, name: 'icon_16x16.png' },
    { size: 32, name: 'icon_16x16@2x.png' },
    { size: 32, name: 'icon_32x32.png' },
    { size: 64, name: 'icon_32x32@2x.png' },
    { size: 128, name: 'icon_128x128.png' },
    { size: 256, name: 'icon_128x128@2x.png' },
    { size: 256, name: 'icon_256x256.png' },
    { size: 512, name: 'icon_256x256@2x.png' },
    { size: 512, name: 'icon_512x512.png' },
    { size: 1024, name: 'icon_512x512@2x.png' },
  ];
  
  for (const { size, name } of macSizes) {
    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(join(iconsetDir, name));
  }
  
  console.log('✓ Generated iconset directory');
  console.log('  Run on macOS: iconutil -c icns build/icons/icon.iconset');
}

async function generateWindowsIcon() {
  console.log('\nGenerating Windows .ico format...');
  console.log('ℹ For .ico generation with multiple sizes:');
  console.log('  npm install -D png2icons');
  console.log('  or use online tools like https://convertio.co/png-ico/');
  
  // Generate the main 256x256 icon
  await sharp(svgBuffer)
    .resize(256, 256)
    .png()
    .toFile(join(iconsDir, 'icon.png'));
  
  console.log('✓ Generated icon.png (256x256) for Windows');
}

async function updatePackageJson() {
  console.log('\nChecking package.json icon configuration...');
  
  const packagePath = join(rootDir, 'package.json');
  const packageJson = JSON.parse(readFileSync(packagePath, 'utf8'));
  
  // Check if icon paths are configured
  if (!packageJson.build.mac.icon) {
    console.log('ℹ Add to package.json build.mac: "icon": "build/icons/icon.icns"');
  }
  if (!packageJson.build.win.icon) {
    console.log('ℹ Add to package.json build.win: "icon": "build/icons/icon.ico"');
  }
  if (!packageJson.build.linux.icon) {
    console.log('ℹ Add to package.json build.linux: "icon": "build/icons/icon.png"');
  }
}

async function main() {
  console.log('🐙 Octopus Icon Generator\n');
  console.log('='.repeat(50));
  
  try {
    await generatePNGs();
    await generateFavicon();
    await copyToPublic();
    await generateMacIcons();
    await generateWindowsIcon();
    await updatePackageJson();
    
    console.log('\n' + '='.repeat(50));
    console.log('✅ Icon generation completed!\n');
    console.log('Next steps:');
    console.log('1. Install sharp: npm install -D sharp');
    console.log('2. Run: node scripts/generate-icons.js');
    console.log('3. (macOS) Run: iconutil -c icns build/icons/icon.iconset');
    console.log('4. (Windows) Use png2icons or online tool for .ico');
    console.log('5. Update package.json with icon paths');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('\nMake sure to install dependencies:');
    console.error('  npm install -D sharp');
    process.exit(1);
  }
}

main();
