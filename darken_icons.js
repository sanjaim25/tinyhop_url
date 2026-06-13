const fs = require('fs');
const path = require('path');

const icons = ['BarChart2', 'Globe', 'Monitor', 'Smartphone', 'Tablet', 'Inbox', 'Paperclip', 'Package', 'Link', 'LinkIcon', 'TrendingUp', 'Search', 'Calendar', 'Clock', 'CheckCircle', 'ClipboardList', 'Zap', 'MapPin', 'FileText', 'Settings', 'MessageCircle', 'Rocket', 'Bug', 'Target', 'Brain', 'Users', 'QrCode', 'Lock', 'Palette', 'Lightbulb', 'Pointer', 'Trophy'];

function darkenIcons(filePath) {
  // Skip CommandPalette because it has a dark theme where dark icons would be invisible
  if (filePath.includes('CommandPalette')) return;

  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  for (const icon of icons) {
    // Regex to match <IconName size={14}/> or <IconName /> etc
    const regex = new RegExp(`<${icon}\\s+size=\\{([0-9]+)\\}\\/?>`, 'g');
    if (regex.test(content)) {
      content = content.replace(regex, `<${icon} size={$1} color="#15141c" strokeWidth={2.5} />`);
      changed = true;
    }
    
    // Match <IconName/> without size
    const regex2 = new RegExp(`<${icon}\\s*\\/?>`, 'g');
    if (regex2.test(content)) {
      content = content.replace(regex2, `<${icon} color="#15141c" strokeWidth={2.5} />`);
      changed = true;
    }
  }

  if (changed) {
    fs.writeFileSync(filePath, content);
    console.log('Darkened icons in ' + filePath);
  }
}

const scanDir = (dir) => {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      scanDir(fullPath);
    } else if (fullPath.endsWith('.jsx')) {
      darkenIcons(fullPath);
    }
  }
};

scanDir('client/src');
