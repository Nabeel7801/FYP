const express = require("express");
const router = express.Router();

const Course = require("../models/coursesSchema")

router.get('/getCourses', (req, res) => {
    Course.find()
        .then(courses => res.json(courses))
        .catch(err => res.status(400).json({ error: err }))
})

router.get('/getCourseByID/:id', (req, res) => {
    Course.findById(req.params.id)
        .then(courses => res.json(courses))
        .catch(err => res.status(400).json({ error: err }))
})

router.get('/getMultipleCourses/:courses', (req, res) => {
    Course.find({ _id: { $in: req.params.courses.split(",") } })
        .then(courses => res.json(courses))
        .catch(err => res.status(400).json({ error: err }))
})

router.post('/addCourse', (req, res) => {
    const { CourseCode, CourseName, CreditHours, CourseType } = req.body;
    Course.find()
        .then((courses) => {
            const id = courses.length === 0 ? "0001" : ("0000" + String(parseInt(courses[courses.length - 1]._id) + 1)).slice(-4);
            const newCourse = new Course({ _id: id, CourseName: CourseName, CourseCode: CourseCode, CreditHours: CreditHours, CourseType: CourseType })

            newCourse.save()
                .then(() => res.json({ addedData: newCourse }))

        }).catch((err) => { res.status(500).json({ error: err }) })

})


router.post('/addCourses', (req, res) => {
    Course.insertMany(req.body)
        .then(() => res.json({}))
        .catch((err) => { res.status(500).json({ error: err }) })

})

router.post('/updateCourse/:id', (req, res) => {
    Course.findById(req.params.id)
        .then(courses => {

            courses.CourseName = req.body.CourseName
            courses.CourseCode = req.body.CourseCode
            courses.CreditHours = req.body.CreditHours
            courses.CourseType = req.body.CourseType

            courses.save()
                .then(() => res.json("Course Updated"))
                .catch(err => res.status(400).json("Error: " + err))
        })
        .catch(err => res.status(400).json("Error: " + err))

})

router.delete('/deleteCourse/:id', (req, res) => {
    Course.findByIdAndDelete(req.params.id)
        .then(() => res.status(201).json("Course Deleted"))
        .catch(err => res.status(400).json("Error: " + err))
})

module.exports = router