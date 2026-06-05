import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ViewAssignments() {
  const [assignments, setAssignments] = useState([]);
const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/teacher-assignments`)
      .then((res) => setAssignments(res.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div>
      <h1>Teacher Assignments</h1>

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>ID</th>
            <th>Teacher</th>
            <th>Class</th>
            <th>Section</th>
            <th>Subject</th>
          </tr>
        </thead>

        <tbody>
          {assignments.map((a) => (
            <tr key={a.assignment_id}>
              <td>{a.assignment_id}</td>
              <td>{a.teacher_name}</td>
              <td>{a.class_name}</td>
              <td>{a.section_name}</td>
              <td>{a.subject_name}</td>
            </tr>
          ))}
        </tbody>
      </table>
            <button onClick={() => navigate("/admin")}>Back to Dashboard</button>

    </div>
  );
}

export default ViewAssignments;