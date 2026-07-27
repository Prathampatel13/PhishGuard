# 🛡️ PhishGuard - Phishing URL Detection System

> **Detect malicious websites before you visit them.**

![PhishGuard Banner](https://img.shields.io/badge/PhishGuard-v1.0.0-blue?style=for-the-badge)
![Python](https://img.shields.io/badge/Python-3.10+-green?style=for-the-badge&logo=python)
![FastAPI](https://img.shields.io/badge/FastAPI-0.104+-blue?style=for-the-badge&logo=fastapi)
![React](https://img.shields.io/badge/React-18.2+-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2+-3178C6?style=for-the-badge&logo=typescript)
![Tailwind](https://img.shields.io/badge/Tailwind-3.3+-06B6D4?style=for-the-badge&logo=tailwindcss)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Folder Structure](#folder-structure)
- [Installation Guide](#installation-guide)
- [API Documentation](#api-documentation)
- [Usage](#usage)
- [Screenshots](#screenshots)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)

---

## 🔍 Overview

PhishGuard is a modern cybersecurity web application that analyzes website URLs and predicts whether they are **Safe**, **Suspicious**, or **Dangerous** using rule-based phishing detection techniques. Built as a college mini project for **Cyber Security and Forensic - Cyber Threat Intelligence and Analysis**.

### Key Highlights

- **Rule-Based Detection Engine**: Analyzes URLs against 20+ phishing indicators
- **Real-Time Analysis**: Instant URL scanning with detailed risk reports
- **Historical Tracking**: View and manage all your past URL analysis
- **Interactive Dashboard**: Visual analytics with charts and statistics
- **Professional UI**: Premium cybersecurity SaaS-inspired interface

---

## ✨ Features

### 🔬 URL Analysis
- HTTPS/HTTP protocol validation
- URL length analysis
- Hyphen and special character detection
- IP address detection
- Subdomain count analysis
- Suspicious keyword detection (login, verify, secure, bank, etc.)
- Brand impersonation detection (PayPal, Google, Amazon, etc.)
- Suspicious TLD detection (.xyz, .top, .click, etc.)
- Risk scoring (0-100)

### 📊 Dashboard & Analytics
- Risk score visualization with circular progress
- Animated statistics counters
- Pie chart (safe vs suspicious vs dangerous)
- Bar chart (daily scans)
- Line chart (risk trends)
- Total scans, threats blocked, safe sites analyzed

### 📋 History Management
- Complete scan history with all details
- Search and filter capabilities
- Clear history option
- Export to CSV
- Download PDF reports

### 🎨 User Interface
- Dark/Light mode toggle
- Glassmorphism design
- Smooth Framer Motion animations
- Responsive layout (mobile, tablet, desktop)
- Toast notifications
- Cyber-security themed icons
- Premium typography

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.2.0 | UI Framework |
| Vite | 5.0.8 | Build Tool |
| TypeScript | 5.2.2 | Type Safety |
| Tailwind CSS | 3.3.6 | Styling |
| React Router | 6.20.1 | Navigation |
| Axios | 1.6.2 | HTTP Client |
| Framer Motion | 10.16.16 | Animations |
| Lucide React | 0.294.0 | Icons |
| Recharts | 2.10.3 | Charts |
| React Hot Toast | 2.4.1 | Notifications |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Python | 3.10+ | Runtime |
| FastAPI | 0.104.1 | Web Framework |
| SQLAlchemy | 2.0.23 | ORM |
| SQLite | - | Database |
| Pydantic | 2.5.2 | Validation |
| Uvicorn | 0.24.0 | ASGI Server |

---

## 🏗️ Architecture

```
┌────────────────────────────────────────────────────┐
│                    Frontend (React)                 │
│  ┌─────────┐ ┌──────────┐ ┌──────────┐ ┌────────┐ │
│  │  Pages  │ │Components│ │  Hooks   │ │Services│ │
│  └────┬────┘ └────┬─────┘ └────┬─────┘ └────┬───┘ │
│       └───────────┴────────────┴─────────────┘      │
└───────────────────────┬────────────────────────────┘
                        │ HTTP/JSON
┌───────────────────────▼────────────────────────────┐
│                Backend (FastAPI)                     │
│  ┌────────┐ ┌──────────┐ ┌────────┐ ┌──────────┐  │
│  │ Routes │ │ Services │ │Models  │ │Analyzer  │  │
│  └────┬───┘ └────┬─────┘ └────┬───┘ └────┬─────┘  │
│       └───────────┴────────────┴───────────┘        │
└───────────────────────┬────────────────────────────┘
                        │
┌───────────────────────▼────────────────────────────┐
│                    SQLite Database                   │
└────────────────────────────────────────────────────┘
```

---

## 📁 Folder Structure

```
phishguard/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py              # FastAPI application entry point
│   │   ├── config.py            # Configuration management
│   │   ├── database.py          # Database connection & session
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   └── scan_history.py  # SQLAlchemy models
│   │   ├── schemas/
│   │   │   ├── __init__.py
│   │   │   └── scan.py          # Pydantic schemas
│   │   ├── routes/
│   │   │   ├── __init__.py
│   │   │   └── scan.py          # API endpoints
│   │   ├── services/
│   │   │   ├── __init__.py
│   │   │   ├── analyzer.py      # Phishing detection engine
│   │   │   └── scan_service.py  # Business logic layer
│   │   ├── repositories/
│   │   │   ├── __init__.py
│   │   │   └── scan_repository.py # Database CRUD operations
│   │   └── utils/
│   │       ├── __init__.py
│   │       └── logger.py        # Logging configuration
│   ├── requirements.txt
│   ├── .env
│   ├── .env.example
│   └── phishguard.db
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Hero.tsx
│   │   │   ├── FeatureCards.tsx
│   │   │   ├── URLInput.tsx
│   │   │   ├── AnalyzeButton.tsx
│   │   │   ├── RiskMeter.tsx
│   │   │   ├── RiskBadge.tsx
│   │   │   ├── ReasonList.tsx
│   │   │   ├── RecommendationCard.tsx
│   │   │   ├── StatisticsCards.tsx
│   │   │   ├── HistoryTable.tsx
│   │   │   ├── LoadingSpinner.tsx
│   │   │   ├── Toast.tsx
│   │   │   ├── Charts.tsx
│   │   │   └── ThemeToggle.tsx
│   │   ├── pages/
│   │   │   ├── Home.tsx
│   │   │   ├── Analyze.tsx
│   │   │   ├── History.tsx
│   │   │   └── About.tsx
│   │   ├── hooks/
│   │   │   ├── useApi.ts
│   │   │   └── useTheme.ts
│   │   ├── services/
│   │   │   └── api.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   ├── utils/
│   │   │   └── helpers.ts
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   ├── index.css
│   │   └── vite-env.d.ts
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   ├── tsconfig.node.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── postcss.config.js
├── .gitignore
└── README.md
```

---

## 🚀 Installation Guide

### Prerequisites

- **Node.js** v18+ and **npm** v9+
- **Python** 3.10+
- **pip** (Python package manager)

### Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/phishguard.git
cd phishguard
```

### Step 2: Backend Setup

```bash
cd backend

# Create virtual environment (recommended)
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the server
uvicorn app.main:app --reload
```

The backend will start at **http://localhost:8000**.

### Step 3: Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Run the development server
npm run dev
```

The frontend will start at **http://localhost:5173**.

---

## 📚 API Documentation

### Base URL

```
http://localhost:8000
```

### Endpoints

#### 1. Health Check

```
GET /
```

**Response:**
```json
{
  "status": "healthy",
  "app": "PhishGuard",
  "version": "1.0.0"
}
```

#### 2. Analyze URL

```
POST /analyze
```

**Request Body:**
```json
{
  "url": "https://example.com"
}
```

**Response:**
```json
{
  "url": "https://example.com",
  "risk_score": 15,
  "status": "safe",
  "reasons": ["Uses HTTPS", "Short URL"],
  "recommendation": "This URL appears to be safe.",
  "confidence": 85,
  "analysis_details": {
    "has_https": true,
    "has_http": false,
    "url_length": 21,
    "has_hyphens": false,
    "has_at_symbol": false,
    "has_ip": false,
    "subdomain_count": 1,
    "dot_count": 2,
    "special_char_count": 2,
    "number_count": 0,
    "suspicious_keywords": [],
    "brand_impersonation": [],
    "suspicious_tld": false
  }
}
```

#### 3. Get History

```
GET /history
```

**Query Parameters:**
- `search` (optional): Search by URL
- `skip` (optional): Records to skip (default: 0)
- `limit` (optional): Records to return (default: 50)

#### 4. Delete History Record

```
DELETE /history/{id}
```

#### 5. Clear All History

```
DELETE /history
```

#### 6. Get Statistics

```
GET /stats
```

---

## 🎯 Usage

### Analyzing a URL

1. Navigate to the **Analyze** page
2. Enter a URL in the input field (e.g., `https://google.com`)
3. Click **Scan URL**
4. View the comprehensive analysis results:
   - **Risk Score**: Numerical score from 0-100
   - **Status**: Safe (0-30), Suspicious (31-60), Dangerous (61-100)
   - **Reasons**: List of detected phishing indicators
   - **Recommendation**: Actionable advice
   - **Confidence**: Analysis confidence percentage

### Viewing History

1. Navigate to the **History** page
2. Browse all past URL analyses
3. Use the search bar to find specific URLs
4. Click **Export CSV** to download data
5. Click **Clear History** to delete all records

### Dashboard Analytics

1. Navigate to the **Home** page
2. View animated statistics counters
3. Analyze the pie chart showing scan distribution
4. Review the bar chart for daily scan activity
5. Monitor the line chart for risk trends

---

## 🧪 Testing

### Backend Testing

```bash
cd backend
# Run tests (when implemented)
pytest
# Manual test
curl -X POST http://localhost:8000/analyze \
  -H "Content-Type: application/json" \
  -d '{"url": "https://google.com"}'
```

### Frontend Testing

```bash
cd frontend
npm run build  # Verify production build
```

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Authors

- **Your Name** - *Cyber Security Student*

---

## 🙏 Acknowledgments

- Cyber Security and Forensic Faculty
- Open Source Community
- React, FastAPI, and Tailwind CSS Teams

---

<div align="center">
  <strong>🛡️ Stay Safe, Stay Vigilant 🛡️</strong>
  <br/>
  <sub>PhishGuard - Cyber Threat Intelligence and Analysis</sub>
</div>

