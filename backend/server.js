require("dotenv").config();

const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend is running");
});

app.get("/test-db", (req, res) => {
  db.query("SELECT * FROM users", (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.query(
    "SELECT * FROM users WHERE email = ? AND password = ?",
    [email, password],
    (err, result) => {
      if (err) return res.status(500).json(err);

      if (result.length === 0) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      res.json({
        message: "Login successful",
        user: result[0],
      });
    }
  );
});



//studentinsert
app.post("/students", (req, res) => {
  const {
    name,
    email,
    password,
    admission_no,
    class_id,
    section_id,
    admission_date,
    guardian_name,
    guardian_phone,
  } = req.body;

  db.query(
    "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, 'student')",
    [name, email, password],
    (err, userResult) => {
      if (err) return res.status(500).json(err);

      const userId = userResult.insertId;

      db.query(
        `INSERT INTO students 
        (user_id, admission_no, class_id, section_id, admission_date, guardian_name, guardian_phone) 
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [userId, admission_no, class_id, section_id, admission_date, guardian_name, guardian_phone],
        (err) => {
          if (err) return res.status(500).json(err);

          res.json({ message: "Student added successfully" });
        }
      );
    }
  );
});


app.get("/students", (req, res) => {
  const query = `
    SELECT 
      students.student_id,
      students.class_id,
      students.section_id,
      users.name,
      users.email,
      students.admission_no,
      students.admission_date,
      students.leaving_date,
      students.status,
      classes.class_name,
      sections.section_name,
      students.guardian_name,
      students.guardian_phone
    FROM students
    JOIN users ON students.user_id = users.user_id
    JOIN classes ON students.class_id = classes.class_id
    JOIN sections ON students.section_id = sections.section_id
  `;

  db.query(query, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});





app.delete("/students/:id", (req, res) => {
  const studentId = req.params.id;

  db.query(
    "SELECT user_id FROM students WHERE student_id = ?",
    [studentId],
    (err, result) => {
      if (err) return res.status(500).json(err);

      if (result.length === 0) {
        return res.status(404).json({ message: "Student not found" });
      }

      const userId = result[0].user_id;

      db.query("DELETE FROM students WHERE student_id = ?", [studentId], (err) => {
        if (err) return res.status(500).json(err);

        db.query("DELETE FROM users WHERE user_id = ?", [userId], (err) => {
          if (err) return res.status(500).json(err);

          res.json({ message: "Student deleted successfully" });
        });
      });
    }
  );
});







app.put("/students/:id", (req, res) => {
  const studentId = req.params.id;

  const {
    name,
    email,
    admission_no,
    class_id,
    section_id,
    admission_date,
    leaving_date,
    status,
    guardian_name,
    guardian_phone,
  } = req.body;

  db.query(
    "SELECT user_id FROM students WHERE student_id = ?",
    [studentId],
    (err, result) => {
      if (err) return res.status(500).json(err);

      if (result.length === 0) {
        return res.status(404).json({ message: "Student not found" });
      }

      const userId = result[0].user_id;

      db.query(
        "UPDATE users SET name=?, email=? WHERE user_id=?",
        [name, email, userId],
        (err) => {
          if (err) return res.status(500).json(err);

          db.query(
            `UPDATE students 
             SET admission_no=?, class_id=?, section_id=?, admission_date=?, leaving_date=?, status=?, guardian_name=?, guardian_phone=? 
             WHERE student_id=?`,
            [
              admission_no,
              class_id,
              section_id,
              admission_date || null,
              leaving_date || null,
              status || "active",
              guardian_name,
              guardian_phone,
              studentId,
            ],
            (err) => {
              if (err) return res.status(500).json(err);

              res.json({ message: "Student updated successfully" });
            }
          );
        }
      );
    }
  );
});



//teacher


app.post("/teachers", (req, res) => {
  const {
    name,
    email,
    password,
    qualification,
    phone,
    joining_date
  } = req.body;

  db.query(
    "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, 'teacher')",
    [name, email, password],
    (err, userResult) => {
      if (err) return res.status(500).json(err);

      const userId = userResult.insertId;

      db.query(
        "INSERT INTO teachers (user_id, qualification, phone, joining_date) VALUES (?, ?, ?, ?)",
        [userId, qualification, phone, joining_date],
        (err) => {
          if (err) return res.status(500).json(err);

          res.json({
            message: "Teacher added successfully"
          });
        }
      );
    }
  );
});








app.get("/teachers", (req, res) => {
  const query = `
    SELECT
      teachers.teacher_id,
      users.name,
      users.email,
      teachers.qualification,
      teachers.phone,
      teachers.joining_date,
      teachers.leaving_date,
      teachers.status
    FROM teachers
    JOIN users
      ON teachers.user_id = users.user_id
  `;

  db.query(query, (err, result) => {
    if (err) return res.status(500).json(err);

    res.json(result);
  });
});

app.get("/teacher-profile/:userId", (req, res) => {
  const userId = req.params.userId;

  const query = `
    SELECT
      teachers.teacher_id,
      teachers.qualification,
      teachers.phone,
      teachers.joining_date,
      teachers.leaving_date,
      teachers.status,
      users.user_id,
      users.name,
      users.email
    FROM teachers
    JOIN users
      ON teachers.user_id = users.user_id
    WHERE teachers.user_id = ?
  `;

  db.query(query, [userId], (err, result) => {
    if (err) return res.status(500).json(err);

    if (result.length === 0) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    res.json(result[0]);
  });
});




app.delete("/teachers/:id", (req, res) => {
  const teacherId = req.params.id;

  db.query(
    "SELECT user_id FROM teachers WHERE teacher_id = ?",
    [teacherId],
    (err, result) => {
      if (err) return res.status(500).json(err);

      if (result.length === 0) {
        return res.status(404).json({ message: "Teacher not found" });
      }

      const userId = result[0].user_id;

      db.query("DELETE FROM teachers WHERE teacher_id = ?", [teacherId], (err) => {
        if (err) return res.status(500).json(err);

        db.query("DELETE FROM users WHERE user_id = ?", [userId], (err) => {
          if (err) return res.status(500).json(err);

          res.json({ message: "Teacher deleted successfully" });
        });
      });
    }
  );
});


app.put("/teachers/:id", (req, res) => {
  const teacherId = req.params.id;
  const { name, email, qualification, phone, joining_date, leaving_date, status } = req.body;

  db.query(
    "SELECT user_id FROM teachers WHERE teacher_id = ?",
    [teacherId],
    (err, result) => {
      if (err) return res.status(500).json(err);

      if (result.length === 0) {
        return res.status(404).json({ message: "Teacher not found" });
      }

      const userId = result[0].user_id;

      db.query(
        "UPDATE users SET name=?, email=? WHERE user_id=?",
        [name, email, userId],
        (err) => {
          if (err) return res.status(500).json(err);

          db.query(
            "UPDATE teachers SET qualification=?, phone=?, joining_date=?, leaving_date=?, status=? WHERE teacher_id=?",
            [qualification, phone, joining_date || null, leaving_date || null, status || "active", teacherId],
            (err) => {
              if (err) return res.status(500).json(err);

              res.json({ message: "Teacher updated successfully" });
            }
          );
        }
      );
    }
  );
});


//subjects

app.post("/subjects", (req, res) => {
  const { subject_name } = req.body;

  db.query(
    "INSERT INTO subjects (subject_name) VALUES (?)",
    [subject_name],
    (err) => {
      if (err) return res.status(500).json(err);

      res.json({
        message: "Subject added successfully",
      });
    }
  );
});


app.get("/subjects", (req, res) => {
  db.query(
    "SELECT * FROM subjects",
    (err, result) => {
      if (err) return res.status(500).json(err);

      res.json(result);
    }
  );
});


//assignmentteacher

app.post("/teacher-assignments", (req, res) => {
  const { teacher_id, class_id, section_id, subject_id } = req.body;

  db.query(
    `INSERT INTO teacher_assignments 
     (teacher_id, class_id, section_id, subject_id)
     VALUES (?, ?, ?, ?)`,
    [teacher_id, class_id, section_id, subject_id],
    (err) => {
      if (err) return res.status(500).json(err);

      res.json({ message: "Teacher assigned successfully" });
    }
  );
});


app.get("/teacher-assignments", (req, res) => {
  const query = `
    SELECT 
      teacher_assignments.assignment_id,
      teacher_assignments.teacher_id,
      teacher_assignments.class_id,
      teacher_assignments.section_id,
      teacher_assignments.subject_id,
      users.name AS teacher_name,
      classes.class_name,
      sections.section_name,
      subjects.subject_name
    FROM teacher_assignments
    JOIN teachers ON teacher_assignments.teacher_id = teachers.teacher_id
    JOIN users ON teachers.user_id = users.user_id
    JOIN classes ON teacher_assignments.class_id = classes.class_id
    JOIN sections ON teacher_assignments.section_id = sections.section_id
    JOIN subjects ON teacher_assignments.subject_id = subjects.subject_id
  `;

  db.query(query, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

app.put("/teacher-assignments/:id", (req, res) => {
  const assignmentId = req.params.id;
  const { teacher_id, class_id, section_id, subject_id } = req.body;

  const query = `
    UPDATE teacher_assignments
    SET teacher_id = ?,
        class_id = ?,
        section_id = ?,
        subject_id = ?
    WHERE assignment_id = ?
  `;

  db.query(
    query,
    [teacher_id, class_id, section_id, subject_id, assignmentId],
    (err, result) => {
      if (err) return res.status(500).json(err);

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Assignment not found" });
      }

      res.json({ message: "Assignment updated successfully" });
    }
  );
});

const ensureTimetableTable = (callback) => {
  const query = `
    CREATE TABLE IF NOT EXISTS timetable_slots (
      timetable_id INT AUTO_INCREMENT PRIMARY KEY,
      assignment_id INT NOT NULL,
      day_name VARCHAR(20) NOT NULL,
      period_number INT NOT NULL,
      start_time TIME NULL,
      end_time TIME NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (assignment_id) REFERENCES teacher_assignments(assignment_id)
    )
  `;

  db.query(query, callback);
};

const addMinutesToTime = (time, minutesToAdd) => {
  const [hours, minutes] = time.split(":").map(Number);
  const date = new Date(2000, 0, 1, hours, minutes);
  date.setMinutes(date.getMinutes() + minutesToAdd);

  return `${String(date.getHours()).padStart(2, "0")}:${String(
    date.getMinutes()
  ).padStart(2, "0")}:00`;
};

app.get("/timetable", (req, res) => {
  ensureTimetableTable((tableErr) => {
    if (tableErr) return res.status(500).json(tableErr);

    const query = `
      SELECT
        timetable_slots.timetable_id,
        timetable_slots.assignment_id,
        timetable_slots.day_name,
        timetable_slots.period_number,
        timetable_slots.start_time,
        timetable_slots.end_time,
        teacher_assignments.teacher_id,
        teacher_assignments.class_id,
        teacher_assignments.section_id,
        teacher_assignments.subject_id,
        users.name AS teacher_name,
        classes.class_name,
        sections.section_name,
        subjects.subject_name
      FROM timetable_slots
      JOIN teacher_assignments
        ON timetable_slots.assignment_id = teacher_assignments.assignment_id
      JOIN teachers
        ON teacher_assignments.teacher_id = teachers.teacher_id
      JOIN users
        ON teachers.user_id = users.user_id
      JOIN classes
        ON teacher_assignments.class_id = classes.class_id
      JOIN sections
        ON teacher_assignments.section_id = sections.section_id
      JOIN subjects
        ON teacher_assignments.subject_id = subjects.subject_id
      ORDER BY
        FIELD(timetable_slots.day_name, 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'),
        timetable_slots.period_number,
        classes.class_id,
        sections.section_id
    `;

    db.query(query, (err, result) => {
      if (err) return res.status(500).json(err);
      res.json(result);
    });
  });
});

app.post("/timetable/generate", (req, res) => {
  const {
    days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    periods_per_day = 6,
    start_time = "08:00",
    period_minutes = 40,
    periods_per_assignment = 3,
  } = req.body;

  const assignmentQuery = `
    SELECT
      teacher_assignments.assignment_id,
      teacher_assignments.teacher_id,
      teacher_assignments.class_id,
      teacher_assignments.section_id,
      teacher_assignments.subject_id,
      users.name AS teacher_name,
      classes.class_name,
      sections.section_name,
      subjects.subject_name
    FROM teacher_assignments
    JOIN teachers ON teacher_assignments.teacher_id = teachers.teacher_id
    JOIN users ON teachers.user_id = users.user_id
    JOIN classes ON teacher_assignments.class_id = classes.class_id
    JOIN sections ON teacher_assignments.section_id = sections.section_id
    JOIN subjects ON teacher_assignments.subject_id = subjects.subject_id
    ORDER BY classes.class_id, sections.section_id, subjects.subject_name
  `;

  ensureTimetableTable((tableErr) => {
    if (tableErr) return res.status(500).json(tableErr);

    db.query(assignmentQuery, (assignmentErr, assignments) => {
      if (assignmentErr) return res.status(500).json(assignmentErr);

      if (assignments.length === 0) {
        return res.status(400).json({
          message: "No teacher assignments found",
        });
      }

      const slots = [];
      days.forEach((day) => {
        for (let period = 1; period <= Number(periods_per_day); period += 1) {
          const offset = (period - 1) * Number(period_minutes);
          slots.push({
            day_name: day,
            period_number: period,
            start_time: addMinutesToTime(start_time, offset),
            end_time: addMinutesToTime(start_time, offset + Number(period_minutes)),
          });
        }
      });

      const teacherBusy = new Set();
      const classBusy = new Set();
      const generated = [];
      const unplaced = [];

      const requests = assignments.flatMap((assignment) =>
        Array.from({ length: Number(periods_per_assignment) }, () => assignment)
      );

      requests.forEach((assignment) => {
        const placedCountForAssignment = generated.filter(
          (slot) => slot.assignment_id === assignment.assignment_id
        ).length;

        const preferredSlots = slots
          .map((slot, index) => ({ ...slot, index }))
          .sort((a, b) => {
            const aSameSubjectDay = generated.some(
              (item) =>
                item.assignment_id === assignment.assignment_id &&
                item.day_name === a.day_name
            );
            const bSameSubjectDay = generated.some(
              (item) =>
                item.assignment_id === assignment.assignment_id &&
                item.day_name === b.day_name
            );

            if (aSameSubjectDay !== bSameSubjectDay) {
              return aSameSubjectDay ? 1 : -1;
            }

            return (a.index + placedCountForAssignment) - b.index;
          });

        const availableSlot = preferredSlots.find((slot) => {
          const teacherKey = `${slot.day_name}-${slot.period_number}-teacher-${assignment.teacher_id}`;
          const classKey = `${slot.day_name}-${slot.period_number}-class-${assignment.class_id}-${assignment.section_id}`;

          return !teacherBusy.has(teacherKey) && !classBusy.has(classKey);
        });

        if (!availableSlot) {
          unplaced.push(assignment);
          return;
        }

        teacherBusy.add(
          `${availableSlot.day_name}-${availableSlot.period_number}-teacher-${assignment.teacher_id}`
        );
        classBusy.add(
          `${availableSlot.day_name}-${availableSlot.period_number}-class-${assignment.class_id}-${assignment.section_id}`
        );

        generated.push({
          ...assignment,
          day_name: availableSlot.day_name,
          period_number: availableSlot.period_number,
          start_time: availableSlot.start_time,
          end_time: availableSlot.end_time,
        });
      });

      db.query("DELETE FROM timetable_slots", (deleteErr) => {
        if (deleteErr) return res.status(500).json(deleteErr);

        if (generated.length === 0) {
          return res.status(400).json({
            message: "Could not place any timetable slots",
            unplaced,
          });
        }

        const values = generated.map((slot) => [
          slot.assignment_id,
          slot.day_name,
          slot.period_number,
          slot.start_time,
          slot.end_time,
        ]);

        db.query(
          `INSERT INTO timetable_slots
           (assignment_id, day_name, period_number, start_time, end_time)
           VALUES ?`,
          [values],
          (insertErr) => {
            if (insertErr) return res.status(500).json(insertErr);

            res.json({
              message: "Timetable generated successfully",
              generated,
              unplaced,
            });
          }
        );
      });
    });
  });
});





app.get("/teacher-classes/:userId", (req, res) => {
  const userId = req.params.userId;

  const query = `
    SELECT 
      teacher_assignments.assignment_id,
      teacher_assignments.class_id,
      teacher_assignments.section_id,
      teacher_assignments.subject_id,
      classes.class_name,
      sections.section_name,
      subjects.subject_name
    FROM teacher_assignments
    JOIN teachers ON teacher_assignments.teacher_id = teachers.teacher_id
    JOIN classes ON teacher_assignments.class_id = classes.class_id
    JOIN sections ON teacher_assignments.section_id = sections.section_id
    JOIN subjects ON teacher_assignments.subject_id = subjects.subject_id
    WHERE teachers.user_id = ?
  `;

  db.query(query, [userId], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});




//getstudentsofaclass
app.get("/students-by-class-section/:classId/:sectionId", (req, res) => {
  const { classId, sectionId } = req.params;

  const query = `
    SELECT
      student_id,
      admission_no,
      guardian_name,
      guardian_phone,
      users.name
    FROM students
    JOIN users ON students.user_id = users.user_id
    WHERE class_id = ? AND section_id = ?
  `;

  db.query(query, [classId, sectionId], (err, result) => {
    if (err) return res.status(500).json(err);

    res.json(result);
  });
});




app.post("/attendance", (req, res) => {
  const { assignment_id, attendance_date, attendance } = req.body;

  const values = Object.keys(attendance).map((studentId) => [
    studentId,
    assignment_id,
    attendance_date,
    attendance[studentId],
  ]);

  const query = `
    INSERT INTO attendance 
    (student_id, assignment_id, attendance_date, status)
    VALUES ?
    ON DUPLICATE KEY UPDATE status = VALUES(status)
  `;

  db.query(query, [values], (err) => {
    if (err) return res.status(500).json(err);

    res.json({ message: "Attendance saved successfully" });
  });
});






//view atttendance

app.get("/attendance/:assignmentId", (req, res) => {
  const assignmentId = req.params.assignmentId;

  const query = `
    SELECT
      attendance.attendance_id,
      attendance.attendance_date,
      attendance.status,
      students.admission_no,
      users.name
    FROM attendance
    JOIN students
      ON attendance.student_id = students.student_id
    JOIN users
      ON students.user_id = users.user_id
    WHERE attendance.assignment_id = ?
    ORDER BY attendance.attendance_date DESC
  `;

  db.query(query, [assignmentId], (err, result) => {
    if (err) return res.status(500).json(err);

    res.json(result);
  });
});


//attendacebymonth
app.get("/attendance-month/:assignmentId/:year/:month", (req, res) => {
  const { assignmentId, year, month } = req.params;

  const query = `
    SELECT
      students.student_id,
      students.admission_no,
      users.name,

      DAY(attendance.attendance_date) AS day,
      attendance.status,

      (
        SELECT COUNT(*) 
        FROM attendance a 
        WHERE a.student_id = students.student_id 
        AND a.assignment_id = ?
        AND a.status = 'Present'
      ) AS total_present,

      (
        SELECT COUNT(*) 
        FROM attendance a 
        WHERE a.student_id = students.student_id 
        AND a.assignment_id = ?
        AND a.status = 'Absent'
      ) AS total_absent,

      (
        SELECT COUNT(*) 
        FROM attendance a 
        WHERE a.student_id = students.student_id 
        AND a.assignment_id = ?
        AND a.status = 'Late'
      ) AS total_late

    FROM students
    JOIN users ON students.user_id = users.user_id
    JOIN teacher_assignments 
      ON students.class_id = teacher_assignments.class_id
      AND students.section_id = teacher_assignments.section_id

    LEFT JOIN attendance 
      ON attendance.student_id = students.student_id
      AND attendance.assignment_id = teacher_assignments.assignment_id
      AND YEAR(attendance.attendance_date) = ?
      AND MONTH(attendance.attendance_date) = ?

    WHERE teacher_assignments.assignment_id = ?
    ORDER BY users.name
  `;

  db.query(
    query,
    [assignmentId, assignmentId, assignmentId, year, month, assignmentId],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json(result);
    }
  );
});




app.put("/attendance-cell", (req, res) => {
  const { student_id, assignment_id, attendance_date, status } = req.body;

  const query = `
    INSERT INTO attendance 
    (student_id, assignment_id, attendance_date, status)
    VALUES (?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE status = VALUES(status)
  `;

  db.query(
    query,
    [student_id, assignment_id, attendance_date, status],
    (err) => {
      if (err) return res.status(500).json(err);

      res.json({ message: "Attendance updated successfully" });
    }
  );
});



//assesments
app.post("/assessments", (req, res) => {
  const {
    assignment_id,
    assessment_title,
    assessment_type,
    total_marks,
    assessment_date,
  } = req.body;

  const query = `
    INSERT INTO assessments
    (assignment_id, assessment_title, assessment_type, total_marks, assessment_date)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(
    query,
    [assignment_id, assessment_title, assessment_type, total_marks, assessment_date],
    (err) => {
      if (err) return res.status(500).json(err);

      res.json({ message: "Assessment created successfully" });
    }
  );
});











app.get("/assessments/:assignmentId", (req, res) => {
  const assignmentId = req.params.assignmentId;

  const query = `
    SELECT *
    FROM assessments
    WHERE assignment_id = ?
    ORDER BY assessment_date DESC
  `;

  db.query(query, [assignmentId], (err, result) => {
    if (err) return res.status(500).json(err);

    res.json(result);
  });
});

//savemarks
app.post("/student-marks", (req, res) => {
  const { assessment_id, marks } = req.body;

  const values = Object.keys(marks).map((studentId) => [
    assessment_id,
    studentId,
    marks[studentId],
  ]);

  const query = `
    INSERT INTO student_marks
    (assessment_id, student_id, obtained_marks)
    VALUES ?
    ON DUPLICATE KEY UPDATE obtained_marks = VALUES(obtained_marks)
  `;

  db.query(query, [values], (err) => {
    if (err) return res.status(500).json(err);

    res.json({ message: "Marks saved successfully" });
  });
});




app.get("/student-marks/:assessmentId", (req, res) => {
  const assessmentId = req.params.assessmentId;

  const query = `
    SELECT student_id, obtained_marks
    FROM student_marks
    WHERE assessment_id = ?
  `;

  db.query(query, [assessmentId], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});





app.get("/assessment-results/:assessmentId", (req, res) => {
  const assessmentId = req.params.assessmentId;

  const query = `
    SELECT
      student_marks.mark_id,
      students.admission_no,
      users.name,
      student_marks.obtained_marks
    FROM student_marks
    JOIN students ON student_marks.student_id = students.student_id
    JOIN users ON students.user_id = users.user_id
    WHERE student_marks.assessment_id = ?
  `;

  db.query(query, [assessmentId], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});



//studentlogin

app.post("/student-login", (req, res) => {
  const { admission_no, password } = req.body;

  const query = `
    SELECT 
      students.student_id,
      students.user_id,
      students.admission_no,
      users.name,
      users.password
    FROM students
    JOIN users ON students.user_id = users.user_id
    WHERE students.admission_no = ?
    AND users.password = ?
  `;

  db.query(query, [admission_no, password], (err, result) => {
    if (err) return res.status(500).json(err);

    if (result.length === 0) {
      return res.status(401).json({ message: "Invalid admission number or password" });
    }

    res.json({
      message: "Student login successful",
      student: result[0],
    });
  });
});





//studentdetails

app.get("/student-profile/:studentId", (req, res) => {
  const studentId = req.params.studentId;

  const query = `
    SELECT
      students.student_id,
      students.admission_no,
      students.admission_date,
      students.leaving_date,
      students.status,
      users.name,
      users.email,
      classes.class_name,
      sections.section_name,
      students.guardian_name,
      students.guardian_phone
    FROM students
    JOIN users ON students.user_id = users.user_id
    JOIN classes ON students.class_id = classes.class_id
    JOIN sections ON students.section_id = sections.section_id
    WHERE students.student_id = ?
  `;

  db.query(query, [studentId], (err, result) => {
    if (err) return res.status(500).json(err);

    res.json(result[0]);
  });
});









app.get("/student-attendance/:studentId", (req, res) => {
  const studentId = req.params.studentId;

  const query = `
    SELECT
      subjects.subject_name,
      classes.class_name,
      sections.section_name,

      SUM(CASE WHEN attendance.status = 'Present' THEN 1 ELSE 0 END) AS present_count,
      SUM(CASE WHEN attendance.status = 'Absent' THEN 1 ELSE 0 END) AS absent_count,
      SUM(CASE WHEN attendance.status = 'Late' THEN 1 ELSE 0 END) AS late_count,
      COUNT(attendance.attendance_id) AS total_classes

    FROM attendance
    JOIN teacher_assignments 
      ON attendance.assignment_id = teacher_assignments.assignment_id
    JOIN subjects ON teacher_assignments.subject_id = subjects.subject_id
    JOIN classes ON teacher_assignments.class_id = classes.class_id
    JOIN sections ON teacher_assignments.section_id = sections.section_id

    WHERE attendance.student_id = ?

    GROUP BY 
      teacher_assignments.assignment_id,
      subjects.subject_name,
      classes.class_name,
      sections.section_name
  `;

  db.query(query, [studentId], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});








app.get("/student-results/:studentId", (req, res) => {
  const studentId = req.params.studentId;

  const query = `
    SELECT
      subjects.subject_name,
      assessments.assessment_title,
      assessments.assessment_type,
      assessments.total_marks,
      assessments.assessment_date,
      student_marks.obtained_marks
    FROM student_marks
    JOIN assessments 
      ON student_marks.assessment_id = assessments.assessment_id
    JOIN teacher_assignments 
      ON assessments.assignment_id = teacher_assignments.assignment_id
    JOIN subjects 
      ON teacher_assignments.subject_id = subjects.subject_id
    WHERE student_marks.student_id = ?
    ORDER BY assessments.assessment_date DESC
  `;

  db.query(query, [studentId], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});








//result card
app.get("/report-card/:studentId/:examType", (req, res) => {
  const { studentId, examType } = req.params;

  const query = `
    SELECT
      subjects.subject_name,
      assessments.total_marks AS full_marks,
      student_marks.obtained_marks,

      (
        SELECT ROUND(AVG(sm2.obtained_marks), 2)
        FROM student_marks sm2
        JOIN assessments a2 ON sm2.assessment_id = a2.assessment_id
        WHERE a2.assignment_id = assessments.assignment_id
        AND a2.assessment_type = ?
      ) AS average_marks,

      (
        SELECT MAX(sm3.obtained_marks)
        FROM student_marks sm3
        JOIN assessments a3 ON sm3.assessment_id = a3.assessment_id
        WHERE a3.assignment_id = assessments.assignment_id
        AND a3.assessment_type = ?
      ) AS highest_marks

    FROM student_marks
    JOIN assessments 
      ON student_marks.assessment_id = assessments.assessment_id
    JOIN teacher_assignments 
      ON assessments.assignment_id = teacher_assignments.assignment_id
    JOIN subjects 
      ON teacher_assignments.subject_id = subjects.subject_id

    WHERE student_marks.student_id = ?
    AND assessments.assessment_type = ?
  `;

  db.query(query, [examType, examType, studentId, examType], (err, result) => {
    if (err) return res.status(500).json(err);

    res.json(result);
  });
});






//admindashboardstats

app.get("/dashboard-stats", (req, res) => {
  const stats = {};

  db.query("SELECT COUNT(*) AS totalStudents FROM students", (err, studentResult) => {
    if (err) return res.status(500).json(err);

    stats.totalStudents = studentResult[0].totalStudents;

    db.query("SELECT COUNT(*) AS totalTeachers FROM teachers", (err, teacherResult) => {
      if (err) return res.status(500).json(err);

      stats.totalTeachers = teacherResult[0].totalTeachers;

      db.query("SELECT COUNT(*) AS totalSubjects FROM subjects", (err, subjectResult) => {
        if (err) return res.status(500).json(err);

        stats.totalSubjects = subjectResult[0].totalSubjects;

        db.query("SELECT COUNT(*) AS totalClasses FROM classes", (err, classResult) => {
          if (err) return res.status(500).json(err);

          stats.totalClasses = classResult[0].totalClasses;

          res.json(stats);
        });
      });
    });
  });
});





//assesmentupdate/delete
app.delete("/assessments/:id", (req, res) => {
  const assessmentId = req.params.id;

  db.query(
    "DELETE FROM student_marks WHERE assessment_id = ?",
    [assessmentId],
    (err) => {
      if (err) return res.status(500).json(err);

      db.query(
        "DELETE FROM assessments WHERE assessment_id = ?",
        [assessmentId],
        (err) => {
          if (err) return res.status(500).json(err);

          res.json({ message: "Assessment deleted successfully" });
        }
      );
    }
  );
});




//updateassesment


app.put("/assessments/:id", (req, res) => {
  const assessmentId = req.params.id;

  const {
    assessment_title,
    assessment_type,
    total_marks,
    assessment_date,
  } = req.body;

  const query = `
    UPDATE assessments
    SET assessment_title = ?,
        assessment_type = ?,
        total_marks = ?,
        assessment_date = ?
    WHERE assessment_id = ?
  `;

  db.query(
    query,
    [
      assessment_title,
      assessment_type,
      total_marks,
      assessment_date,
      assessmentId,
    ],
    (err) => {
      if (err) return res.status(500).json(err);

      res.json({ message: "Assessment updated successfully" });
    }
  );
});






app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
