const express = require("express");
const router = express.Router();

const Enrollment = require("../models/enrollmentsSchema")

router.get('/getEnrollments', (req, res) => {
    Enrollment.find()
        .then(enrollments => res.json(enrollments))
        .catch(err => res.status(400).json({ error: err }))
})

router.get('/getEnrollmentByID/:id', (req, res) => {
    Enrollment.findById(req.params.id)
        .then(enrollments => res.json(enrollments))
        .catch(err => res.status(400).json({ error: err }))
})

router.get('/getEnrollmentByAssignedCourse/:AssignedCourse', (req, res) => {
    Enrollment.find({AssignedCourse: { $in: req.params.AssignedCourse.split(",") } })
    .then(enrollments => res.json(enrollments))
    .catch(err => res.status(400).json({ error: err }))
})

router.get('/getEnrollmentByAssignedCourseStudent/:AssignedCourse/:Student', (req, res) => {
    Enrollment.find({
        AssignedCourse: { $in: req.params.AssignedCourse.split(",") },
        Student: req.params.Student
    })
        .then(enrollments => res.json(enrollments))
        .catch(err => res.status(400).json({ error: err }))
})

router.get('/getEnrollmentByStudent/:Student', (req, res) => {
    Enrollment.find({ Student: req.params.Student })
        .then(enrollments => res.json(enrollments))
        .catch(err => res.status(400).json({ error: err }))
})

router.get('/getResults/:id', (req, res) => {
    Enrollment.findById(req.params.id)
        .then(enrollments => res.json(enrollments.Result))
        .catch(err => res.status(400).json({ error: err }))
})

router.post('/addEnrollment', (req, res) => {
    const {
        AssignedCourse,
        Student } = req.body;
    Enrollment.find()
        .then((enrollments) => {
            const id = enrollments.length === 0 ? "0001" : ("0000" + String(parseInt(enrollments[enrollments.length - 1]._id) + 1)).slice(-4);
            const newEnrollment = new Enrollment({ _id: id, AssignedCourse: AssignedCourse, Student: Student })

            newEnrollment.save()
                .then(() => res.json({ id: id, addStatus: "Enrolled Successfully" }))

        }).catch((err) => { res.status(500).json({ error: err }) })

})

router.post('/updateEnrollment/:id', (req, res) => {
    Enrollment.findById(req.params.id)
        .then(enrollments => {

            enrollments.AssignedCourse = req.body.AssignedCourse
            enrollments.Student = req.body.Student

            enrollments.save()
                .then(() => res.json("Enrollment Updated"))
                .catch(err => res.status(400).json("Error: " + err))
        })
        .catch(err => res.status(400).json("Error: " + err))

})

router.delete('/deleteEnrollment/:id', (req, res) => {
    Enrollment.findByIdAndDelete(req.params.id)
        .then(() => res.status(201).json("Enrollment Deleted"))
        .catch(err => res.status(400).json("Error: " + err))
})

module.exports = router