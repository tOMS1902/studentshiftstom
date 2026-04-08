import { useState } from "react";
import PageWrapper from "../components/PageWrapper";
import "../StudentShiftWeb.css";

function ChatThread({ applicantId, jobId }) {
  const key = "ss_msgs_" + applicantId + "_" + jobId;
  const [messages, setMessages] = useState(() => JSON.parse(localStorage.getItem(key) || "[]"));
  const [input, setInput] = useState("");

  const send = () => {
    if (!input.trim()) return;
    const msg = { from: "student", text: input.trim(), time: new Date().toISOString() };
    const updated = [...messages, msg];
    setMessages(updated);
    localStorage.setItem(key, JSON.stringify(updated));
    setInput("");
  };

  return (
    <div style={{ backgroundColor: "#f0f9ff", border: "1.5px solid #bae6fd", borderRadius: "0.5rem", padding: "0.75rem", marginTop: "0.6rem" }}>
      <p style={{ fontSize: "0.75rem", fontWeight: "700", color: "#0369a1", marginBottom: "0.5rem" }}>💬 Messages from Employer</p>
      <div style={{ maxHeight: "160px", overflowY: "auto", marginBottom: "0.5rem", display: "flex", flexDirection: "column", gap: "0.35rem" }}>
        {messages.length === 0
          ? <p style={{ fontSize: "0.8rem", color: "#9ca3af", textAlign: "center", padding: "0.5rem 0" }}>No messages yet.</p>
          : messages.map((m, i) => (
            <div key={i} style={{ alignSelf: m.from === "student" ? "flex-end" : "flex-start", maxWidth: "85%" }}>
              <div style={{ backgroundColor: m.from === "student" ? "#3b82f6" : "#e5e7eb", color: m.from === "student" ? "white" : "#111827", padding: "0.4rem 0.65rem", borderRadius: "0.55rem", fontSize: "0.8rem", lineHeight: 1.4 }}>
                {m.text}
              </div>
              <p style={{ fontSize: "0.65rem", color: "#9ca3af", margin: "0.1rem 0 0", textAlign: m.from === "student" ? "right" : "left" }}>
                {new Date(m.time).toLocaleTimeString("en-IE", { hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
          ))
        }
      </div>
      <div style={{ display: "flex", gap: "0.4rem" }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && send()}
          placeholder="Reply…"
          style={{ flex: 1, padding: "0.45rem 0.65rem", borderRadius: "0.4rem", border: "1.5px solid #bae6fd", fontSize: "0.8rem" }}
        />
        <button onClick={send} style={{ padding: "0.45rem 0.75rem", borderRadius: "0.4rem", border: "none", backgroundColor: "#3b82f6", color: "white", fontWeight: "600", fontSize: "0.8rem", cursor: "pointer" }}>
          Send
        </button>
      </div>
    </div>
  );
}

const STATUS_STYLE = {
  Pending:  { bg: "#fef3c7", color: "#d97706" },
  Accepted: { bg: "#dcfce7", color: "#16a34a" },
  Rejected: { bg: "#fee2e2", color: "#dc2626" },
};

function AppliedJobCard({ job, currentUser, setSelectedJob, setPage }) {
  const [showChat, setShowChat] = useState(false);
  const status = currentUser
    ? (localStorage.getItem("ss_appstatus_" + currentUser.id + "_" + job.id) || "Pending")
    : "Pending";
  const { bg, color } = STATUS_STYLE[status] || STATUS_STYLE.Pending;

  return (
    <div className="job-card" style={{ flexDirection: "column", alignItems: "stretch" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem", marginBottom: "0.4rem" }}>
        <div style={{ flex: 1 }}>
          <h2 style={{ fontWeight: "800", fontSize: "1.05rem", margin: "0 0 0.15rem", color: "#1e293b" }}>{job.title}</h2>
          <p style={{ color: "#64748b", margin: 0, fontSize: "0.875rem" }}>{job.company} · {job.location}</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexShrink: 0 }}>
          <span style={{ fontSize: "0.7rem", fontWeight: "700", padding: "0.2rem 0.6rem", borderRadius: "999px", backgroundColor: bg, color, textTransform: "uppercase", letterSpacing: "0.04em" }}>
            {status}
          </span>
          <button onClick={() => { setSelectedJob(job); setPage("jobDetails"); }} style={btnBlue}>View</button>
        </div>
      </div>

      <p style={{ fontWeight: "600", color: "#111827", marginBottom: "0.4rem", fontSize: "0.9rem" }}>{job.pay}</p>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem", marginBottom: status === "Accepted" ? "0.5rem" : 0 }}>
        {job.days.map(day => (
          <span key={day} style={{ fontSize: "0.7rem", backgroundColor: "#eef2ff", color: "#4f46e5", padding: "0.15rem 0.5rem", borderRadius: "999px", fontWeight: "600" }}>
            {day.slice(0, 3)} · {job.times[day]?.join(", ")}
          </span>
        ))}
      </div>

      {status === "Accepted" && (
        <button
          onClick={() => setShowChat(p => !p)}
          style={{ alignSelf: "flex-start", padding: "0.38rem 0.9rem", borderRadius: "2rem", border: `1.5px solid ${showChat ? "#6366f1" : "#e2e8f0"}`, backgroundColor: showChat ? "#eef2ff" : "white", color: showChat ? "#4f46e5" : "#64748b", fontWeight: "700", fontSize: "0.78rem", cursor: "pointer", fontFamily: "inherit" }}
        >
          💬 {showChat ? "Hide Messages" : "Messages"}
        </button>
      )}

      {showChat && status === "Accepted" && currentUser && (
        <ChatThread applicantId={currentUser.id} jobId={job.id} />
      )}
    </div>
  );
}

export default function AppliedJobs({ appliedJobs, setSelectedJob, setPage, currentUser }) {
  return (
    <PageWrapper>
      <div style={{ textAlign: "center", marginBottom: "1.75rem" }}>
        <h1 style={{ margin: 0, fontWeight: "800", fontSize: "1.85rem", color: "#1e293b" }}>✅ Applied Jobs</h1>
        <p style={{ margin: "0.35rem 0 0", color: "#64748b", fontSize: "0.9rem" }}>Track your applications and hear back from employers</p>
      </div>

      {appliedJobs.length === 0 ? (
        <div style={{ textAlign: "center", padding: "3rem 1rem", color: "#6b7280" }}>
          <p style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>📋</p>
          <p style={{ fontSize: "1.1rem", fontWeight: "600", marginBottom: "0.4rem" }}>No applications yet</p>
          <p style={{ fontSize: "0.875rem", marginBottom: "1.5rem" }}>Find a job you like and hit Apply to get started.</p>
          <button onClick={() => setPage("studentDashboard")} style={btnGray}>Browse Jobs</button>
        </div>
      ) : (
        <>
          {appliedJobs.map(job => (
            <AppliedJobCard
              key={job.id}
              job={job}
              currentUser={currentUser}
              setSelectedJob={setSelectedJob}
              setPage={setPage}
            />
          ))}
          <div style={{ textAlign: "center", marginTop: "2rem" }}>
            <button onClick={() => setPage("studentDashboard")} style={btnGray}>Back to Jobs</button>
          </div>
        </>
      )}
    </PageWrapper>
  );
}

const btnBase = { padding: "0.4rem 0.9rem", borderRadius: "2rem", color: "white", border: "none", cursor: "pointer", fontWeight: "700", fontSize: "0.82rem", fontFamily: "inherit" };
const btnBlue = { ...btnBase, background: "linear-gradient(135deg, #6366f1, #8b5cf6)", boxShadow: "0 2px 8px rgba(99,102,241,0.3)" };
const btnGray = { ...btnBase, background: "linear-gradient(135deg, #f43f5e, #e11d48)", boxShadow: "0 4px 14px rgba(244,63,94,0.3)", padding: "0.75rem 1.75rem", fontSize: "0.9rem" };
