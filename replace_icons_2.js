const fs = require('fs');

function replaceInFile(filePath, replacements, imports) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;
  for (const [search, replace] of replacements) {
    if ((search instanceof RegExp && search.test(content)) || (typeof search === 'string' && content.includes(search))) {
      content = content.replace(search, replace);
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

// 1. AnimatedURLCard.jsx
replaceInFile('client/src/components/animations/AnimatedURLCard.jsx', [
  [/📅/g, '<Calendar size={14}/>'],
  [/⏰/g, '<Clock size={14}/>']
], 'Calendar, Clock');

// 2. FloatingDemo.jsx
replaceInFile('client/src/components/animations/FloatingDemo.jsx', [
  [/🔗/g, '<Link size={18}/>']
], 'Link');

// 3. CommandPalette.jsx
replaceInFile('client/src/components/CommandPalette.jsx', [
  [/icon: '📊'/g, 'icon: <BarChart2 size={16}/>'],
  [/icon: '📈'/g, 'icon: <TrendingUp size={16}/>'],
  [/icon: '📱'/g, 'icon: <Smartphone size={16}/>'],
  [/icon: '🧠'/g, 'icon: <Brain size={16}/>'],
  [/icon: '👥'/g, 'icon: <Users size={16}/>'],
  [/icon: '🛠️'/g, 'icon: <Settings size={16}/>'],
  [/icon: '🔗'/g, 'icon: <Link size={16}/>'],
  [/>🔍</g, '><Search size={20}/><']
], 'BarChart2, TrendingUp, Smartphone, Brain, Users, Settings, Link, Search');

// 4. About.jsx
replaceInFile('client/src/pages/About.jsx', [
  [/icon: '⚡'/g, 'icon: <Zap size={24}/>'],
  [/icon: '🔒'/g, 'icon: <Lock size={24}/>'],
  [/icon: '🎨'/g, 'icon: <Palette size={24}/>'],
  [/icon: '💡'/g, 'icon: <Lightbulb size={24}/>']
], 'Zap, Lock, Palette, Lightbulb');

// 5. Analytics.jsx
replaceInFile('client/src/pages/Analytics.jsx', [
  [/icon="👆"/g, 'icon={<Pointer size={20}/>}'],
  [/icon="✅"/g, 'icon={<CheckCircle size={20}/>}'],
  [/icon="📊"/g, 'icon={<BarChart2 size={20}/>}'],
  [/icon="🏆"/g, 'icon={<Trophy size={20}/>}']
], 'Pointer, CheckCircle, BarChart2, Trophy');

// 6. AnalyticsShowcase.jsx
replaceInFile('client/src/pages/AnalyticsShowcase.jsx', [
  [/icon: '🖥️'/g, 'icon: <Monitor size={18}/>'],
  [/icon: '🔗'/g, 'icon: <Link size={18}/>']
], 'Monitor, Link');

// 7. Dashboard.jsx
replaceInFile('client/src/pages/Dashboard.jsx', [
  [/icon:'🕒'/g, 'icon:<Clock size={16}/>'],
  [/icon:'📱'/g, 'icon:<Smartphone size={16}/>'],
  [/icon="↗"/g, 'icon={<TrendingUp size={20}/>}'],
  [/icon="⚡"/g, 'icon={<Zap size={20}/>}']
], 'Clock, Smartphone, TrendingUp, Zap');

// 8. DashboardEnhanced.jsx
replaceInFile('client/src/pages/DashboardEnhanced.jsx', [
  [/icon="👆"/g, 'icon={<Pointer size={20}/>}'],
  [/icon="⚡"/g, 'icon={<Zap size={20}/>}']
], 'Pointer, Zap');

// 9. FeaturesIndex.jsx
replaceInFile('client/src/pages/features/FeaturesIndex.jsx', [
  [/icon: '📊'/g, 'icon: <BarChart2 size={24}/>'],
  [/icon: '📱'/g, 'icon: <Smartphone size={24}/>']
], 'BarChart2, Smartphone');

// 10. Shorten.jsx
replaceInFile('client/src/pages/Shorten.jsx', [
  [/🔒 Password protected/g, '<span style={{display:"flex",alignItems:"center",gap:4}}><Lock size={12}/> Password protected</span>'],
  [/icon="👆"/g, 'icon={<Pointer size={18}/>}']
], 'Lock, Pointer');

console.log('Second batch replacements complete.');
