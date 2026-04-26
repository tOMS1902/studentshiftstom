export default function Header({ currentUser, setPage, likedJobs, appliedJobs, notifCount }) {

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
      display: "grid",
      gridTemplateColumns: "1fr auto 1fr",
      alignItems: "center",
      padding: "0.9rem 2.5rem",
      background: "linear-gradient(135deg, #A21D54 0%, #C2185B 100%)",
      color: "white",
      boxShadow: "0 4px 20px rgba(162,29,84,0.35)",
      position: "sticky",
      top: 0,
      zIndex: 100,
    }}>

      {/* Left — Account (when logged in) + About */}
      <div className="header-left" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        {currentUser && (
          <div style={{ position: "relative", display: "inline-block" }}>
            <button onClick={() => setPage("account")} style={{ ...navBtnPrimary, display: "inline-flex", alignItems: "center", gap: "0.45rem" }}>
              {currentUser.profilePhoto
                ? <img src={currentUser.profilePhoto} alt="Profile" style={{ width: "22px", height: "22px", borderRadius: "50%", objectFit: "cover", display: "block", flexShrink: 0 }} />
                : <PersonIcon />
              }
            </button>
            {optionalBadge > 0 && <span style={notifDot}>{optionalBadge}</span>}
          </div>
        )}
        <button onClick={() => setPage("about")} style={navBtnOutline}>About</button>
      </div>

      {/* Centre — Logo */}
      <div
        className="header-logo"
        style={{ display: "flex", alignItems: "center", gap: "0.75rem", cursor: "pointer" }}
        onClick={() => setPage("studentDashboard")}
      >
        <div className="header-logo-icon"><LogoIcon /></div>
        <div className="header-logo-text" style={{ lineHeight: "1.1" }}>
          <div className="logo-student" style={{ margin: 0, fontSize: "1.7rem", fontWeight: "800", color: "white", letterSpacing: "-0.02em" }}>StudentShifts<span style={{ color: "rgba(255,255,255,0.7)" }}>.ie</span></div>
        </div>
      </div>

      {/* Right — Liked/Applied (student) or Login/Sign Up (logged out) */}
      <div className="header-right" style={{ display: "flex", gap: "0.5rem", alignItems: "center", justifyContent: "flex-end" }}>
        {currentUser ? (
          <>
            {currentUser.role === "admin" ? (
              <button onClick={() => setPage("admin")} style={navBtnPrimary}>Admin Dashboard</button>
            ) : currentUser.role === "student" ? (
              <>
                <button onClick={() => setPage("likedJobs")} style={{ ...navBtnOutline, display: "inline-flex", alignItems: "center", gap: "0.4rem" }}>
                  ❤️ <span className="nav-label">Liked</span> <CountBadge n={likedJobs.length} />
                </button>
                <div style={{ position: "relative", display: "inline-block" }}>
                  <button onClick={() => setPage("appliedJobs")} style={{ ...navBtnOutline, display: "inline-flex", alignItems: "center", gap: "0.4rem" }}>
                    ✅ <span className="nav-label">Applied</span> <CountBadge n={appliedJobs.length} />
                  </button>
                  {notifCount > 0 && <span style={notifDot}>{notifCount}</span>}
                </div>
                <button onClick={() => setPage("messages")} style={{ ...navBtnOutline, display: "inline-flex", alignItems: "center", gap: "0.4rem" }}>
                  💬 <span className="nav-label">Messages</span>
                </button>
              </>
            ) : (
              <>
                <button onClick={() => setPage("studentDashboard")} style={navBtnOutline}><span className="nav-label">Browse </span>Jobs</button>
                <button onClick={() => setPage("companyMessages")} style={{ ...navBtnOutline, display: "inline-flex", alignItems: "center", gap: "0.4rem" }}>💬 <span className="nav-label">Messages</span></button>
                <button onClick={() => setPage("companyDashboard")} style={navBtnPrimary}><span className="nav-label">My </span>Jobs</button>
              </>
            )}
          </>
        ) : (
          <>
            <button onClick={() => setPage("login")} style={navBtnOutline}>Login</button>
            <button onClick={() => setPage("signup")} style={navBtnPrimary}>Sign Up</button>
          </>
        )}
      </div>
    </header>
  );
}

function LogoIcon() {
  return (
    <div style={{
      width: "44px",
      height: "44px",
      borderRadius: "12px",
      backgroundColor: "white",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
      flexShrink: 0,
    }}>
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3z" fill="#A21D54"/>
        <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z" fill="#C2185B"/>
      </svg>
    </div>
  );
}

function PersonIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  );
}

function CountBadge({ n }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", backgroundColor: "rgba(255,255,255,0.25)", borderRadius: "999px", padding: "0 0.45rem", fontSize: "0.68rem", fontWeight: "700", minWidth: "18px", height: "18px" }}>
      {n}
    </span>
  );
}



const navBtnPrimary = {
  padding: "0.48rem 1.1rem",
  borderRadius: "2rem",
  background: "white",
  color: "#A21D54",
  border: "none",
  cursor: "pointer",
  fontWeight: "700",
  fontSize: "0.82rem",
  boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
  fontFamily: "inherit",
};

const navBtnOutline = {
  padding: "0.45rem 1.1rem",
  borderRadius: "2rem",
  backgroundColor: "rgba(255,255,255,0.15)",
  color: "white",
  border: "1.5px solid rgba(255,255,255,0.5)",
  cursor: "pointer",
  fontWeight: "600",
  fontSize: "0.82rem",
  fontFamily: "inherit",
};

const notifDot = {
  position: "absolute",
  top: "-4px",
  right: "-4px",
  backgroundColor: "#fff",
  color: "#A21D54",
  fontSize: "0.62rem",
  fontWeight: "700",
  width: "16px",
  height: "16px",
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  pointerEvents: "none",
  border: "2px solid #C2185B",
};
