import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

function ViewAssessments() {
  const navigate = useNavigate();
  const location = useLocation();
  const classInfo = location.state.classInfo;

  const [assessments, setAssessments] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/assessments/${classInfo.assignment_id}`)
      .then((res) => setAssessments(res.data))
      .catch((err) => console.log(err));
  }, [classInfo]);

  const goTo = (path) => {
    setSidebarOpen(false);
    navigate(path);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this assessment?")) {
      return;
    }

    try {
      const res = await axios.delete(
        `${import.meta.env.VITE_API_URL}/assessments/${id}`
      );
      alert(res.data.message);

      setAssessments(assessments.filter((a) => a.assessment_id !== id));
    } catch (err) {
      alert("Error deleting assessment");
      console.log(err);
    }
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
            <h1>Assessments</h1>
            <p>
              {classInfo.class_name} - Section {classInfo.section_name} |{" "}
              {classInfo.subject_name}
            </p>
          </div>
          <div className="hero-actions">
            <span className="teacher-hero-badge">{assessments.length} total</span>
            <button onClick={() => navigate("/teacher-classes")}>Classes</button>
          </div>
        </section>

        <section className="admin-table-panel">
          <div className="admin-table-wrap">
            <table className="admin-table assessment-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Type</th>
                  <th>Total Marks</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {assessments.map((a) => (
                  <tr key={a.assessment_id}>
                    <td>{a.assessment_title}</td>
                    <td>{a.assessment_type}</td>
                    <td>{a.total_marks}</td>
                    <td>{a.assessment_date?.split("T")[0]}</td>
                    <td>
                      <div className="table-actions">
                        <button
                          onClick={() =>
                            navigate("/enter-marks", {
                              state: { classInfo: classInfo, assessment: a },
                            })
                          }
                        >
                          Enter Marks
                        </button>

                        <button
                          onClick={() =>
                            navigate("/assessment-result", {
                              state: { classInfo: classInfo, assessment: a },
                            })
                          }
                        >
                          View Result
                        </button>

                        <button
                          onClick={() =>
                            navigate("/edit-assessment", {
                              state: { classInfo, assessment: a },
                            })
                          }
                        >
                          Edit
                        </button>

                        <button
                          className="danger-table-btn"
                          onClick={() => handleDelete(a.assessment_id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}

export default ViewAssessments;
