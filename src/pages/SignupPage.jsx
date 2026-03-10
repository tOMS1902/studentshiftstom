import React, { useState } from "react";
import PageWrapper from "../components/PageWrapper";

export default function SignupPage({ setPage }) {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");

  const [studentIdCard, setStudentIdCard] = useState(null);
  const [governmentId, setGovernmentId] = useState(null);

  const handleSignup = () => {
    if (!name || !email || !password) {
      alert("Please fill in your name, email and password.");
      return;
    }

    if (role === "student") {
      if (!studentIdCard) { alert("Please upload your Student ID card."); return; }
      if (!governmentId) { alert("Please upload a Government ID."); return; }
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
      governmentIdName: governmentId?.name || null,
      // Filled in on Account page
      cvName: null,
      linkedIn: "",
      coverLetterName: null,
    };

    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("currentUser", JSON.stringify(newUser));

    setPage(role === "student" ? "studentDashboard" : "companyDashboard");
  };

  return (
    <PageWrapper>
      <div style={{ maxWidth: "420px", margin: "0 auto" }}>
        <h2 style={{ textAlign: "center", marginBottom: "1.5rem" }}>Create Account</h2>

        <input placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} style={inputStyle} />
        <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} style={inputStyle} />

        <select value={role} onChange={e => setRole(e.target.value)} style={inputStyle}>
          <option value="student">Student</option>
          <option value="company">Company</option>
        </select>

        {role === "student" && (
          <div style={{ marginTop: "1.25rem" }}>
            <div style={{ backgroundColor: "#f3f4f6", borderRadius: "0.75rem", padding: "1rem 1.25rem" }}>
              <p style={{ fontWeight: "700", marginBottom: "0.25rem", color: "#111827" }}>Verification Documents</p>
              <p style={{ fontSize: "0.8rem", color: "#6b7280", marginBottom: "1rem" }}>
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
          </div>
        )}

        <button onClick={handleSignup} style={btnPrimary}>Sign Up</button>
        <button onClick={() => setPage("login")} style={btnSecondary}>Back to Login</button>
      </div>
    </PageWrapper>
  );
}

function FileUpload({ label, hint, accept, onChange, file }) {
  return (
    <div style={{ marginBottom: "0.9rem" }}>
      <label style={{ display: "block", fontWeight: "600", fontSize: "0.875rem", marginBottom: "0.25rem", color: "#374151" }}>
        {label} <span style={{ color: "#ef4444" }}>*</span>
      </label>
      <p style={{ fontSize: "0.75rem", color: "#6b7280", marginBottom: "0.35rem" }}>{hint}</p>
      <div style={{
        display: "flex", alignItems: "center", gap: "0.75rem",
        border: `1.5px dashed ${file ? "#22c55e" : "#d1d5db"}`,
        borderRadius: "0.5rem", padding: "0.5rem 0.75rem",
        backgroundColor: file ? "#f0fdf4" : "white",
      }}>
        <label style={{ cursor: "pointer", fontSize: "0.8rem", fontWeight: "600", color: "#3b82f6", whiteSpace: "nowrap" }}>
          {file ? "Change" : "Choose file"}
          <input type="file" accept={accept} style={{ display: "none" }} onChange={e => onChange(e.target.files[0] || null)} />
        </label>
        <span style={{ fontSize: "0.8rem", color: file ? "#16a34a" : "#9ca3af", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {file ? `✓ ${file.name}` : "No file chosen"}
        </span>
      </div>
    </div>
  );
}

const inputStyle = { width: "100%", padding: "0.6rem 0.75rem", marginBottom: "0.75rem", borderRadius: "0.5rem", border: "1.5px solid #d1d5db", fontSize: "0.95rem", boxSizing: "border-box" };
const btnPrimary   = { width: "100%", marginTop: "1.25rem", padding: "0.75rem", borderRadius: "0.5rem", border: "none", backgroundColor: "#3b82f6", color: "white", fontWeight: "bold", cursor: "pointer", fontSize: "1rem" };
const btnSecondary = { width: "100%", marginTop: "0.5rem", padding: "0.75rem", borderRadius: "0.5rem", border: "none", backgroundColor: "#6b7280", color: "white", fontWeight: "bold", cursor: "pointer", fontSize: "1rem" };
