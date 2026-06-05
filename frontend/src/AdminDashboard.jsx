import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function AdminDashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalStudents: 0,
    totalTeachers: 0,
    totalSubjects: 0,
    totalClasses: 0,
  });

  useEffect(() => {
    axios
      .get("http://localhost:5000/dashboard-stats")
      .then((res) => setStats(res.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <h2>SmartSchool</h2>
        <button onClick={() => navigate("/admin")}>Dashboard</button>
        <button onClick={() => navigate("/view-students")}>Students</button>
        <button onClick={() => navigate("/view-teachers")}>Teachers</button>
        <button onClick={() => navigate("/view-subjects")}>Subjects</button>
        <button onClick={() => navigate("/view-assignments")}>Assignments</button>

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
        <h1>Admin Dashboard</h1>
        <p>Welcome to SmartSchool Admin Portal</p>

        <div className="stats-grid">
          <div className="stat-card">
            <h3>{stats.totalStudents}</h3>
            <p>Total Students</p>
          </div>

          <div className="stat-card">
            <h3>{stats.totalTeachers}</h3>
            <p>Total Teachers</p>
          </div>

          <div className="stat-card">
            <h3>{stats.totalSubjects}</h3>
            <p>Total Subjects</p>
          </div>

          <div className="stat-card">
            <h3>{stats.totalClasses}</h3>
            <p>Total Classes</p>
          </div>
        </div>

        <h2>Quick Actions</h2>

        <div className="action-grid">
          <button onClick={() => navigate("/add-student")}>Add Student</button>
          <button onClick={() => navigate("/add-teacher")}>Add Teacher</button>
          <button onClick={() => navigate("/add-subject")}>Add Subject</button>
          <button onClick={() => navigate("/assign-teacher")}>Assign Teacher</button>
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;