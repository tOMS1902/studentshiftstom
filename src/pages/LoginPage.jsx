import { useState } from "react";
import PageWrapper from "../components/PageWrapper";
import { signIn } from "../lib/auth";

export default function LoginPage({ setPage }) {
  const [email, setEmail]     = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) { setError("Please enter your email and password."); return; }
    setLoading(true);
    setError("");
    try {
      await signIn({ email, password });
      // onAuthStateChange in StudentShiftsWeb handles the redirect
    } catch (e) {
      setError(e.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper>
      <div style={{ textAlign: "center", maxWidth: "420px", margin: "0 auto" }}>

        <div style={{ marginBottom: "1.75rem" }}>
          <h2 style={{ margin: 0, fontWeight: "800", fontSize: "1.8rem", color: "#1e293b" }}>Welcome back</h2>
          <p style={{ margin: "0.35rem 0 0", color: "#64748b", fontSize: "0.9rem" }}>Sign in to find your next shift</p>
        </div>

        {error && (
          <div style={{ backgroundColor: "#fff1f2", border: "1px solid #fecdd3", borderRadius: "0.6rem", padding: "0.65rem 1rem", marginBottom: "1rem", color: "#e11d48", fontSize: "0.875rem", fontWeight: "500", textAlign: "left" }}>
            {error}
          </div>
        )}

        <input
          placeholder="Email address"
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={fieldStyle}
        />
        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleLogin()}
          style={fieldStyle}
        />

        <button onClick={handleLogin} disabled={loading} style={{ ...btnPrimary, opacity: loading ? 0.7 : 1 }}>
          {loading ? "Signing in…" : "Login →"}
        </button>
        <button onClick={() => setPage("studentDashboard")} style={btnGhost}>Browse without account</button>
        <button onClick={() => setPage("studentDashboard")} style={btnHome}>← Back to Home</button>

        <p style={{ marginTop: "1.25rem", fontSize: "0.875rem", color: "#64748b" }}>
          Don't have an account?{" "}
          <span style={{ color: "#6366f1", cursor: "pointer", fontWeight: "700" }} onClick={() => setPage("signup")}>
            Create one free
          </span>
        </p>

      </div>
    </PageWrapper>
  );
}

const fieldStyle = { width: "100%", padding: "0.72rem 1rem", margin: "0.4rem 0", display: "block", borderRadius: "0.65rem", border: "1.5px solid #e2e8f0", boxSizing: "border-box", fontSize: "0.95rem", fontFamily: "'Poppins', sans-serif", color: "#1e293b", outline: "none" };
const btnBase    = { width: "100%", padding: "0.8rem", borderRadius: "2rem", border: "none", color: "white", fontWeight: "700", cursor: "pointer", marginTop: "0.6rem", fontSize: "0.95rem", fontFamily: "inherit" };
const btnPrimary = { ...btnBase, background: "linear-gradient(135deg, #6366f1, #8b5cf6)", boxShadow: "0 4px 18px rgba(99,102,241,0.35)", marginTop: "1rem" };
const btnGhost   = { ...btnBase, backgroundColor: "#f1f5f9", color: "#64748b", boxShadow: "none" };
const btnHome    = { ...btnBase, marginTop: "0.75rem", background: "linear-gradient(135deg, #f43f5e, #e11d48)", boxShadow: "0 4px 18px rgba(244,63,94,0.35)" };
