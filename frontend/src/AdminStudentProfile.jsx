import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

function AdminStudentProfile() {
  const navigate = useNavigate();
  const location = useLocation();

  const student = location.state.student;

  const [attendance, setAttendance] = useState([]);
  const [results, setResults] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/student-attendance/${student.student_id}`)
      .then((res) => setAttendance(res.data))
      .catch((err) => console.log(err));

    axios
      .get(`http://localhost:5000/student-results/${student.student_id}`)
      .then((res) => setResults(res.data))
      .catch((err) => console.log(err));
  }, [student.student_id]);

  const getAttendancePercentage = (item) => {
    if (item.total_classes === 0) return "0%";
    return Math.round((item.present_count / item.total_classes) * 100) + "%";
  };

  const getResultPercentage = (obtained, total) => {
    return ((obtained / total) * 100).toFixed(2);
  };

  return (
    <div>
      <h1>Student Profile</h1>

      <button onClick={() => navigate("/view-students")}>Back</button>

      <h2>Basic Information</h2>

      <p><b>Name:</b> {student.name}</p>
      <p><b>Email:</b> {student.email}</p>
      <p><b>Admission No:</b> {student.admission_no}</p>
      <p><b>Class:</b> {student.class_name}</p>
      <p><b>Section:</b> {student.section_name}</p>
      <p><b>Guardian Name:</b> {student.guardian_name}</p>
      <p><b>Guardian Phone:</b> {student.guardian_phone}</p>

      <hr />

      <h2>Attendance Summary</h2>

      {attendance.length === 0 ? (
        <p>No attendance record found.</p>
      ) : (
        <table border="1" cellPadding="10">
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
      )}

      <hr />

      <h2>Results Summary</h2>

      {results.length === 0 ? (
        <p>No result record found.</p>
      ) : (
        <table border="1" cellPadding="10">
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
                <td>{getResultPercentage(r.obtained_marks, r.total_marks)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AdminStudentProfile;