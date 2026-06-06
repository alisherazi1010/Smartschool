import { useState } from "react";
import { useNavigate } from "react-router-dom";

function StudentDashboard() {
  const navigate = useNavigate();
  const name = localStorage.getItem("name");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const goTo = (path) => {
    setSidebarOpen(false);
    navigate(path);
  };

  return (
    <div className="dashboard-layout">
      <button className="menu-toggle" onClick={() => setSidebarOpen(true)}>
        Menu
      </button>

      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <h2>SmartSchool</h2>

        <button onClick={() => goTo("/student")}>Dashboard</button>
        <button onClick={() => goTo("/student-profile")}>My Profile</button>
        <button onClick={() => goTo("/student-attendance")}>My Attendance</button>
        <button onClick={() => goTo("/student-results")}>My Results</button>
        <button onClick={() => goTo("/student-report-card")}>Report Card</button>

        <button
          className="logout-btn"
          onClick={() => {
            localStorage.clear();
            navigate("/student-login", { replace: true });
          }}
        >
          Logout
        </button>
      </aside>

      <main className="dashboard-main">
        <div className="student-hero">
          <h1>Welcome Back, {name}</h1>
          <p>SmartSchool Student Portal</p>
        </div>

        <div className="student-grid">
          <div
            className="student-card glass-student-card"
            onClick={() => goTo("/student-profile")}
          >
            <span className="student-card-icon">PF</span>
            <h2>My Profile</h2>
            <p>Personal and class information</p>
          </div>

          <div
            className="student-card glass-student-card"
            onClick={() => goTo("/student-attendance")}
          >
            <span className="student-card-icon">AT</span>
            <h2>Attendance</h2>
            <p>Track your attendance record</p>
          </div>

          <div
            className="student-card glass-student-card"
            onClick={() => goTo("/student-results")}
          >
            <span className="student-card-icon">RS</span>
            <h2>Results</h2>
            <p>View assessments and marks</p>
          </div>

          <div
            className="student-card glass-student-card"
            onClick={() => goTo("/student-report-card")}
          >
            <span className="student-card-icon">RC</span>
            <h2>Report Card</h2>
            <p>Mid Term and Final Term reports</p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default StudentDashboard;
