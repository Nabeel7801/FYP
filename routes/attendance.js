const express = require("express");
const router = express.Router();

const Attendance = require("../models/attendancesSchema")

router.get('/getAttendance', (req, res) => {
    Attendance.find()
        .then(attendance => res.json(attendance))
        .catch(err => res.status(400).json({ error: err }))
})

router.get('/getAttendanceByID/:id', (req, res) => {
    Attendance.findById(req.params.id)
        .then(attendance => res.json(attendance))
        .catch(err => res.status(400).json({ error: err }))
})

router.get('/getAttendanceByDateEnrollment/:AttendanceDate/:EnrollmentID', (req, res) => {
    Attendance.find({
        EnrollmentID: req.params.EnrollmentID,
        Date: req.params.AttendanceDate
    })
    .then(enrollments => res.json(enrollments))
    .catch(err => res.status(400).json({ error: err }))
})

router.get('/getAttendanceByEnrollment/:enrollment', (req, res) => {
    Attendance.find({ EnrollmentID: { $in: req.params.enrollment.split(",") } })
        .then(attendance => res.json(attendance))
        .catch(err => res.status(400).json({ error: err }))
})

router.get('/getAttendanceByDate/:date', (req, res) => {
    Attendance.find({ Date: req.params.date })
        .then(attendance => res.json(attendance))
        .catch(err => res.status(400).json({ error: err }))
})

router.post('/addAttendance', (req, res) => {
    Attendance.insertMany(req.body)
        .then(() => res.json({}))
        .catch((err) => { res.status(500).json({ error: err }) })
})


router.post('/updateAttendance/:id', (req, res) => {
    Attendance.findById(req.params.id)
        .then(attendance => {

            attendance.Date = req.body.Date
            attendance.Status = req.body.Status
            attendance.EnrollmentID = req.body.EnrollmentID

            attendance.save()
                .then(() => res.json("Attendance Updated"))
                .catch(err => res.status(400).json("Error: " + err))
        })
        .catch(err => res.status(400).json("Error: " + err))

})

router.delete('/deleteAttendance/:id', (req, res) => {
    Attendance.findByIdAndDelete(req.params.id)
        .then(() => res.status(201).json("Attendance Deleted"))
        .catch(err => res.status(400).json("Error: " + err))
})

module.exports = router