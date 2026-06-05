import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function AddStudent() {
  const navigate = useNavigate();

  const [student, setStudent] = useState({
    name: "",
    email: "",
    password: "",
    admission_no: "",
    class_id: "",
    section_id: "",
    guardian_name: "",
    guardian_phone: "",
  });

  useEffect(() => {
    const role = localStorage.getItem("role");

    if (role !== "admin") {
      alert("Only admin can access this page");
      navigate("/");
    }
  }, [navigate]);

  const handleChange = (e) => {
    setStudent({
      ...student,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    if (
      !student.name ||
      !student.email ||
      !student.password ||
      !student.admission_no ||
      !student.class_id ||
      !student.section_id
    ) {
      alert("Please fill all required fields");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/students", student);
      alert(res.data.message);

      setStudent({
        name: "",
        email: "",
        password: "",
        admission_no: "",
        class_id: "",
        section_id: "",
        guardian_name: "",
        guardian_phone: "",
      });
    } catch (err) {
      alert("Error adding student");
      console.log(err);
    }
  };

  return (
    <div>
      <h1>Add Student</h1>

      <input
        name="name"
        placeholder="Student Name"
        value={student.name}
        onChange={handleChange}
      />
      <br /><br />

      <input
        name="email"
        placeholder="Email"
        value={student.email}
        onChange={handleChange}
      />
      <br /><br />

      <input
        name="password"
        type="password"
        placeholder="Password"
        value={student.password}
        onChange={handleChange}
      />
      <br /><br />

      <input
        name="admission_no"
        placeholder="Admission No"
        value={student.admission_no}
        onChange={handleChange}
      />
      <br /><br />

      <select name="class_id" value={student.class_id} onChange={handleChange}>
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

      <select name="section_id" value={student.section_id} onChange={handleChange}>
        <option value="">Select Section</option>
        <option value="1">A</option>
        <option value="2">B</option>
        <option value="3">C</option>
      </select>

      <br /><br />

      <input
        name="guardian_name"
        placeholder="Guardian Name"
        value={student.guardian_name}
        onChange={handleChange}
      />
      <br /><br />

      <input
        name="guardian_phone"
        placeholder="Guardian Phone"
        value={student.guardian_phone}
        onChange={handleChange}
      />
      <br /><br />

      <button onClick={handleSubmit}>Add Student</button>
      <br /><br />

      <button onClick={() => navigate("/admin")}>Back to Dashboard</button>
    </div>
  );
}

export default AddStudent;