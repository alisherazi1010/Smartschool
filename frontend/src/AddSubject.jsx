import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function AddSubject() {
  const navigate = useNavigate();
  const [subjectName, setSubjectName] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem("role");

    if (role !== "admin") {
      alert("Only admin can access this page");
      navigate("/");
    }
  }, [navigate]);

  const goTo = (path) => {
    setSidebarOpen(false);
    navigate(path);
  };

  const handleSubmit = async () => {
    if (!subjectName.trim()) {
      alert("Enter subject name");
      return;
    }

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/subjects`, {
        subject_name: subjectName,
      });

      alert(res.data.message);
      setSubjectName("");
    } catch (err) {
      alert("Error adding subject");
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
            <h1>Add Subject</h1>
            <p>Create a new subject for classes and teacher assignments.</p>
          </div>
          <div className="hero-actions">
            <button onClick={() => navigate("/admin")}>Dashboard</button>
          </div>
        </section>

        <section className="admin-form-panel compact-form-panel">
          <div className="admin-section-header">
            <h2>Subject Details</h2>
            <p>Enter the subject name exactly as it should appear.</p>
          </div>

          <div className="admin-form-grid single-filter-grid">
            <label>
              Subject Name
              <input
                placeholder="Subject Name"
                value={subjectName}
                onChange={(e) => setSubjectName(e.target.value)}
              />
            </label>
          </div>

          <div className="form-actions">
            <button onClick={handleSubmit}>Add Subject</button>
          </div>
        </section>
      </main>
    </div>
  );
}

export default AddSubject;
