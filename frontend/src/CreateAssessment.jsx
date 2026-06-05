import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

function CreateAssessment() {
  const navigate = useNavigate();
  const location = useLocation();
  const classInfo = location.state.classInfo;

  const [assessment, setAssessment] = useState({
    assessment_title: "",
    assessment_type: "",
    total_marks: "",
    assessment_date: "",
  });

  const handleChange = (e) => {
    setAssessment({
      ...assessment,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    if (
      !assessment.assessment_title ||
      !assessment.assessment_type ||
      !assessment.total_marks ||
      !assessment.assessment_date
    ) {
      alert("Please fill all fields");
      return;
    }

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/assessments`, {
        assignment_id: classInfo.assignment_id,
        ...assessment,
      });

      alert(res.data.message);
      navigate("/teacher-classes");
    } catch (err) {
      alert("Error creating assessment");
      console.log(err);
    }
  };

  return (
    <div>
      <h1>Create Assessment</h1>

      <h3>
        {classInfo.class_name} - Section {classInfo.section_name}
      </h3>

      <p>Subject: {classInfo.subject_name}</p>

      <input
        name="assessment_title"
        placeholder="Assessment Title"
        value={assessment.assessment_title}
        onChange={handleChange}
      />

      <br /><br />

      <select
        name="assessment_type"
        value={assessment.assessment_type}
        onChange={handleChange}
      >
        <option value="">Select Type</option>
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
        placeholder="Total Marks"
        value={assessment.total_marks}
        onChange={handleChange}
      />

      <br /><br />

      <input
        name="assessment_date"
        type="date"
        value={assessment.assessment_date}
        onChange={handleChange}
      />

      <br /><br />

      <button onClick={handleSubmit}>Create Assessment</button>

      <br /><br />

      <button onClick={() => navigate("/teacher-classes")}>Back</button>
    </div>
  );
}

export default CreateAssessment;