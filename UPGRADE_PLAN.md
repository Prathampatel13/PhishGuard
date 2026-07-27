# PhishGuard Upgrade Plan

## Information Gathered

### Existing Architecture:
- **Frontend**: React 18 + TypeScript, Vite 5, Tailwind CSS 3, Framer Motion, Recharts, Lucide React
- **Backend**: FastAPI, SQLAlchemy, SQLite (unchanged)
- **Pages**: Home (landing), Analyze (scan URL + results), History (past scans), About
- **Components**: Hero, FeatureCards, StatisticsCards, Charts, HistoryTable, RiskMeter, RiskBadge, ReasonList, RecommendationCard, Navbar, Sidebar, Footer, URLInput, LoadingSpinner
- **Types**: ScanResult, HistoryRecord, Statistics, AnalysisDetails, etc.
- **API Service**: Axios-based service hitting `http://localhost:8000`

### What Needs to Change (file-by-file):

#### 1. **Home Page** (`pages/Home.tsx`)
- Add hero section with animated stats (10000+ URLs scanned, etc.)
- Add FeatureCards with glassmorphism
- Smooth animations on scroll

#### 2. **Analysis Result Page** (`pages/Analyze.tsx`)
- Complete redesign with professional analysis report layout
- Circular progress for risk score
- Animated cards for Threat Indicators, Reasons, Recommendations, Technical Details
- Green check / Red cross for each indicator

#### 3. **Dashboard** (NEW - `pages/Dashboard.tsx`)
- Total Scans, Safe/Dangerous/Suspicious counts
- Average Risk Score, Today's Scans
- Pie Chart (safe vs dangerous vs suspicious)
- Bar Chart (Top Threat Indicators)
- Line Chart (Daily Scan History)

#### 4. **History Page** (`pages/History.tsx`)
- Add search, filter, sort, pagination
- Delete, Clear History
- Download PDF Report, Export CSV

#### 5. **About Page** (`pages/About.tsx`)
- Explain Phishing
- Cyber Threat Intelligence
- How Detection Works
- Tech Stack

#### 6. **Components to Create/Update**:
- **Hero.tsx** - Premium landing with big URL search box, animated stats
- **URLInput.tsx** - Large search bar with glassmorphism
- **ThreatIndicators.tsx** - NEW: Dedicated card with green/red indicators
- **AnalysisReport.tsx** - NEW: Professional report card
- **DownloadReport.tsx** - NEW: PDF generation
- **Charts.tsx** - Enhanced with proper Recharts integration
- **StatisticsCards.tsx** - Enhanced with animated counters
- **FeatureCards.tsx** - Enhanced glassmorphism
- **HistoryTable.tsx** - Enhanced with search/filter/pagination
- **Navbar.tsx** - Updated with dashboard link
- **Sidebar.tsx** - Updated with dashboard link

#### 7. **App.tsx** - Add Dashboard route, update layout

#### 8. **index.css** - Enhanced glassmorphism, animations, scrollbar styles

### Design System:
- Dark Theme: bg-#020617, cards #111827, borders #334155
- Primary: #2563EB, Success: #22C55E, Danger: #EF4444, Warning: #F59E0B
- Glassmorphism: backdrop-blur-xl, semi-transparent backgrounds
- Rounded corners: 20px (rounded-2xl)
- Font: Inter, JetBrains Mono

### New Files to Create:
1. `frontend/src/pages/Dashboard.tsx` - Dashboard page
2. `frontend/src/components/ThreatIndicators.tsx` - Threat indicator card
3. `frontend/src/components/AnalysisReport.tsx` - Analysis report card
4. `frontend/src/components/DownloadReport.tsx` - PDF download
5. `frontend/src/components/StatCard.tsx` - Reusable stat card

### Files to Modify:
1. `frontend/src/App.tsx` - Add Dashboard route
2. `frontend/src/pages/Home.tsx` - Premium redesign
3. `frontend/src/pages/Analyze.tsx` - Professional result page
4. `frontend/src/pages/History.tsx` - Enhanced with search/filter/pagination
5. `frontend/src/pages/About.tsx` - Enhanced content
6. `frontend/src/components/Hero.tsx` - Premium hero
7. `frontend/src/components/URLInput.tsx` - Large search box
8. `frontend/src/components/ReasonList.tsx` - Enhanced with green/red
9. `frontend/src/components/RecommendationCard.tsx` - Dynamic recommendations
10. `frontend/src/components/Charts.tsx` - Enhanced Recharts
11. `frontend/src/components/StatisticsCards.tsx` - Animated counters
12. `frontend/src/components/FeatureCards.tsx` - Enhanced
13. `frontend/src/components/HistoryTable.tsx` - Search/filter/pagination
14. `frontend/src/components/Navbar.tsx` - Dashboard link
15. `frontend/src/components/Sidebar.tsx` - Dashboard link
16. `frontend/src/index.css` - Enhanced styles
17. `frontend/src/utils/helpers.ts` - Add PDF generation helpers

### Follow-up Steps:
1. Test all routes work
2. Test backend connectivity remains intact
3. Test PDF generation
4. Verify responsiveness on mobile/tablet/desktop

