# Dhan Sarthi (धन सारथी) 🚀
> **SEBI Multi-Asset Super App for Retail Investors & Financial Awareness**  
> *"हर निवेशक की ताकत — Har Investor Ki Taaqat"*

---

## 📌 Overview

**Dhan Sarthi** is a comprehensive, unified multi-asset super application built for retail investors in India. Aligned with **SEBI (Securities and Exchange Board of India)** guidelines, **Sahamati Account Aggregator (AA)** architecture, and **SEBI SCORES 2.0**, Dhan Sarthi empowers investors with unified portfolio tracking, AI-guided suitability checks, certified financial education, and real-time fraud protection.

---

## ✨ Core Pillars & Features

### 📊 1. Dhan Darpan (Unified Portfolio Mirror)
* **Consolidated Net Worth**: Real-time cross-broker and cross-depository tracking (NSDL, CDSL, CAMS, RBI Retail Direct).
* **Account Aggregator Integration**: Encrypted, read-only data fetching via Sahamati AA framework.
* **Portfolio Health Score**: AI-driven diversification breakdown and concentration risk alerts (e.g., Equity vs. Debt vs. Gold).

### 📚 2. Dhan Gyaan (Investor Awareness & Learning Hub)
* **AI Financial Assistant**: Interactive natural language Q&A for complex financial concepts, mutual funds, REITs, and SEBI regulations.
* **Featured Educational Modules**: NISM & SEBI certified learning tracks on Securities Markets, eKYC Rights, and Asset Classes.
* **Gamified Learning**: Earn badges and Gyaan Coins upon completing interactive quizzes.

### 🎯 3. Dhan Marg (Investment Avenue Suitability Engine)
* **Risk Tolerance Assessment**: Evaluates user risk profiles against SEBI suitability criteria.
* **Product Match Engine**: Instant AI suitability checks for Stocks, Mutual Funds, Bonds, and High-Risk Assets before investing.

### 🛡️ 4. Dhan Rakshak (Spot A Scam & Fraud Protection)
* **AI Fraud Scanner**: Paste suspicious WhatsApp/Telegram tips, SMS, or investment offers for instant risk scoring.
* **SCORES 2.0 Directives**: Direct guidance on grievance redressal and reporting unregistered financial advisors to SEBI.

### 🔐 5. One-Time eKYC & Consent
* Seamless identity verification via **DigiLocker** and **SEBI KRA** guidelines.

---

## 🏗️ Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Web Frontend** | Next.js 16 (App Router), TypeScript, Tailwind CSS, Recharts, Lucide Icons |
| **Mobile App** | React Native, Expo, React Navigation, Lucide React Native |
| **Backend API** | Python 3.10+, FastAPI, Uvicorn, Pydantic, Pytest |
| **Integrations** | Sahamati Account Aggregator (Mock DPI), DigiLocker eKYC, SEBI SCORES 2.0 API |

---

## 📁 Repository Structure

```
Dhan-Sarthi/
├── backend/                  # FastAPI Backend API Service
│   ├── app/
│   │   ├── api/v1/          # Endpoints (Auth, AA DPI Mock, AI Features)
│   │   └── main.py          # FastAPI application entrypoint
│   ├── tests/               # Pytest suite for backend APIs
│   └── requirements.txt     # Python dependencies
├── frontend/                 # Next.js Web Client
│   ├── src/
│   │   ├── app/             # Next.js App Router pages & CSS
│   │   └── components/      # UI components (Darpan, Gyaan, Marg, Rakshak)
│   └── package.json
└── mobile/                   # React Native Mobile Client
    ├── screens/             # Mobile screens (Auth, eKYC, Darpan, Gyaan, Marg, Rakshak)
    ├── App.tsx              # Navigation & Tab bar config
    └── package.json
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: v18+ 
- **Python**: v3.10+
- **Expo Go** app (optional for mobile testing on physical devices)

---

### 2. Backend Setup (FastAPI)

```bash
# Navigate to backend directory
cd backend

# Create & activate virtual environment (Windows)
python -m venv venv
.\venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start FastAPI server
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
> The API server will run at `http://localhost:8000`. Swagger docs available at `http://localhost:8000/docs`.

---

### 3. Web Frontend Setup (Next.js)

```bash
# Open new terminal and navigate to frontend
cd frontend

# Install dependencies
npm install

# Start Next.js development server
npm run dev
```
> Access web dashboard at `http://localhost:3000`.

---

### 4. Mobile App Setup (React Native / Expo)

```bash
# Open new terminal and navigate to mobile
cd mobile

# Install dependencies
npm install

# Start Expo development server
npx expo start
```
> Scan the QR code using Expo Go app on iOS/Android, or press `a` for Android Emulator / `w` for Web preview.

---

## 🧪 Running Tests

To run unit tests for the backend API:

```bash
cd backend
.\venv\Scripts\activate
pytest
```

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for details.
