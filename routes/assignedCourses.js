const express = require("express");
const router = express.Router();

const AssignedCourse = require("../models/assignedCoursesSchema")

router.get('/getAssignedCourses', (req, res) => {
    AssignedCourse.find()
        .then(assignedCourses => res.json(assignedCourses))
        .catch(err => res.status(400).json({ error: err }))
})

router.get('/getAssignedCourseByID/:id', (req, res) => {
    AssignedCourse.findById(req.params.id)
        .then(assignedCourses => res.json(assignedCourses))
        .catch(err => res.status(400).json({ error: err }))
})

router.get('/getAssignedCoursesByFaculty/:facultyID', (req, res) => {
    AssignedCourse.find({Faculty: req.params.facultyID})
        .then(assignedCourses => res.json(assignedCourses))
        .catch(err => res.status(400).json({ error: err }))
})

router.get('/getAssignedCourseByDegreeSemDeptYear/:Degree/:Semester/:Department/:Year', (req, res) => {
    AssignedCourse.find({ Degree: req.params.Degree, Semester: req.params.Semester, Department: req.params.Department, Year: req.params.Year })
        .then(assignedCourses => res.json(assignedCourses))
        .catch(err => res.status(400).json({ error: err }))
})
router.get('/getAssignedByCourseNSemester/:Course/:Semester', (req, res) => {
    AssignedCourse.find({
        Course: { $in: req.params.Course.split(",") },
        Semester: req.params.Semester
    })
        .then(assignedCourses => res.json(assignedCourses))
        .catch(err => res.status(400).json({ error: err }))
})
router.get('/getMultipleAssignedCourses/:id', (req, res) => {
    AssignedCourse.find({ _id: { $in: req.params.id.split(",") } })
        .then(faculty => res.json(faculty))
        .catch(err => res.status(400).json({ error: err }))
})

router.post('/assignCourse', (req, res) => {
    const { Department,
        Semester,
        Degree,
        Course,
        Year,
        Faculty } = req.body;
    AssignedCourse.find()
        .then((assignedCourses) => {
            const id = assignedCourses.length === 0 ? "0001" : ("0000" + String(parseInt(assignedCourses[assignedCourses.length - 1]._id) + 1)).slice(-4);

            const newAssignedCourse = new AssignedCourse({
                _id: id, Department: Department, Semester: Semester, Degree: Degree, Course: Course,
                Faculty: Faculty, Year: Year
            })
            newAssignedCourse.save()
                .then(() => res.json({ addedData: newAssignedCourse }))

        }).catch((err) => { res.status(500).json({ error: err }) })

})


router.post('/AssignCourses', (req, res) => {
    AssignedCourse.insertMany(req.body)
        .then(() => res.json({}))
        .catch((err) => { res.status(500).json({ error: err }) })

})

router.post('/updateAssignedCourse/:id', (req, res) => {
    AssignedCourse.findById(req.params.id)
        .then(assignedCourses => {

            assignedCourses.Department = req.body.Department
            assignedCourses.Semester = req.body.Semester
            assignedCourses.Degree = req.body.Degree
            assignedCourses.Course = req.body.Course
            assignedCourses.Faculty = req.body.Faculty
            assignedCourses.Year = req.body.Year

            assignedCourses.save()
                .then(() => res.json("Assigned Course Updated"))
                .catch(err => res.status(400).json("Error: " + err))
        })
        .catch(err => res.status(400).json("Error: " + err))

})

router.delete('/deleteAssignedCourse/:id', (req, res) => {
    AssignedCourse.findByIdAndDelete(req.params.id)
        .then(() => res.status(201).json("AssignedCourse Deleted"))
        .catch(err => res.status(400).json("Error: " + err))
})

module.exports = router