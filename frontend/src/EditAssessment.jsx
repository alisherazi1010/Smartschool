import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

function EditAssessment() {
  const navigate = useNavigate();
  const location = useLocation();

  const { classInfo, assessment } = location.state;
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [formData, setFormData] = useState({
    assessment_title: assessment.assessment_title,
    assessment_type: assessment.assessment_type,
    total_marks: assessment.total_marks,
    assessment_date: assessment.assessment_date?.split("T")[0],
  });

  const goTo = (path) => {
    setSidebarOpen(false);
    navigate(path);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async () => {
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/assessments/${assessment.assessment_id}`,
        formData
      );

      alert(res.data.message);
      navigate("/view-assessments", { state: { classInfo } });
    } catch (err) {
      alert("Error updating assessment");
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
            <h1>Edit Assessment</h1>
            <p>
              {classInfo.class_name} - Section {classInfo.section_name} |{" "}
              {classInfo.subject_name}
            </p>
          </div>
          <div className="hero-actions">
            <button
              onClick={() =>
                navigate("/view-assessments", { state: { classInfo } })
              }
            >
              Assessments
            </button>
          </div>
        </section>

        <section className="admin-form-panel">
          <div className="admin-section-header">
            <h2>Assessment Details</h2>
            <p>Update title, type, marks, or date.</p>
          </div>

          <div className="admin-form-grid">
            <label>
              Assessment Title
              <input
                name="assessment_title"
                value={formData.assessment_title}
                onChange={handleChange}
              />
            </label>

            <label>
              Type
              <select
                name="assessment_type"
                value={formData.assessment_type}
                onChange={handleChange}
              >
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
                value={formData.total_marks}
                onChange={handleChange}
              />
            </label>

            <label>
              Assessment Date
              <input
                name="assessment_date"
                type="date"
                value={formData.assessment_date}
                onChange={handleChange}
              />
            </label>
          </div>

          <div className="form-actions">
            <button onClick={handleUpdate}>Update Assessment</button>
          </div>
        </section>
      </main>
    </div>
  );
}

export default EditAssessment;
