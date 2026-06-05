import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function StudentAttendance() {
  const navigate = useNavigate();
  const [attendance, setAttendance] = useState([]);

  useEffect(() => {
    const role = localStorage.getItem("role");
    const studentId = localStorage.getItem("student_id");

    if (role !== "student") {
      alert("Only student can access this page");
      navigate("/");
      return;
    }

    axios
      .get(`http://localhost:5000/student-attendance/${studentId}`)
      .then((res) => setAttendance(res.data))
      .catch((err) => console.log(err));
  }, [navigate]);

  const getPercentage = (item) => {
    if (item.total_classes === 0) return "0%";
    return Math.round((item.present_count / item.total_classes) * 100) + "%";
  };

  return (
    <div>
      <h1>My Attendance</h1>

      <button onClick={() => navigate("/student")}>Back</button>

      <br /><br />

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Subject</th>
            <th>Class</th>
            <th>Section</th>
            <th>Present</th>
            <th>Absent</th>
            <th>Late</th>
            <th>Total</th>
            <th>Percentage</th>
          </tr>
        </thead>

        <tbody>
          {attendance.map((item, index) => (
            <tr key={index}>
              <td>{item.subject_name}</td>
              <td>{item.class_name}</td>
              <td>{item.section_name}</td>
              <td>{item.present_count}</td>
              <td>{item.absent_count}</td>
              <td>{item.late_count}</td>
              <td>{item.total_classes}</td>
              <td>{getPercentage(item)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default StudentAttendance;