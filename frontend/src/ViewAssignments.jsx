import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function ViewAssignments() {
  const [assignments, setAssignments] = useState([]);
  const [searchTeacher, setSearchTeacher] = useState("");
  const [searchClass, setSearchClass] = useState("");
  const [searchSection, setSearchSection] = useState("");
  const [searchSubject, setSearchSubject] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem("role");

    if (role !== "admin") {
      alert("Only admin can access this page");
      navigate("/");
      return;
    }

    axios
      .get(`${import.meta.env.VITE_API_URL}/teacher-assignments`)
      .then((res) => setAssignments(res.data))
      .catch((err) => console.log(err));
  }, [navigate]);

  const goTo = (path) => {
    setSidebarOpen(false);
    navigate(path);
  };

  const filteredAssignments = assignments.filter((assignment) => {
    return (
      assignment.teacher_name
        .toLowerCase()
        .includes(searchTeacher.toLowerCase()) &&
      assignment.class_name.toLowerCase().includes(searchClass.toLowerCase()) &&
      assignment.section_name
        .toLowerCase()
        .includes(searchSection.toLowerCase()) &&
      assignment.subject_name
        .toLowerCase()
        .includes(searchSubject.toLowerCase())
    );
  });

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
            <h1>Teacher Assignments</h1>
            <p>Review which teachers are assigned to classes and subjects.</p>
          </div>
          <div className="hero-actions">
            <span className="admin-hero-badge">
              {filteredAssignments.length} shown
            </span>
            <button onClick={() => navigate("/admin")}>Dashboard</button>
          </div>
        </section>

        <section className="admin-list-panel">
          <div className="admin-section-header">
            <h2>Search Assignments</h2>
            <p>Filter assignments by teacher, class, section, or subject.</p>
          </div>

          <div className="admin-filter-grid">
            <input
              type="text"
              placeholder="Teacher"
              value={searchTeacher}
              onChange={(e) => setSearchTeacher(e.target.value)}
            />

            <input
              type="text"
              placeholder="Class"
              value={searchClass}
              onChange={(e) => setSearchClass(e.target.value)}
            />

            <input
              type="text"
              placeholder="Section"
              value={searchSection}
              onChange={(e) => setSearchSection(e.target.value)}
            />

            <input
              type="text"
              placeholder="Subject"
              value={searchSubject}
              onChange={(e) => setSearchSubject(e.target.value)}
            />
          </div>
        </section>

        <section className="admin-table-panel">
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Teacher</th>
                  <th>Class</th>
                  <th>Section</th>
                  <th>Subject</th>
                </tr>
              </thead>

              <tbody>
                {filteredAssignments.map((a) => (
                  <tr key={a.assignment_id}>
                    <td>{a.assignment_id}</td>
                    <td>{a.teacher_name}</td>
                    <td>{a.class_name}</td>
                    <td>{a.section_name}</td>
                    <td>{a.subject_name}</td>
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

export default ViewAssignments;
