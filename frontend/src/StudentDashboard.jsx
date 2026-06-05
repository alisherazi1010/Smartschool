import { useNavigate } from "react-router-dom";

function StudentDashboard() {
  const navigate = useNavigate();
  const name = localStorage.getItem("name");

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <h2>SmartSchool</h2>

        <button onClick={() => navigate("/student")}>Dashboard</button>
        <button onClick={() => navigate("/student-profile")}>My Profile</button>
        <button onClick={() => navigate("/student-attendance")}>My Attendance</button>
        <button onClick={() => navigate("/student-results")}>My Results</button>
        <button onClick={() => navigate("/student-report-card")}>Report Card</button>

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
          <h1>Welcome Back, {name} 👋</h1>
          <p>SmartSchool Student Portal</p>
        </div>

        <div className="student-grid">
          <div
            className="student-card profile-card"
            onClick={() => navigate("/student-profile")}
          >
            <h2>👤 My Profile</h2>
            <p>Personal and class information</p>
          </div>

          <div
            className="student-card attendance-card"
            onClick={() => navigate("/student-attendance")}
          >
            <h2>📅 Attendance</h2>
            <p>Track your attendance record</p>
          </div>

          <div
            className="student-card result-card"
            onClick={() => navigate("/student-results")}
          >
            <h2>📊 Results</h2>
            <p>View assessments and marks</p>
          </div>

          <div
            className="student-card report-card-card"
            onClick={() => navigate("/student-report-card")}
          >
            <h2>🏆 Report Card</h2>
            <p>Mid Term & Final Term reports</p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default StudentDashboard;