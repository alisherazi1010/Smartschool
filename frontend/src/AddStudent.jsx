import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function AddStudent() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [student, setStudent] = useState({
    name: "",
    email: "",
    password: "",
    admission_no: "",
    admission_date: "",
    class_id: "",
    section_id: "",
    guardian_name: "",
    guardian_phone: "",
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
    setStudent({
      ...student,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    if (
      !student.name ||
      !student.email ||
      !student.password ||
      !student.admission_no ||
      !student.class_id ||
      !student.section_id
    ) {
      alert("Please fill all required fields");
      return;
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/students`,
        student
      );
      alert(res.data.message);

      setStudent({
        name: "",
        email: "",
        password: "",
        admission_no: "",
        admission_date: "",
        class_id: "",
        section_id: "",
        guardian_name: "",
        guardian_phone: "",
      });
    } catch (err) {
      alert("Error adding student");
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
            <h1>Add Student</h1>
            <p>Create a student account with class and guardian details.</p>
          </div>
          <div className="hero-actions">
            <button onClick={() => navigate("/admin")}>Dashboard</button>
          </div>
        </section>

        <section className="admin-form-panel">
          <div className="admin-section-header">
            <h2>Student Details</h2>
            <p>Name, email, password, admission number, class, and section are required.</p>
          </div>

          <div className="admin-form-grid">
            <label>
              Student Name
              <input
                name="name"
                placeholder="Student Name"
                value={student.name}
                onChange={handleChange}
              />
            </label>

            <label>
              Email
              <input
                name="email"
                placeholder="Email"
                value={student.email}
                onChange={handleChange}
              />
            </label>

            <label>
              Password
              <input
                name="password"
                type="password"
                placeholder="Password"
                value={student.password}
                onChange={handleChange}
              />
            </label>

            <label>
              Admission No
              <input
                name="admission_no"
                placeholder="Admission No"
                value={student.admission_no}
                onChange={handleChange}
              />
            </label>

            <label>
              Admission Date
              <input
                name="admission_date"
                type="date"
                value={student.admission_date}
                onChange={handleChange}
              />
            </label>

            <label>
              Class
              <select
                name="class_id"
                value={student.class_id}
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
                value={student.section_id}
                onChange={handleChange}
              >
                <option value="">Select Section</option>
                <option value="1">A</option>
                <option value="2">B</option>
                <option value="3">C</option>
              </select>
            </label>

            <label>
              Guardian Name
              <input
                name="guardian_name"
                placeholder="Guardian Name"
                value={student.guardian_name}
                onChange={handleChange}
              />
            </label>

            <label>
              Guardian Phone
              <input
                name="guardian_phone"
                placeholder="Guardian Phone"
                value={student.guardian_phone}
                onChange={handleChange}
              />
            </label>
          </div>

          <div className="form-actions">
            <button onClick={handleSubmit}>Add Student</button>
          </div>
        </section>
      </main>
    </div>
  );
}

export default AddStudent;
