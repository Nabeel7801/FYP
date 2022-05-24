const express = require("express");
const router = express.Router();

const Degree = require("../models/degreesSchema")

router.get('/getDegrees', (req, res) => {
    Degree.find()
        .then(degrees => res.json(degrees))
        .catch(err => res.status(400).json({ error: err }))
})

router.get('/getDegreeByID/:id', (req, res) => {
    Degree.findById(req.params.id)
        .then(degrees => res.json(degrees))
        .catch(err => res.status(400).json({ error: err }))
})

router.post('/addDegree', (req, res) => {
    const {
        DegreeName,
        CreditHours,
        Department,
        Semester } = req.body;
    Degree.find()
        .then((degrees) => {
            const id = degrees.length === 0 ? "0001" : ("0000" + String(parseInt(degrees[degrees.length - 1]._id) + 1)).slice(-4);
            const newDegree = new Degree({ _id: id, DegreeName: DegreeName, Department: Department, CreditHours: CreditHours, Semester: Semester })

            newDegree.save()
                .then(() => res.json({ id: id, addStatus: "Degree Added" }))

        }).catch((err) => { res.status(500).json({ error: err }) })

})


router.post('/addDegree', (req, res) => {
    Degree.insertMany(req.body)
        .then(() => res.json({}))
        .catch((err) => { res.status(500).json({ error: err }) })

})

router.post('/updateDegree/:id', (req, res) => {
    Degree.findById(req.params.id)
        .then(degrees => {

            degrees.DegreeName = req.body.DegreeName
            degrees.Department = req.body.Department
            degrees.CreditHours = req.body.CreditHours
            degrees.Semester = req.body.Semester

            degrees.save()
                .then(() => res.json("Degree Updated"))
                .catch(err => res.status(400).json("Error: " + err))
        })
        .catch(err => res.status(400).json("Error: " + err))

})

router.delete('/deleteDegree/:id', (req, res) => {
    Degree.findByIdAndDelete(req.params.id)
        .then(() => res.status(201).json("Degree Deleted"))
        .catch(err => res.status(400).json("Error: " + err))
})

module.exports = router