import React, { useState } from "react";
import PageWrapper from "../components/PageWrapper";

export default function LoginPage({ setPage, setCurrentUser, mockUsers }) {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [error, setError] = useState("");

  const handleLogin = () => {
    const foundUser = mockUsers.find(u => u.email === email && u.password === password && u.role === role);
    if (foundUser) {
      setCurrentUser(foundUser);
      setPage(role === "student" ? "studentDashboard" : "companyDashboard");
    } else {
      setError("Invalid email, password, or role.");
    }
  };

  const quickLogin = (user) => {
    setCurrentUser(user);
    setPage(user.role === "student" ? "studentDashboard" : "companyDashboard");
  };

  return (
    <PageWrapper>
      <div style={{ textAlign: "center", maxWidth: "400px", margin: "0 auto" }}>
        <h2 style={{ marginBottom: "1.5rem" }}>Login</h2>

        {error && <p style={{ color: "red", marginBottom: "0.5rem" }}>{error}</p>}

        <select value={role} onChange={e => setRole(e.target.value)} style={fieldStyle}>
          <option value="student">Student</option>
          <option value="company">Company</option>
        </select>

        <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} style={fieldStyle} />
        <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} style={fieldStyle} />

        <button onClick={handleLogin} style={btnPrimary}>Login</button>
        <button onClick={() => setPage("studentDashboard")} style={btnGray}>Back to Home</button>

        <p style={{ marginTop: "1rem", fontSize: "0.9rem" }}>
          Don't have an account?{" "}
          <span style={{ color: "#3b82f6", cursor: "pointer", fontWeight: "bold" }} onClick={() => setPage("signup")}>
            Create an account
          </span>
        </p>

        {/* Demo credentials */}
        <div style={{ marginTop: "2rem", backgroundColor: "#f3f4f6", borderRadius: "0.75rem", padding: "1rem", textAlign: "left" }}>
          <p style={{ fontWeight: "700", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "#6b7280", marginBottom: "0.75rem" }}>
            Demo Accounts
          </p>
          {mockUsers.map(user => (
            <div key={user.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem", padding: "0.5rem 0.75rem", backgroundColor: "white", borderRadius: "0.5rem", border: "1px solid #e5e7eb" }}>
              <div>
                <p style={{ fontWeight: "600", fontSize: "0.875rem", margin: 0 }}>{user.name}</p>
                <p style={{ fontSize: "0.75rem", color: "#6b7280", margin: 0 }}>{user.email} · {user.password}</p>
              </div>
              <button onClick={() => quickLogin(user)} style={btnQuick}>
                Login
              </button>
            </div>
          ))}
        </div>

      </div>
    </PageWrapper>
  );
}

const fieldStyle = {
  width: "100%",
  padding: "0.6rem 0.75rem",
  margin: "0.4rem 0",
  display: "block",
  borderRadius: "0.5rem",
  border: "1px solid #d1d5db",
  boxSizing: "border-box",
  fontSize: "0.95rem",
};

const btnBase    = { width: "100%", padding: "0.7rem", borderRadius: "0.5rem", border: "none", color: "white", fontWeight: "bold", cursor: "pointer", marginTop: "0.5rem" };
const btnPrimary = { ...btnBase, backgroundColor: "#3b82f6", marginTop: "1rem" };
const btnGray    = { ...btnBase, backgroundColor: "#6b7280" };
const btnQuick   = { padding: "0.3rem 0.75rem", borderRadius: "0.4rem", backgroundColor: "#3b82f6", color: "white", border: "none", cursor: "pointer", fontSize: "0.8rem", fontWeight: "600" };
