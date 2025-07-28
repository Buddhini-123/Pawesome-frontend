#!/usr/bin/env node

/**
 * Quick image analysis script for Pawesome Frontend
 * Run with: node scripts/analyze-images.js
 */

const fs = require('fs').promises;
const path = require('path');

const DIRECTORIES = [
  path.join(__dirname, '../public'),
  path.join(__dirname, '../src/assets')
];

const IMAGE_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg'];

async function getFileSize(filePath) {
  const stats = await fs.stat(filePath);
  return stats.size;
}

async function analyzeDirectory(dir) {
  const results = [];
  
  try {
    const items = await fs.readdir(dir, { withFileTypes: true });
    
    for (const item of items) {
      const fullPath = path.join(dir, item.name);
      
      if (item.isDirectory()) {
        results.push(...await analyzeDirectory(fullPath));
      } else if (item.isFile()) {
        const ext = path.extname(item.name).toLowerCase();
        
        if (IMAGE_EXTENSIONS.includes(ext)) {
          const size = await getFileSize(fullPath);
          results.push({
            path: fullPath,
            name: item.name,
            size: size,
            sizeKB: (size / 1024).toFixed(2),
            sizeMB: (size / 1024 / 1024).toFixed(2),
            extension: ext
          });
        }
      }
    }
  } catch (error) {
    console.error(`Error analyzing directory ${dir}:`, error.message);
  }
  
  return results;
}

async function main() {
  console.log('🔍 Analyzing Images in Pawesome Frontend\n');
  
  let allImages = [];
  
  for (const dir of DIRECTORIES) {
    const images = await analyzeDirectory(dir);
    allImages = allImages.concat(images);
  }
  
  // Sort by size (largest first)
  allImages.sort((a, b) => b.size - a.size);
  
  // Calculate totals
  const totalSize = allImages.reduce((sum, img) => sum + img.size, 0);
  const totalSizeMB = (totalSize / 1024 / 1024).toFixed(2);
  
  // Group by extension
  const byExtension = {};
  allImages.forEach(img => {
    if (!byExtension[img.extension]) {
      byExtension[img.extension] = { count: 0, totalSize: 0 };
    }
    byExtension[img.extension].count++;
    byExtension[img.extension].totalSize += img.size;
  });
  
  // Print summary
  console.log('📊 Summary');
  console.log('==========');
  console.log(`Total images: ${allImages.length}`);
  console.log(`Total size: ${totalSizeMB} MB\n`);
  
  console.log('📈 By Format');
  console.log('============');
  Object.entries(byExtension).forEach(([ext, data]) => {
    const sizeMB = (data.totalSize / 1024 / 1024).toFixed(2);
    console.log(`${ext}: ${data.count} files (${sizeMB} MB)`);
  });
  
  console.log('\n🚨 Large Images (> 100KB)');
  console.log('========================');
  const largeImages = allImages.filter(img => img.size > 100 * 1024);
  
  largeImages.slice(0, 10).forEach(img => {
    const relativePath = img.path.replace(process.cwd(), '');
    console.log(`${img.sizeKB} KB - ${relativePath}`);
  });
  
  if (largeImages.length > 10) {
    console.log(`\n... and ${largeImages.length - 10} more large images`);
  }
  
  console.log('\n💡 Recommendations');
  console.log('==================');
  
  // Check for missing WebP
  if (!byExtension['.webp'] || byExtension['.webp'].count < 5) {
    console.log('⚠️  Very few WebP images found. Consider converting PNG/JPEG to WebP for 25-35% size reduction.');
  }
  
  // Check for large PNGs
  const largePNGs = allImages.filter(img => img.extension === '.png' && img.size > 50 * 1024);
  if (largePNGs.length > 0) {
    console.log(`⚠️  Found ${largePNGs.length} PNG files larger than 50KB. Consider optimizing or converting to WebP.`);
  }
  
  // Check total size
  if (totalSize > 10 * 1024 * 1024) {
    console.log('⚠️  Total image size exceeds 10MB. This will significantly impact load times.');
  }
  
  console.log('\n✅ Run "npm run optimize:images" to optimize all images automatically.');
}

main().catch(console.error);