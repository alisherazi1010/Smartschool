import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function ViewSubjects() {
  const [subjects, setSubjects] = useState([]);
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
      .get(`${import.meta.env.VITE_API_URL}/subjects`)
      .then((res) => setSubjects(res.data))
      .catch((err) => console.log(err));
  }, [navigate]);

  const goTo = (path) => {
    setSidebarOpen(false);
    navigate(path);
  };

  const filteredSubjects = subjects.filter((subject) =>
    subject.subject_name.toLowerCase().includes(searchSubject.toLowerCase())
  );

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
            <h1>View Subjects</h1>
            <p>Review the subjects available across the school.</p>
          </div>
          <div className="hero-actions">
            <span className="admin-hero-badge">
              {filteredSubjects.length} shown
            </span>
            <button onClick={() => navigate("/admin")}>Dashboard</button>
          </div>
        </section>

        <section className="admin-list-panel">
          <div className="admin-section-header">
            <h2>Search Subjects</h2>
            <p>Filter subject records by subject name.</p>
          </div>

          <div className="admin-filter-grid single-filter-grid">
            <input
              type="text"
              placeholder="Search Subject"
              value={searchSubject}
              onChange={(e) => setSearchSubject(e.target.value)}
            />
          </div>
        </section>

        <section className="admin-table-panel">
          <div className="admin-table-wrap">
            <table className="admin-table compact-admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Subject Name</th>
                </tr>
              </thead>

              <tbody>
                {filteredSubjects.map((s) => (
                  <tr key={s.subject_id}>
                    <td>{s.subject_id}</td>
                    <td>{s.subject_name}</td>
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

export default ViewSubjects;
