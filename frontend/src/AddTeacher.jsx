import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function AddTeacher() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [teacher, setTeacher] = useState({
    name: "",
    email: "",
    password: "",
    qualification: "",
    phone: "",
  });

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

  const handleChange = (e) => {
    setTeacher({
      ...teacher,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    if (
      !teacher.name ||
      !teacher.email ||
      !teacher.password ||
      !teacher.qualification ||
      !teacher.phone
    ) {
      alert("Please fill all fields");
      return;
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/teachers`,
        teacher
      );
      alert(res.data.message);

      setTeacher({
        name: "",
        email: "",
        password: "",
        qualification: "",
        phone: "",
      });
    } catch (err) {
      alert("Error adding teacher");
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
            <h1>Add Teacher</h1>
            <p>Create a teacher account and profile information.</p>
          </div>
          <div className="hero-actions">
            <button onClick={() => navigate("/admin")}>Dashboard</button>
          </div>
        </section>

        <section className="admin-form-panel">
          <div className="admin-section-header">
            <h2>Teacher Details</h2>
            <p>All fields are required to create a teacher record.</p>
          </div>

          <div className="admin-form-grid">
            <label>
              Teacher Name
              <input
                name="name"
                placeholder="Teacher Name"
                value={teacher.name}
                onChange={handleChange}
              />
            </label>

            <label>
              Email
              <input
                name="email"
                placeholder="Email"
                value={teacher.email}
                onChange={handleChange}
              />
            </label>

            <label>
              Password
              <input
                name="password"
                type="password"
                placeholder="Password"
                value={teacher.password}
                onChange={handleChange}
              />
            </label>

            <label>
              Qualification
              <input
                name="qualification"
                placeholder="Qualification"
                value={teacher.qualification}
                onChange={handleChange}
              />
            </label>

            <label>
              Phone
              <input
                name="phone"
                placeholder="Phone"
                value={teacher.phone}
                onChange={handleChange}
              />
            </label>
          </div>

          <div className="form-actions">
            <button onClick={handleSubmit}>Add Teacher</button>
          </div>
        </section>
      </main>
    </div>
  );
}

export default AddTeacher;
