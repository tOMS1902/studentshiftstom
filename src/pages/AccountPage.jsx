import React, { useState } from "react";
import PageWrapper from "../components/PageWrapper";

export default function AccountPage({
  currentUser,
  setCurrentUser,
  setPage,
  setLikedJobs,
  setAppliedJobs,
}) {

  const [linkedIn, setLinkedIn] = useState(currentUser.linkedIn || "");
  const [cv, setCv] = useState(null);
  const [coverLetter, setCoverLetter] = useState(null);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    const updatedUser = {
      ...currentUser,
      linkedIn,
      cvName: cv ? cv.name : currentUser.cvName,
      coverLetterName: coverLetter ? coverLetter.name : currentUser.coverLetterName,
    };

    setCurrentUser(updatedUser);
    const users = JSON.parse(localStorage.getItem("users")) || [];
    localStorage.setItem("users", JSON.stringify(users.map(u => u.id === updatedUser.id ? updatedUser : u)));
    localStorage.setItem("currentUser", JSON.stringify(updatedUser));

    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      setCurrentUser(null);
      setLikedJobs([]);
      setAppliedJobs([]);
      setPage("studentDashboard");
    }
  };

  const goBack = () => setPage(currentUser.role === "student" ? "studentDashboard" : "companyDashboard");

  return (
    <PageWrapper>
      <div style={{ maxWidth: "480px", margin: "0 auto" }}>
        <h2 style={{ textAlign: "center", marginBottom: "1.75rem" }}>My Account</h2>

        {/* Basic Info */}
        <Section title="Account Details">
          <InfoRow label="Name" value={currentUser.name} />
          <InfoRow label="Email" value={currentUser.email} />
          <InfoRow label="Role" value={currentUser.role === "student" ? "Student" : "Company"} />
        </Section>

        {/* Verification docs uploaded at signup */}
        {currentUser.role === "student" && (
          <Section title="Verification Documents">
            <DocRow label="Student ID Card" filename={currentUser.studentIdCardName} />
            <DocRow label="Government ID" filename={currentUser.governmentIdName} />
          </Section>
        )}

        {/* Profile section — CV, Cover Letter, LinkedIn */}
        {currentUser.role === "student" && (
          <Section title="My Profile">
            <p style={{ fontSize: "0.8rem", color: "#6b7280", marginBottom: "1rem" }}>
              Your CV is required before you can apply for jobs. LinkedIn and Cover Letter are optional.
            </p>

            <FileUpload
              label="CV"
              hint=".pdf or .docx — required to apply for jobs"
              accept=".pdf,.doc,.docx"
              onChange={setCv}
              file={cv}
              existingName={currentUser.cvName}
              required
            />

            <FileUpload
              label="Cover Letter"
              hint=".pdf or .docx — optional"
              accept=".pdf,.doc,.docx"
              onChange={setCoverLetter}
              file={coverLetter}
              existingName={currentUser.coverLetterName}
            />

            <label style={labelStyle}>LinkedIn URL <span style={{ fontWeight: "400", color: "#9ca3af" }}>(optional)</span></label>
            <input
              placeholder="https://linkedin.com/in/yourname"
              value={linkedIn}
              onChange={e => setLinkedIn(e.target.value)}
              style={inputStyle}
            />

            <button onClick={handleSave} style={btnPrimary}>
              {saved ? "✓ Saved!" : "Save Profile"}
            </button>
          </Section>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginTop: "0.5rem" }}>
          <button onClick={goBack} style={btnGray}>Back to Dashboard</button>
          <button onClick={handleLogout} style={btnRed}>Logout</button>
        </div>
      </div>
    </PageWrapper>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ backgroundColor: "#f9fafb", border: "1.5px solid #e5e7eb", borderRadius: "0.75rem", padding: "1rem 1.25rem", marginBottom: "1.25rem" }}>
      <p style={{ fontWeight: "700", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "#6b7280", marginBottom: "0.75rem" }}>{title}</p>
      {children}
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem", fontSize: "0.95rem" }}>
      <span style={{ color: "#6b7280" }}>{label}</span>
      <span style={{ fontWeight: "600", color: "#111827" }}>{value}</span>
    </div>
  );
}

function DocRow({ label, filename }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem", fontSize: "0.875rem" }}>
      <span style={{ color: "#6b7280" }}>{label}</span>
      {filename
        ? <span style={{ color: "#16a34a", fontWeight: "600" }}>✓ {filename}</span>
        : <span style={{ color: "#ef4444", fontWeight: "600" }}>Not uploaded</span>
      }
    </div>
  );
}

function FileUpload({ label, hint, accept, onChange, file, existingName, required }) {
  const hasFile = file || existingName;
  return (
    <div style={{ marginBottom: "0.9rem" }}>
      <label style={{ display: "block", fontWeight: "600", fontSize: "0.875rem", marginBottom: "0.25rem", color: "#374151" }}>
        {label} {required && !existingName && <span style={{ color: "#ef4444" }}>*</span>}
      </label>
      <p style={{ fontSize: "0.75rem", color: "#6b7280", marginBottom: "0.35rem" }}>{hint}</p>
      <div style={{
        display: "flex", alignItems: "center", gap: "0.75rem",
        border: `1.5px dashed ${hasFile ? "#22c55e" : "#d1d5db"}`,
        borderRadius: "0.5rem", padding: "0.5rem 0.75rem",
        backgroundColor: hasFile ? "#f0fdf4" : "white",
      }}>
        <label style={{ cursor: "pointer", fontSize: "0.8rem", fontWeight: "600", color: "#3b82f6", whiteSpace: "nowrap" }}>
          {hasFile ? "Change" : "Choose file"}
          <input type="file" accept={accept} style={{ display: "none" }} onChange={e => onChange(e.target.files[0] || null)} />
        </label>
        <span style={{ fontSize: "0.8rem", color: hasFile ? "#16a34a" : "#9ca3af", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {file ? `✓ ${file.name}` : existingName ? `✓ ${existingName}` : "No file chosen"}
        </span>
      </div>
    </div>
  );
}

const labelStyle  = { display: "block", fontWeight: "600", fontSize: "0.875rem", color: "#374151", marginBottom: "0.3rem" };
const inputStyle  = { width: "100%", padding: "0.6rem 0.75rem", marginBottom: "1rem", borderRadius: "0.5rem", border: "1.5px solid #d1d5db", fontSize: "0.9rem", boxSizing: "border-box" };
const btnBase     = { width: "100%", padding: "0.75rem", borderRadius: "0.5rem", border: "none", color: "white", fontWeight: "bold", cursor: "pointer", fontSize: "0.95rem" };
const btnPrimary  = { ...btnBase, backgroundColor: "#3b82f6" };
const btnGray     = { ...btnBase, backgroundColor: "#6b7280" };
const btnRed      = { ...btnBase, backgroundColor: "#ef4444" };
