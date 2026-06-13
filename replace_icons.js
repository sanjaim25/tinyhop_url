const fs = require('fs');
const path = require('path');

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

// 1. Dashboard.jsx
replaceInFile('client/src/pages/Dashboard.jsx', [
  [/icon:'📊'/g, 'icon:<BarChart2 size={16}/>'],
  [/icon:'🌍'/g, 'icon:<Globe size={16}/>'],
  [/{icons\[device\?.toLowerCase\(\)\]\|\|'💻'}/g, '{icons[device?.toLowerCase()]||<Monitor size={16}/>}'],
  [/const icons = {desktop:'🖥️',mobile:'📱',tablet:'📟'}/g, 'const icons = {desktop:<Monitor size={16}/>,mobile:<Smartphone size={16}/>,tablet:<Tablet size={16}/>}'],
  [/📭 No visits recorded yet/g, '<div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:10}}><Inbox size={24}/>No visits recorded yet</div>'],
  [/🌍 No location data yet/g, '<div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:10}}><Globe size={24}/>No location data yet</div>'],
  [/📱 No device data yet/g, '<div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:10}}><Smartphone size={24}/>No device data yet</div>'],
  [/<div style={{ fontSize:'2rem', marginBottom:10 }}>📭<\/div>/g, '<div style={{display:"flex", justifyContent:"center", marginBottom:10}}><Inbox size={32}/></div>'],
  [/📎 Links/g, '<span style={{display:"flex",alignItems:"center",gap:8}}><Paperclip size={18}/> Links</span>'],
  [/📦 Batches \(/g, '<span style={{display:"flex",alignItems:"center",gap:8}}><Package size={18}/> Batches (</span>'],
  [/icon="🔗"/g, 'icon={<Link size={20}/>}'],
  [/icon="📈"/g, 'icon={<TrendingUp size={20}/>}'],
  [/{search \? '🔍' : '🔗'}/g, '{search ? <Search size={28}/> : <Link size={28}/>}'],
  [/<span style={{ fontSize: '1.5rem' }}>📦<\/span>/g, '<Package size={24}/>'],
  [/<span>📊 {batch.totalUrls} URLs<\/span>/g, '<span style={{display:"flex", alignItems:"center", gap:4}}><BarChart2 size={14}/> {batch.totalUrls} URLs</span>'],
  [/<span>📅 {fmtD\(batch.createdAt\)}<\/span>/g, '<span style={{display:"flex", alignItems:"center", gap:4}}><Calendar size={14}/> {fmtD(batch.createdAt)}</span>'],
  [/{v.device==='mobile'\?'📱':v.device==='tablet'\?'📟':'🖥️'}/g, '{v.device==="mobile"?<Smartphone size={14}/>:v.device==="tablet"?<Tablet size={14}/>:<Monitor size={14}/>}'],
  [/expired\?'⏰ Expired':'✅ Active'/g, 'expired? <span style={{display:"flex", alignItems:"center", gap:4}}><Clock size={14}/> Expired</span> : <span style={{display:"flex", alignItems:"center", gap:4}}><CheckCircle size={14}/> Active</span>']
], 'BarChart2, Globe, Monitor, Smartphone, Tablet, Inbox, Paperclip, Package, Link, TrendingUp, Search, Calendar, Clock, CheckCircle');

// 2. Analytics.jsx
replaceInFile('client/src/pages/Analytics.jsx', [
  [/icon="🌍"/g, 'icon={<Globe size={20}/>}'],
  [/icon="📱"/g, 'icon={<Smartphone size={20}/>}'],
  [/icon="🔗"/g, 'icon={<Link size={20}/>}'],
  [/icon="📋"/g, 'icon={<ClipboardList size={20}/>}'],
  [/icon="⚡"/g, 'icon={<Zap size={20}/>}'],
  [/{v.device==='mobile'\?'📱':v.device==='tablet'\?'📟':'🖥️'}/g, '{v.device==="mobile"?<Smartphone size={14}/>:v.device==="tablet"?<Tablet size={14}/>:<Monitor size={14}/>}'],
  [/<div style={{ fontSize: '1.75rem', marginBottom: 8 }}>📭<\/div>/g, '<div style={{display:"flex", justifyContent:"center", marginBottom:8}}><Inbox size={28}/></div>'],
  [/const icons = { desktop:'🖥️', mobile:'📱', tablet:'📟' }/g, 'const icons = { desktop:<Monitor size={14}/>, mobile:<Smartphone size={14}/>, tablet:<Tablet size={14}/> }'],
  [/{icons\[device\?.toLowerCase\(\)\]\|\|'💻'}/g, '{icons[device?.toLowerCase()]||<Monitor size={14}/>}']
], 'Globe, Smartphone, Tablet, Monitor, Link, ClipboardList, Zap, Inbox');

// 3. AnalyticsShowcase.jsx
replaceInFile('client/src/pages/AnalyticsShowcase.jsx', [
  [/icon: '📱'/g, 'icon: <Smartphone size={18}/>'],
  [/icon: '🌍'/g, 'icon: <Globe size={18}/>'],
  [/flag: '🇺🇸'/g, 'flag: <MapPin size={16}/>'],
  [/flag: '🇬🇧'/g, 'flag: <MapPin size={16}/>'],
  [/flag: '🇩🇪'/g, 'flag: <MapPin size={16}/>'],
  [/flag: '🇮🇳'/g, 'flag: <MapPin size={16}/>'],
  [/flag: '🇨🇦'/g, 'flag: <MapPin size={16}/>']
], 'Smartphone, Globe, MapPin');

// 4. BulkShorten.jsx
replaceInFile('client/src/pages/BulkShorten.jsx', [
  [/<div style={{ fontSize: '3rem', marginBottom: 16 }}>📄<\/div>/g, '<div style={{display:"flex", justifyContent:"center", marginBottom:16}}><FileText size={48}/></div>'],
  [/<span style={{ animation: 'pulse 1.5s ease-in-out infinite' }}>⚙️<\/span>/g, '<span style={{ animation: "pulse 1.5s ease-in-out infinite", display:"flex" }}><Settings size={18}/></span>']
], 'FileText, Settings');

// 5. Contact.jsx
replaceInFile('client/src/pages/Contact.jsx', [
  [/icon: '💬'/g, 'icon: <MessageCircle size={24}/>'],
  [/icon: '🚀'/g, 'icon: <Rocket size={24}/>'],
  [/icon: '🐛'/g, 'icon: <Bug size={24}/>']
], 'MessageCircle, Rocket, Bug');

// 6. DashboardEnhanced.jsx
replaceInFile('client/src/pages/DashboardEnhanced.jsx', [
  [/icon="🔗"/g, 'icon={<Link size={20}/>}'],
  [/icon="📈"/g, 'icon={<TrendingUp size={20}/>}'],
  [/{search \? '🔍' : '🔗'}/g, '{search ? <Search size={28}/> : <Link size={28}/>}']
], 'Link, TrendingUp, Search');

// 7. features/FeaturePageLayout.jsx
replaceInFile('client/src/pages/features/FeaturePageLayout.jsx', [
  [/⏰ Link expired gracefully/g, '<span style={{display:"flex", alignItems:"center", gap:4}}><Clock size={16}/> Link expired gracefully</span>']
], 'Clock');

// 8. features/FeaturesIndex.jsx
replaceInFile('client/src/pages/features/FeaturesIndex.jsx', [
  [/icon: '⚡'/g, 'icon: <Zap size={24}/>'],
  [/icon: '🎯'/g, 'icon: <Target size={24}/>'],
  [/icon: '⏰'/g, 'icon: <Clock size={24}/>'],
  [/icon: '🌍'/g, 'icon: <Globe size={24}/>']
], 'Zap, Target, Clock, Globe');

// 9. HelpDesk.jsx
replaceInFile('client/src/pages/HelpDesk.jsx', [
  [/<div style={{ fontSize: '3rem', marginBottom: 16 }}>💬<\/div>/g, '<div style={{display:"flex", justifyContent:"center", marginBottom:16}}><MessageCircle size={48}/></div>']
], 'MessageCircle');

// 10. Shorten.jsx
replaceInFile('client/src/pages/Shorten.jsx', [
  [/🔗 Short Link/g, '<span style={{display:"flex",alignItems:"center",gap:6}}><Link size={16}/> Short Link</span>'],
  [/📱 QR Code/g, '<span style={{display:"flex",alignItems:"center",gap:6}}><Smartphone size={16}/> QR Code</span>'],
  [/⏰ Expires /g, '<span style={{display:"flex",alignItems:"center",gap:4}}><Clock size={14}/> Expires </span>'],
  [/icon="🔗"/g, 'icon={<Link size={18}/>}'],
  [/icon="⚡"/g, 'icon={<Zap size={18}/>}']
], 'Link, Smartphone, Clock, Zap');

console.log('Replacements complete.');
