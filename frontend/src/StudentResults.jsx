import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function StudentResults() {
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

const goTo = (path) => {
  setSidebarOpen(false);
  navigate(path);
};

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
      <h1>My Results</h1>

      <button onClick={() => navigate("/student")}>Back</button>

      <br /><br />

      <table border="1" cellPadding="10">
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
      </main>
    </div>
  );
}

export default StudentResults;