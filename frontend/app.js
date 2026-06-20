const API_BASE = "https://pm-copilot-qh19.onrender.com";

let selectedType = "prd";
const typeLabels = { prd: "Your PRD", stories: "User Stories", tickets: "Backlog Tickets" };

// ── INIT ──────────────────────────────────────────────
pendo.initialize({
  visitor: {
    id: ''
  }
});

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".type-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".type-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      selectedType = btn.dataset.type;
    });
  });

  const textarea = document.getElementById("ideaInput");
  const charCount = document.getElementById("charCount");
  textarea.addEventListener("input", () => {
    charCount.textContent = Math.min(textarea.value.length, 500);
    if (textarea.value.length > 500) textarea.value = textarea.value.substring(0, 500);
  });

  loadHistory();
});

// ── GENERATE ─────────────────────────────────────────
async function generate() {
  const idea = document.getElementById("ideaInput").value.trim();
  if (!idea || idea.length < 5) { showError("Please describe your product idea."); return; }

  setLoading(true);
  hideError();
  hideOutput();

  try {
    const res = await fetch(`${API_BASE}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idea, type: selectedType }),
    });
    const data = await res.json();
    if (!res.ok || data.error) { showError(data.error || "Something went wrong."); return; }

    showOutput(data.result);
    loadHistory(); // refresh sidebar
  } catch (err) {
    showError("Cannot connect to backend. Make sure server is running on port 3001.");
  } finally {
    setLoading(false);
  }
}

// ── LOAD HISTORY ──────────────────────────────────────
async function loadHistory() {
  const list = document.getElementById("historyList");
  if (!list) return;

  try {
    const res = await fetch(`${API_BASE}/api/projects`);
    const projects = await res.json();

    if (!projects.length) {
      list.innerHTML = `<div class="history-empty">No saved projects yet.<br/>Generate something!</div>`;
      return;
    }

    list.innerHTML = projects.map((p) => `
      <div class="history-item" onclick="loadProject(${p.id})">
        <div class="history-idea">${truncate(p.idea, 60)}</div>
        <div class="history-meta">
          <span>${p.generation_count} generation${p.generation_count !== 1 ? "s" : ""}</span>
          <span>${timeAgo(p.created_at)}</span>
        </div>
        <button class="history-delete" onclick="deleteProject(event, ${p.id})">✕</button>
      </div>
    `).join("");
  } catch {
    list.innerHTML = `<div class="history-empty">Could not load history.</div>`;
  }
}

// ── LOAD SINGLE PROJECT ───────────────────────────────
async function loadProject(id) {
  try {
    const res = await fetch(`${API_BASE}/api/projects/${id}`);
    const project = await res.json();

    document.getElementById("ideaInput").value = project.idea;
    document.getElementById("charCount").textContent = project.idea.length;

    if (project.generations?.length) {
      const latest = project.generations[0];
      selectedType = latest.type;
      document.querySelectorAll(".type-btn").forEach((b) => {
        b.classList.toggle("active", b.dataset.type === latest.type);
      });
      showOutput(latest.result);
    }

    document.getElementById("generator").scrollIntoView({ behavior: "smooth" });
  } catch {
    showError("Could not load project.");
  }
}

// ── DELETE PROJECT ────────────────────────────────────
async function deleteProject(e, id) {
  e.stopPropagation();
  if (!confirm("Delete this project?")) return;
  await fetch(`${API_BASE}/api/projects/${id}`, { method: "DELETE" });
  loadHistory();
}

// ── COPY ─────────────────────────────────────────────
function copyOutput() {
  const text = document.getElementById("outputBody").textContent;
  navigator.clipboard.writeText(text).then(() => {
    const btn = document.querySelector(".copy-btn");
    btn.textContent = "Copied ✓";
    setTimeout(() => (btn.textContent = "Copy ↗"), 2000);
  });
}

// ── HELPERS ───────────────────────────────────────────
function setLoading(on) {
  document.getElementById("generateBtn").disabled = on;
  document.getElementById("btnText").classList.toggle("hidden", on);
  document.getElementById("btnLoader").classList.toggle("hidden", !on);
}
function showOutput(text) {
  const wrap = document.getElementById("outputWrap");
  document.getElementById("outputLabel").textContent = typeLabels[selectedType] || "Result";
  document.getElementById("outputBody").textContent = text;
  wrap.classList.remove("hidden");
  wrap.scrollIntoView({ behavior: "smooth", block: "start" });
}
function hideOutput() { document.getElementById("outputWrap").classList.add("hidden"); }
function showError(msg) {
  document.getElementById("errorMsg").textContent = msg;
  document.getElementById("errorWrap").classList.remove("hidden");
}
function hideError() { document.getElementById("errorWrap").classList.add("hidden"); }
function truncate(str, n) { return str.length > n ? str.substring(0, n) + "…" : str; }
function timeAgo(dateStr) {
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}
