import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function TeacherProfile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem("role");
    const userId = localStorage.getItem("user_id");

    if (role !== "teacher" || !userId) {
      navigate("/", { replace: true });
      return;
    }

    axios
      .get(`${import.meta.env.VITE_API_URL}/teacher-profile/${userId}`)
      .then((res) => setProfile(res.data))
      .catch((err) => console.log(err));
  }, [navigate]);

  const goTo = (path) => {
    setSidebarOpen(false);
    navigate(path);
  };

  const formatDate = (value) => {
    if (!value) return "-";
    return value.split("T")[0];
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
            <h1>My Profile</h1>
            <p>Teacher account, contact, and employment details.</p>
          </div>
          <div className="hero-actions">
            <button onClick={() => navigate("/teacher")}>Dashboard</button>
          </div>
        </section>

        {!profile ? (
          <section className="admin-list-panel">
            <p className="empty-panel-text">Loading profile...</p>
          </section>
        ) : (
          <>
            <section className="profile-header-card admin-profile-header">
              <div className="profile-avatar">
                {profile.name.charAt(0).toUpperCase()}
              </div>

              <div>
                <h1>{profile.name}</h1>
                <p>{profile.qualification}</p>
                <span>{profile.status || "active"}</span>
              </div>
            </section>

            <section className="profile-info-grid">
              <div className="profile-info-card">
                <h3>Email</h3>
                <p>{profile.email}</p>
              </div>

              <div className="profile-info-card">
                <h3>Phone</h3>
                <p>{profile.phone}</p>
              </div>

              <div className="profile-info-card">
                <h3>Qualification</h3>
                <p>{profile.qualification}</p>
              </div>

              <div className="profile-info-card">
                <h3>Joining Date</h3>
                <p>{formatDate(profile.joining_date)}</p>
              </div>

              <div className="profile-info-card">
                <h3>Leaving Date</h3>
                <p>{formatDate(profile.leaving_date)}</p>
              </div>

              <div className="profile-info-card">
                <h3>Status</h3>
                <p>{profile.status || "active"}</p>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}

export default TeacherProfile;
