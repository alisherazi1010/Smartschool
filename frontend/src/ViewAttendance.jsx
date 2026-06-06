import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

function ViewAttendance() {
  const navigate = useNavigate();
  const location = useLocation();
  const classInfo = location.state.classInfo;

  const currentDate = new Date();

  const [month, setMonth] = useState(currentDate.getMonth() + 1);
  const [year, setYear] = useState(currentDate.getFullYear());
  const [students, setStudents] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const days = [
    ...new Set(
      students.flatMap((student) =>
        Object.keys(student.attendance).map((day) => Number(day))
      )
    ),
  ].sort((a, b) => a - b);

  const formatAttendanceDate = (day) => {
    const date = new Date(Number(year), Number(month) - 1, day);

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
    });
  };

  const loadAttendance = () => {
    axios
      .get(
        `${import.meta.env.VITE_API_URL}/attendance-month/${classInfo.assignment_id}/${year}/${month}`
      )
      .then((res) => {
        const grouped = {};

        res.data.forEach((row) => {
          if (!grouped[row.student_id]) {
            grouped[row.student_id] = {
              student_id: row.student_id,
              admission_no: row.admission_no,
              name: row.name,
              attendance: {},
              total_present: row.total_present || 0,
              total_absent: row.total_absent || 0,
              total_late: row.total_late || 0,
            };
          }

          if (row.day) {
            grouped[row.student_id].attendance[row.day] = row.status;
          }
        });

        setStudents(Object.values(grouped));
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    loadAttendance();
  }, []);

  const goTo = (path) => {
    setSidebarOpen(false);
    navigate(path);
  };

  const updateAttendanceCell = async (studentId, day, status) => {
    const attendanceDate = `${year}-${String(month).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`;

    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/attendance-cell`, {
        student_id: studentId,
        assignment_id: classInfo.assignment_id,
        attendance_date: attendanceDate,
        status,
      });

      loadAttendance();
    } catch (err) {
      alert("Error updating attendance");
      console.log(err);
    }
  };

  const calculatePercentage = (student) => {
    const total =
      student.total_present + student.total_absent + student.total_late;

    if (total === 0) return "0%";

    return Math.round((student.total_present / total) * 100) + "%";
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
            <h1>Monthly Attendance</h1>
            <p>
              {classInfo.class_name} - Section {classInfo.section_name} |{" "}
              {classInfo.subject_name}
            </p>
          </div>
          <div className="hero-actions">
            <button onClick={() => navigate("/teacher-classes")}>Classes</button>
          </div>
        </section>

        <section className="admin-form-panel">
          <div className="admin-section-header">
            <h2>Attendance Period</h2>
            <p>Choose a month and year to load attendance records.</p>
          </div>

          <div className="admin-form-grid teacher-period-grid">
            <label>
              Month
              <select value={month} onChange={(e) => setMonth(e.target.value)}>
                <option value="1">January</option>
                <option value="2">February</option>
                <option value="3">March</option>
                <option value="4">April</option>
                <option value="5">May</option>
                <option value="6">June</option>
                <option value="7">July</option>
                <option value="8">August</option>
                <option value="9">September</option>
                <option value="10">October</option>
                <option value="11">November</option>
                <option value="12">December</option>
              </select>
            </label>

            <label>
              Year
              <input
                type="number"
                value={year}
                onChange={(e) => setYear(e.target.value)}
              />
            </label>
          </div>

          <div className="form-actions">
            <button onClick={loadAttendance}>Load Attendance</button>
          </div>
        </section>

        <section className="admin-table-panel">
          <div className="admin-table-wrap">
            <table className="admin-table attendance-month-table">
              <thead>
                <tr>
                  <th>Admission No</th>
                  <th>Student Name</th>

                  {days.map((day) => (
                    <th key={day}>{formatAttendanceDate(day)}</th>
                  ))}

                  <th>Total Present</th>
                  <th>Total Absent</th>
                  <th>Total Late</th>
                  <th>Percentage</th>
                </tr>
              </thead>

              <tbody>
                {students.map((student) => (
                  <tr key={student.student_id}>
                    <td>{student.admission_no}</td>
                    <td>{student.name}</td>

                    {days.map((day) => (
                      <td key={day}>
                        <select
                          className="attendance-cell-select"
                          value={student.attendance[day] || ""}
                          onChange={(e) =>
                            updateAttendanceCell(
                              student.student_id,
                              day,
                              e.target.value
                            )
                          }
                        >
                          <option value="">-</option>
                          <option value="Present">P</option>
                          <option value="Absent">A</option>
                          <option value="Late">L</option>
                        </select>
                      </td>
                    ))}

                    <td>{student.total_present}</td>
                    <td>{student.total_absent}</td>
                    <td>{student.total_late}</td>
                    <td>{calculatePercentage(student)}</td>
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

export default ViewAttendance;
