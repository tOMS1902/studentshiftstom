import React, { useState, useEffect } from "react";

export default function PageWrapper({ children }) {

  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 300);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <main style={{
      width: "100%",
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      padding: "3rem 1rem",
      boxSizing: "border-box",
      backgroundColor: "#f9fafb",
      fontFamily: "Arial, sans-serif",
      color: "#000",
    }}>

      <div style={{
        width: "100%",
        maxWidth: "860px",
        margin: "0 auto",
        padding: "2rem",
        boxSizing: "border-box",
        backgroundColor: "white",
        borderRadius: "0.75rem",
        boxShadow: "0 6px 18px rgba(0,0,0,0.1)",
      }}>
        {children}
      </div>

      {/* Back to top button */}
      {showTop && (
        <button
          onClick={scrollToTop}
          style={{
            position: "fixed",
            bottom: "2rem",
            right: "2rem",
            width: "44px",
            height: "44px",
            borderRadius: "50%",
            backgroundColor: "#1f2937",
            color: "white",
            border: "none",
            fontSize: "1.2rem",
            cursor: "pointer",
            boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 300,
          }}
          title="Back to top"
        >
          ↑
        </button>
      )}

    </main>
  );
}
