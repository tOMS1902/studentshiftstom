import { useState } from "react";
import PageWrapper from "../components/PageWrapper";

export default function SignupPage({ setPage }) {

  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole]         = useState("student");

  const [studentIdCard, setStudentIdCard] = useState(null);
  const [governmentId, setGovernmentId]   = useState(null);

  const handleSignup = () => {
    if (!name || !email || !password) {
      alert("Please fill in your name, email and password.");
      return;
    }
    if (role === "student") {
      if (!studentIdCard) { alert("Please upload your Student ID card."); return; }
      if (!governmentId)  { alert("Please upload a Government ID."); return; }
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];
    if (users.find(u => u.email === email)) {
      alert("An account with this email already exists.");
      return;
    }

    const newUser = {
      id: Date.now(),
      name,
      email,
      password,
      role,
      studentIdCardName: studentIdCard?.name || null,
      governmentIdName:  governmentId?.name  || null,
      cvName:            null,
      linkedIn:          "",
      coverLetterName:   null,
    };

    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("currentUser", JSON.stringify(newUser));
    setPage(role === "student" ? "studentDashboard" : "companyDashboard");
  };

  return (
    <PageWrapper>
      <div style={{ maxWidth: "440px", margin: "0 auto" }}>

        {/* Brand mark */}
        <div style={{ textAlign: "center", marginBottom: "1.75rem" }}>
          <h2 style={{ margin: 0, fontWeight: "800", fontSize: "1.8rem", color: "#1e293b" }}>Create account</h2>
          <p style={{ margin: "0.35rem 0 0", color: "#64748b", fontSize: "0.9rem" }}>Join StudentShifts — it's free</p>
        </div>

        {/* Role toggle */}
        <div style={{ display: "flex", backgroundColor: "#f1f5f9", borderRadius: "0.75rem", padding: "0.25rem", marginBottom: "1.1rem", gap: "0.25rem" }}>
          {[{ val: "student", label: "🎓 Student" }, { val: "company", label: "🏢 Company" }].map(({ val, label }) => (
            <button
              key={val}
              onClick={() => setRole(val)}
              style={{
                flex: 1,
                padding: "0.55rem",
                borderRadius: "0.6rem",
                border: "none",
                fontWeight: "600",
                fontSize: "0.875rem",
                cursor: "pointer",
                backgroundColor: role === val ? "white" : "transparent",
                color: role === val ? "#6366f1" : "#64748b",
                boxShadow: role === val ? "0 1px 6px rgba(0,0,0,0.1)" : "none",
                fontFamily: "inherit",
              }}
            >
              {label}
            </button>
          ))}
        </div>

        <input placeholder="Full Name"  value={name}     onChange={e => setName(e.target.value)}     style={inputStyle} />
        <input placeholder="Email"      value={email}    onChange={e => setEmail(e.target.value)}    style={inputStyle} />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSignup()} style={inputStyle} />

        {role === "student" && (
          <div style={{ marginTop: "1.25rem", backgroundColor: "#f8fafc", borderRadius: "0.85rem", padding: "1rem 1.25rem", border: "1px solid #e2e8f0" }}>
            <p style={{ fontWeight: "700", marginBottom: "0.2rem", color: "#1e293b", fontSize: "0.95rem" }}>Verification Documents</p>
            <p style={{ fontSize: "0.78rem", color: "#64748b", marginBottom: "1rem", marginTop: 0 }}>
              Required to verify your student status. Reviewed securely.
            </p>
            <FileUpload
              label="Student ID Card"
              hint="Photo of your student ID card"
              accept="image/*,.pdf"
              onChange={setStudentIdCard}
              file={studentIdCard}
            />
            <FileUpload
              label="Government ID"
              hint="Age Card, Passport or Driver's Licence"
              accept="image/*,.pdf"
              onChange={setGovernmentId}
              file={governmentId}
            />
          </div>
        )}

        <button onClick={handleSignup} style={btnPrimary}>Create Account →</button>
        <button onClick={() => setPage("login")} style={btnGhost}>Already have an account? Sign in</button>
        <button onClick={() => setPage("studentDashboard")} style={btnHome}>← Back to Home</button>

      </div>
    </PageWrapper>
  );
}

function FileUpload({ label, hint, accept, onChange, file }) {
  return (
    <div style={{ marginBottom: "0.9rem" }}>
      <label style={{ display: "block", fontWeight: "600", fontSize: "0.875rem", marginBottom: "0.2rem", color: "#374151" }}>
        {label} <span style={{ color: "#f43f5e" }}>*</span>
      </label>
      <p style={{ fontSize: "0.75rem", color: "#64748b", marginBottom: "0.35rem", marginTop: 0 }}>{hint}</p>
      <div style={{
        display: "flex", alignItems: "center", gap: "0.75rem",
        border: `1.5px dashed ${file ? "#10b981" : "#e2e8f0"}`,
        borderRadius: "0.6rem", padding: "0.55rem 0.75rem",
        backgroundColor: file ? "#f0fdf4" : "white",
      }}>
        <label style={{ cursor: "pointer", fontSize: "0.8rem", fontWeight: "600", color: "#6366f1", whiteSpace: "nowrap" }}>
          {file ? "Change" : "Choose file"}
          <input type="file" accept={accept} style={{ display: "none" }} onChange={e => onChange(e.target.files[0] || null)} />
        </label>
        <span style={{ fontSize: "0.8rem", color: file ? "#10b981" : "#94a3b8", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {file ? `✓ ${file.name}` : "No file chosen"}
        </span>
      </div>
    </div>
  );
}

const inputStyle  = { width: "100%", padding: "0.72rem 1rem", marginBottom: "0.75rem", borderRadius: "0.65rem", border: "1.5px solid #e2e8f0", fontSize: "0.95rem", boxSizing: "border-box", fontFamily: "inherit", color: "#1e293b" };
const btnBase     = { width: "100%", padding: "0.8rem", borderRadius: "0.75rem", border: "none", color: "white", fontWeight: "700", cursor: "pointer", fontSize: "0.95rem", fontFamily: "inherit" };
const btnPrimary  = { ...btnBase, marginTop: "1.25rem", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", boxShadow: "0 4px 18px rgba(99,102,241,0.35)" };
const btnGhost    = { ...btnBase, marginTop: "0.6rem", backgroundColor: "#f1f5f9", color: "#64748b", boxShadow: "none" };
const btnHome     = { ...btnBase, marginTop: "0.6rem", background: "linear-gradient(135deg, #f43f5e, #e11d48)", boxShadow: "0 4px 18px rgba(244,63,94,0.35)" };
