import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function StudentResults() {
  const navigate = useNavigate();
  const [results, setResults] = useState([]);

  useEffect(() => {
    const role = localStorage.getItem("role");
    const studentId = localStorage.getItem("student_id");

    if (role !== "student") {
      alert("Only student can access this page");
      navigate("/");
      return;
    }

    axios
      .get(`http://localhost:5000/student-results/${studentId}`)
      .then((res) => setResults(res.data))
      .catch((err) => console.log(err));
  }, [navigate]);

  const getPercentage = (obtained, total) => {
    return ((obtained / total) * 100).toFixed(2);
  };

  return (
    <div>
      <h1>My Results</h1>

      <button onClick={() => navigate("/student")}>Back</button>

      <br /><br />

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Subject</th>
            <th>Assessment</th>
            <th>Type</th>
            <th>Date</th>
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
              <td>{r.assessment_date?.split("T")[0]}</td>
              <td>{r.total_marks}</td>
              <td>{r.obtained_marks}</td>
              <td>{getPercentage(r.obtained_marks, r.total_marks)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default StudentResults;