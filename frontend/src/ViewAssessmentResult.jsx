import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

function ViewAssessmentResult() {
  const navigate = useNavigate();
  const location = useLocation();

  const { classInfo, assessment } = location.state;

  const [results, setResults] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    axios
      .get(
        `${import.meta.env.VITE_API_URL}/assessment-results/${assessment.assessment_id}`
      )
      .then((res) => setResults(res.data))
      .catch((err) => console.log(err));
  }, [assessment]);

  const goTo = (path) => {
    setSidebarOpen(false);
    navigate(path);
  };

  const getPercentage = (obtained) => {
    return ((obtained / assessment.total_marks) * 100).toFixed(2);
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
        <button onClick={() => goTo("/teacher-profile")}>My Profile</button>
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
            <h1>Assessment Result</h1>
            <p>
              {classInfo.class_name} - Section {classInfo.section_name} |{" "}
              {classInfo.subject_name}
            </p>
          </div>
          <div className="hero-actions">
            <span className="teacher-hero-badge">
              {assessment.total_marks} marks
            </span>
            <button
              onClick={() =>
                navigate("/view-assessments", { state: { classInfo } })
              }
            >
              Assessments
            </button>
          </div>
        </section>

        <section className="admin-list-panel">
          <div className="admin-section-header">
            <h2>{assessment.assessment_title}</h2>
            <p>{assessment.assessment_type}</p>
          </div>
        </section>

        <section className="admin-table-panel">
          {results.length === 0 ? (
            <p className="empty-panel-text">No marks have been entered yet.</p>
          ) : (
            <div className="admin-table-wrap">
              <table className="admin-table compact-admin-table">
                <thead>
                  <tr>
                    <th>Admission No</th>
                    <th>Student Name</th>
                    <th>Obtained Marks</th>
                    <th>Percentage</th>
                  </tr>
                </thead>

                <tbody>
                  {results.map((r) => (
                    <tr key={r.mark_id}>
                      <td>{r.admission_no}</td>
                      <td>{r.name}</td>
                      <td>{r.obtained_marks}</td>
                      <td>{getPercentage(r.obtained_marks)}%</td>
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

export default ViewAssessmentResult;
