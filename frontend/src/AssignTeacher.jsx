import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const classOptions = [
  { id: "1", name: "Nursery" },
  { id: "2", name: "KG" },
  { id: "3", name: "Prep" },
  { id: "4", name: "Class 1" },
  { id: "5", name: "Class 2" },
  { id: "6", name: "Class 3" },
  { id: "7", name: "Class 4" },
  { id: "8", name: "Class 5" },
  { id: "9", name: "Class 6" },
  { id: "10", name: "Class 7" },
  { id: "11", name: "Class 8" },
  { id: "12", name: "Class 9" },
  { id: "13", name: "Class 10" },
];

const sectionOptions = [
  { id: "1", name: "A" },
  { id: "2", name: "B" },
  { id: "3", name: "C" },
];

function AssignTeacher() {
  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [assignments, setAssignments] = useState([]);
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

    axios
      .get(`${import.meta.env.VITE_API_URL}/teacher-assignments`)
      .then((res) => setAssignments(res.data))
      .catch((err) => console.log(err));
  }, [navigate]);

  const goTo = (path) => {
    setSidebarOpen(false);
    navigate(path);
  };

  const handleChange = (e) => {
    if (e.target.name === "class_id") {
      setAssignment({
        ...assignment,
        class_id: e.target.value,
        section_id: "",
        subject_id: "",
      });
      return;
    }

    if (e.target.name === "section_id") {
      setAssignment({
        ...assignment,
        section_id: e.target.value,
        subject_id: "",
      });
      return;
    }

    setAssignment({
      ...assignment,
      [e.target.name]: e.target.value,
    });
  };

  const isSubjectAssigned = (classId, sectionId, subjectId) => {
    return assignments.some(
      (item) =>
        String(item.class_id) === String(classId) &&
        String(item.section_id) === String(sectionId) &&
        String(item.subject_id) === String(subjectId)
    );
  };

  const hasAvailableSubject = (classId, sectionId) => {
    return subjects.some(
      (subject) => !isSubjectAssigned(classId, sectionId, subject.subject_id)
    );
  };

  const availableClasses = classOptions.filter((classItem) =>
    sectionOptions.some((section) => hasAvailableSubject(classItem.id, section.id))
  );

  const availableSections = assignment.class_id
    ? sectionOptions.filter((section) =>
        hasAvailableSubject(assignment.class_id, section.id)
      )
    : [];

  const availableSubjects =
    assignment.class_id && assignment.section_id
      ? subjects.filter(
          (subject) =>
            !isSubjectAssigned(
              assignment.class_id,
              assignment.section_id,
              subject.subject_id
            )
        )
      : [];

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
      setAssignments((current) => [
        ...current,
        {
          teacher_id: assignment.teacher_id,
          class_id: assignment.class_id,
          section_id: assignment.section_id,
          subject_id: assignment.subject_id,
        },
      ]);
      setAssignment({
        teacher_id: "",
        class_id: "",
        section_id: "",
        subject_id: "",
      });
    } catch (err) {
      alert(err.response?.data?.message || "Error assigning teacher");
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
                {availableClasses.map((classItem) => (
                  <option key={classItem.id} value={classItem.id}>
                    {classItem.name}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Section
              <select
                name="section_id"
                value={assignment.section_id}
                onChange={handleChange}
                disabled={!assignment.class_id}
              >
                <option value="">Select Section</option>
                {availableSections.map((section) => (
                  <option key={section.id} value={section.id}>
                    {section.name}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Subject
              <select
                name="subject_id"
                value={assignment.subject_id}
                onChange={handleChange}
                disabled={!assignment.class_id || !assignment.section_id}
              >
                <option value="">Select Subject</option>
                {availableSubjects.map((s) => (
                  <option key={s.subject_id} value={s.subject_id}>
                    {s.subject_name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {availableClasses.length === 0 && (
            <p className="empty-panel-text">
              All class, section, and subject combinations are already assigned.
            </p>
          )}

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
