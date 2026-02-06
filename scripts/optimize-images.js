#!/usr/bin/env node

/**
 * Image Optimization Script for Pawesome Frontend
 * 
 * This script helps optimize images in your project by:
 * - Converting images to WebP format
 * - Compressing images
 * - Generating responsive image sizes
 * - Creating lazy-loading placeholders
 * 
 * Prerequisites:
 * npm install sharp imagemin imagemin-webp imagemin-pngquant imagemin-mozjpeg --save-dev
 */

const fs = require('fs').promises;
const path = require('path');
const sharp = require('sharp');

// Configuration
const CONFIG = {
  inputDir: path.join(__dirname, '../public'),
  outputDir: path.join(__dirname, '../public/optimized'),
  formats: ['webp', 'original'], // Generate WebP and keep original format
  sizes: {
    thumbnail: { width: 150, suffix: '-thumb' },
    small: { width: 400, suffix: '-sm' },
    medium: { width: 800, suffix: '-md' },
    large: { width: 1200, suffix: '-lg' },
    original: { width: null, suffix: '' }
  },
  quality: {
    webp: 85,
    jpeg: 85,
    png: 90
  },
  skipPatterns: [/favicon/, /logo192/, /logo512/] // Files to skip
};

// Utility functions
async function ensureDir(dirPath) {
  try {
    await fs.mkdir(dirPath, { recursive: true });
  } catch (error) {
    console.error(`Error creating directory ${dirPath}:`, error);
  }
}

async function getImageFiles(dir) {
  const files = [];
  const items = await fs.readdir(dir, { withFileTypes: true });
  
  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    
    if (item.isDirectory()) {
      files.push(...await getImageFiles(fullPath));
    } else if (item.isFile() && /\.(jpg|jpeg|png|gif)$/i.test(item.name)) {
      // Skip files that match skip patterns
      const shouldSkip = CONFIG.skipPatterns.some(pattern => pattern.test(item.name));
      if (!shouldSkip) {
        files.push(fullPath);
      }
    }
  }
  
  return files;
}

async function getImageMetadata(filePath) {
  try {
    const metadata = await sharp(filePath).metadata();
    const stats = await fs.stat(filePath);
    return {
      width: metadata.width,
      height: metadata.height,
      format: metadata.format,
      size: stats.size,
      sizeKB: (stats.size / 1024).toFixed(2),
      sizeMB: (stats.size / 1024 / 1024).toFixed(2)
    };
  } catch (error) {
    console.error(`Error getting metadata for ${filePath}:`, error);
    return null;
  }
}

async function optimizeImage(inputPath, outputPath, options = {}) {
  const { width, format, quality } = options;
  
  try {
    let pipeline = sharp(inputPath);
    
    // Resize if width is specified
    if (width) {
      pipeline = pipeline.resize(width, null, {
        withoutEnlargement: true,
        fit: 'inside'
      });
    }
    
    // Convert format and apply quality settings
    switch (format) {
      case 'webp':
        pipeline = pipeline.webp({ quality: quality || CONFIG.quality.webp });
        break;
      case 'jpeg':
      case 'jpg':
        pipeline = pipeline.jpeg({ quality: quality || CONFIG.quality.jpeg });
        break;
      case 'png':
        pipeline = pipeline.png({ quality: quality || CONFIG.quality.png });
        break;
    }
    
    await pipeline.toFile(outputPath);
    return true;
  } catch (error) {
    console.error(`Error optimizing ${inputPath}:`, error);
    return false;
  }
}

async function generateResponsiveImages(inputPath, outputDir) {
  const basename = path.basename(inputPath, path.extname(inputPath));
  const ext = path.extname(inputPath).slice(1);
  const results = [];
  
  for (const [sizeName, sizeConfig] of Object.entries(CONFIG.sizes)) {
    // Skip original size for now
    if (sizeName === 'original' && !CONFIG.formats.includes('webp')) continue;
    
    for (const format of CONFIG.formats) {
      const outputFormat = format === 'original' ? ext : format;
      const suffix = sizeConfig.suffix;
      const filename = `${basename}${suffix}.${outputFormat}`;
      const outputPath = path.join(outputDir, filename);
      
      const success = await optimizeImage(inputPath, outputPath, {
        width: sizeConfig.width,
        format: outputFormat,
        quality: CONFIG.quality[outputFormat] || 85
      });
      
      if (success) {
        const metadata = await getImageMetadata(outputPath);
        results.push({
          path: outputPath,
          filename,
          size: sizeName,
          format: outputFormat,
          metadata
        });
      }
    }
  }
  
  return results;
}

async function generateLazyLoadingPlaceholder(inputPath, outputPath) {
  try {
    await sharp(inputPath)
      .resize(20) // Very small size for placeholder
      .blur(5)
      .toFile(outputPath);
    return true;
  } catch (error) {
    console.error(`Error generating placeholder for ${inputPath}:`, error);
    return false;
  }
}

async function generateImageReport(results) {
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      totalImages: results.length,
      totalOriginalSize: 0,
      totalOptimizedSize: 0,
      savingsPercentage: 0
    },
    images: [],
    recommendations: []
  };
  
  for (const result of results) {
    const originalSize = result.original.metadata.size;
    const optimizedSizes = result.optimized.reduce((acc, img) => acc + (img.metadata?.size || 0), 0);
    
    report.summary.totalOriginalSize += originalSize;
    report.summary.totalOptimizedSize += optimizedSizes;
    
    report.images.push({
      original: result.original,
      optimized: result.optimized,
      savings: {
        bytes: originalSize - optimizedSizes,
        percentage: ((1 - optimizedSizes / originalSize) * 100).toFixed(2)
      }
    });
  }
  
  report.summary.savingsPercentage = (
    (1 - report.summary.totalOptimizedSize / report.summary.totalOriginalSize) * 100
  ).toFixed(2);
  
  // Generate recommendations
  report.recommendations = generateRecommendations(report);
  
  return report;
}

function generateRecommendations(report) {
  const recommendations = [];
  
  // Check for very large images
  report.images.forEach(img => {
    if (img.original.metadata.size > 500 * 1024) { // > 500KB
      recommendations.push({
        file: img.original.path,
        issue: 'Large file size',
        recommendation: `Consider using CDN or further compression. Current size: ${img.original.metadata.sizeMB}MB`
      });
    }
    
    if (img.original.metadata.width > 2000) {
      recommendations.push({
        file: img.original.path,
        issue: 'Very high resolution',
        recommendation: `Image width is ${img.original.metadata.width}px. Consider if this resolution is necessary.`
      });
    }
  });
  
  return recommendations;
}

// Main execution
async function main() {
  console.log('🖼️  Pawesome Image Optimization Tool');
  console.log('===================================\n');
  
  // Ensure output directory exists
  await ensureDir(CONFIG.outputDir);
  
  // Get all image files
  console.log('📁 Scanning for images...');
  const imageFiles = await getImageFiles(CONFIG.inputDir);
  console.log(`Found ${imageFiles.length} images to optimize\n`);
  
  const results = [];
  
  // Process each image
  for (const [index, imagePath] of imageFiles.entries()) {
    const relativePath = path.relative(CONFIG.inputDir, imagePath);
    console.log(`Processing (${index + 1}/${imageFiles.length}): ${relativePath}`);
    
    // Get original metadata
    const originalMetadata = await getImageMetadata(imagePath);
    if (!originalMetadata) continue;
    
    // Create output directory structure
    const outputSubDir = path.join(CONFIG.outputDir, path.dirname(relativePath));
    await ensureDir(outputSubDir);
    
    // Generate responsive images
    const optimizedImages = await generateResponsiveImages(imagePath, outputSubDir);
    
    // Generate lazy loading placeholder
    const placeholderPath = path.join(
      outputSubDir,
      `${path.basename(imagePath, path.extname(imagePath))}-placeholder.jpg`
    );
    await generateLazyLoadingPlaceholder(imagePath, placeholderPath);
    
    results.push({
      original: {
        path: imagePath,
        metadata: originalMetadata
      },
      optimized: optimizedImages,
      placeholder: placeholderPath
    });
    
    console.log(`✅ Completed: Generated ${optimizedImages.length} optimized versions\n`);
  }
  
  // Generate report
  console.log('📊 Generating optimization report...');
  const report = await generateImageReport(results);
  
  // Save report
  const reportPath = path.join(CONFIG.outputDir, 'optimization-report.json');
  await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
  
  // Print summary
  console.log('\n✨ Optimization Complete!');
  console.log('========================');
  console.log(`Total images processed: ${report.summary.totalImages}`);
  console.log(`Original total size: ${(report.summary.totalOriginalSize / 1024 / 1024).toFixed(2)}MB`);
  console.log(`Optimized total size: ${(report.summary.totalOptimizedSize / 1024 / 1024).toFixed(2)}MB`);
  console.log(`Space saved: ${report.summary.savingsPercentage}%`);
  console.log(`\nReport saved to: ${reportPath}`);
  
  if (report.recommendations.length > 0) {
    console.log('\n⚠️  Recommendations:');
    report.recommendations.forEach((rec, index) => {
      console.log(`${index + 1}. ${rec.file}`);
      console.log(`   Issue: ${rec.issue}`);
      console.log(`   ${rec.recommendation}\n`);
    });
  }
}

// Run the script
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { optimizeImage, generateResponsiveImages };