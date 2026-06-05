import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function ViewTeachers() {
  const [teachers, setTeachers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem("role");

    if (role !== "admin") {
      alert("Only admin can access this page");
      navigate("/");
      return;
    }

    axios
      .get(`${import.meta.env.VITE_API_URL}/teachers`)
      .then((res) => setTeachers(res.data))
      .catch((err) => console.log(err));
  }, [navigate]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this teacher?")) {
      return;
    }

    try {
      const res = await axios.delete(`${import.meta.env.VITE_API_URL}/teachers/${id}`);
      alert(res.data.message);

      setTeachers(teachers.filter((t) => t.teacher_id !== id));
    } catch (err) {
      alert("Error deleting teacher");
      console.log(err);
    }
  };

  return (
    <div>
      <h1>View Teachers</h1>

      <button onClick={() => navigate("/admin")}>Back to Dashboard</button>

      <br /><br />

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Qualification</th>
            <th>Phone</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {teachers.map((t) => (
            <tr key={t.teacher_id}>
              <td>{t.teacher_id}</td>
              <td>{t.name}</td>
              <td>{t.email}</td>
              <td>{t.qualification}</td>
              <td>{t.phone}</td>
              <td>
                <button
                  onClick={() =>
                    navigate("/edit-teacher", { state: { teacher: t } })
                  }
                >
                  Edit
                </button>

                <button onClick={() => handleDelete(t.teacher_id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ViewTeachers;