import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function AssignTeacher() {
  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const [assignment, setAssignment] = useState({
    teacher_id: "",
    class_id: "",
    section_id: "",
    subject_id: "",
  });

  useEffect(() => {
    const role = localStorage.getItem("role");

    if (role !== "admin") {
      alert("Only admin can access this page");
      navigate("/");
      return;
    }

    axios
      .get(`${import.meta.env.VITE_API_URL}/teachers`)
      .then((res) => setTeachers(res.data))
      .catch((err) => console.log(err));

    axios
      .get(`${import.meta.env.VITE_API_URL}/subjects`)
      .then((res) => setSubjects(res.data))
      .catch((err) => console.log(err));
  }, [navigate]);

  const goTo = (path) => {
    setSidebarOpen(false);
    navigate(path);
  };

  const handleChange = (e) => {
    setAssignment({
      ...assignment,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    if (
      !assignment.teacher_id ||
      !assignment.class_id ||
      !assignment.section_id ||
      !assignment.subject_id
    ) {
      alert("Please select teacher, class, section, and subject");
      return;
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/teacher-assignments`,
        assignment
      );

      alert(res.data.message);
      setAssignment({
        teacher_id: "",
        class_id: "",
        section_id: "",
        subject_id: "",
      });
    } catch (err) {
      alert("Error assigning teacher");
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
        <button onClick={() => goTo("/admin")}>Dashboard</button>
        <button onClick={() => goTo("/view-students")}>Students</button>
        <button onClick={() => goTo("/view-teachers")}>Teachers</button>
        <button onClick={() => goTo("/view-subjects")}>Subjects</button>
        <button onClick={() => goTo("/view-assignments")}>Assignments</button>

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
        <section className="admin-hero">
          <div>
            <h1>Assign Teacher</h1>
            <p>Assign a teacher to a class, section, and subject.</p>
          </div>
          <div className="hero-actions">
            <button onClick={() => navigate("/admin")}>Dashboard</button>
          </div>
        </section>

        <section className="admin-form-panel">
          <div className="admin-section-header">
            <h2>Assignment Details</h2>
            <p>Choose each field before creating the assignment.</p>
          </div>

          <div className="admin-form-grid">
            <label>
              Teacher
              <select
                name="teacher_id"
                value={assignment.teacher_id}
                onChange={handleChange}
              >
                <option value="">Select Teacher</option>
                {teachers.map((t) => (
                  <option key={t.teacher_id} value={t.teacher_id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Class
              <select
                name="class_id"
                value={assignment.class_id}
                onChange={handleChange}
              >
                <option value="">Select Class</option>
                <option value="1">Nursery</option>
                <option value="2">KG</option>
                <option value="3">Prep</option>
                <option value="4">Class 1</option>
                <option value="5">Class 2</option>
                <option value="6">Class 3</option>
                <option value="7">Class 4</option>
                <option value="8">Class 5</option>
                <option value="9">Class 6</option>
                <option value="10">Class 7</option>
                <option value="11">Class 8</option>
                <option value="12">Class 9</option>
                <option value="13">Class 10</option>
              </select>
            </label>

            <label>
              Section
              <select
                name="section_id"
                value={assignment.section_id}
                onChange={handleChange}
              >
                <option value="">Select Section</option>
                <option value="1">A</option>
                <option value="2">B</option>
                <option value="3">C</option>
              </select>
            </label>

            <label>
              Subject
              <select
                name="subject_id"
                value={assignment.subject_id}
                onChange={handleChange}
              >
                <option value="">Select Subject</option>
                {subjects.map((s) => (
                  <option key={s.subject_id} value={s.subject_id}>
                    {s.subject_name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="form-actions">
            <button onClick={handleSubmit}>Assign Teacher</button>
            <button
              className="secondary-form-btn"
              onClick={() => navigate("/manage-assignments")}
            >
              Manage Assignments
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

export default AssignTeacher;
