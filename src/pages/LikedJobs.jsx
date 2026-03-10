import React from "react";
import PageWrapper from "../components/PageWrapper";
import "../StudentShiftWeb.css";

export default function LikedJobs({ likedJobs, setLikedJobs, setSelectedJob, setPage }) {

  const removeLike = (jobId) => setLikedJobs(likedJobs.filter((job) => job.id !== jobId));

  return (
    <PageWrapper>
      <h1 style={{ textAlign: "center", marginBottom: "2rem" }}>❤️ Liked Jobs</h1>

      {likedJobs.length === 0 ? (
        <div style={{ textAlign: "center", padding: "3rem 1rem", color: "#6b7280" }}>
          <p style={{ fontSize: "1.25rem", fontWeight: "600", marginBottom: "0.5rem" }}>No liked jobs yet</p>
          <p style={{ marginBottom: "1.5rem" }}>Browse available jobs and like the ones that interest you.</p>
          <button onClick={() => setPage("studentDashboard")} style={btnGray}>Browse Jobs</button>
        </div>
      ) : (
        <>
          {likedJobs.map((job) => (
            <div key={job.id} className="job-card" style={{ flexDirection: "column", alignItems: "stretch" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem", marginBottom: "0.4rem" }}>
                <h2 style={{ fontWeight: "bold", fontSize: "1.25rem", margin: 0 }}>{job.title}</h2>
                <div style={{ display: "flex", gap: "0.5rem", flexShrink: 0 }}>
                  <button onClick={() => { setSelectedJob(job); setPage("jobDetails"); }} style={btnBlue}>View</button>
                  <button onClick={() => removeLike(job.id)} style={btnRed}>Remove</button>
                </div>
              </div>
              <p style={{ color: "#6b7280", marginBottom: "0.1rem", fontSize: "0.9rem" }}>{job.company} · {job.location}</p>
              <p style={{ fontWeight: "600", color: "#111827", marginBottom: "0.5rem", fontSize: "0.9rem" }}>{job.pay}</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem" }}>
                {job.days.map(day => (
                  <span key={day} style={{ fontSize: "0.75rem", backgroundColor: "#eff6ff", color: "#1d4ed8", padding: "0.2rem 0.55rem", borderRadius: "999px", fontWeight: "600" }}>
                    {day.slice(0, 3)} · {job.times[day]?.join(", ")}
                  </span>
                ))}
              </div>
            </div>
          ))}

          <div style={{ textAlign: "center", marginTop: "2rem" }}>
            <button onClick={() => setPage("studentDashboard")} style={btnGray}>Back to Jobs</button>
          </div>
        </>
      )}
    </PageWrapper>
  );
}

const btnBase = { padding: "0.4rem 0.9rem", borderRadius: "0.5rem", color: "white", border: "none", cursor: "pointer", fontWeight: "500", fontSize: "0.875rem" };
const btnBlue = { ...btnBase, backgroundColor: "#3b82f6" };
const btnRed  = { ...btnBase, backgroundColor: "#ef4444" };
const btnGray = { ...btnBase, backgroundColor: "#6b7280", padding: "0.75rem 1.5rem", fontSize: "0.95rem" };
