import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "./assets/smartschool.png";

function Login() {
  const navigate = useNavigate();
  const handleSubmit = (e) => {
  e.preventDefault();
  handleLogin();
};


  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
  setError("Please fill all required fields.");
  return;
}

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/login`, {
        email,
        password,
      });

      const role = res.data.user.role;

      localStorage.setItem("role", role);
      localStorage.setItem("user_id", res.data.user.user_id);
      localStorage.setItem("name", res.data.user.name);

      if (role === "admin") navigate("/admin");
      else if (role === "teacher") navigate("/teacher");
      else alert("Invalid role");
    } catch (err) {
      setError("Invalid email or password");
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
          <h3>Admin / Teacher Login</h3>

          {error && (
  <div className="error-message">
    {error}
  </div>
)}

          <label>Email</label>
          <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => {setEmail(e.target.value);
              setError("");}
            }
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => {setPassword(e.target.value);
              setError("");}
            }
          />

          <button className="primary-login-btn" type="submit">
            Login
          </button>

          <button
            className="link-login-btn"
            type="button"
            onClick={() => navigate("/student-login")}
          >
            Student Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;