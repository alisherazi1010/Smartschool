import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

function MarkAttendance() {
  const navigate = useNavigate();
  const location = useLocation();
  const classInfo = location.state.classInfo;

  const [students, setStudents] = useState([]);
  const [attendanceDate, setAttendanceDate] = useState("");
  const [attendance, setAttendance] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    axios
      .get(
        `${import.meta.env.VITE_API_URL}/students-by-class-section/${classInfo.class_id}/${classInfo.section_id}`
      )
      .then((res) => {
        setStudents(res.data);

        const initialAttendance = {};
        res.data.forEach((student) => {
          initialAttendance[student.student_id] = "Present";
        });

        setAttendance(initialAttendance);
      })
      .catch((err) => console.log(err));
  }, [classInfo]);

  const goTo = (path) => {
    setSidebarOpen(false);
    navigate(path);
  };

  const handleStatusChange = (studentId, status) => {
    setAttendance({
      ...attendance,
      [studentId]: status,
    });
  };

  const handleSubmit = async () => {
    if (!attendanceDate) {
      alert("Please select attendance date");
      return;
    }

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/attendance`, {
        assignment_id: classInfo.assignment_id,
        attendance_date: attendanceDate,
        attendance,
      });

      alert(res.data.message);
    } catch (err) {
      alert("Error saving attendance");
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
        <button onClick={() => goTo("/teacher")}>Dashboard</button>
        <button onClick={() => goTo("/teacher-profile")}>My Profile</button>
        <button onClick={() => goTo("/teacher-classes")}>My Classes</button>

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
        <section className="teacher-hero">
          <div>
            <h1>Mark Attendance</h1>
            <p>
              {classInfo.class_name} - Section {classInfo.section_name} |{" "}
              {classInfo.subject_name}
            </p>
          </div>
          <div className="hero-actions">
            <button onClick={() => navigate("/teacher-classes")}>Classes</button>
          </div>
        </section>

        <section className="admin-form-panel compact-form-panel">
          <div className="admin-section-header">
            <h2>Attendance Date</h2>
            <p>Select the date before saving attendance.</p>
          </div>

          <div className="admin-form-grid single-filter-grid">
            <label>
              Date
              <input
                type="date"
                value={attendanceDate}
                onChange={(e) => setAttendanceDate(e.target.value)}
              />
            </label>
          </div>
        </section>

        <section className="admin-table-panel">
          <div className="admin-table-wrap">
            <table className="admin-table compact-admin-table">
              <thead>
                <tr>
                  <th>Admission No</th>
                  <th>Name</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {students.map((s) => (
                  <tr key={s.student_id}>
                    <td>{s.admission_no}</td>
                    <td>{s.name}</td>
                    <td>
                      <select
                        className="assignment-select"
                        value={attendance[s.student_id] || "Present"}
                        onChange={(e) =>
                          handleStatusChange(s.student_id, e.target.value)
                        }
                      >
                        <option value="Present">Present</option>
                        <option value="Absent">Absent</option>
                        <option value="Late">Late</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="form-actions">
            <button onClick={handleSubmit}>Submit Attendance</button>
          </div>
        </section>
      </main>
    </div>
  );
}

export default MarkAttendance;
