import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import StudentShiftsWeb from "./StudentShiftsWeb.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ErrorBoundary>
      <StudentShiftsWeb />
    </ErrorBoundary>
  </StrictMode>
);