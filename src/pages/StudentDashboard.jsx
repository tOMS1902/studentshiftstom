import React, { useState, useRef, useEffect } from "react";
import PageWrapper from "../components/PageWrapper";
import "../StudentShiftWeb.css";

export default function StudentDashboard({
  setPage,
  setSelectedJob,
  likedJobs,
  setLikedJobs,
  appliedJobs,
  currentUser,
}) {

  const jobs = [
    { id: 1, title: "Bar Staff", company: "Galway Pub", location: "City Centre", pay: "€12/hr", days: ["Tuesday","Thursday"], times: { Tuesday: ["11:00","13:00"], Thursday: ["13:00"] }, weekendRequired: true },
    { id: 2, title: "Retail Assistant", company: "SuperMart", location: "5 min walk", pay: "€10/hr", days: ["Monday","Wednesday","Friday"], times: { Monday: ["10:00"], Wednesday: ["14:00"], Friday: ["12:00"] }, weekendRequired: false },
    { id: 3, title: "Library Assistant", company: "Campus Library", location: "On-Campus", pay: "€12/hr", days: ["Monday","Tuesday","Thursday"], times: { Monday: ["09:00"], Tuesday: ["11:00"], Thursday: ["13:00"] }, weekendRequired: false },
    { id: 4, title: "Waiter", company: "Galway Bistro", location: "Near Campus", pay: "€11/hr", days: ["Tuesday","Wednesday","Friday"], times: { Tuesday: ["11:00"], Wednesday: ["12:00"], Friday: ["14:00"] }, weekendRequired: true },
    { id: 5, title: "Cleaner", company: "City Mall", location: "10 min walk", pay: "€10/hr", days: ["Monday","Thursday"], times: { Monday: ["10:00"], Thursday: ["13:00"] }, weekendRequired: false },
    { id: 6, title: "Barista", company: "Coffee Hub", location: "Near Campus", pay: "€11/hr", days: ["Monday","Tuesday","Wednesday"], times: { Monday: ["09:00"], Tuesday: ["11:00"], Wednesday: ["10:00"] }, weekendRequired: true },
    { id: 7, title: "Receptionist", company: "City Hotel", location: "Downtown", pay: "€13/hr", days: ["Monday","Wednesday","Friday"], times: { Monday: ["08:00"], Wednesday: ["08:00"], Friday: ["08:00"] }, weekendRequired: false },
    { id: 8, title: "Stockroom Assistant", company: "SuperMart", location: "5 min walk", pay: "€10/hr", days: ["Tuesday","Thursday"], times: { Tuesday: ["12:00"], Thursday: ["14:00"] }, weekendRequired: false },
    { id: 9, title: "Food Prep", company: "Galway Bistro", location: "Near Campus", pay: "€11/hr", days: ["Monday","Wednesday"], times: { Monday: ["09:00"], Wednesday: ["10:00"] }, weekendRequired: true },
    { id: 10, title: "Security Guard", company: "City Mall", location: "10 min walk", pay: "€14/hr", days: ["Friday"], times: { Friday: ["18:00"] }, weekendRequired: true },
    { id: 11, title: "Dishwasher", company: "Galway Pub", location: "City Centre", pay: "€11/hr", days: ["Monday","Tuesday"], times: { Monday: ["12:00"], Tuesday: ["13:00"] }, weekendRequired: true },
    { id: 12, title: "Promoter", company: "Tech Store", location: "Downtown", pay: "€12/hr", days: ["Wednesday","Thursday"], times: { Wednesday: ["14:00"], Thursday: ["16:00"] }, weekendRequired: false },
    { id: 13, title: "Host", company: "City Hotel", location: "Downtown", pay: "€13/hr", days: ["Monday","Friday"], times: { Monday: ["09:00"], Friday: ["11:00"] }, weekendRequired: true },
    { id: 14, title: "Catering Assistant", company: "Galway Bistro", location: "Near Campus", pay: "€11/hr", days: ["Tuesday","Thursday"], times: { Tuesday: ["11:00"], Thursday: ["13:00"] }, weekendRequired: true },
    { id: 15, title: "Cashier", company: "SuperMart", location: "5 min walk", pay: "€10/hr", days: ["Monday","Wednesday","Friday"], times: { Monday: ["10:00"], Wednesday: ["12:00"], Friday: ["14:00"] }, weekendRequired: false },
    { id: 16, title: "Kitchen Staff", company: "City Mall", location: "10 min walk", pay: "€11/hr", days: ["Wednesday","Thursday"], times: { Wednesday: ["11:00"], Thursday: ["13:00"] }, weekendRequired: true },
    { id: 17, title: "Bar Staff", company: "Galway Pub", location: "City Centre", pay: "€12/hr", days: ["Monday","Friday"], times: { Monday: ["13:00"], Friday: ["12:00"] }, weekendRequired: true },
    { id: 18, title: "Delivery Assistant", company: "Tech Store", location: "Downtown", pay: "€12/hr", days: ["Tuesday","Thursday"], times: { Tuesday: ["09:00"], Thursday: ["10:00"] }, weekendRequired: false },
    { id: 19, title: "Stock Clerk", company: "SuperMart", location: "5 min walk", pay: "€10/hr", days: ["Monday","Wednesday"], times: { Monday: ["08:00"], Wednesday: ["09:00"] }, weekendRequired: false },
    { id: 20, title: "Waiter", company: "City Bistro", location: "Near Campus", pay: "€11/hr", days: ["Tuesday","Friday"], times: { Tuesday: ["12:00"], Friday: ["14:00"] }, weekendRequired: true },
    { id: 21, title: "Food Runner", company: "Galway Bistro", location: "Near Campus", pay: "€11/hr", days: ["Monday","Thursday"], times: { Monday: ["11:00"], Thursday: ["13:00"] }, weekendRequired: true },
    { id: 22, title: "Barista", company: "Coffee Hub", location: "Near Campus", pay: "€11/hr", days: ["Wednesday","Friday"], times: { Wednesday: ["10:00"], Friday: ["12:00"] }, weekendRequired: false },
    { id: 23, title: "Receptionist", company: "City Hotel", location: "Downtown", pay: "€13/hr", days: ["Monday","Tuesday","Thursday"], times: { Monday: ["09:00"], Tuesday: ["11:00"], Thursday: ["13:00"] }, weekendRequired: false },
    { id: 24, title: "Cleaner", company: "City Mall", location: "10 min walk", pay: "€10/hr", days: ["Wednesday","Friday"], times: { Wednesday: ["08:00"], Friday: ["10:00"] }, weekendRequired: true },
    { id: 25, title: "Catering Assistant", company: "Galway Bistro", location: "Near Campus", pay: "€11/hr", days: ["Tuesday","Thursday"], times: { Tuesday: ["12:00"], Thursday: ["14:00"] }, weekendRequired: true },
    { id: 26, title: "Bar Staff", company: "Galway Pub", location: "City Centre", pay: "€12/hr", days: ["Monday","Wednesday"], times: { Monday: ["13:00"], Wednesday: ["12:00"] }, weekendRequired: true },
    { id: 27, title: "Dishwasher", company: "City Bistro", location: "Near Campus", pay: "€11/hr", days: ["Tuesday","Friday"], times: { Tuesday: ["11:00"], Friday: ["13:00"] }, weekendRequired: true },
    { id: 28, title: "Promoter", company: "Tech Store", location: "Downtown", pay: "€12/hr", days: ["Monday","Thursday"], times: { Monday: ["09:00"], Thursday: ["11:00"] }, weekendRequired: false },
    { id: 29, title: "Stockroom Assistant", company: "SuperMart", location: "5 min walk", pay: "€10/hr", days: ["Wednesday","Thursday"], times: { Wednesday: ["10:00"], Thursday: ["12:00"] }, weekendRequired: false },
    { id: 30, title: "Kitchen Staff", company: "City Mall", location: "10 min walk", pay: "€11/hr", days: ["Monday","Tuesday"], times: { Monday: ["11:00"], Tuesday: ["13:00"] }, weekendRequired: true },
    { id: 31, title: "Cashier", company: "SuperMart", location: "5 min walk", pay: "€10/hr", days: ["Wednesday","Friday"], times: { Wednesday: ["12:00"], Friday: ["14:00"] }, weekendRequired: false },
    { id: 32, title: "Waiter", company: "Galway Bistro", location: "Near Campus", pay: "€11/hr", days: ["Tuesday","Thursday"], times: { Tuesday: ["11:00"], Thursday: ["13:00"] }, weekendRequired: true },
    { id: 33, title: "Barista", company: "Coffee Hub", location: "Near Campus", pay: "€11/hr", days: ["Monday","Wednesday","Friday"], times: { Monday: ["10:00"], Wednesday: ["12:00"], Friday: ["14:00"] }, weekendRequired: false },
    { id: 34, title: "Receptionist", company: "City Hotel", location: "Downtown", pay: "€13/hr", days: ["Tuesday","Thursday"], times: { Tuesday: ["09:00"], Thursday: ["11:00"] }, weekendRequired: false },
    { id: 35, title: "Cleaner", company: "City Mall", location: "10 min walk", pay: "€10/hr", days: ["Monday","Friday"], times: { Monday: ["08:00"], Friday: ["10:00"] }, weekendRequired: true },
    { id: 36, title: "Food Prep", company: "Galway Bistro", location: "Near Campus", pay: "€11/hr", days: ["Wednesday","Thursday"], times: { Wednesday: ["11:00"], Thursday: ["13:00"] }, weekendRequired: true },
    { id: 37, title: "Dishwasher", company: "City Bistro", location: "Near Campus", pay: "€11/hr", days: ["Monday","Tuesday"], times: { Monday: ["12:00"], Tuesday: ["13:00"] }, weekendRequired: true },
    { id: 38, title: "Promoter", company: "Tech Store", location: "Downtown", pay: "€12/hr", days: ["Wednesday","Friday"], times: { Wednesday: ["14:00"], Friday: ["16:00"] }, weekendRequired: false },
    { id: 39, title: "Stock Clerk", company: "SuperMart", location: "5 min walk", pay: "€10/hr", days: ["Tuesday","Thursday"], times: { Tuesday: ["08:00"], Thursday: ["10:00"] }, weekendRequired: false },
    { id: 40, title: "Kitchen Staff", company: "City Mall", location: "10 min walk", pay: "€11/hr", days: ["Monday","Friday"], times: { Monday: ["11:00"], Friday: ["13:00"] }, weekendRequired: true },
  ];

  const weekdays = ["Monday","Tuesday","Wednesday","Thursday","Friday"];
  const timeSlots = ["08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00"];
  const allLocations = [...new Set(jobs.map(j => j.location))].sort();
  const jobTypeCategories = {
    "Hospitality": ["Bar Staff","Waiter","Host","Food Runner","Catering Assistant","Dishwasher","Food Prep","Kitchen Staff"],
    "Retail": ["Retail Assistant","Cashier","Stockroom Assistant","Stock Clerk","Delivery Assistant","Promoter"],
    "Campus": ["Library Assistant"],
    "Service": ["Barista","Receptionist","Cleaner","Security Guard"],
  };

  const [selectedDays, setSelectedDays] = useState([]);
  const [dayTimes, setDayTimes] = useState({});
  const [warning, setWarning] = useState("");
  const [openDropdown, setOpenDropdown] = useState(null);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [selectedJobTypes, setSelectedJobTypes] = useState([]);
  const filterBarRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (filterBarRef.current && !filterBarRef.current.contains(e.target)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDay = (day) => {
    let updated = [...selectedDays];
    if (updated.includes(day)) {
      updated = updated.filter(d => d !== day);
      const newTimes = { ...dayTimes };
      delete newTimes[day];
      setDayTimes(newTimes);
    } else {
      if (updated.length >= 5) setWarning("Are you a student selecting all 5 weekdays?");
      updated.push(day);
    }
    setSelectedDays(updated);
  };

  const updateTime = (day, time) => setDayTimes({ ...dayTimes, [day]: time });

  const toggleLocation = (loc) =>
    setSelectedLocations(prev => prev.includes(loc) ? prev.filter(l => l !== loc) : [...prev, loc]);

  const toggleJobType = (type) =>
    setSelectedJobTypes(prev => prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]);

  const clearAll = () => {
    setSelectedDays([]);
    setDayTimes({});
    setSelectedLocations([]);
    setSelectedJobTypes([]);
    setWarning("");
  };

  const hasActiveFilters = selectedDays.length > 0 || selectedLocations.length > 0 || selectedJobTypes.length > 0;

  const filteredJobs = jobs.filter(job => {
    if (selectedDays.length > 0) {
      const daysMatch = selectedDays.every(day => {
        if (!job.days.includes(day)) return false;
        if (dayTimes[day]) return job.times[day]?.includes(dayTimes[day]);
        return true;
      });
      if (!daysMatch) return false;
    }
    if (selectedLocations.length > 0 && !selectedLocations.includes(job.location)) return false;
    if (selectedJobTypes.length > 0) {
      const category = Object.entries(jobTypeCategories).find(([, titles]) => titles.includes(job.title));
      if (!category || !selectedJobTypes.includes(category[0])) return false;
    }
    return true;
  });

  const toggleLike = (job) => {
    if (!currentUser) { setPage("login"); return; }
    if (appliedJobs.some(j => j.id === job.id)) return;
    const isLiked = likedJobs.some((j) => j.id === job.id);
    if (isLiked) {
      setLikedJobs(likedJobs.filter((j) => j.id !== job.id));
    } else {
      setLikedJobs([...likedJobs, job]);
    }
  };

  const dayTimeLabel = () => {
    if (selectedDays.length === 0) return "Days & Times";
    const parts = selectedDays.map(d => dayTimes[d] ? `${d.slice(0,3)} ${dayTimes[d]}` : d.slice(0,3));
    return `Days & Times (${parts.join(", ")})`;
  };
  const locationLabel = () => selectedLocations.length === 0 ? "Location" : `Location (${selectedLocations.length})`;
  const jobTypeLabel = () => selectedJobTypes.length === 0 ? "Job Type" : `Job Type (${selectedJobTypes.join(", ")})`;

  const dropdownBtnStyle = (isActive) => ({
    padding: "0.45rem 1rem",
    borderRadius: "0.5rem",
    border: `1.5px solid ${isActive ? "#3b82f6" : "#d1d5db"}`,
    backgroundColor: isActive ? "#eff6ff" : "white",
    color: isActive ? "#1d4ed8" : "#374151",
    fontWeight: isActive ? "600" : "500",
    fontSize: "0.875rem",
    cursor: "pointer",
    whiteSpace: "nowrap",
  });

  return (
    <PageWrapper>
      <h1 style={{ textAlign: "center", marginBottom: "1.5rem" }}>Available Jobs</h1>

      {/* Filter Bar */}
      <div ref={filterBarRef} style={{ marginBottom: "2rem", position: "relative" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", alignItems: "center" }}>

          {/* Days & Times */}
          <div style={{ position: "relative" }}>
            <button onClick={() => setOpenDropdown(openDropdown === "dayTime" ? null : "dayTime")} style={dropdownBtnStyle(selectedDays.length > 0)}>
              {dayTimeLabel()} ▾
            </button>
            {openDropdown === "dayTime" && (
              <div style={dropdownPanel}>
                {warning && <p style={{ color: "#ef4444", fontSize: "0.8rem", marginBottom: "0.5rem" }}>{warning}</p>}
                {weekdays.map(day => (
                  <div key={day} style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.5rem" }}>
                    <input type="checkbox" id={`day-${day}`} checked={selectedDays.includes(day)} onChange={() => toggleDay(day)} style={{ cursor: "pointer", width: "15px", height: "15px" }} />
                    <label htmlFor={`day-${day}`} style={{ fontWeight: "500", minWidth: "90px", cursor: "pointer" }}>{day}</label>
                    <select
                      value={dayTimes[day] || ""}
                      onChange={e => updateTime(day, e.target.value)}
                      disabled={!selectedDays.includes(day)}
                      style={{ padding: "0.2rem 0.4rem", borderRadius: "0.4rem", border: "1px solid #d1d5db", fontSize: "0.8rem", color: selectedDays.includes(day) ? "#111827" : "#9ca3af", cursor: selectedDays.includes(day) ? "pointer" : "not-allowed", backgroundColor: selectedDays.includes(day) ? "white" : "#f9fafb" }}
                    >
                      <option value="">Any time</option>
                      {timeSlots.map(time => <option key={time} value={time}>{time}</option>)}
                    </select>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Location */}
          <div style={{ position: "relative" }}>
            <button onClick={() => setOpenDropdown(openDropdown === "location" ? null : "location")} style={dropdownBtnStyle(selectedLocations.length > 0)}>
              {locationLabel()} ▾
            </button>
            {openDropdown === "location" && (
              <div style={dropdownPanel}>
                {allLocations.map(loc => (
                  <label key={loc} style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.4rem", cursor: "pointer", fontWeight: "500" }}>
                    <input type="checkbox" checked={selectedLocations.includes(loc)} onChange={() => toggleLocation(loc)} style={{ width: "15px", height: "15px", cursor: "pointer" }} />
                    {loc}
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Job Type */}
          <div style={{ position: "relative" }}>
            <button onClick={() => setOpenDropdown(openDropdown === "jobType" ? null : "jobType")} style={dropdownBtnStyle(selectedJobTypes.length > 0)}>
              {jobTypeLabel()} ▾
            </button>
            {openDropdown === "jobType" && (
              <div style={dropdownPanel}>
                {Object.keys(jobTypeCategories).map(type => (
                  <label key={type} style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.4rem", cursor: "pointer", fontWeight: "500" }}>
                    <input type="checkbox" checked={selectedJobTypes.includes(type)} onChange={() => toggleJobType(type)} style={{ width: "15px", height: "15px", cursor: "pointer" }} />
                    {type}
                  </label>
                ))}
              </div>
            )}
          </div>

          {hasActiveFilters && (
            <button onClick={clearAll} style={{ padding: "0.45rem 0.9rem", borderRadius: "0.5rem", border: "1.5px solid #fca5a5", backgroundColor: "#fef2f2", color: "#dc2626", fontWeight: "600", fontSize: "0.875rem", cursor: "pointer" }}>
              Clear
            </button>
          )}

          <span style={{ marginLeft: "auto", fontSize: "0.875rem", color: "#6b7280" }}>
            {filteredJobs.length} job{filteredJobs.length !== 1 ? "s" : ""} found
          </span>
        </div>
      </div>

      {/* Empty State */}
      {filteredJobs.length === 0 && (
        <div style={{ textAlign: "center", padding: "3rem 1rem", color: "#6b7280" }}>
          <p style={{ fontSize: "1.25rem", fontWeight: "600", marginBottom: "0.5rem" }}>No jobs match your filters</p>
          <p style={{ marginBottom: "1.5rem" }}>Try removing some filters to see more results.</p>
          <button onClick={clearAll} style={{ padding: "0.6rem 1.25rem", borderRadius: "0.5rem", backgroundColor: "#3b82f6", color: "white", border: "none", fontWeight: "600", cursor: "pointer" }}>
            Clear Filters
          </button>
        </div>
      )}

      {/* Job List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {filteredJobs.map((job) => {
        const isLiked = likedJobs.some(j => j.id === job.id);
        const isApplied = appliedJobs.some(j => j.id === job.id);

        return (
          <div key={job.id} className="job-card" style={{ flexDirection: "column", alignItems: "stretch" }}>
            {/* Top row: title + buttons */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem", marginBottom: "0.4rem" }}>
              <h2 style={{ fontWeight: "bold", fontSize: "1.25rem", margin: 0 }}>{job.title}</h2>
              <div style={{ display: "flex", gap: "0.5rem", flexShrink: 0 }}>
                <button onClick={() => { setSelectedJob(job); setPage("jobDetails"); }} style={btnBlue}>
                  View
                </button>
                <button
                  onClick={() => toggleLike(job)}
                  style={{ ...btnBase, backgroundColor: isApplied ? "#16a34a" : (isLiked ? "#16a34a" : "#f87171") }}
                  disabled={isApplied}
                >
                  {isApplied ? "✅" : (isLiked ? "✅" : "❤️")}
                </button>
              </div>
            </div>
            {/* Details */}
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
        );
      })}
      </div>

    </PageWrapper>
  );
}

const dropdownPanel = {
  position: "absolute",
  top: "calc(100% + 0.4rem)",
  left: 0,
  zIndex: 100,
  backgroundColor: "white",
  border: "1.5px solid #e5e7eb",
  borderRadius: "0.6rem",
  boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
  padding: "0.75rem 1rem",
  minWidth: "220px",
};

const btnBase = { padding: "0.5rem 1rem", borderRadius: "0.5rem", color: "white", border: "none", cursor: "pointer", fontWeight: "500" };
const btnBlue = { ...btnBase, backgroundColor: "#3b82f6" };
