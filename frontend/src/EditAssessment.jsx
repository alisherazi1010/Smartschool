import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

function EditAssessment() {
  const navigate = useNavigate();
  const location = useLocation();

  const { classInfo, assessment } = location.state;

  const [formData, setFormData] = useState({
    assessment_title: assessment.assessment_title,
    assessment_type: assessment.assessment_type,
    total_marks: assessment.total_marks,
    assessment_date: assessment.assessment_date?.split("T")[0],
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async () => {
    try {
      const res = await axios.put(
        `http://localhost:5000/assessments/${assessment.assessment_id}`,
        formData
      );

      alert(res.data.message);
      navigate("/view-assessments", { state: { classInfo } });
    } catch (err) {
      alert("Error updating assessment");
      console.log(err);
    }
  };

  return (
    <div>
      <h1>Edit Assessment</h1>

      <input
        name="assessment_title"
        value={formData.assessment_title}
        onChange={handleChange}
      />

      <br /><br />

      <select
        name="assessment_type"
        value={formData.assessment_type}
        onChange={handleChange}
      >
        <option value="Test">Test</option>
        <option value="Assignment">Assignment</option>
        <option value="Quiz">Quiz</option>
        <option value="Project">Project</option>
        <option value="Presentation">Presentation</option>
        <option value="Mid Term">Mid Term</option>
        <option value="Final Term">Final Term</option>
      </select>

      <br /><br />

      <input
        name="total_marks"
        type="number"
        value={formData.total_marks}
        onChange={handleChange}
      />

      <br /><br />

      <input
        name="assessment_date"
        type="date"
        value={formData.assessment_date}
        onChange={handleChange}
      />

      <br /><br />

      <button onClick={handleUpdate}>Update Assessment</button>

      <br /><br />

      <button onClick={() => navigate("/view-assessments", { state: { classInfo } })}>
        Back
      </button>
    </div>
  );
}

export default EditAssessment;