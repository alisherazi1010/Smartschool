import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const defaultDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const classOptions = [
  { class_id: "1", class_name: "Nursery" },
  { class_id: "2", class_name: "KG" },
  { class_id: "3", class_name: "Prep" },
  { class_id: "4", class_name: "Class 1" },
  { class_id: "5", class_name: "Class 2" },
  { class_id: "6", class_name: "Class 3" },
  { class_id: "7", class_name: "Class 4" },
  { class_id: "8", class_name: "Class 5" },
  { class_id: "9", class_name: "Class 6" },
  { class_id: "10", class_name: "Class 7" },
  { class_id: "11", class_name: "Class 8" },
  { class_id: "12", class_name: "Class 9" },
  { class_id: "13", class_name: "Class 10" },
];
const sectionOptions = [
  { section_id: "1", section_name: "A" },
  { section_id: "2", section_name: "B" },
  { section_id: "3", section_name: "C" },
];

function TimetableGenerator() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [timetable, setTimetable] = useState([]);
  const [unplaced, setUnplaced] = useState([]);
  const [selectedClassSections, setSelectedClassSections] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [settings, setSettings] = useState({
    periods_per_day: 6,
    start_time: "08:00",
    period_minutes: 40,
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

  const getClassSectionKey = (classId, sectionId) => `${classId}-${sectionId}`;

  const isClassSectionSelected = (classId, sectionId) => {
    return selectedClassSections.some(
      (item) => item.class_id === classId && item.section_id === sectionId
    );
  };

  const toggleClassSection = (classItem, sectionItem) => {
    const isSelected = isClassSectionSelected(
      classItem.class_id,
      sectionItem.section_id
    );

    if (isSelected) {
      setSelectedClassSections((current) =>
        current.filter(
          (item) =>
            !(
              item.class_id === classItem.class_id &&
              item.section_id === sectionItem.section_id
            )
        )
      );
      return;
    }

    setSelectedClassSections((current) => [
      ...current,
      {
        class_id: classItem.class_id,
        class_name: classItem.class_name,
        section_id: sectionItem.section_id,
        section_name: sectionItem.section_name,
      },
    ]);
  };

  const selectAllClassSections = () => {
    const allClassSections = classOptions.flatMap((classItem) =>
      sectionOptions.map((sectionItem) => ({
        class_id: classItem.class_id,
        class_name: classItem.class_name,
        section_id: sectionItem.section_id,
        section_name: sectionItem.section_name,
      }))
    );

    setSelectedClassSections(allClassSections);
  };

  const loadTimetable = () => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/timetable`)
      .then((res) => setTimetable(res.data))
      .catch((err) => console.log(err));
  };

  const generateTimetable = async () => {
    if (selectedClassSections.length === 0) {
      alert("Please select at least one class and section");
      return;
    }

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
          selected_class_sections: selectedClassSections.map((item) => ({
            class_id: item.class_id,
            section_id: item.section_id,
          })),
        }
      );

      alert(res.data.message);
      setTimetable(res.data.generated || []);
      setUnplaced(res.data.unplaced || []);
    } catch (err) {
      setUnplaced(err.response?.data?.unplaced || []);
      alert(
        err.response?.data?.message ||
          err.response?.data?.sqlMessage ||
          "Error generating timetable"
      );
      console.log(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const getSlot = (day, period, classSection) => {
    return timetable.filter(
      (item) =>
        item.day_name === day &&
        Number(item.period_number) === period &&
        String(item.class_id) === String(classSection.class_id) &&
        String(item.section_id) === String(classSection.section_id)
    );
  };

  const timetablePeriodCount = Math.max(
    Number(settings.periods_per_day),
    ...timetable.map((item) => Number(item.period_number) || 0)
  );

  const periods = Array.from(
    { length: timetablePeriodCount },
    (_, index) => index + 1
  );

  const getPeriodTime = (period) => {
    const matchingSlot = timetable.find(
      (item) => Number(item.period_number) === Number(period)
    );

    if (!matchingSlot?.start_time || !matchingSlot?.end_time) return "";

    return `${matchingSlot.start_time.slice(0, 5)} - ${matchingSlot.end_time.slice(
      0,
      5
    )}`;
  };

  const timetableClassSections = timetable
    .reduce((groups, item) => {
      const key = getClassSectionKey(item.class_id, item.section_id);
      if (groups.some((group) => group.key === key)) return groups;

      return [
        ...groups,
        {
          key,
          class_id: item.class_id,
          class_name: item.class_name,
          section_id: item.section_id,
          section_name: item.section_name,
        },
      ];
    }, [])
    .sort((a, b) => {
      if (Number(a.class_id) !== Number(b.class_id)) {
        return Number(a.class_id) - Number(b.class_id);
      }

      return Number(a.section_id) - Number(b.section_id);
    });

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
            <p>
              Choose class-sections and give every subject one class per day.
            </p>
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
              Each assigned subject gets one class from Monday to Friday.
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

          </div>

          <div className="class-section-picker">
            <div className="admin-section-header">
              <h2>Classes And Sections</h2>
              <p>Select the class-sections that need a timetable.</p>
            </div>

            <div className="form-actions timetable-picker-actions">
              <button className="secondary-form-btn" onClick={selectAllClassSections}>
                Select All
              </button>
              <button
                className="secondary-form-btn"
                onClick={() => setSelectedClassSections([])}
              >
                Clear
              </button>
            </div>

            <div className="class-section-grid">
              {classOptions.map((classItem) => (
                <div className="class-section-card" key={classItem.class_id}>
                  <strong>{classItem.class_name}</strong>
                  <div>
                    {sectionOptions.map((sectionItem) => {
                      const selected = isClassSectionSelected(
                        classItem.class_id,
                        sectionItem.section_id
                      );

                      return (
                        <button
                          className={selected ? "selected" : ""}
                          key={sectionItem.section_id}
                          onClick={() => toggleClassSection(classItem, sectionItem)}
                        >
                          {sectionItem.section_name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
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
                These could not fit without clashes. Add more periods per day
                or adjust teacher assignments.
              </p>
            </div>

            <div className="unplaced-list">
              {unplaced.map((item, index) => (
                <span key={`${item.assignment_id}-${index}`}>
                  {item.requested_day ? `${item.requested_day}: ` : ""}
                  {item.class_name} {item.section_name}
                  {item.subject_name ? ` - ${item.subject_name}` : ""}
                </span>
              ))}
            </div>
          </section>
        )}

        <section className="admin-table-panel">
          <div className="admin-section-header">
            <h2>Generated Timetable</h2>
            <p>
              Each subject appears once per day, with no teacher or
              class-section clashes.
            </p>
          </div>

          {timetable.length === 0 ? (
            <p className="empty-panel-text">No timetable generated yet.</p>
          ) : (
            <div className="class-timetable-list">
              {timetableClassSections.map((classSection) => (
                <section className="class-timetable-panel" key={classSection.key}>
                  <div className="class-timetable-title">
                    <h3>
                      {classSection.class_name} - Section{" "}
                      {classSection.section_name}
                    </h3>
                  </div>

                  <div className="admin-table-wrap timetable-scroll-wrap">
                    <table className="admin-table timetable-table">
                      <thead>
                        <tr>
                          <th>Day</th>
                          {periods.map((period) => (
                            <th key={period}>
                              <span>Period {period}</span>
                              <small>{getPeriodTime(period)}</small>
                            </th>
                          ))}
                        </tr>
                      </thead>

                      <tbody>
                        {defaultDays.map((day) => (
                          <tr key={`${classSection.key}-${day}`}>
                            <th>{day}</th>
                            {periods.map((period) => (
                              <td key={`${classSection.key}-${day}-${period}`}>
                                <div className="timetable-cell">
                                  {getSlot(day, period, classSection).length ===
                                  0 ? (
                                    <span className="timetable-free-slot">
                                      Free
                                    </span>
                                  ) : (
                                    getSlot(day, period, classSection).map((slot) => (
                                      <div
                                        className="timetable-chip"
                                        key={`${slot.assignment_id}-${slot.day_name}-${slot.period_number}`}
                                      >
                                        <span>{slot.subject_name}</span>
                                        <small>{slot.teacher_name}</small>
                                      </div>
                                    ))
                                  )}
                                </div>
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default TimetableGenerator;
