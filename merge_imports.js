const fs = require('fs');
const path = require('path');

function mergeLucideImports(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split(/\r?\n/);
  let newLines = [];
  let lucideImports = new Set();
  
  for (let line of lines) {
    if (line.includes("from 'lucide-react'")) {
      const match = line.match(/import\s+\{\s*(.*?)\s*\}\s+from\s+'lucide-react'/);
      if (match) {
        const parts = match[1].split(',').map(p => p.trim()).filter(Boolean);
        for (let p of parts) {
          lucideImports.add(p);
        }
      }
    } else {
      newLines.push(line);
    }
  }
  
  if (lucideImports.size > 0) {
    const importStr = 'import { ' + Array.from(lucideImports).join(', ') + " } from 'lucide-react'";
    newLines.unshift(importStr);
    fs.writeFileSync(filePath, newLines.join('\n'));
    console.log('Merged in ' + filePath);
  }
}

const dir = 'client/src/pages';
const files = fs.readdirSync(dir);
for (const file of files) {
  if (file.endsWith('.jsx')) {
    mergeLucideImports(path.join(dir, file));
  }
}

// also check features and components
const featuresDir = 'client/src/pages/features';
if (fs.existsSync(featuresDir)) {
  for (const file of fs.readdirSync(featuresDir)) {
    if (file.endsWith('.jsx')) mergeLucideImports(path.join(featuresDir, file));
  }
}

const compsDir = 'client/src/components';
if (fs.existsSync(compsDir)) {
  for (const file of fs.readdirSync(compsDir)) {
    if (file.endsWith('.jsx')) mergeLucideImports(path.join(compsDir, file));
  }
}

const animationsDir = 'client/src/components/animations';
if (fs.existsSync(animationsDir)) {
  for (const file of fs.readdirSync(animationsDir)) {
    if (file.endsWith('.jsx')) mergeLucideImports(path.join(animationsDir, file));
  }
}
