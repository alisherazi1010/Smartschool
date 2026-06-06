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

function ManageAssignments() {
  const [assignments, setAssignments] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [savingId, setSavingId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const loadData = () => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/teacher-assignments`)
      .then((res) => setAssignments(res.data))
      .catch((err) => console.log(err));

    axios
      .get(`${import.meta.env.VITE_API_URL}/teachers`)
      .then((res) => setTeachers(res.data))
      .catch((err) => console.log(err));

    axios
      .get(`${import.meta.env.VITE_API_URL}/subjects`)
      .then((res) => setSubjects(res.data))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    const role = localStorage.getItem("role");

    if (role !== "admin") {
      alert("Only admin can access this page");
      navigate("/");
      return;
    }

    loadData();
  }, [navigate]);

  const goTo = (path) => {
    setSidebarOpen(false);
    navigate(path);
  };

  const handleChange = (assignmentId, field, value) => {
    setAssignments((current) =>
      current.map((assignment) =>
        assignment.assignment_id === assignmentId
          ? { ...assignment, [field]: value }
          : assignment
      )
    );
  };

  const handleSave = async (assignment) => {
    setSavingId(assignment.assignment_id);

    try {
      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/teacher-assignments/${assignment.assignment_id}`,
        {
          teacher_id: assignment.teacher_id,
          class_id: assignment.class_id,
          section_id: assignment.section_id,
          subject_id: assignment.subject_id,
        }
      );

      alert(res.data.message);
      loadData();
    } catch (err) {
      alert("Error updating assignment");
      console.log(err);
    } finally {
      setSavingId(null);
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
            <h1>Manage Assignments</h1>
            <p>Change teacher, class, section, or subject assignments.</p>
          </div>
          <span className="admin-hero-badge">{assignments.length} total</span>
        </section>

        <section className="admin-table-panel">
          <div className="admin-table-wrap">
            <table className="admin-table manage-assignment-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Teacher</th>
                  <th>Class</th>
                  <th>Section</th>
                  <th>Subject</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {assignments.map((assignment) => (
                  <tr key={assignment.assignment_id}>
                    <td>{assignment.assignment_id}</td>
                    <td>
                      <select
                        className="assignment-select"
                        value={assignment.teacher_id}
                        onChange={(e) =>
                          handleChange(
                            assignment.assignment_id,
                            "teacher_id",
                            e.target.value
                          )
                        }
                      >
                        {teachers.map((teacher) => (
                          <option
                            key={teacher.teacher_id}
                            value={teacher.teacher_id}
                          >
                            {teacher.name}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <select
                        className="assignment-select"
                        value={assignment.class_id}
                        onChange={(e) =>
                          handleChange(
                            assignment.assignment_id,
                            "class_id",
                            e.target.value
                          )
                        }
                      >
                        {classOptions.map((classItem) => (
                          <option key={classItem.id} value={classItem.id}>
                            {classItem.name}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <select
                        className="assignment-select"
                        value={assignment.section_id}
                        onChange={(e) =>
                          handleChange(
                            assignment.assignment_id,
                            "section_id",
                            e.target.value
                          )
                        }
                      >
                        {sectionOptions.map((section) => (
                          <option key={section.id} value={section.id}>
                            {section.name}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <select
                        className="assignment-select"
                        value={assignment.subject_id}
                        onChange={(e) =>
                          handleChange(
                            assignment.assignment_id,
                            "subject_id",
                            e.target.value
                          )
                        }
                      >
                        {subjects.map((subject) => (
                          <option
                            key={subject.subject_id}
                            value={subject.subject_id}
                          >
                            {subject.subject_name}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <div className="table-actions">
                        <button
                          onClick={() => handleSave(assignment)}
                          disabled={savingId === assignment.assignment_id}
                        >
                          {savingId === assignment.assignment_id
                            ? "Saving"
                            : "Save"}
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

export default ManageAssignments;
