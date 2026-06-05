import { useState } from "react";
import { useNavigate } from "react-router-dom";

function TeacherDashboard() {
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

        <button onClick={() => goTo("/teacher")}>Dashboard</button>
        <button onClick={() => goTo("/teacher-classes")}>My Classes</button>

        <button
          className="logout-btn"
          onClick={() => {
            localStorage.clear();
            navigate("/", { replace: true });
          }}
        >
          Logout
        </button>
      </aside>

      <main className="dashboard-main">
        <h1>Teacher Dashboard</h1>
        <p>Welcome, {name}</p>

        <div className="stats-grid">
          <div
            className="stat-card clickable-card"
            onClick={() => navigate("/teacher-classes")}
          >
            <h3>My Classes</h3>
            <p>View assigned classes and subjects</p>
          </div>

          <div
            className="stat-card clickable-card"
            onClick={() => navigate("/teacher-classes")}
          >
            <h3>Attendance</h3>
            <p>Mark or view attendance</p>
          </div>

          <div
            className="stat-card clickable-card"
            onClick={() => navigate("/teacher-classes")}
          >
            <h3>Assessments</h3>
            <p>Create tests, assignments, mid/final terms</p>
          </div>

          <div
            className="stat-card clickable-card"
            onClick={() => navigate("/teacher-classes")}
          >
            <h3>Results</h3>
            <p>Enter and view student marks</p>
          </div>
        </div>

        <h2>Quick Actions</h2>

        <div className="action-grid">
          <button onClick={() => navigate("/teacher-classes")}>
            Open My Classes
          </button>
        </div>
      </main>
    </div>
  );
}

export default TeacherDashboard;