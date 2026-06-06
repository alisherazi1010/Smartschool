import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function AdminDashboard() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [stats, setStats] = useState({
    totalStudents: 0,
    totalTeachers: 0,
    totalSubjects: 0,
    totalClasses: 0,
  });

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/dashboard-stats`)
      .then((res) => setStats(res.data))
      .catch((err) => console.log(err));
  }, []);

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
        <button onClick={() => goTo("/admin")}>Dashboard</button>
        <button onClick={() => goTo("/view-students")}>Students</button>
        <button onClick={() => goTo("/view-teachers")}>Teachers</button>
        <button onClick={() => goTo("/view-subjects")}>Subjects</button>
        <button onClick={() => goTo("/view-assignments")}>Assignments</button>

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
        <section className="admin-hero">
          <div>
            <h1>Admin Dashboard</h1>
            <p>Welcome to SmartSchool Admin Portal</p>
          </div>
          <span className="admin-hero-badge">Overview</span>
        </section>

        <div className="stats-grid admin-stats-grid">
          <div className="stat-card admin-stat-card">
            <span className="admin-stat-icon">ST</span>
            <h3>{stats.totalStudents}</h3>
            <p>Total Students</p>
          </div>

          <div className="stat-card admin-stat-card">
            <span className="admin-stat-icon">TR</span>
            <h3>{stats.totalTeachers}</h3>
            <p>Total Teachers</p>
          </div>

          <div className="stat-card admin-stat-card">
            <span className="admin-stat-icon">SB</span>
            <h3>{stats.totalSubjects}</h3>
            <p>Total Subjects</p>
          </div>

          <div className="stat-card admin-stat-card">
            <span className="admin-stat-icon">CL</span>
            <h3>{stats.totalClasses}</h3>
            <p>Total Classes</p>
          </div>
        </div>

        <div className="admin-section-header">
          <h2>Quick Actions</h2>
          <p>Manage the main school records from one place.</p>
        </div>

        <div className="action-grid admin-action-grid">
          <button onClick={() => navigate("/add-student")}>
            <span className="admin-action-icon">+</span>
            <span>Add Student</span>
          </button>
          <button onClick={() => navigate("/add-teacher")}>
            <span className="admin-action-icon">+</span>
            <span>Add Teacher</span>
          </button>
          <button onClick={() => navigate("/add-subject")}>
            <span className="admin-action-icon">+</span>
            <span>Add Subject</span>
          </button>
          <button onClick={() => navigate("/assign-teacher")}>
            <span className="admin-action-icon">GO</span>
            <span>Assign Teacher</span>
          </button>
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;
