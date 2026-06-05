import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function ViewSubjects() {
  const [subjects, setSubjects] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/subjects`)
      .then((res) => setSubjects(res.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div>
      <h1>View Subjects</h1>

      <button onClick={() => navigate("/admin")}>
        Back to Dashboard
      </button>

      <br /><br />

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>ID</th>
            <th>Subject Name</th>
          </tr>
        </thead>

        <tbody>
          {subjects.map((s) => (
            <tr key={s.subject_id}>
              <td>{s.subject_id}</td>
              <td>{s.subject_name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ViewSubjects;