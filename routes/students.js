const express = require("express");
const router = express.Router();

const Students = require("../models/studentsSchema")

router.get('/getStudents', (req, res) => {
    Students.find()
        .then(students => res.json(students))
        .catch(err => res.status(400).json({ error: err }))
})

router.get('/getStudentByID/:id', (req, res) => {
    Students.findById(req.params.id)
        .then(student => res.json(student))
        .catch(err => res.status(400).json({ error: err }))
})

router.get('/getMultipleStudentsByID/:id', (req, res) => {
    Students.find({_id: { $in: req.params.id.split(",") } })
        .then(students => res.json(students))
        .catch(err => res.status(400).json({ error: err }))
})

router.get('/getStudentByUserID/:userID', (req, res) => {
    Students.findOne({ UserID: req.params.userID })
        .then(student => res.json(student))
        .catch(err => res.status(400).json({ error: err }))
})

router.post('/addStudent', (req, res) => {
    const { UserID, Name, Institution, Career, Program, Semester, Email, Phone, Department } = req.body;

    Students.find()
        .then((students) => {
            const id = students.length === 0 ? "00000001" : ("00000000" + String(parseInt(students[students.length - 1]._id) + 1)).slice(-8);
            const newStudent = new Students({
                _id: id,
                UserID: UserID,
                Name: Name,
                Institution: Institution,
                Career: Career,
                Program: Program,
                Semester: Semester,
                Email: Email,
                Phone: Phone,
                Department: Department
            })
            newStudent.save()
                .then(() => res.json({ id: id, addStatus: "Student Added" }))

        }).catch((err) => { res.status(500).json({ error: err }) })

})


router.post('/addStudents', (req, res) => {
    Students.insertMany(req.body)
        .then(() => res.json({}))
        .catch((err) => { res.status(500).json({ error: err }) })

})

router.post('/updateStudent/:id', (req, res) => {
    Students.findById(req.params.id)
        .then(student => {
            student.Name = req.body.Name
            student.Institution = req.body.Institution
            student.Career = req.body.Career
            student.Program = req.body.Program
            student.Semester = req.body.Semester
            student.Email = req.body.Email
            student.Phone = req.body.Phone
            student.Department = req.body.Department

            student.save()
                .then(() => res.json({ PreviousImage: "" }))
                .catch(err => res.status(400).json("Error: " + err))
        })
        .catch(err => console.log(err))

})

router.post('/updateStudentWithoutImage/:id', (req, res) => {
    Students.findById(req.params.id)
        .then(student => {

            student.Name = req.body.Name
            student.Institution = req.body.Institution
            student.Career = req.body.Career
            student.Program = req.body.Program
            student.Semester = req.body.Semester
            student.Email = req.body.Email
            student.Phone = req.body.Phone
            student.Department = req.body.Department

            student.save()
                .then(() => res.json("Student Updated"))
                .catch(err => res.status(400).json("Error: " + err))
        })
        .catch(err => console.log(err))

})

router.delete('/deleteStudent/:id', (req, res) => {
    Students.findByIdAndDelete(req.params.id)
        .then(() => res.status(201).json("Student Deleted"))
        .catch(err => res.status(400).json("Error: " + err))
})

module.exports = router