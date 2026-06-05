import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function AddSubject() {
  const navigate = useNavigate();

  const [subjectName, setSubjectName] = useState("");

  useEffect(() => {
    const role = localStorage.getItem("role");

    if (role !== "admin") {
      alert("Only admin can access this page");
      navigate("/");
    }
  }, [navigate]);

  const handleSubmit = async () => {
    if (!subjectName.trim()) {
      alert("Enter subject name");
      return;
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/subjects`,
        { subject_name: subjectName }
      );

      alert(res.data.message);
      setSubjectName("");
    } catch (err) {
      alert("Error adding subject");
      console.log(err);
    }
  };

  return (
    <div>
      <h1>Add Subject</h1>

      <input
        placeholder="Subject Name"
        value={subjectName}
        onChange={(e) => setSubjectName(e.target.value)}
      />

      <br /><br />

      <button onClick={handleSubmit}>Add Subject</button>

      <br /><br />

      <button onClick={() => navigate("/admin")}>
        Back to Dashboard
      </button>
    </div>
  );
}

export default AddSubject;