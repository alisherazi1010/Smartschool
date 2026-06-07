import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

function CreateAssessment() {
  const navigate = useNavigate();
  const location = useLocation();
  const classInfo = location.state.classInfo;
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [assessment, setAssessment] = useState({
    assessment_title: "",
    assessment_type: "",
    total_marks: "",
    assessment_date: "",
  });

  const goTo = (path) => {
    setSidebarOpen(false);
    navigate(path);
  };

  const handleChange = (e) => {
    setAssessment({
      ...assessment,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    if (
      !assessment.assessment_title ||
      !assessment.assessment_type ||
      !assessment.total_marks ||
      !assessment.assessment_date
    ) {
      alert("Please fill all fields");
      return;
    }

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/assessments`, {
        assignment_id: classInfo.assignment_id,
        ...assessment,
      });

      alert(res.data.message);
      navigate("/teacher-classes");
    } catch (err) {
      alert("Error creating assessment");
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
            <h1>Create Assessment</h1>
            <p>
              {classInfo.class_name} - Section {classInfo.section_name} |{" "}
              {classInfo.subject_name}
            </p>
          </div>
          <div className="hero-actions">
            <button onClick={() => navigate("/teacher-classes")}>Classes</button>
          </div>
        </section>

        <section className="admin-form-panel">
          <div className="admin-section-header">
            <h2>Assessment Details</h2>
            <p>Create a test, assignment, term exam, or other assessment.</p>
          </div>

          <div className="admin-form-grid">
            <label>
              Assessment Title
              <input
                name="assessment_title"
                placeholder="Assessment Title"
                value={assessment.assessment_title}
                onChange={handleChange}
              />
            </label>

            <label>
              Type
              <select
                name="assessment_type"
                value={assessment.assessment_type}
                onChange={handleChange}
              >
                <option value="">Select Type</option>
                <option value="Test">Test</option>
                <option value="Assignment">Assignment</option>
                <option value="Quiz">Quiz</option>
                <option value="Project">Project</option>
                <option value="Presentation">Presentation</option>
                <option value="Mid Term">Mid Term</option>
                <option value="Final Term">Final Term</option>
              </select>
            </label>

            <label>
              Total Marks
              <input
                name="total_marks"
                type="number"
                placeholder="Total Marks"
                value={assessment.total_marks}
                onChange={handleChange}
              />
            </label>

            <label>
              Assessment Date
              <input
                name="assessment_date"
                type="date"
                value={assessment.assessment_date}
                onChange={handleChange}
              />
            </label>
          </div>

          <div className="form-actions">
            <button onClick={handleSubmit}>Create Assessment</button>
          </div>
        </section>
      </main>
    </div>
  );
}

export default CreateAssessment;
