import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function StudentProfile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
const [sidebarOpen, setSidebarOpen] = useState(false);

const goTo = (path) => {
  setSidebarOpen(false);
  navigate(path);
};



  useEffect(() => {
  const role = localStorage.getItem("role");
  const studentId = localStorage.getItem("student_id");

  if (role !== "student" || !studentId) {
    navigate("/", { replace: true });
    return;
  }

  axios
    .get(`${import.meta.env.VITE_API_URL}/student-profile/${studentId}`)
    .then((res) => setProfile(res.data))
    .catch((err) => console.log(err));
}, [navigate]);

  if (!profile) return <p>Loading...</p>;

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

        <button onClick={() => navigate("/student")}>Dashboard</button>
        <button onClick={() => navigate("/student-profile")}>My Profile</button>
        <button onClick={() => navigate("/student-attendance")}>My Attendance</button>
        <button onClick={() => navigate("/student-results")}>My Results</button>
        <button onClick={() => navigate("/student-report-card")}>Report Card</button>

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
        <div className="profile-header-card">
          <div className="profile-avatar">
            {profile.name.charAt(0).toUpperCase()}
          </div>

          <div>
            <h1>{profile.name}</h1>
            <p>{profile.class_name} - Section {profile.section_name}</p>
            <span>{profile.admission_no}</span>
          </div>
        </div>

        <div className="profile-info-grid">
          <div className="profile-info-card">
            <h3>📧 Email</h3>
            <p>{profile.email}</p>
          </div>

          <div className="profile-info-card">
            <h3>🎓 Class</h3>
            <p>{profile.class_name}</p>
          </div>

          <div className="profile-info-card">
            <h3>🏫 Section</h3>
            <p>{profile.section_name}</p>
          </div>

          <div className="profile-info-card">
            <h3>👨‍👩‍👦 Guardian</h3>
            <p>{profile.guardian_name}</p>
          </div>

          <div className="profile-info-card">
            <h3>📞 Guardian Phone</h3>
            <p>{profile.guardian_phone}</p>
          </div>

          <div className="profile-info-card">
            <h3>🆔 Admission No</h3>
            <p>{profile.admission_no}</p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default StudentProfile;