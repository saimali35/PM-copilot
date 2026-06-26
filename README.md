<div align="center">

# 🚀 PM Copilot

**Turn a rough product idea into a PRD, User Stories, or Backlog Tickets — in seconds.**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-black?style=for-the-badge&logo=vercel)](https://pm-copilot-delta.vercel.app/)
[![Backend](https://img.shields.io/badge/Backend-Render-46E3B7?style=for-the-badge&logo=render)](https://pm-copilot-qh19.onrender.com/)
[![Built With](https://img.shields.io/badge/AI-Google%20Gemini-4285F4?style=for-the-badge&logo=google)](https://ai.google.dev/)
[![Hackathon](https://img.shields.io/badge/World%20Product%20Day-Hackathon-FF6B6B?style=for-the-badge)](https://mindtheproduct.devpost.com/)

> *An AI copilot that flies alongside product managers — handling the documentation so you can focus on the thinking that actually matters.*

![PM Copilot Banner](https://via.placeholder.com/900x300/1A237E/FFFFFF?text=PM+Copilot+%E2%80%94+AI+for+Product+Managers)

</div>

---

## ✨ What It Does

Type any product idea in plain English. PM Copilot generates everything you need — instantly.

| Output | Description |
|--------|-------------|
| 📄 **Full PRD** | A complete Product Requirements Document |
| 📝 **6 User Stories** | Detailed, sprint-ready user stories |
| 🎫 **5 Backlog Tickets** | Jira-ready tickets with acceptance criteria |

All artifacts are **saved automatically** to a database for future reference.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | HTML · CSS · Vanilla JavaScript |
| **Backend** | Node.js + Express.js |
| **Database** | SQLite |
| **AI Engine** | Google Gemini 2.0 Flash API |
| **Deployment** | Vercel (frontend) + Render (backend) |

---

## 📁 Project Structure

```
pm-copilot/
├── frontend/
│   ├── index.html       ← UI with sidebar history panel
│   ├── style.css        ← All styles
│   └── app.js           ← Frontend logic + history
│
├── backend/
│   ├── server.js        ← Express API + Gemini integration
│   ├── package.json     ← Dependencies
│   ├── .env.example     ← Copy to .env and add your API key
│   └── db/
│       ├── database.js  ← SQLite setup & table definitions
│       └── pm_copilot.db← Auto-created on first run
│
└── README.md
```

---

## 🗄️ Database Schema

### `projects` table

| Column | Type | Description |
|--------|------|-------------|
| `id` | INTEGER PK | Auto-increment ID |
| `idea` | TEXT | The user's product idea |
| `created_at` | DATETIME | Timestamp |

### `generations` table

| Column | Type | Description |
|--------|------|-------------|
| `id` | INTEGER PK | Auto-increment ID |
| `project_id` | INTEGER FK | Links to `projects` |
| `type` | TEXT | `prd` / `stories` / `tickets` |
| `result` | TEXT | AI-generated content |
| `created_at` | DATETIME | Timestamp |

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- A [Google Gemini API key](https://ai.google.dev/)

### 1. Clone the repo

```bash
git clone https://github.com/parthyeram/PM-Copilot.git
cd PM-Copilot
```

### 2. Set up the backend

```bash
cd backend
npm install
cp .env.example .env
```

Open `.env` and add your API key:

```env
GEMINI_API_KEY=your_api_key_here
PORT=3000
```

### 3. Start the server

```bash
node server.js
```

### 4. Open the frontend

Open `frontend/index.html` in your browser, or serve it with any static file server:

```bash
npx serve frontend
```

---

## ⚡ Challenges We Solved

- **CORS** between Vercel frontend and Render backend
- **Rate limits** on Gemini free tier — handled gracefully with retries
- **Persistent storage** — SQLite database auto-created on first run
- **API key security** — environment variables across both deployment platforms
- **UX simplicity** — one-click workflow usable by non-technical PMs

---

## 🔮 Roadmap

- [ ] User authentication & personalized dashboards
- [ ] Custom PRD templates
- [ ] AI-powered user story prioritization
- [ ] Jira & Notion integration
- [ ] Team collaboration features
- [ ] Export to PDF and Word
- [ ] Mobile-friendly experience
- [ ] AI analytics & insights

---

## 👥 Team

| Name | Role |
|------|------|
| [Parth Yeram](https://devpost.com/parthyeram18) | Full-stack development, AI integration, deployment |
| [Saideep Mali](https://devpost.com/bsam93207) | Contributor |

Built for the **[Mind the Product — World Product Day: Everyone Ships Now](https://mindtheproduct.devpost.com/)** hackathon.

---

## 📄 License

MIT License — feel free to fork, extend, and build on it.
