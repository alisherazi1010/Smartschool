import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

function ViewAssessmentResult() {
  const navigate = useNavigate();
  const location = useLocation();

  const { classInfo, assessment } = location.state;

  const [results, setResults] = useState([]);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/assessment-results/${assessment.assessment_id}`)
      .then((res) => setResults(res.data))
      .catch((err) => console.log(err));
  }, [assessment]);

  const getPercentage = (obtained) => {
    return ((obtained / assessment.total_marks) * 100).toFixed(2);
  };

  return (
    <div>
      <h1>Assessment Result</h1>

      <h3>
        {classInfo.class_name} - Section {classInfo.section_name}
      </h3>

      <p>Subject: {classInfo.subject_name}</p>
      <p>Assessment: {assessment.assessment_title}</p>
      <p>Total Marks: {assessment.total_marks}</p>

      <button onClick={() => navigate("/view-assessments", { state: { classInfo } })}>
        Back
      </button>

      <br /><br />

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Admission No</th>
            <th>Student Name</th>
            <th>Obtained Marks</th>
            <th>Percentage</th>
          </tr>
        </thead>

        <tbody>
          {results.map((r) => (
            <tr key={r.mark_id}>
              <td>{r.admission_no}</td>
              <td>{r.name}</td>
              <td>{r.obtained_marks}</td>
              <td>{getPercentage(r.obtained_marks)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ViewAssessmentResult;