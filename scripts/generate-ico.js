#!/usr/bin/env node

/**
 * Windows ICO generator for Octopus
 * Generates multi-resolution .ico file from PNG files
 * 
 * Requirements:
 *   npm install -D sharp
 */

import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');
const iconsDir = join(rootDir, 'build', 'icons');

// ICO format structure
// Reference: https://en.wikipedia.org/wiki/ICO_(file_format)

function createIcoHeader(imageCount) {
  const buffer = Buffer.alloc(6);
  buffer.writeUInt16LE(0, 0);      // Reserved (must be 0)
  buffer.writeUInt16LE(1, 2);      // Type (1 = ICO)
  buffer.writeUInt16LE(imageCount, 4); // Number of images
  return buffer;
}

function createIcoEntry(width, height, colorCount, offset, size) {
  const buffer = Buffer.alloc(16);
  buffer.writeUInt8(width === 256 ? 0 : width, 0);   // Width (0 = 256)
  buffer.writeUInt8(height === 256 ? 0 : height, 1); // Height (0 = 256)
  buffer.writeUInt8(colorCount, 2);  // Color count (0 = more than 255)
  buffer.writeUInt8(0, 3);           // Reserved
  buffer.writeUInt16LE(1, 4);        // Color planes
  buffer.writeUInt16LE(32, 6);       // Bits per pixel
  buffer.writeUInt32LE(size, 8);     // Image data size
  buffer.writeUInt32LE(offset, 12);  // Image data offset
  return buffer;
}

async function generateIco() {
  console.log('🐙 Generating Windows ICO file...\n');

  // Sizes to include in ICO (Windows standard)
  const sizes = [16, 24, 32, 48, 64, 128, 256];
  
  const images = [];
  
  // Load PNG files
  for (const size of sizes) {
    const pngPath = join(iconsDir, `icon_${size}x${size}.png`);
    try {
      const pngData = readFileSync(pngPath);
      images.push({
        size,
        data: pngData,
        length: pngData.length
      });
      console.log(`✓ Loaded ${size}x${size} PNG (${(pngData.length / 1024).toFixed(1)}KB)`);
    } catch (error) {
      console.warn(`⚠ Warning: Could not load ${size}x${size} PNG, skipping`);
    }
  }

  if (images.length === 0) {
    console.error('❌ Error: No PNG files found');
    console.error('   Run: npm run icons:generate');
    process.exit(1);
  }

  console.log(`\nCreating ICO with ${images.length} images...`);

  // Create ICO file
  const header = createIcoHeader(images.length);
  const entries = [];
  
  // Calculate offsets
  let offset = 6 + (16 * images.length); // Header + directory entries
  
  for (const image of images) {
    const entry = createIcoEntry(
      image.size,
      image.size,
      0, // 0 = more than 255 colors (true color)
      offset,
      image.length
    );
    entries.push(entry);
    offset += image.length;
  }

  // Combine all parts
  const buffers = [header, ...entries, ...images.map(img => img.data)];
  const icoBuffer = Buffer.concat(buffers);

  // Write ICO file
  const icoPath = join(iconsDir, 'icon.ico');
  writeFileSync(icoPath, icoBuffer);

  console.log(`\n✅ Successfully generated icon.ico`);
  console.log(`   Location: ${icoPath}`);
  console.log(`   Size: ${(icoBuffer.length / 1024).toFixed(1)}KB`);
  console.log(`   Images: ${images.length} (${images.map(i => i.size).join(', ')}px)`);
}

async function main() {
  try {
    await generateIco();
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('\nTroubleshooting:');
    console.error('1. Make sure PNG files exist: npm run icons:generate');
    console.error('2. Check file permissions');
    process.exit(1);
  }
}

main();
