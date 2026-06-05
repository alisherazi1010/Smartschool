import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./Login";
import AdminDashboard from "./AdminDashboard";
import TeacherDashboard from "./TeacherDashboard";
import StudentDashboard from "./StudentDashboard";
import AddStudent from "./AddStudent";
import ViewStudents from "./ViewStudents";
import EditStudent from "./EditStudent";
import ViewTeachers from "./ViewTeachers";
import AddTeacher from "./AddTeacher";
import EditTeacher from "./EditTeacher";
import AddSubject from "./AddSubject";
import ViewSubjects from "./ViewSubjects";
import AssignTeacher from "./AssignTeacher";
import ViewAssignments from "./ViewAssignments";
import TeacherClasses from "./TeacherClasses";
import MarkAttendance from "./MarkAttendance";
import ViewAttendance from "./ViewAttendance";
import CreateAssessment from "./CreateAssessment";
import ViewAssessments from "./ViewAssessments";
import EnterMarks from "./EnterMarks";
import ViewAssessmentResult from "./ViewAssessmentResult";
import StudentLogin from "./StudentLogin";
import StudentProfile from "./StudentProfile";
import StudentAttendance from "./StudentAttendance";
import StudentResults from "./StudentResults";
import StudentReportCard from "./StudentReportCard";
import AdminStudentProfile from "./AdminStudentProfile";
import EditAssessment from "./EditAssessment";
import "./styles.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/teacher" element={<TeacherDashboard />} />
        <Route path="/student" element={<StudentDashboard />} />
        <Route path="/add-student" element={<AddStudent />} />
        <Route path="/view-students" element={<ViewStudents />} />
        <Route path="/edit-student" element={<EditStudent />} />
        <Route path="/view-teachers" element={<ViewTeachers />} />
        <Route path="/add-teacher" element={<AddTeacher />} />
        <Route path="/edit-teacher" element={<EditTeacher />} />
        <Route path="/add-subject" element={<AddSubject />} />
        <Route path="/view-subjects" element={<ViewSubjects />} />
        <Route path="/assign-teacher" element={<AssignTeacher />} />
        <Route path="/view-assignments" element={<ViewAssignments />} />
        <Route path="/teacher-classes" element={<TeacherClasses />} />
        <Route path="/mark-attendance" element={<MarkAttendance />} />
        <Route path="/view-attendance" element={<ViewAttendance />} />
        <Route path="/create-assessment" element={<CreateAssessment />} />
        <Route path="/view-assessments" element={<ViewAssessments />} />
        <Route path="/enter-marks" element={<EnterMarks />} />
        <Route path="/assessment-result" element={<ViewAssessmentResult />} />
        <Route path="/student-login" element={<StudentLogin />} />
        <Route path="/student-profile" element={<StudentProfile />} />
        <Route path="/student-attendance" element={<StudentAttendance />} />
        <Route path="/student-results" element={<StudentResults />} />
        <Route path="/student-report-card" element={<StudentReportCard />} />
        <Route path="/admin-student-profile" element={<AdminStudentProfile />} />
        <Route path="/edit-assessment" element={<EditAssessment />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;