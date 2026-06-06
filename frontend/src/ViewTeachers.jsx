import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function ViewTeachers() {
  const [teachers, setTeachers] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [searchEmail, setSearchEmail] = useState("");
  const [searchQualification, setSearchQualification] = useState("");
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
      .get(`${import.meta.env.VITE_API_URL}/teachers`)
      .then((res) => setTeachers(res.data))
      .catch((err) => console.log(err));
  }, [navigate]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this teacher?")) {
      return;
    }

    try {
      const res = await axios.delete(
        `${import.meta.env.VITE_API_URL}/teachers/${id}`
      );
      alert(res.data.message);

      setTeachers(teachers.filter((t) => t.teacher_id !== id));
    } catch (err) {
      alert("Error deleting teacher");
      console.log(err);
    }
  };

  const goTo = (path) => {
    setSidebarOpen(false);
    navigate(path);
  };

  const filteredTeachers = teachers.filter((teacher) => {
    return (
      teacher.name.toLowerCase().includes(searchName.toLowerCase()) &&
      teacher.email.toLowerCase().includes(searchEmail.toLowerCase()) &&
      teacher.qualification
        .toLowerCase()
        .includes(searchQualification.toLowerCase())
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
            <h1>View Teachers</h1>
            <p>Review teacher records, qualifications, and contact details.</p>
          </div>
          <div className="hero-actions">
            <span className="admin-hero-badge">
              {filteredTeachers.length} shown
            </span>
            <button onClick={() => navigate("/admin")}>Dashboard</button>
          </div>
        </section>

        <section className="admin-list-panel">
          <div className="admin-section-header">
            <h2>Search Teachers</h2>
            <p>Filter records by name, email, or qualification.</p>
          </div>

          <div className="admin-filter-grid teacher-filter-grid">
            <input
              type="text"
              placeholder="Search Name"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
            />

            <input
              type="text"
              placeholder="Search Email"
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
            />

            <input
              type="text"
              placeholder="Qualification"
              value={searchQualification}
              onChange={(e) => setSearchQualification(e.target.value)}
            />
          </div>
        </section>

        <section className="admin-table-panel">
          <div className="admin-table-wrap">
            <table className="admin-table teacher-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Qualification</th>
                  <th>Phone</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredTeachers.map((t) => (
                  <tr key={t.teacher_id}>
                    <td>{t.teacher_id}</td>
                    <td>{t.name}</td>
                    <td>{t.email}</td>
                    <td>{t.qualification}</td>
                    <td>{t.phone}</td>
                    <td>
                      <div className="table-actions">
                        <button
                          onClick={() =>
                            navigate("/edit-teacher", { state: { teacher: t } })
                          }
                        >
                          Edit
                        </button>

                        <button
                          className="danger-table-btn"
                          onClick={() => handleDelete(t.teacher_id)}
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

export default ViewTeachers;
