require("dotenv").config();  // ← ADD THIS LINE
const express = require("express");
const cors = require("cors");
const db = require("./db/database");
const { GoogleGenerativeAI } = require("@google/generative-ai");


const app = express();
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "DELETE"],
  allowedHeaders: ["Content-Type"]
}));
app.use(express.json());
const path = require("path");                                          // ← ADD
app.use(express.static(path.join(__dirname, "../frontend")));          // ← ADD

const PORT = 3001;

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY); // ✅ LINE 11: Initialize Gemini with your .env key

// ── PROMPTS ──────────────────────────────────────────
const prompts = {
  prd: (idea) => `You are a senior product manager. Based on the following product idea, write a detailed PRD.

Product Idea: "${idea}"

Structure with these sections:
1. Problem Statement
2. Goals & Success Metrics
3. Target Users
4. Scope (In-scope & Out-of-scope)
5. Key Features
6. Risks & Assumptions

Be specific and concise. Use bullet points where needed. At the top, include "Product Manager" but do not include any dates, timestamps, or version numbers anywhere in the output.`,
  stories: (idea) => `You are a senior product manager. Write 6 detailed user stories for this idea.

Product Idea: "${idea}"

For each story:
**Story [N]: [Short Title]**
As a [type of user], I want to [action], so that [benefit].

Add 3 acceptance criteria per story:
✅ Given [context], when [action], then [outcome].`,

  tickets: (idea) => `You are a senior product manager. Create 5 backlog tickets for Jira/Linear.

Product Idea: "${idea}"

For each ticket:
**[TICKET-N] [Title]**
- Type: [Bug/Feature/Task]
- Priority: [P0/P1/P2]
- Description: [2-3 sentences]
- Acceptance Criteria: [3 bullet points]
- Story Points: [1/2/3/5/8]`,
};

// ── GENERATE & SAVE ───────────────────────────────────
app.post("/api/generate", async (req, res) => {
  const { idea, type } = req.body;

  if (!idea || idea.trim().length < 5) {
    return res.status(400).json({ error: "Please provide a valid product idea." });
  }
  if (!prompts[type]) {
    return res.status(400).json({ error: "Invalid type. Must be prd, stories, or tickets." });
  }

  try {
    // ✅ LINE 55-57: Replaced Claude API call with Gemini API call
   const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash"
});
    const geminiResponse = await model.generateContent(prompts[type](idea));
    const result = geminiResponse.response.text() || "No response generated.";

    // Save to DB
    db.run(`INSERT INTO projects (idea) VALUES (?)`, [idea], function (err) {
      if (err) return res.status(500).json({ error: "Failed to save project." });

      const projectId = this.lastID;
      db.run(
        `INSERT INTO generations (project_id, type, result) VALUES (?, ?, ?)`,
        [projectId, type, result],
        function (err2) {
          if (err2) return res.status(500).json({ error: "Failed to save generation." });
          res.json({ result, projectId, generationId: this.lastID });
        }
      );
    });
  } catch (err) {
    console.error("GEMINI ERROR:", JSON.stringify(err, null, 2), err.message, err.stack);
    res.status(500).json({ error: "Failed to connect to Gemini API." }); // ✅ LINE 75: Updated error message
  }
});

// ── GET ALL PROJECTS (History) ────────────────────────
app.get("/api/projects", (req, res) => {
  db.all(
    `SELECT p.id, p.idea, p.created_at,
            COUNT(g.id) as generation_count
     FROM projects p
     LEFT JOIN generations g ON g.project_id = p.id
     GROUP BY p.id
     ORDER BY p.created_at DESC`,
    [],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
});

// ── GET ONE PROJECT + ITS GENERATIONS ─────────────────
app.get("/api/projects/:id", (req, res) => {
  const { id } = req.params;
  db.get(`SELECT * FROM projects WHERE id = ?`, [id], (err, project) => {
    if (err || !project) return res.status(404).json({ error: "Project not found." });

    db.all(
      `SELECT * FROM generations WHERE project_id = ? ORDER BY created_at DESC`,
      [id],
      (err2, generations) => {
        if (err2) return res.status(500).json({ error: err2.message });
        res.json({ ...project, generations });
      }
    );
  });
});

// ── DELETE A PROJECT ──────────────────────────────────
app.delete("/api/projects/:id", (req, res) => {
  db.run(`DELETE FROM projects WHERE id = ?`, [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ deleted: true, id: req.params.id });
  });
});

// ── HEALTH ────────────────────────────────────────────
app.get("/api/health", (req, res) => {
  res.json({ status: "PM Copilot backend running ✅" });
});

app.listen(PORT, () => console.log(`✅ Backend running at http://localhost:${PORT}`));