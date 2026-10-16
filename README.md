# AgroMinds — Smart Agriculture Platform

[![Node.js Version](https://img.shields.io/badge/Node.js-v20%2B-green.svg)](https://nodejs.org/)
[![React Version](https://img.shields.io/badge/React-v18.3-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-v5.4-purple.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v3.4-38bdf8.svg)](https://tailwindcss.com/)
[![Express.js](https://img.shields.io/badge/Express.js-v4.21-black.svg)](https://expressjs.com/)
[![License](https://img.shields.io/badge/License-ISC-amber.svg)](LICENSE)

> **AgroMinds** is a full-stack, AI-integrated digital agriculture platform built to empower farmers, agronomists, and agricultural researchers with scientific crop cultivation guidance, soil health management, precision irrigation schedules, integrated pest defense, and test-mode consultation kits.

---

## 1. Project Overview & Context

- **Category:** Full-stack Web Application with AI Integration
- **Organization:** Northcorp Software, Gurugram, Haryana, India
- **Context:** Software Engineering Internship Project / Agricultural Technology Demonstration
- **Target Audience:** Farmers, agricultural consultants, research scholars, and agri-entrepreneurs across subtropical and temperate agro-climatic zones.

---

## 2. Key Features

### 🌾 Professional Agricultural Landing Page
- Polished, responsive UI using an agricultural palette: deep forest green, fresh emerald, warm sand, and earth tones.
- Dynamic system health indicator checking backend service status.
- Value proposition, quantitative impact metrics (35% fertilizer cost savings, 40% water conservation), feature cards, and 4-step "How It Works" workflow.

### 🤖 AI Agriculture Assistant (Google Gemini)
- Integrated via backend REST endpoint `/api/assistant/ask` using the `@google/genai` SDK.
- Context-aware answers accepting user-provided parameters: target crop, soil texture, state/region, and crop growth stage.
- Multi-turn conversation persistence tied to authenticated farmer profiles.
- Transparent fallback mode: When `GEMINI_API_KEY` is unconfigured, the assistant responds via an in-memory mock intelligence engine with an explicit notice, ensuring zero crashes during local demonstration.
- Agronomic safety disclaimer on all recommendations advising validation with local certified extension officers.

### 📚 Agricultural Knowledge Module
- Searchable and category-filterable knowledge encyclopedia:
  - **Crops:** Wheat, Paddy/Rice, Cotton, Tomato (seed rates, critical CRI irrigation, NPK fertilization).
  - **Soil Health:** Black Cotton Vertisols, Alluvial Loams, organic carbon restoration, Broad Bed and Furrow (BBF) drainage.
  - **Irrigation:** Drip fertigation, micro-sprinklers, Alternate Wetting and Drying (AWD).
  - **Pests & Diseases:** Fall Armyworm, Powdery Mildew, biological controls (Bt, NSKE 5%, Trichogramma).
  - **Seasonal:** Kharif monsoon contingency plans, Rabi winter cultivation roadmaps.
  - **Sustainable Practices:** Integrated Pest Management (IPM), legume crop rotation, zero-tillage seeding.
- Interactive modal displaying key agronomic specifications.

### 🔐 User Authentication & Farmer Profiles
- User authentication integrated with Supabase Auth.
- Session handling with Bearer JWT tokens.
- Secure fallback development mode (`/api/auth/dev-login`) for instant 1-click evaluation without requiring external cloud credentials.
- Farmer profile editor allowing customization of land acreage, primary crops, soil texture, and region.

### 💳 Razorpay Payment Integration (Test Mode)
- Server-side order creation (`/api/payments/create-order`).
- Cryptographic HMAC SHA-256 signature verification (`/api/payments/verify`) preventing client-side spoofing.
- Three customizable tiers:
  - **Pro Agronomist Consultation Pack** (₹499)
  - **Lab Soil Testing & Health Card Kit** (₹999)
  - **Commercial Farm Advisory Suite** (₹2499)
- Audit log tracking payment status (`created`, `paid`, `failed`).
- Simulated test mode enabled when Razorpay credentials are absent.

### 📖 Interactive Swagger / OpenAPI Documentation
- Fully documented OpenAPI 3.0.0 specification served directly at `/api-docs`.
- Interactive testing of all API endpoints with schemas, request samples, and response formats.

---

## 3. Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite 5, Tailwind CSS, Lucide React, React Router 6 |
| **Backend** | Node.js (LTS), Express 4.21, Helmet, CORS, Morgan, Express-Rate-Limit, Express-Validator |
| **AI Integration** | Google Gemini API (`@google/genai`), prompt engineering with agronomy system instructions |
| **Database** | Supabase PostgreSQL, Row Level Security (RLS), PL/pgSQL triggers |
| **Payments** | Razorpay SDK (Test Sandbox Mode), HMAC SHA-256 verification |
| **Containerization** | Docker, Docker Compose, Multi-stage builds |
| **Reverse Proxy** | Nginx with gzip compression, security headers, and SPA routing |
| **Testing** | Jest, Supertest (17 automated backend integration tests) |

---

## 4. Application Architecture

```
                                  [ User Browser ]
                                         │
                                   HTTP / HTTPS
                                         ▼
                                 [ Nginx Proxy:80 ]
                                  /              \
                          (Static / SPA)     (/api & /api-docs)
                                /                  \
                       [ React Vite Bundle ]  [ Express API :5000 ]
                                                    │
                      ┌─────────────────────────────┼────────────────────────────┐
                      ▼                             ▼                            ▼
             [ Supabase PostgreSQL ]        [ Google Gemini API ]       [ Razorpay Sandbox ]
              (RLS + Multi-tenant)         (Agronomy Intelligence)      (HMAC Verification)
```

---

## 5. Directory Structure

```
agrominds/
├── backend/
│   ├── src/
│   │   ├── config/              # Environment, Supabase, Gemini, Razorpay, Logger
│   │   │   ├── env.js
│   │   │   ├── gemini.js
│   │   │   ├── logger.js
│   │   │   ├── razorpay.js
│   │   │   └── supabase.js
│   │   ├── controllers/         # Request handling & HTTP responses
│   │   │   ├── agricultureController.js
│   │   │   ├── assistantController.js
│   │   │   ├── authController.js
│   │   │   ├── healthController.js
│   │   │   └── paymentController.js
│   │   ├── middleware/          # Security, Auth, Rate Limiting, Error handling
│   │   │   ├── authMiddleware.js
│   │   │   ├── errorHandler.js
│   │   │   ├── rateLimiter.js
│   │   │   └── validator.js
│   │   ├── routes/              # Express API routers
│   │   │   ├── agricultureRoutes.js
│   │   │   ├── assistantRoutes.js
│   │   │   ├── authRoutes.js
│   │   │   ├── healthRoutes.js
│   │   │   ├── paymentRoutes.js
│   │   │   └── index.js
│   │   ├── services/            # Business logic & 3rd party SDK wrappers
│   │   │   ├── agricultureService.js
│   │   │   ├── geminiService.js
│   │   │   ├── razorpayService.js
│   │   │   └── supabaseService.js
│   │   ├── swagger/             # OpenAPI 3.0 definition
│   │   │   └── swaggerDoc.js
│   │   ├── tests/               # Automated Jest & Supertest test suite
│   │   │   └── api.test.js
│   │   ├── utils/               # Standardized response helper & constants
│   │   │   └── responseHelper.js
│   │   ├── app.js               # Express application initialization
│   │   └── server.js            # HTTP server entry point
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── api/                 # API client wrapper with token handling
│   │   │   └── client.js
│   │   ├── components/          # Reusable UI widgets
│   │   │   ├── Footer.jsx
│   │   │   ├── Navbar.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/             # Global Auth & Profile context
│   │   │   └── AuthContext.jsx
│   │   ├── pages/               # Application views
│   │   │   ├── AgriKnowledgePage.jsx
│   │   │   ├── AssistantPage.jsx
│   │   │   ├── AuthPage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── LandingPage.jsx
│   │   │   ├── PaymentPage.jsx
│   │   │   └── ProfilePage.jsx
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── .env.example
│
├── database/
│   ├── schema.sql               # PostgreSQL schema with RLS & Triggers
│   └── README.md                # Database setup instructions
│
├── deployment/
│   ├── Dockerfile.backend       # Hardened Node.js alpine container
│   ├── Dockerfile.frontend      # Multi-stage Vite + Nginx container
│   └── nginx.conf               # Production Nginx reverse-proxy configuration
│
├── docker-compose.yml           # Multi-container orchestration
├── .env.example                 # Root environment template
├── .gitignore
└── README.md
```

---

## 6. Prerequisites

- **Node.js**: v18.0.0 or higher (v20+ LTS recommended)
- **npm**: v9.0.0 or higher
- **Git**
- *(Optional)* **Docker & Docker Compose** for containerized execution.

---

## 7. Local Installation & Setup

### Step 1: Clone or Navigate to the Workspace
```bash
cd c:\Users\suksh\Desktop\agrominds
```

### Step 2: Configure Environment Variables
Copy `.env.example` to `backend/.env` and `frontend/.env`:
```bash
# In the root directory:
copy .env.example backend\.env
copy frontend\.env.example frontend\.env
```

*(Note: AgroMinds features intelligent development fallback modes. If you don't have active Supabase, Gemini, or Razorpay keys immediately, the application runs seamlessly in designated test/mock mode without crashing).*

---

## 8. Running the Application Locally

You can run the backend and frontend simultaneously in separate terminals:

### Terminal 1: Backend Server
```bash
cd backend
npm install
npm run dev
# or: npm start
```
- **Backend API:** `http://localhost:5000`
- **Health Check:** `http://localhost:5000/api/health`
- **Swagger Documentation:** `http://localhost:5000/api-docs`

### Terminal 2: Frontend Client
```bash
cd frontend
npm install
npm run dev
```
- **Frontend Web App:** `http://localhost:5173`

---

## 9. Running Automated Tests

AgroMinds includes a comprehensive Jest & Supertest automated test suite covering:
- Health check & root endpoints
- Agricultural knowledge searching and slug routing
- AI prompt validation and advisory generation
- Authentication middleware and token verification
- Razorpay order creation and HMAC signature verification

Run the tests from the backend directory:
```bash
cd backend
npm test
```

**Verification result:**
```
PASS src/tests/api.test.js
  AgroMinds API Automated Test Suite
    1. Health & Root Endpoints (3 tests passed)
    2. Agriculture Knowledge Base (5 tests passed)
    3. AI Agriculture Assistant (2 tests passed)
    4. Authentication & Security Middleware (3 tests passed)
    5. Payment Integration (Razorpay) (4 tests passed)

Test Suites: 1 passed, 1 total
Tests:       17 passed, 17 total
Snapshots:   0 total
```

---

## 10. External Integrations Configuration

### A. Google Gemini API Setup
1. Create an API key in [Google AI Studio](https://aistudio.google.com/).
2. In `backend/.env`, set:
   ```env
   GEMINI_API_KEY=AIzaSy...your_actual_key
   GEMINI_MODEL=gemini-2.5-flash
   ```
3. Restart the backend. The AI Assistant will transition from mock mode to live Gemini intelligence.

### B. Supabase PostgreSQL & Auth Setup
1. Create a free project at [supabase.com](https://supabase.com).
2. Go to the **SQL Editor** tab and execute the SQL script in [`database/schema.sql`](./database/schema.sql).
3. Retrieve your project credentials from **Project Settings -> API**.
4. In `backend/.env` and `frontend/.env`, set:
   ```env
   SUPABASE_URL=https://xyzcompany.supabase.co
   SUPABASE_ANON_KEY=eyJhbGciOi...
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...
   SUPABASE_JWT_SECRET=your_jwt_secret
   ```

### C. Razorpay Test Sandbox Setup
1. Sign up for a [Razorpay](https://razorpay.com/) account and enable **Test Mode**.
2. Generate API Keys in **Dashboard -> Settings -> API Keys**.
3. In `backend/.env`, set:
   ```env
   RAZORPAY_KEY_ID=rzp_test_XXXXXXXX
   RAZORPAY_KEY_SECRET=your_test_secret
   ```

---

## 11. Containerized Deployment (Docker Compose)

To build and run the entire platform with container isolation and Nginx reverse proxy:

```bash
docker-compose up --build -d
```

- Web Application & API: `http://localhost`
- API Documentation: `http://localhost/api-docs`

To stop:
```bash
docker-compose down
```

---

## 12. Troubleshooting & FAQ

- **Port 5000 in use:** Modify `PORT=5001` in `backend/.env` and update the proxy target in `frontend/vite.config.js`.
- **Gemini Quota Exceeded:** If your Gemini API quota is reached, AgroMinds catches the error gracefully, logs the event, and delivers an explicitly labelled fallback response with safety guidance.
- **Payment Signature Mismatch:** In test mode without credentials, use the simulated checkout button which passes mock cryptographic parameters. When live test credentials are provided, ensure `RAZORPAY_KEY_SECRET` matches your Razorpay dashboard.

---

## 13. Project Team & Deliverables

- **Platform:** AgroMinds — Smart Agriculture Platform
- **Lead Engineering:** Northcorp Software Internship Engineering Cohort
- **Location:** Gurugram, India
