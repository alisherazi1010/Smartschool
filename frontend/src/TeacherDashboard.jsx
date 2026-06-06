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
        <section className="teacher-hero">
          <div>
            <h1>Teacher Dashboard</h1>
            <p>Welcome, {name}</p>
          </div>
          <span className="teacher-hero-badge">Today</span>
        </section>

        <div className="teacher-dashboard-grid">
          <div
            className="teacher-dashboard-card"
            onClick={() => navigate("/teacher-classes")}
          >
            <span className="teacher-card-icon">CL</span>
            <h3>My Classes</h3>
            <p>View assigned classes and subjects</p>
          </div>

          <div
            className="teacher-dashboard-card"
            onClick={() => navigate("/teacher-classes")}
          >
            <span className="teacher-card-icon">AT</span>
            <h3>Attendance</h3>
            <p>Mark or view attendance</p>
          </div>

          <div
            className="teacher-dashboard-card"
            onClick={() => navigate("/teacher-classes")}
          >
            <span className="teacher-card-icon">AS</span>
            <h3>Assessments</h3>
            <p>Create tests, assignments, mid/final terms</p>
          </div>

          <div
            className="teacher-dashboard-card"
            onClick={() => navigate("/teacher-classes")}
          >
            <span className="teacher-card-icon">RS</span>
            <h3>Results</h3>
            <p>Enter and view student marks</p>
          </div>
        </div>

        <div className="teacher-section-header">
          <h2>Quick Actions</h2>
          <p>Open your assigned classes to manage attendance and assessments.</p>
        </div>

        <div className="teacher-action-row">
          <button onClick={() => navigate("/teacher-classes")}>
            <span className="teacher-action-icon">GO</span>
            <span>Open My Classes</span>
          </button>
        </div>
      </main>
    </div>
  );
}

export default TeacherDashboard;
