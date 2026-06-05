import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

function EditTeacher() {
  const navigate = useNavigate();
  const location = useLocation();

  const [teacher, setTeacher] = useState(location.state.teacher);

  const handleChange = (e) => {
    setTeacher({
      ...teacher,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async () => {
    try {
      const res = await axios.put(
        `http://localhost:5000/teachers/${teacher.teacher_id}`,
        teacher
      );

      alert(res.data.message);
      navigate("/view-teachers");
    } catch (err) {
      alert("Error updating teacher");
      console.log(err);
    }
  };

  return (
    <div>
      <h1>Edit Teacher</h1>

      <input name="name" value={teacher.name} onChange={handleChange} />
      <br /><br />

      <input name="email" value={teacher.email} onChange={handleChange} />
      <br /><br />

      <input
        name="qualification"
        value={teacher.qualification}
        onChange={handleChange}
      />
      <br /><br />

      <input name="phone" value={teacher.phone} onChange={handleChange} />
      <br /><br />

      <button onClick={handleUpdate}>Update Teacher</button>
      <br /><br />

      <button onClick={() => navigate("/view-teachers")}>Back</button>
    </div>
  );
}

export default EditTeacher;