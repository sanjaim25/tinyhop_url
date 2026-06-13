const fs = require('fs');
const path = require('path');

// Fix Shorten.jsx duplicate Link issue
let file = 'client/src/pages/Shorten.jsx';
let content = fs.readFileSync(file, 'utf8');
content = content.replace("import { Link, Smartphone, Clock, Zap } from 'lucide-react'", "import { Link as LinkIcon, Smartphone, Clock, Zap } from 'lucide-react'");
content = content.replace(/<Link size=/g, "<LinkIcon size=");
fs.writeFileSync(file, content);

// Fix Dashboard.jsx duplicate Link issue
file = 'client/src/pages/Dashboard.jsx';
content = fs.readFileSync(file, 'utf8');
content = content.replace("import { BarChart2, Globe, Monitor, Smartphone, Tablet, Inbox, Paperclip, Package, Link, TrendingUp, Search, Calendar, Clock, CheckCircle } from 'lucide-react'", "import { BarChart2, Globe, Monitor, Smartphone, Tablet, Inbox, Paperclip, Package, Link as LinkIcon, TrendingUp, Search, Calendar, Clock, CheckCircle } from 'lucide-react'");
content = content.replace(/<Link size=/g, "<LinkIcon size=");
fs.writeFileSync(file, content);

// Fix DashboardEnhanced.jsx duplicate Link issue
file = 'client/src/pages/DashboardEnhanced.jsx';
content = fs.readFileSync(file, 'utf8');
content = content.replace("import { Link, TrendingUp, Search } from 'lucide-react'", "import { Link as LinkIcon, TrendingUp, Search } from 'lucide-react'");
content = content.replace(/<Link size=/g, "<LinkIcon size=");
fs.writeFileSync(file, content);

// Fix Analytics.jsx duplicate Link issue
file = 'client/src/pages/Analytics.jsx';
content = fs.readFileSync(file, 'utf8');
content = content.replace("import { Pointer, CheckCircle, BarChart2, Trophy, TrendingUp, Clock } from 'lucide-react'\n", "");
content = content.replace("import { Pointer, CheckCircle, BarChart2, Trophy, TrendingUp, Clock } from 'lucide-react'\r\n", "");
content = content.replace("import { Globe, Smartphone, Tablet, Monitor, Link, ClipboardList, Zap, Inbox, Pointer, CheckCircle, BarChart2, Trophy, TrendingUp, Clock } from 'lucide-react'", "import { Globe, Smartphone, Tablet, Monitor, Link as LinkIcon, ClipboardList, Zap, Inbox, Pointer, CheckCircle, BarChart2, Trophy, TrendingUp, Clock } from 'lucide-react'");
content = content.replace(/<Link size=/g, "<LinkIcon size=");
fs.writeFileSync(file, content);

// Fix About.jsx duplicate imports
file = 'client/src/pages/About.jsx';
content = fs.readFileSync(file, 'utf8');
content = content.replace("import { Zap, Lock, Palette, Lightbulb } from 'lucide-react'\n", "");
content = content.replace("import { Zap, Lock, Palette, Lightbulb } from 'lucide-react'\r\n", "");
fs.writeFileSync(file, content);

// Fix AnalyticsShowcase.jsx Link duplicate if it imports react-router-dom Link (just in case)
file = 'client/src/pages/AnalyticsShowcase.jsx';
content = fs.readFileSync(file, 'utf8');
if (content.includes("import { Link } from 'react-router-dom'") && content.includes("Link")) {
    content = content.replace("import { Smartphone, Globe, MapPin, Monitor, Link } from 'lucide-react'", "import { Smartphone, Globe, MapPin, Monitor, Link as LinkIcon } from 'lucide-react'");
    content = content.replace(/<Link size=/g, "<LinkIcon size=");
    fs.writeFileSync(file, content);
}

console.log("Fixes applied.");
