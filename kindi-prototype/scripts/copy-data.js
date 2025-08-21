const fs = require('fs');
const path = require('path');

// Ensure directories exist
const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Created directory: ${dir}`);
  }
};

// Copy file
const copyFile = (src, dest) => {
  fs.copyFileSync(src, dest);
  console.log(`Copied: ${src} -> ${dest}`);
};

// Copy directory recursively
const copyDir = (src, dest) => {
  ensureDir(dest);
  
  const entries = fs.readdirSync(src, { withFileTypes: true });
  
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      copyFile(srcPath, destPath);
    }
  }
};

// Main execution
console.log('Copying data files to public directory...');

// Copy data directory to public
const dataDir = path.join(__dirname, '..', 'data');
const publicDataDir = path.join(__dirname, '..', 'public', 'data');

if (fs.existsSync(dataDir)) {
  copyDir(dataDir, publicDataDir);
  console.log('Data files copied successfully!');
} else {
  console.error('Data directory not found!');
  process.exit(1);
}
