import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.join(__dirname, '../dist');

const sitemap0Path = path.join(distDir, 'sitemap-0.xml');
const sitemapIndexPath = path.join(distDir, 'sitemap-index.xml');
const finalSitemapPath = path.join(distDir, 'sitemap.xml');
const robotsPath = path.join(distDir, 'robots.txt');

console.log('Running sitemap cleanup script...');

// 0. Clean legacy manual sitemap files from workspace source and output
const legacyFiles = [
  path.join(__dirname, '../sitemap.xml'),
  path.join(__dirname, '../sitemap-index.xml'),
  path.join(__dirname, '../sitemap-stylesheet.xml'),
  path.join(__dirname, '../sitemap.xsl'),
  path.join(__dirname, '../public/sitemap.xml'),
  path.join(__dirname, '../public/sitemap-index.xml'),
  path.join(__dirname, '../public/sitemap-stylesheet.xml'),
  path.join(__dirname, '../public/sitemap.xsl'),
  path.join(distDir, 'sitemap-stylesheet.xml'),
  path.join(distDir, 'sitemap.xsl')
];

legacyFiles.forEach(file => {
  if (fs.existsSync(file)) {
    try {
      fs.unlinkSync(file);
      console.log(`Deleted legacy sitemap file: ${path.relative(path.join(__dirname, '..'), file)}`);
    } catch (err) {
      console.warn(`Warning: Could not delete legacy sitemap file: ${file}. Error: ${err.message}`);
    }
  }
});

// 1. Read sitemap-0.xml
if (!fs.existsSync(sitemap0Path)) {
  console.error('Error: sitemap-0.xml not found in dist/ directory!');
  process.exit(1);
}

let sitemapXml = fs.readFileSync(sitemap0Path, 'utf8');

// 2. Filter out redirect URLs and standard error pages
// ocr-tools/ redirects to image-tools/
const ocrPattern = /<url>(?:(?!<\/url>)[\s\S])*?<loc>https:\/\/convertocean\.com\/ocr-tools\/?<\/loc>(?:(?!<\/url>)[\s\S])*?<\/url>/g;
const err404Pattern = /<url>(?:(?!<\/url>)[\s\S])*?<loc>https:\/\/convertocean\.com\/404\/?<\/loc>(?:(?!<\/url>)[\s\S])*?<\/url>/g;
const err500Pattern = /<url>(?:(?!<\/url>)[\s\S])*?<loc>https:\/\/convertocean\.com\/500\/?<\/loc>(?:(?!<\/url>)[\s\S])*?<\/url>/g;

sitemapXml = sitemapXml.replace(ocrPattern, '');
sitemapXml = sitemapXml.replace(err404Pattern, '');
sitemapXml = sitemapXml.replace(err500Pattern, '');

// Log URL count
const matches = sitemapXml.match(/<url>/g);
const urlCount = matches ? matches.length : 0;
console.log(`Processed sitemap.xml containing ${urlCount} valid URLs (excluded ocr-tools redirect & error pages).`);

// 3. Write final sitemap.xml
fs.writeFileSync(finalSitemapPath, sitemapXml, 'utf8');
console.log('Successfully wrote dist/sitemap.xml');

// 4. Delete temporary files
if (fs.existsSync(sitemap0Path)) {
  fs.unlinkSync(sitemap0Path);
  console.log('Removed temporary dist/sitemap-0.xml');
}
if (fs.existsSync(sitemapIndexPath)) {
  fs.unlinkSync(sitemapIndexPath);
  console.log('Removed temporary dist/sitemap-index.xml');
}

// 5. Ensure dist/robots.txt points to /sitemap.xml
if (fs.existsSync(robotsPath)) {
  let robotsTxt = fs.readFileSync(robotsPath, 'utf8');
  if (robotsTxt.includes('sitemap-index.xml')) {
    robotsTxt = robotsTxt.replace(/sitemap-index\.xml/g, 'sitemap.xml');
    fs.writeFileSync(robotsPath, robotsTxt, 'utf8');
    console.log('Successfully updated sitemap reference inside dist/robots.txt to /sitemap.xml');
  }
}
console.log('Sitemap cleanup completed successfully.');
