import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function StudentReportCard() {
  const navigate = useNavigate();
  const [examType, setExamType] = useState("");
  const [records, setRecords] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const studentId = localStorage.getItem("student_id");

  const goTo = (path) => {
    setSidebarOpen(false);
    navigate(path);
  };

  const getGrade = (percentage) => {
    if (percentage >= 90) return "A+";
    if (percentage >= 80) return "A";
    if (percentage >= 70) return "B";
    if (percentage >= 60) return "C";
    if (percentage >= 50) return "D";
    return "Fail";
  };

  const loadReport = async (type) => {
    setExamType(type);

    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/report-card/${studentId}/${type}`
      );

      setRecords(res.data);
    } catch (err) {
      alert("Error loading report card");
      console.log(err);
    }
  };

  const totalFullMarks = records.reduce(
    (sum, r) => sum + Number(r.full_marks),
    0
  );

  const totalObtained = records.reduce(
    (sum, r) => sum + Number(r.obtained_marks),
    0
  );

  const totalAverage = records.reduce(
    (sum, r) => sum + Number(r.average_marks || 0),
    0
  );

  const totalHighest = records.reduce(
    (sum, r) => sum + Number(r.highest_marks || 0),
    0
  );

  const overallPercentage =
    totalFullMarks === 0 ? 0 : (totalObtained / totalFullMarks) * 100;

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
            <h1>Report Card</h1>
            <p>Load Mid Term or Final Term report details.</p>
          </div>
          <div className="hero-actions">
            <button onClick={() => navigate("/student")}>Dashboard</button>
          </div>
        </section>

        <section className="admin-list-panel">
          <div className="admin-section-header">
            <h2>Select Exam</h2>
            <p>Choose a term to view the report card.</p>
          </div>

          <div className="report-type-actions">
            <button
              className={examType === "Mid Term" ? "active-report-btn" : ""}
              onClick={() => loadReport("Mid Term")}
            >
              Mid Term
            </button>

            <button
              className={examType === "Final Term" ? "active-report-btn" : ""}
              onClick={() => loadReport("Final Term")}
            >
              Final Term
            </button>
          </div>
        </section>

        {examType && records.length === 0 && (
          <section className="admin-table-panel">
            <p className="empty-panel-text">
              No {examType} result has been added yet.
            </p>
          </section>
        )}

        {records.length > 0 && (
          <section className="admin-table-panel">
            <div className="admin-section-header">
              <h2>{examType} Report Card</h2>
              <p>Overall percentage: {overallPercentage.toFixed(2)}%</p>
            </div>

            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Subject</th>
                    <th>Full Marks</th>
                    <th>Obtained Marks</th>
                    <th>Average Marks</th>
                    <th>Percentage</th>
                    <th>Grade</th>
                    <th>Highest Marks</th>
                  </tr>
                </thead>

                <tbody>
                  {records.map((r, index) => {
                    const percentage =
                      (Number(r.obtained_marks) / Number(r.full_marks)) * 100;

                    return (
                      <tr key={index}>
                        <td>{r.subject_name}</td>
                        <td>{r.full_marks}</td>
                        <td>{r.obtained_marks}</td>
                        <td>{r.average_marks}</td>
                        <td>{percentage.toFixed(2)}%</td>
                        <td>{getGrade(percentage)}</td>
                        <td>{r.highest_marks}</td>
                      </tr>
                    );
                  })}

                  <tr className="report-total-row">
                    <th>Total</th>
                    <th>{totalFullMarks}</th>
                    <th>{totalObtained}</th>
                    <th>{totalAverage.toFixed(2)}</th>
                    <th>{overallPercentage.toFixed(2)}%</th>
                    <th>{getGrade(overallPercentage)}</th>
                    <th>{totalHighest}</th>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default StudentReportCard;
