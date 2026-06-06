import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function StudentAttendance() {
  const navigate = useNavigate();
  const [attendance, setAttendance] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem("role");
    const studentId = localStorage.getItem("student_id");

    if (role !== "student") {
      alert("Only student can access this page");
      navigate("/");
      return;
    }

    axios
      .get(`${import.meta.env.VITE_API_URL}/student-attendance/${studentId}`)
      .then((res) => setAttendance(res.data))
      .catch((err) => console.log(err));
  }, [navigate]);

  const goTo = (path) => {
    setSidebarOpen(false);
    navigate(path);
  };

  const getPercentage = (item) => {
    if (item.total_classes === 0) return "0%";
    return Math.round((item.present_count / item.total_classes) * 100) + "%";
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
        <section className="student-hero">
          <div>
            <h1>My Attendance</h1>
            <p>Track attendance by subject, class, and section.</p>
          </div>
          <div className="hero-actions">
            <button onClick={() => navigate("/student")}>Dashboard</button>
          </div>
        </section>

        <section className="admin-table-panel">
          {attendance.length === 0 ? (
            <p className="empty-panel-text">No attendance record found.</p>
          ) : (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Subject</th>
                    <th>Class</th>
                    <th>Section</th>
                    <th>Present</th>
                    <th>Absent</th>
                    <th>Late</th>
                    <th>Total</th>
                    <th>Percentage</th>
                  </tr>
                </thead>

                <tbody>
                  {attendance.map((item, index) => (
                    <tr key={index}>
                      <td>{item.subject_name}</td>
                      <td>{item.class_name}</td>
                      <td>{item.section_name}</td>
                      <td>{item.present_count}</td>
                      <td>{item.absent_count}</td>
                      <td>{item.late_count}</td>
                      <td>{item.total_classes}</td>
                      <td>{getPercentage(item)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default StudentAttendance;
