import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "./assets/smartschool.png";

function StudentLogin() {
  const navigate = useNavigate();
  
  const handleSubmit = (e) => {
  e.preventDefault();
  handleLogin();
};

  const [admissionNo, setAdmissionNo] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!admissionNo || !password) {
  setError("Please fill all required fields.");
  return;
}
    try {
      const res = await axios.post("http://localhost:5000/student-login", {
        admission_no: admissionNo,
        password,
      });

      localStorage.setItem("role", "student");
      localStorage.setItem("student_id", res.data.student.student_id);
      localStorage.setItem("user_id", res.data.student.user_id);
      localStorage.setItem("name", res.data.student.name);
      localStorage.setItem("admission_no", res.data.student.admission_no);

      navigate("/student");
    } catch (err) {
      setError("Invalid admission number or password");
    }
  };

  return (
    <div className="split-login-page">
      <div className="login-brand-section">
        <img src={logo} alt="SmartSchool Logo" className="brand-logo" />
        <h2>Managing Education Smarter</h2>
      </div>

      <div className="login-form-section">
        <form className="modern-login-card" onSubmit={handleSubmit}>
          <h1>SmartSchool</h1>
          <h3>Student Portal</h3>

          {error && (
  <div className="error-message">
    {error}
  </div>
)}




          <label>Admission Number</label>
          <input
            type="text"
            placeholder="Enter admission number"
            value={admissionNo}
            onChange={(e) => {setAdmissionNo(e.target.value);
                setError("");
            }}
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => {setPassword(e.target.value);
                setError("");
            }}
          />

          <button className="primary-login-btn"  type="submit">
            Login
          </button>

          <button className="link-login-btn" onClick={() => navigate("/")}>
            Back to Admin / Teacher Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default StudentLogin;