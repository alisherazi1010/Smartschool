import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function StudentResults() {
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
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
      .get(`${import.meta.env.VITE_API_URL}/student-results/${studentId}`)
      .then((res) => setResults(res.data))
      .catch((err) => console.log(err));
  }, [navigate]);

  const goTo = (path) => {
    setSidebarOpen(false);
    navigate(path);
  };

  const getPercentage = (obtained, total) => {
    return ((obtained / total) * 100).toFixed(2);
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
            <h1>My Results</h1>
            <p>View assessment marks and percentages.</p>
          </div>
          <div className="hero-actions">
            <button onClick={() => navigate("/student")}>Dashboard</button>
          </div>
        </section>

        <section className="admin-table-panel">
          {results.length === 0 ? (
            <p className="empty-panel-text">No result record found.</p>
          ) : (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Subject</th>
                    <th>Assessment</th>
                    <th>Type</th>
                    <th>Date</th>
                    <th>Total Marks</th>
                    <th>Obtained Marks</th>
                    <th>Percentage</th>
                  </tr>
                </thead>

                <tbody>
                  {results.map((r, index) => (
                    <tr key={index}>
                      <td>{r.subject_name}</td>
                      <td>{r.assessment_title}</td>
                      <td>{r.assessment_type}</td>
                      <td>{r.assessment_date?.split("T")[0]}</td>
                      <td>{r.total_marks}</td>
                      <td>{r.obtained_marks}</td>
                      <td>{getPercentage(r.obtained_marks, r.total_marks)}%</td>
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

export default StudentResults;
