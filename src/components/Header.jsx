import React from "react";

export default function Header({ currentUser, setPage, likedJobs, appliedJobs }) {

  // Count unfilled profile items for students (CV, Cover Letter, LinkedIn)
  const optionalBadge = (() => {
    if (currentUser?.role !== "student") return 0;
    let missing = 0;
    if (!currentUser.cvName) missing++;
    if (!currentUser.coverLetterName) missing++;
    if (!currentUser.linkedIn) missing++;
    return missing;
  })();

  return (
    <header style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "1rem 3rem",
      backgroundColor: "#1f2937",
      color: "white",
      boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
    }}>

      <h1
        style={{ fontSize: "1.8rem", fontWeight: "bold", cursor: "pointer" }}
        onClick={() => setPage(currentUser?.role === "company" ? "companyDashboard" : "studentDashboard")}
      >
        StudentShifts.ie
      </h1>

      <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
        {currentUser ? (
          <>
            {currentUser.role === "student" && (
              <>
                <button onClick={() => setPage("likedJobs")} style={buttonStyle}>
                  ❤️ Liked ({likedJobs.length})
                </button>
                <button onClick={() => setPage("appliedJobs")} style={buttonStyle}>
                  ✅ Applied ({appliedJobs.length})
                </button>
              </>
            )}

            <div style={{ position: "relative", display: "inline-block" }}>
              <button onClick={() => setPage("account")} style={buttonStyle}>
                Account
              </button>
              {optionalBadge > 0 && (
                <span style={{
                  position: "absolute",
                  top: "-6px",
                  right: "-6px",
                  backgroundColor: "#ef4444",
                  color: "white",
                  fontSize: "0.7rem",
                  fontWeight: "700",
                  width: "18px",
                  height: "18px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  pointerEvents: "none",
                }}>
                  {optionalBadge}
                </span>
              )}
            </div>
          </>
        ) : (
          <>
            <button onClick={() => setPage("login")} style={buttonStyle}>Login</button>
            <button onClick={() => setPage("signup")} style={buttonStyle}>Sign Up</button>
          </>
        )}
      </div>
    </header>
  );
}

const buttonStyle = {
  padding: "0.6rem 1.2rem",
  borderRadius: "0.5rem",
  backgroundColor: "#3b82f6",
  color: "white",
  border: "none",
  cursor: "pointer",
  fontWeight: "500",
};
