import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function ViewStudents() {
  const [students, setStudents] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [searchAdmission, setSearchAdmission] = useState("");
  const [searchClass, setSearchClass] = useState("");
  const [searchSection, setSearchSection] = useState("");
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
      .get(`${import.meta.env.VITE_API_URL}/students`)
      .then((res) => setStudents(res.data))
      .catch((err) => console.log(err));
  }, [navigate]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this student?")) {
      return;
    }

    try {
      const res = await axios.delete(
        `${import.meta.env.VITE_API_URL}/students/${id}`
      );
      alert(res.data.message);

      setStudents(students.filter((s) => s.student_id !== id));
    } catch (err) {
      alert("Error deleting student");
      console.log(err);
    }
  };

  const goTo = (path) => {
    setSidebarOpen(false);
    navigate(path);
  };

  const formatDate = (value) => {
    if (!value) return "-";
    return value.split("T")[0];
  };

  const filteredStudents = students.filter((student) => {
    return (
      student.name.toLowerCase().includes(searchName.toLowerCase()) &&
      student.admission_no
        .toLowerCase()
        .includes(searchAdmission.toLowerCase()) &&
      student.class_name.toLowerCase().includes(searchClass.toLowerCase()) &&
      student.section_name.toLowerCase().includes(searchSection.toLowerCase())
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
            <h1>View Students</h1>
            <p>Search, review, update, and open student profiles.</p>
          </div>
          <div className="hero-actions">
            <span className="admin-hero-badge">
              {filteredStudents.length} shown
            </span>
            <button onClick={() => navigate("/admin")}>Dashboard</button>
          </div>
        </section>

        <section className="admin-list-panel">
          <div className="admin-section-header">
            <h2>Search Students</h2>
            <p>Filter records by name, admission number, class, or section.</p>
          </div>

          <div className="admin-filter-grid">
            <input
              type="text"
              placeholder="Search Name"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
            />

            <input
              type="text"
              placeholder="Admission No"
              value={searchAdmission}
              onChange={(e) => setSearchAdmission(e.target.value)}
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
          </div>
        </section>

        <section className="admin-table-panel">
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Admission No</th>
                  <th>Admission Date</th>
                  <th>Class</th>
                  <th>Section</th>
                  <th>Guardian Name</th>
                  <th>Guardian Phone</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredStudents.map((s) => (
                  <tr key={s.student_id}>
                    <td>{s.student_id}</td>
                    <td>{s.name}</td>
                    <td>{s.email}</td>
                    <td>{s.admission_no}</td>
                    <td>{formatDate(s.admission_date)}</td>
                    <td>{s.class_name}</td>
                    <td>{s.section_name}</td>
                    <td>{s.guardian_name}</td>
                    <td>{s.guardian_phone}</td>
                    <td>
                      <div className="table-actions">
                        <button
                          onClick={() =>
                            navigate("/edit-student", { state: { student: s } })
                          }
                        >
                          Edit
                        </button>

                        <button
                          className="danger-table-btn"
                          onClick={() => handleDelete(s.student_id)}
                        >
                          Delete
                        </button>

                        <button
                          onClick={() =>
                            navigate("/admin-student-profile", {
                              state: { student: s },
                            })
                          }
                        >
                          Profile
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

export default ViewStudents;
