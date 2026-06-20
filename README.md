# PM Copilot 🚀

> Turn a rough product idea into a PRD, User Stories, or Backlog Tickets — saved automatically to a database.

---

## Project Structure

```
pm-copilot/
├── frontend/
│   ├── index.html       ← UI with sidebar history panel
│   ├── style.css        ← All styles
│   └── app.js           ← Frontend logic + history
│
├── backend/
│   ├── server.js        ← Express API + Claude integration
│   ├── package.json     ← Dependencies
│   ├── .env.example     ← Copy to .env, add API key
│   └── db/
│       ├── database.js  ← SQLite setup & tables
│       └── pm_copilot.db← Auto-created on first run
│
└── README.md
```

---

## Database Schema

### `projects` table
| Column | Type | Description |
|---|---|---|
| id | INTEGER PK | Auto ID |
| idea | TEXT | The user's product idea |
| created_at | DATETIME | Timestamp |

### `generations` table
| Column | Type | Description |
|---|---|---|
| id | INTEGER PK | Auto ID |
| project_id | INTEGER FK | Links to projects |
| type | TEXT | prd / stories / tickets |
| result | TEXT | AI generated content |
| created_at | DATETIME | Timestamp |

---

