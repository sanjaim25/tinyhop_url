const fs = require('fs');

function replaceInFile(filePath, replacements, imports) {
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;
  for (const [search, replace] of replacements) {
    if (content.includes(search)) {
      content = content.split(search).join(replace);
      changed = true;
    }
  }
  if (changed && imports) {
    if (!content.includes('import {') || !content.includes('lucide-react')) {
      content = 'import { ' + imports + " } from 'lucide-react'\n" + content;
    } else {
      content = 'import { ' + imports + " } from 'lucide-react'\n" + content;
    }
    fs.writeFileSync(filePath, content);
  }
}

// Analytics.jsx
replaceInFile('client/src/pages/Analytics.jsx', [
  ['icon="👆"', 'icon={<Pointer size={20}/>}'],
  ['icon="✅"', 'icon={<CheckCircle size={20}/>}'],
  ['icon="📈"', 'icon={<TrendingUp size={20}/>}'],
  ['icon="⏰"', 'icon={<Clock size={20}/>}'],
  ['icon="🌍"', 'icon={<Globe size={20}/>}'],
  ['icon="📱"', 'icon={<Smartphone size={20}/>}'],
  ['icon="🔗"', 'icon={<Link size={20}/>}'],
  ['icon="📋"', 'icon={<ClipboardList size={20}/>}'],
  ['icon="⚡"', 'icon={<Zap size={20}/>}'],
  ['icon="📊"', 'icon={<BarChart2 size={20}/>}'],
  ['icon="🏆"', 'icon={<Trophy size={20}/>}'],
  ["v.device==='mobile'?'📱':v.device==='tablet'?'📟':'🖥️'", 'v.device==="mobile"?<Smartphone size={14}/>:v.device==="tablet"?<Tablet size={14}/>:<Monitor size={14}/>'],
  ["<div style={{ fontSize: '1.75rem', marginBottom: 8 }}>📭</div>", '<div style={{display:"flex", justifyContent:"center", marginBottom:8}}><Inbox size={28}/></div>'],
  ["const icons = { desktop:'🖥️', mobile:'📱', tablet:'📟' }", 'const icons = { desktop:<Monitor size={14}/>, mobile:<Smartphone size={14}/>, tablet:<Tablet size={14}/> }'],
  ["{icons[device?.toLowerCase()]||'💻'}", '{icons[device?.toLowerCase()]||<Monitor size={14}/>}']
], 'Pointer, CheckCircle, TrendingUp, Clock, Globe, Smartphone, Tablet, Monitor, Link, ClipboardList, Zap, Inbox, BarChart2, Trophy');

// About.jsx
replaceInFile('client/src/pages/About.jsx', [
  ["icon: '⚡'", 'icon: <Zap size={24}/>'],
  ["icon: '🔒'", 'icon: <Lock size={24}/>'],
  ["icon: '🎨'", 'icon: <Palette size={24}/>'],
  ["icon: '💡'", 'icon: <Lightbulb size={24}/>']
], 'Zap, Lock, Palette, Lightbulb');

console.log('Final replacements complete.');
