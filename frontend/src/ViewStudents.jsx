import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function ViewStudents() {
  const [students, setStudents] = useState([]);
  const [searchName, setSearchName] = useState("");
const [searchAdmission, setSearchAdmission] = useState("");
const [searchClass, setSearchClass] = useState("");
const [searchSection, setSearchSection] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem("role");

    if (role !== "admin") {
      alert("Only admin can access this page");
      navigate("/");
      return;
    }

    axios
      .get(`${import.meta.env.VITE_API_URL}/students`)
      .then((res) => setStudents(res.data))
      .catch((err) => console.log(err));
  }, [navigate]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this student?")) {
      return;
    }

    try {
      const res = await axios.delete(`${import.meta.env.VITE_API_URL}/students/${id}`);
      alert(res.data.message);

      setStudents(students.filter((s) => s.student_id !== id));
    } catch (err) {
      alert("Error deleting student");
      console.log(err);
    }
  };




  

const filteredStudents = students.filter((student) => {
  return (
    student.name.toLowerCase().includes(searchName.toLowerCase()) &&
    student.admission_no.toLowerCase().includes(searchAdmission.toLowerCase()) &&
    student.class_name.toLowerCase().includes(searchClass.toLowerCase()) &&
    student.section_name.toLowerCase().includes(searchSection.toLowerCase())
  );
});




  return (
    <div>
      <h1>View Students</h1>

      <button onClick={() => navigate("/admin")}>Back to Dashboard</button>

      <br /><br />


<h3>Search Students</h3>

<input
  type="text"
  placeholder="Search Name"
  value={searchName}
  onChange={(e) => setSearchName(e.target.value)}
/>

<input
  type="text"
  placeholder="Admission No"
  value={searchAdmission}
  onChange={(e) => setSearchAdmission(e.target.value)}
/>

<input
  type="text"
  placeholder="Class"
  value={searchClass}
  onChange={(e) => setSearchClass(e.target.value)}
/>

<input
  type="text"
  placeholder="Section"
  value={searchSection}
  onChange={(e) => setSearchSection(e.target.value)}
/>

<br /><br />







      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Admission No</th>
            <th>Class</th>
            <th>Section</th>
            <th>Guardian Name</th>
            <th>Guardian Phone</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {filteredStudents.map((s) => (
            <tr key={s.student_id}>
              <td>{s.student_id}</td>
              <td>{s.name}</td>
              <td>{s.email}</td>
              <td>{s.admission_no}</td>
              <td>{s.class_name}</td>
              <td>{s.section_name}</td>
              <td>{s.guardian_name}</td>
              <td>{s.guardian_phone}</td>
              <td>
                <button
                  onClick={() =>
                    navigate("/edit-student", { state: { student: s } })
                  }
                >
                  Edit
                </button>

                <button onClick={() => handleDelete(s.student_id)}>
                  Delete
                </button>

                <button onClick={() => navigate("/admin-student-profile", { state: { student: s } })}>
  Profile
</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ViewStudents;