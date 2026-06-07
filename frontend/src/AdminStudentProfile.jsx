import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

function AdminStudentProfile() {
  const navigate = useNavigate();
  const location = useLocation();
  const student = location.state.student;

  const [attendance, setAttendance] = useState([]);
  const [results, setResults] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/student-attendance/${student.student_id}`)
      .then((res) => setAttendance(res.data))
      .catch((err) => console.log(err));

    axios
      .get(`${import.meta.env.VITE_API_URL}/student-results/${student.student_id}`)
      .then((res) => setResults(res.data))
      .catch((err) => console.log(err));
  }, [student.student_id]);

  const goTo = (path) => {
    setSidebarOpen(false);
    navigate(path);
  };

  const formatDate = (value) => {
    if (!value) return "-";
    return value.split("T")[0];
  };

  const getAttendancePercentage = (item) => {
    if (item.total_classes === 0) return "0%";
    return Math.round((item.present_count / item.total_classes) * 100) + "%";
  };

  const getResultPercentage = (obtained, total) => {
    return ((obtained / total) * 100).toFixed(2);
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
            <h1>Student Profile</h1>
            <p>Review student information, attendance, and results.</p>
          </div>
          <div className="hero-actions">
            <button onClick={() => navigate("/view-students")}>Students</button>
            <button onClick={() => navigate("/admin")}>Dashboard</button>
          </div>
        </section>

        <section className="profile-header-card admin-profile-header">
          <div className="profile-avatar">
            {student.name.charAt(0).toUpperCase()}
          </div>

          <div>
            <h1>{student.name}</h1>
            <p>
              {student.class_name} - Section {student.section_name}
            </p>
            <span>{student.admission_no}</span>
          </div>
        </section>

        <section className="profile-info-grid">
          <div className="profile-info-card">
            <h3>Email</h3>
            <p>{student.email}</p>
          </div>

          <div className="profile-info-card">
            <h3>Class</h3>
            <p>{student.class_name}</p>
          </div>

          <div className="profile-info-card">
            <h3>Section</h3>
            <p>{student.section_name}</p>
          </div>

          <div className="profile-info-card">
            <h3>Guardian</h3>
            <p>{student.guardian_name}</p>
          </div>

          <div className="profile-info-card">
            <h3>Guardian Phone</h3>
            <p>{student.guardian_phone}</p>
          </div>

          <div className="profile-info-card">
            <h3>Admission No</h3>
            <p>{student.admission_no}</p>
          </div>

          <div className="profile-info-card">
            <h3>Admission Date</h3>
            <p>{formatDate(student.admission_date)}</p>
          </div>
        </section>

        <section className="admin-table-panel">
          <div className="admin-section-header">
            <h2>Attendance Summary</h2>
            <p>Subject-wise attendance record for this student.</p>
          </div>

          {attendance.length === 0 ? (
            <p className="empty-panel-text">No attendance record found.</p>
          ) : (
            <div className="admin-table-wrap">
              <table className="admin-table compact-admin-table">
                <thead>
                  <tr>
                    <th>Subject</th>
                    <th>Present</th>
                    <th>Absent</th>
                    <th>Late</th>
                    <th>Total</th>
                    <th>Percentage</th>
                  </tr>
                </thead>

                <tbody>
                  {attendance.map((a, index) => (
                    <tr key={index}>
                      <td>{a.subject_name}</td>
                      <td>{a.present_count}</td>
                      <td>{a.absent_count}</td>
                      <td>{a.late_count}</td>
                      <td>{a.total_classes}</td>
                      <td>{getAttendancePercentage(a)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="admin-table-panel">
          <div className="admin-section-header">
            <h2>Results Summary</h2>
            <p>Assessments and marks recorded for this student.</p>
          </div>

          {results.length === 0 ? (
            <p className="empty-panel-text">No result record found.</p>
          ) : (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Subject</th>
                    <th>Assessment</th>
                    <th>Type</th>
                    <th>Total Marks</th>
                    <th>Obtained Marks</th>
                    <th>Percentage</th>
                  </tr>
                </thead>

                <tbody>
                  {results.map((r, index) => (
                    <tr key={index}>
                      <td>{r.subject_name}</td>
                      <td>{r.assessment_title}</td>
                      <td>{r.assessment_type}</td>
                      <td>{r.total_marks}</td>
                      <td>{r.obtained_marks}</td>
                      <td>
                        {getResultPercentage(r.obtained_marks, r.total_marks)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default AdminStudentProfile;
