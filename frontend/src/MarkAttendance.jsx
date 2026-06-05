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

  useEffect(() => {
    axios
      .get(
        `http://localhost:5000/students-by-class-section/${classInfo.class_id}/${classInfo.section_id}`
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
    const res = await axios.post("http://localhost:5000/attendance", {
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
    <div>
      <h1>Mark Attendance</h1>

      <h3>
        {classInfo.class_name} - Section {classInfo.section_name}
      </h3>

      <p>Subject: {classInfo.subject_name}</p>

      <input
        type="date"
        value={attendanceDate}
        onChange={(e) => setAttendanceDate(e.target.value)}
      />

      <br /><br />

      <table border="1" cellPadding="10">
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

      <br />

      <button onClick={handleSubmit}>Submit Attendance</button>

      <br /><br />

      <button onClick={() => navigate("/teacher-classes")}>Back</button>
    </div>
  );
}

export default MarkAttendance;