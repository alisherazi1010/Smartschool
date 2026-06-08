import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const defaultDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

function TimetableGenerator() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [timetable, setTimetable] = useState([]);
  const [unplaced, setUnplaced] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [settings, setSettings] = useState({
    periods_per_day: 6,
    start_time: "08:00",
    period_minutes: 40,
    periods_per_assignment: 3,
  });

  useEffect(() => {
    const role = localStorage.getItem("role");

    if (role !== "admin") {
      alert("Only admin can access this page");
      navigate("/");
      return;
    }

    loadTimetable();
  }, [navigate]);

  const goTo = (path) => {
    setSidebarOpen(false);
    navigate(path);
  };

  const handleSettingChange = (e) => {
    setSettings({
      ...settings,
      [e.target.name]: e.target.value,
    });
  };

  const loadTimetable = () => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/timetable`)
      .then((res) => setTimetable(res.data))
      .catch((err) => console.log(err));
  };

  const generateTimetable = async () => {
    setIsGenerating(true);
    setUnplaced([]);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/timetable/generate`,
        {
          ...settings,
          days: defaultDays,
          periods_per_day: Number(settings.periods_per_day),
          period_minutes: Number(settings.period_minutes),
          periods_per_assignment: Number(settings.periods_per_assignment),
        }
      );

      alert(res.data.message);
      setTimetable(res.data.generated || []);
      setUnplaced(res.data.unplaced || []);
    } catch (err) {
      alert(err.response?.data?.message || "Error generating timetable");
      console.log(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const getSlot = (day, period) => {
    return timetable.filter(
      (item) => item.day_name === day && Number(item.period_number) === period
    );
  };

  const periods = Array.from(
    { length: Number(settings.periods_per_day) },
    (_, index) => index + 1
  );

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
            <h1>Timetable Generator</h1>
            <p>Create a clash-free timetable from teacher assignments.</p>
          </div>
          <div className="hero-actions">
            <span className="admin-hero-badge">{timetable.length} slots</span>
            <button onClick={() => navigate("/admin")}>Dashboard</button>
          </div>
        </section>

        <section className="admin-form-panel">
          <div className="admin-section-header">
            <h2>Generator Settings</h2>
            <p>
              The generator prevents teacher clashes and class-section clashes.
            </p>
          </div>

          <div className="admin-form-grid timetable-settings-grid">
            <label>
              Periods Per Day
              <input
                name="periods_per_day"
                type="number"
                min="1"
                value={settings.periods_per_day}
                onChange={handleSettingChange}
              />
            </label>

            <label>
              School Start Time
              <input
                name="start_time"
                type="time"
                value={settings.start_time}
                onChange={handleSettingChange}
              />
            </label>

            <label>
              Period Minutes
              <input
                name="period_minutes"
                type="number"
                min="20"
                value={settings.period_minutes}
                onChange={handleSettingChange}
              />
            </label>

            <label>
              Weekly Periods Per Assignment
              <input
                name="periods_per_assignment"
                type="number"
                min="1"
                value={settings.periods_per_assignment}
                onChange={handleSettingChange}
              />
            </label>
          </div>

          <div className="form-actions">
            <button onClick={generateTimetable} disabled={isGenerating}>
              {isGenerating ? "Generating" : "Generate Timetable"}
            </button>
            <button className="secondary-form-btn" onClick={loadTimetable}>
              Refresh
            </button>
          </div>
        </section>

        {unplaced.length > 0 && (
          <section className="admin-list-panel">
            <div className="admin-section-header">
              <h2>Unplaced Assignments</h2>
              <p>
                These could not fit without clashes. Add more periods or reduce
                weekly periods per assignment.
              </p>
            </div>

            <div className="unplaced-list">
              {unplaced.map((item, index) => (
                <span key={`${item.assignment_id}-${index}`}>
                  {item.class_name} {item.section_name} - {item.subject_name}
                </span>
              ))}
            </div>
          </section>
        )}

        <section className="admin-table-panel">
          <div className="admin-section-header">
            <h2>Generated Timetable</h2>
            <p>Each cell can contain multiple classes, but no teacher or class-section clashes.</p>
          </div>

          {timetable.length === 0 ? (
            <p className="empty-panel-text">No timetable generated yet.</p>
          ) : (
            <div className="admin-table-wrap">
              <table className="admin-table timetable-table">
                <thead>
                  <tr>
                    <th>Day</th>
                    {periods.map((period) => (
                      <th key={period}>Period {period}</th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {defaultDays.map((day) => (
                    <tr key={day}>
                      <th>{day}</th>
                      {periods.map((period) => (
                        <td key={`${day}-${period}`}>
                          <div className="timetable-cell">
                            {getSlot(day, period).map((slot) => (
                              <div
                                className="timetable-chip"
                                key={`${slot.assignment_id}-${slot.day_name}-${slot.period_number}`}
                              >
                                <strong>
                                  {slot.class_name} {slot.section_name}
                                </strong>
                                <span>{slot.subject_name}</span>
                                <small>{slot.teacher_name}</small>
                                <small>
                                  {slot.start_time?.slice(0, 5)} -{" "}
                                  {slot.end_time?.slice(0, 5)}
                                </small>
                              </div>
                            ))}
                          </div>
                        </td>
                      ))}
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

export default TimetableGenerator;
