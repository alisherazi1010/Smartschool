import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function TeacherClasses() {
  const [classes, setClasses] = useState([]);
  const navigate = useNavigate();
const [sidebarOpen, setSidebarOpen] = useState(false);

  const goTo = (path) => {
    setSidebarOpen(false);
    navigate(path);
  };




  useEffect(() => {
    const role = localStorage.getItem("role");
    const userId = localStorage.getItem("user_id");

    if (role !== "teacher") {
      alert("Only teacher can access this page");
      navigate("/");
      return;
    }

    axios
      .get(`${import.meta.env.VITE_API_URL}/teacher-classes/${userId}`)
      .then((res) => setClasses(res.data))
      .catch((err) => console.log(err));
  }, [navigate]);

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
      <h1>My Classes</h1>

      <button onClick={() => navigate("/teacher")}>Back</button>

      <br /><br />

      {classes.length === 0 ? (
        <p>No classes assigned yet.</p>
      ) : (
        classes.map((c) => (
          <div key={c.assignment_id} className="class-card">
            <div className="class-card-header">
    <div>
            <h3>{c.class_name} - Section {c.section_name}</h3>
            <p>Subject: {c.subject_name}</p>
            </div>
             <span className="class-badge">Today</span>
  </div>

            <div className="class-actions">
            <button onClick={() => navigate("/mark-attendance", { state: { classInfo: c } })}>
              <span className="action-icon">✓</span>
              Mark Attendance
            </button>
            <button
  onClick={() =>
    navigate("/view-attendance", { state: { classInfo: c } })}>
       <span className="action-icon">▦</span>
  View Attendance
</button>


<button
  onClick={() =>
    navigate("/create-assessment", { state: { classInfo: c } })}>
      <span className="action-icon">＋</span>
  Create Assessment
</button>


<button
  onClick={() =>
    navigate("/view-assessments", { state: { classInfo: c } })}>
  <span className="action-icon">□</span>
  View Assessments
</button>
          </div>
          </div>
        ))
      )}
    </main>
    </div>
  );
}

export default TeacherClasses;