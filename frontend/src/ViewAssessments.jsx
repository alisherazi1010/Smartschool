import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

function ViewAssessments() {
  const navigate = useNavigate();
  const location = useLocation();
  const classInfo = location.state.classInfo;

  const [assessments, setAssessments] = useState([]);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/assessments/${classInfo.assignment_id}`)
      .then((res) => setAssessments(res.data))
      .catch((err) => console.log(err));
  }, [classInfo]);


const handleDelete = async (id) => {
  if (!window.confirm("Are you sure you want to delete this assessment?")) {
    return;
  }

  try {
    const res = await axios.delete(`${import.meta.env.VITE_API_URL}/assessments/${id}`);
    alert(res.data.message);

    setAssessments(assessments.filter((a) => a.assessment_id !== id));
  } catch (err) {
    alert("Error deleting assessment");
    console.log(err);
  }
};


  return (
    <div>
      <h1>Assessments</h1>

      <h3>
        {classInfo.class_name} - Section {classInfo.section_name}
      </h3>

      <p>Subject: {classInfo.subject_name}</p>

      <button onClick={() => navigate("/teacher-classes")}>Back</button>

      <br /><br />

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Title</th>
            <th>Type</th>
            <th>Total Marks</th>
            <th>Date</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {assessments.map((a) => (
            <tr key={a.assessment_id}>
              <td>{a.assessment_title}</td>
              <td>{a.assessment_type}</td>
              <td>{a.total_marks}</td>
              <td>{a.assessment_date?.split("T")[0]}</td>
              <td>
                <button
                  onClick={() =>
                    navigate("/enter-marks", {
                      state: { classInfo: classInfo, assessment: a },
                    })
                  }
                >
                  Enter Marks
                </button>
                <button
  onClick={() =>
    navigate("/assessment-result", {
      state: { classInfo: classInfo, assessment: a },
    })
  }
>
  View Result
</button>


<button
  onClick={() =>
    navigate("/edit-assessment", {
      state: { classInfo, assessment: a },
    })
  }
>
  Edit
</button>

<button onClick={() => handleDelete(a.assessment_id)}>
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

export default ViewAssessments;