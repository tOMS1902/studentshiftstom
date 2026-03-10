import React from "react";
import PageWrapper from "../components/PageWrapper";

export default function JobDetails({
  job,
  setPage,
  currentUser,
  likedJobs,
  setLikedJobs,
  appliedJobs,
  setAppliedJobs,
}) {

  if (!job) return null;

  const isLiked   = likedJobs.some((j) => j.id === job.id);
  const isApplied = appliedJobs.some((j) => j.id === job.id);

  const toggleLike = () => {
    if (!currentUser) { setPage("login"); return; }
    if (isApplied) return;
    if (isLiked) {
      setLikedJobs(likedJobs.filter((j) => j.id !== job.id));
    } else {
      setLikedJobs([...likedJobs, job]);
    }
  };

  const handleApply = () => {
    if (!currentUser) { setPage("login"); return; }
    if (isApplied) return;

    // Gate on CV
    if (!currentUser.cvName) {
      if (window.confirm("You need to upload a CV before applying. Go to your Account page to upload one?")) {
        setPage("account");
      }
      return;
    }

    if (window.confirm("Do you want to apply for this job?")) {
      setAppliedJobs([...appliedJobs, job]);
      if (isLiked) setLikedJobs(likedJobs.filter((j) => j.id !== job.id));
    }
  };

  return (
    <PageWrapper>
      <h1 style={{ fontWeight: "bold", fontSize: "1.75rem", marginBottom: "0.5rem" }}>{job.title}</h1>

      <div style={{ backgroundColor: "#f9fafb", border: "1.5px solid #e5e7eb", borderRadius: "0.75rem", padding: "1rem 1.25rem", marginBottom: "1.5rem" }}>
        <InfoRow label="Company"  value={job.company} />
        <InfoRow label="Location" value={job.location} />
        <InfoRow label="Pay"      value={job.pay} />
        <InfoRow label="Weekend"  value={job.weekendRequired ? "Required" : "Not required"} />
      </div>

      <div style={{ backgroundColor: "#f9fafb", border: "1.5px solid #e5e7eb", borderRadius: "0.75rem", padding: "1rem 1.25rem", marginBottom: "2rem" }}>
        <p style={{ fontWeight: "700", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "#6b7280", marginBottom: "0.75rem" }}>Availability</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
          {job.days.map(day => (
            <span key={day} style={{ fontSize: "0.8rem", backgroundColor: "#eff6ff", color: "#1d4ed8", padding: "0.25rem 0.65rem", borderRadius: "999px", fontWeight: "600" }}>
              {day} · {job.times[day]?.join(", ")}
            </span>
          ))}
        </div>
      </div>

      <div className="job-details-buttons" style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
        {!isApplied && (
          <button onClick={toggleLike} style={{ ...btn, backgroundColor: isLiked ? "#16a34a" : "#f87171" }}>
            {isLiked ? "✅ Liked" : "❤️ Like"}
          </button>
        )}

        <button onClick={handleApply} style={{ ...btn, backgroundColor: isApplied ? "#16a34a" : "#3b82f6" }}>
          {isApplied ? "✅ Applied" : "Apply"}
        </button>

        <button onClick={() => setPage("studentDashboard")} style={{ ...btn, backgroundColor: "#6b7280" }}>
          Back
        </button>
      </div>
    </PageWrapper>
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

const btn = { padding: "0.75rem 1.5rem", borderRadius: "0.5rem", color: "white", border: "none", cursor: "pointer", fontWeight: "600" };
