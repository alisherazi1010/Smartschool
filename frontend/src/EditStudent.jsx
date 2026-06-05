import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

function EditStudent() {
  const navigate = useNavigate();
  const location = useLocation();

  const [student, setStudent] = useState(location.state.student);

  const handleChange = (e) => {
    setStudent({
      ...student,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async () => {
    try {
      const res = await axios.put(
        `http://localhost:5000/students/${student.student_id}`,
        student
      );

      alert(res.data.message);
      navigate("/view-students");
    } catch (err) {
      alert("Error updating student");
      console.log(err);
    }
  };

  return (
    <div>
      <h1>Edit Student</h1>

      <input name="name" value={student.name} onChange={handleChange} />
      <br /><br />

      <input name="email" value={student.email} onChange={handleChange} />
      <br /><br />

      <input
        name="admission_no"
        value={student.admission_no}
        onChange={handleChange}
      />
      <br /><br />

      <select name="class_id" value={student.class_id} onChange={handleChange}>
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

      <select name="section_id" value={student.section_id} onChange={handleChange}>
        <option value="1">A</option>
        <option value="2">B</option>
        <option value="3">C</option>
      </select>

      <br /><br />

      <input
        name="guardian_name"
        value={student.guardian_name}
        onChange={handleChange}
      />
      <br /><br />

      <input
        name="guardian_phone"
        value={student.guardian_phone}
        onChange={handleChange}
      />
      <br /><br />

      <button onClick={handleUpdate}>Update Student</button>
      <br /><br />

      <button onClick={() => navigate("/view-students")}>Back</button>
    </div>
  );
}

export default EditStudent;