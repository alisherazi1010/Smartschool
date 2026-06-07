import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

function EnterMarks() {
  const navigate = useNavigate();
  const location = useLocation();

  const { classInfo, assessment } = location.state;

  const [students, setStudents] = useState([]);
  const [marks, setMarks] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    axios
      .get(
        `${import.meta.env.VITE_API_URL}/students-by-class-section/${classInfo.class_id}/${classInfo.section_id}`
      )
      .then((res) => {
        setStudents(res.data);

        axios
          .get(
            `${import.meta.env.VITE_API_URL}/student-marks/${assessment.assessment_id}`
          )
          .then((marksRes) => {
            const savedMarks = {};

            marksRes.data.forEach((m) => {
              savedMarks[m.student_id] = m.obtained_marks;
            });

            setMarks(savedMarks);
          });
      })
      .catch((err) => console.log(err));
  }, [classInfo, assessment]);

  const goTo = (path) => {
    setSidebarOpen(false);
    navigate(path);
  };

  const handleMarkChange = (studentId, value) => {
    if (Number(value) > Number(assessment.total_marks)) {
      alert("Obtained marks cannot be greater than total marks");
      return;
    }

    setMarks({
      ...marks,
      [studentId]: value,
    });
  };

  const handleSubmit = async () => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/student-marks`, {
        assessment_id: assessment.assessment_id,
        marks,
      });

      alert(res.data.message);
      navigate("/view-assessments", { state: { classInfo } });
    } catch (err) {
      alert("Error saving marks");
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
            <h1>Enter Marks</h1>
            <p>
              {classInfo.class_name} - Section {classInfo.section_name} |{" "}
              {classInfo.subject_name}
            </p>
          </div>
          <div className="hero-actions">
            <span className="teacher-hero-badge">
              {assessment.total_marks} marks
            </span>
            <button
              onClick={() =>
                navigate("/view-assessments", { state: { classInfo } })
              }
            >
              Assessments
            </button>
          </div>
        </section>

        <section className="admin-list-panel">
          <div className="admin-section-header">
            <h2>{assessment.assessment_title}</h2>
            <p>{assessment.assessment_type}</p>
          </div>
        </section>

        <section className="admin-table-panel">
          <div className="admin-table-wrap">
            <table className="admin-table compact-admin-table">
              <thead>
                <tr>
                  <th>Admission No</th>
                  <th>Student Name</th>
                  <th>Obtained Marks</th>
                </tr>
              </thead>

              <tbody>
                {students.map((s) => (
                  <tr key={s.student_id}>
                    <td>{s.admission_no}</td>
                    <td>{s.name}</td>
                    <td>
                      <input
                        className="marks-input"
                        type="number"
                        value={marks[s.student_id] || ""}
                        onChange={(e) =>
                          handleMarkChange(s.student_id, e.target.value)
                        }
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="form-actions">
            <button onClick={handleSubmit}>Save Marks</button>
          </div>
        </section>
      </main>
    </div>
  );
}

export default EnterMarks;
