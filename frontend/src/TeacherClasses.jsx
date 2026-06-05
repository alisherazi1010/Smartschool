import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function TeacherClasses() {
  const [classes, setClasses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem("role");
    const userId = localStorage.getItem("user_id");

    if (role !== "teacher") {
      alert("Only teacher can access this page");
      navigate("/");
      return;
    }

    axios
      .get(`${import.meta.env.VITE_API_URL}/teacher-classes/${userId}`)
      .then((res) => setClasses(res.data))
      .catch((err) => console.log(err));
  }, [navigate]);

  return (
    <div>
      <h1>My Classes</h1>

      <button onClick={() => navigate("/teacher")}>Back</button>

      <br /><br />

      {classes.length === 0 ? (
        <p>No classes assigned yet.</p>
      ) : (
        classes.map((c) => (
          <div key={c.assignment_id} style={{ border: "1px solid black", padding: "10px", margin: "10px" }}>
            <h3>{c.class_name} - Section {c.section_name}</h3>
            <p>Subject: {c.subject_name}</p>

            <button onClick={() => navigate("/mark-attendance", { state: { classInfo: c } })}>
              Mark Attendance
            </button>
            <button
  onClick={() =>
    navigate("/view-attendance", { state: { classInfo: c } })
  }
>
  View Attendance
</button>


<button
  onClick={() =>
    navigate("/create-assessment", { state: { classInfo: c } })
  }
>
  Create Assessment
</button>


<button
  onClick={() =>
    navigate("/view-assessments", { state: { classInfo: c } })
  }
>
  View Assessments
</button>
          </div>
        ))
      )}
    </div>
  );
}

export default TeacherClasses;