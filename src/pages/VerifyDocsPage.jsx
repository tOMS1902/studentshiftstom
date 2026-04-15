import { useState } from "react";
import PageWrapper from "../components/PageWrapper";
import { uploadVerificationDocs } from "../lib/auth";

export default function VerifyDocsPage({ currentUser, setCurrentUser, setPage }) {
  const [studentIdCard, setStudentIdCard] = useState(null);
  const [governmentId, setGovernmentId]   = useState(null);
  const [error, setError]   = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!studentIdCard) { setError("Please upload your Student ID card."); return; }
    if (!governmentId)  { setError("Please upload a Government ID."); return; }
    setLoading(true);
    setError("");
    try {
      await uploadVerificationDocs(currentUser.id, studentIdCard, governmentId);
      setCurrentUser(prev => ({ ...prev, studentIdPath: "uploaded" }));
      setPage("studentDashboard");
    } catch (e) {
      setError(e.message || "Upload failed — please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper>
      <div style={{ maxWidth: "440px", margin: "0 auto" }}>

        <div style={{ textAlign: "center", marginBottom: "1.75rem" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>🪪</div>
          <h2 style={{ margin: 0, fontWeight: "800", fontSize: "1.8rem", color: "#1e293b" }}>Verify your identity</h2>
          <p style={{ margin: "0.35rem 0 0", color: "#64748b", fontSize: "0.9rem" }}>One last step before you can apply for jobs</p>
        </div>

        <div style={{ backgroundColor: "#f0f9ff", border: "1px solid #bae6fd", borderRadius: "0.75rem", padding: "0.85rem 1rem", marginBottom: "1.25rem", color: "#0369a1", fontSize: "0.85rem", lineHeight: 1.5 }}>
          Your documents are reviewed securely by our team. We'll notify you once your account is verified.
        </div>

        {error && (
          <div style={{ backgroundColor: "#fff1f2", border: "1px solid #fecdd3", borderRadius: "0.6rem", padding: "0.65rem 1rem", marginBottom: "1rem", color: "#e11d48", fontSize: "0.875rem", fontWeight: "500" }}>
            {error}
          </div>
        )}

        <div style={{ backgroundColor: "#f8fafc", borderRadius: "0.85rem", padding: "1rem 1.25rem", border: "1px solid #e2e8f0" }}>
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

        <button onClick={handleSubmit} disabled={loading} style={{ ...btnPrimary, opacity: loading ? 0.7 : 1 }}>
          {loading ? "Uploading…" : "Submit Documents →"}
        </button>

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
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap", border: `1.5px dashed ${file ? "#10b981" : "#e2e8f0"}`, borderRadius: "0.6rem", padding: "0.55rem 0.75rem", backgroundColor: file ? "#f0fdf4" : "white" }}>
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

const btnPrimary = { width: "100%", padding: "0.8rem", borderRadius: "2rem", border: "none", color: "white", fontWeight: "700", cursor: "pointer", fontSize: "0.95rem", fontFamily: "inherit", marginTop: "1.25rem", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", boxShadow: "0 4px 18px rgba(99,102,241,0.35)" };
