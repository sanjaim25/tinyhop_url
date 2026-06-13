const fs = require('fs');

let file = 'client/src/pages/About.jsx';
let content = fs.readFileSync(file, 'utf8');
content = content.replace("import { Zap, Lock, Palette, Lightbulb } from 'lucide-react'\r\n", '');
content = content.replace("import { Zap, Lock, Palette, Lightbulb } from 'lucide-react'\n", '');
fs.writeFileSync(file, content);

file = 'client/src/pages/Analytics.jsx';
content = fs.readFileSync(file, 'utf8');
content = content.replace("import { Pointer, CheckCircle, BarChart2, Trophy } from 'lucide-react'\r\n", '');
content = content.replace("import { Pointer, CheckCircle, BarChart2, Trophy } from 'lucide-react'\n", '');
fs.writeFileSync(file, content);
