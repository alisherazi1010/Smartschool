import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AssignTeacher() {
  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);
const navigate = useNavigate();
  const [assignment, setAssignment] = useState({
    teacher_id: "",
    class_id: "",
    section_id: "",
    subject_id: "",
  });

  useEffect(() => {
    axios.get("http://localhost:5000/teachers")
      .then(res => setTeachers(res.data));

    axios.get("http://localhost:5000/subjects")
      .then(res => setSubjects(res.data));
  }, []);

  const handleChange = (e) => {
    setAssignment({
      ...assignment,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/teacher-assignments",
        assignment
      );

      alert(res.data.message);
    } catch (err) {
      alert("Error assigning teacher");
      console.log(err);
    }
  };

  return (
    <div>
      <h1>Assign Teacher</h1>

      <select name="teacher_id" onChange={handleChange}>
        <option value="">Select Teacher</option>
        {teachers.map((t) => (
          <option key={t.teacher_id} value={t.teacher_id}>
            {t.name}
          </option>
        ))}
      </select>

      <br /><br />

      <select name="class_id" onChange={handleChange}>
        <option value="">Select Class</option>
        <option value="1">Nursery</option>
        <option value="2">KG</option>
        <option value="3">Prep</option>
        <option value="4">Class 1</option>
        <option value="5">Class 2</option>
        <option value="6">Class 3</option>
        <option value="7">Class 4</option>
        <option value="8">Class 5</option>
        <option value="9">Class 6</option>
        <option value="10">Class 7</option>
        <option value="11">Class 8</option>
        <option value="12">Class 9</option>
        <option value="13">Class 10</option>
      </select>

      <br /><br />

      <select name="section_id" onChange={handleChange}>
        <option value="">Select Section</option>
        <option value="1">A</option>
        <option value="2">B</option>
        <option value="3">C</option>
      </select>

      <br /><br />

      <select name="subject_id" onChange={handleChange}>
        <option value="">Select Subject</option>
        {subjects.map((s) => (
          <option key={s.subject_id} value={s.subject_id}>
            {s.subject_name}
          </option>
        ))}
      </select>

      <br /><br />

      <button onClick={handleSubmit}>Assign Teacher</button>

      <button onClick={() => navigate("/admin")}>Back to Dashboard</button>
    </div>
  );
}

export default AssignTeacher;