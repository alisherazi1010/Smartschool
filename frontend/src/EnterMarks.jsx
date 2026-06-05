import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

function EnterMarks() {
  const navigate = useNavigate();
  const location = useLocation();

  const { classInfo, assessment } = location.state;

  const [students, setStudents] = useState([]);
  const [marks, setMarks] = useState({});

 useEffect(() => {
  axios
    .get(
      `${import.meta.env.VITE_API_URL}/students-by-class-section/${classInfo.class_id}/${classInfo.section_id}`
    )
    .then((res) => {
      setStudents(res.data);

      axios
        .get(`${import.meta.env.VITE_API_URL}/student-marks/${assessment.assessment_id}`)
        .then((marksRes) => {
          const savedMarks = {};

          marksRes.data.forEach((m) => {
            savedMarks[m.student_id] = m.obtained_marks;
          });

          setMarks(savedMarks);
        });
    })
    .catch((err) => console.log(err));
}, [classInfo, assessment]);

  const handleMarkChange = (studentId, value) => {
    if (Number(value) > Number(assessment.total_marks)) {
      alert("Obtained marks cannot be greater than total marks");
      return;
    }

    setMarks({
      ...marks,
      [studentId]: value,
    });
  };

  const handleSubmit = async () => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/student-marks`, {
        assessment_id: assessment.assessment_id,
        marks,
      });

      alert(res.data.message);
      navigate("/view-assessments", { state: { classInfo } });
    } catch (err) {
      alert("Error saving marks");
      console.log(err);
    }
  };

  return (
    <div>
      <h1>Enter Marks</h1>

      <h3>
        {classInfo.class_name} - Section {classInfo.section_name}
      </h3>

      <p>Subject: {classInfo.subject_name}</p>
      <p>Assessment: {assessment.assessment_title}</p>
      <p>Total Marks: {assessment.total_marks}</p>

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Admission No</th>
            <th>Student Name</th>
            <th>Obtained Marks</th>
          </tr>
        </thead>

        <tbody>
          {students.map((s) => (
            <tr key={s.student_id}>
              <td>{s.admission_no}</td>
              <td>{s.name}</td>
              <td>
                <input
                  type="number"
                  value={marks[s.student_id] || ""}
                  onChange={(e) =>
                    handleMarkChange(s.student_id, e.target.value)
                  }
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <br />

      <button onClick={handleSubmit}>Save Marks</button>
      <br /><br />

      <button onClick={() => navigate("/view-assessments", { state: { classInfo } })}>
        Back
      </button>
    </div>
  );
}

export default EnterMarks;