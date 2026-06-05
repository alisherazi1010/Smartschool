import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function AddTeacher() {
  const navigate = useNavigate();

  const [teacher, setTeacher] = useState({
    name: "",
    email: "",
    password: "",
    qualification: "",
    phone: "",
  });

  useEffect(() => {
    const role = localStorage.getItem("role");

    if (role !== "admin") {
      alert("Only admin can access this page");
      navigate("/");
    }
  }, [navigate]);

  const handleChange = (e) => {
    setTeacher({
      ...teacher,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    if (
      !teacher.name ||
      !teacher.email ||
      !teacher.password ||
      !teacher.qualification ||
      !teacher.phone
    ) {
      alert("Please fill all fields");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/teachers", teacher);
      alert(res.data.message);

      setTeacher({
        name: "",
        email: "",
        password: "",
        qualification: "",
        phone: "",
      });
    } catch (err) {
      alert("Error adding teacher");
      console.log(err);
    }
  };

  return (
    <div>
      <h1>Add Teacher</h1>

      <input
        name="name"
        placeholder="Teacher Name"
        value={teacher.name}
        onChange={handleChange}
      />
      <br /><br />

      <input
        name="email"
        placeholder="Email"
        value={teacher.email}
        onChange={handleChange}
      />
      <br /><br />

      <input
        name="password"
        type="password"
        placeholder="Password"
        value={teacher.password}
        onChange={handleChange}
      />
      <br /><br />

      <input
        name="qualification"
        placeholder="Qualification"
        value={teacher.qualification}
        onChange={handleChange}
      />
      <br /><br />

      <input
        name="phone"
        placeholder="Phone"
        value={teacher.phone}
        onChange={handleChange}
      />
      <br /><br />

      <button onClick={handleSubmit}>Add Teacher</button>
      <br /><br />

      <button onClick={() => navigate("/admin")}>Back to Dashboard</button>
    </div>
  );
}

export default AddTeacher;