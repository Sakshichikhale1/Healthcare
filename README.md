# ClinicOS AI 🏥

> **Autonomous AI Operating System for Modern Healthcare Clinics**

ClinicOS AI orchestrates six specialized AI agents that work together to handle patient intake, real-time consultation scribing, medical billing, follow-up automation, clinical intelligence, and analytics — all in one unified platform.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🤖 **Intake Agent** | Onboards patients in seconds with structured data extraction from uploaded documents |
| 🩺 **Scribe Agent** | Generates structured SOAP notes from consultation audio in real time |
| 💳 **Billing Agent** | Automates ICD-10 / CPT coding with claim risk scoring and denial prediction |
| 🔔 **Follow-Up Agent** | Drives patient adherence via WhatsApp & SMS automation flows |
| 🧠 **Clinical Intelligence** | Surfaces drug interactions, care gaps, and clinical recommendations |
| 📊 **Analytics Agent** | Always-on KPIs for revenue, operations, and patient outcomes |

---

## 🧱 Tech Stack

### Frontend
- **React 19** + **TypeScript**
- **TanStack Router** — file-based, type-safe routing
- **Tailwind CSS v4** — utility-first styling
- **Shadcn/UI** — accessible component library
- **Recharts** — data visualization
- **Sonner** — toast notifications
- **Vite** — lightning-fast build tool

### Backend
- **FastAPI** — high-performance Python API framework
- **LangGraph** — multi-agent orchestration
- **SQLAlchemy** — ORM with SQLite (dev) / PostgreSQL (prod)
- **OpenAI GPT-4o** — AI reasoning and summarization
- **OpenAI Whisper** — audio transcription
- **Gunicorn + Uvicorn** — production ASGI server
- **pdfplumber** — PDF medical report extraction

### Infrastructure
- **Render** — cloud deployment (Static Site + Web Service)
- **Supabase** — PostgreSQL database (production)
- **Docker** — containerized backend

---

## 🗂️ Project Structure

```
Healthcare/
├── frontend/                  # React SPA
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── routes/            # Page-level route components
│   │   │   ├── index.tsx      # Landing page
│   │   │   ├── app.dashboard.tsx
│   │   │   ├── app.intake.tsx
│   │   │   ├── app.doctor.tsx
│   │   │   ├── app.patients.tsx
│   │   │   ├── app.billing.tsx
│   │   │   ├── app.reports.tsx
│   │   │   ├── app.followup.tsx
│   │   │   ├── app.agents.tsx
│   │   │   └── app.analytics.tsx
│   │   ├── services/          # API client layer
│   │   ├── lib/               # Utilities and mock data
│   │   └── hooks/             # Custom React hooks
│   ├── index.html
│   ├── vite.config.ts
│   └── package.json
│
├── backend/                   # FastAPI application
│   ├── app/
│   │   ├── agents/            # AI agent implementations
│   │   │   ├── intake.py
│   │   │   ├── scribe.py
│   │   │   ├── billing.py
│   │   │   ├── followup.py
│   │   │   ├── clinical.py
│   │   │   ├── analytics.py
│   │   │   └── supervisor.py  # LangGraph orchestrator
│   │   ├── api/               # REST API routers
│   │   ├── models/            # SQLAlchemy database models
│   │   ├── services/          # Business logic services
│   │   ├── database/          # DB connection & session
│   │   └── main.py            # FastAPI application entry
│   ├── requirements.txt
│   └── Dockerfile
│
├── render.yaml                # Render deployment blueprint
├── Dockerfile                 # Root multi-stage Dockerfile
└── README.md
```

---

## 🚀 Getting Started (Local Development)

### Prerequisites
- **Node.js** v20+
- **Python** 3.11+
- **pip**

### 1. Clone the repository
```bash
git clone https://github.com/Sakshichikhale1/Healthcare.git
cd Healthcare
```

### 2. Backend Setup
```bash
cd backend
pip install -r requirements.txt
```

Create a `.env` file in the `backend/` directory:
```env
DATABASE_URL=sqlite:///./clinicos.db   # SQLite for local dev
OPENAI_API_KEY=sk-...                  # Your OpenAI API key
SECRET_KEY=your-jwt-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
ALLOWED_ORIGINS=http://localhost:8080
```

Start the backend server:
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

The API will be available at: `http://localhost:8000`  
Interactive docs: `http://localhost:8000/docs`

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

The app will be available at: `http://localhost:8080`

---

## 🌐 Deployment (Render)

This project is configured for one-click deployment to [Render](https://render.com) using a Blueprint.

### Option A: Render Blueprint (Recommended)
1. Fork or push this repository to your GitHub account.
2. Go to [Render Blueprints](https://dashboard.render.com/blueprints).
3. Connect the `Healthcare` repository.
4. Render will automatically detect `render.yaml` and create:
   - **`healthcare-frontend`** — React Static Site
   - **`healthcare-api`** — FastAPI Web Service

5. Add environment variables for the backend:

| Key | Value |
|---|---|
| `DATABASE_URL` | Your Supabase PostgreSQL connection string |
| `OPENAI_API_KEY` | Your OpenAI API key |
| `SECRET_KEY` | A random secure string |
| `ALLOWED_ORIGINS` | Your frontend URL (e.g. `https://healthcare-frontend.onrender.com`) |

### Option B: Manual Services

**Static Site (Frontend)**
| Setting | Value |
|---|---|
| Root Directory | `frontend` |
| Build Command | `npm install && npm run build` |
| Publish Directory | `dist` |
| Rewrite Rule | `/* → /index.html` |

**Web Service (Backend)**
| Setting | Value |
|---|---|
| Root Directory | `backend` |
| Runtime | Python |
| Build Command | `pip install -r requirements.txt` |
| Start Command | `uvicorn app.main:app --host 0.0.0.0 --port 8000` |

---

## 🔑 Environment Variables Reference

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | Yes | PostgreSQL or SQLite connection string |
| `OPENAI_API_KEY` | Yes | OpenAI API key for GPT-4o and Whisper |
| `SECRET_KEY` | Yes | JWT signing secret |
| `ALGORITHM` | No | JWT algorithm (default: `HS256`) |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | No | Token expiry (default: `30`) |
| `ALLOWED_ORIGINS` | No | CORS allowed origins (default: localhost) |

---

## 📡 API Reference

The backend exposes a RESTful API at `/api/v1/`. Key endpoints:

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/v1/patients/` | List all patients |
| `POST` | `/api/v1/patients/` | Create a new patient |
| `POST` | `/api/v1/upload/reports` | Upload and analyze a medical report |
| `POST` | `/api/v1/upload/audio` | Upload consultation audio for scribing |
| `GET` | `/api/v1/consultations/{id}/soap` | Retrieve SOAP note |
| `GET` | `/api/v1/agents/status` | Get AI agent status |
| `GET` | `/api/v1/analytics/kpis` | Get KPI metrics |
| `WS` | `/ws` | WebSocket for real-time agent events |

Full interactive documentation available at `/docs` when the backend is running.

---

## 🛡️ Security Notes

- **Never commit** your `.env` file — it is excluded via `.gitignore`.
- In production, always set `ALLOWED_ORIGINS` to your specific frontend domain instead of `*`.
- The local SQLite database (`clinicos.db`) is also excluded from git.
- For production, use the Supabase PostgreSQL connection string as `DATABASE_URL`.

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "Add your feature"`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License**.

---

<div align="center">
  <p>Built for the future of medicine. 🩺</p>
</div>
