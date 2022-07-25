const express = require("express");
const router = express.Router();

const Faculty = require("../models/facultySchema")

router.get('/getFaculty', (req, res) => {
    Faculty.find()
        .then(faculty => res.json(faculty))
        .catch(err => res.status(400).json({ error: err }))
})

router.get('/getFacultyByID/:id', (req, res) => {
    Faculty.findById(req.params.id)
        .then(faculty => res.json(faculty))
        .catch(err => res.status(400).json({ error: err }))
})

router.get('/getFacultyByUserID/:userID', (req, res) => {
    Faculty.findOne({ UserID: req.params.userID })
        .then(faculty => res.json(faculty))
        .catch(err => res.status(400).json({ error: err }))
})

router.post('/addFaculty', (req, res) => {
    const { FacultyName, FacultyPhone, FacultyEmail, CNIC, UserID, FacultyDepartment, FacultyRank, DOB, Address, City, State, PostalCode } = req.body;
    
    Faculty.findOne({}, {}, { sort: { '_id' : -1 } })
    .then(faculty => {
        const id = !faculty ? "000001" : ("000000" + String(parseInt(faculty._id) + 1)).slice(-6);
        const newFaculty = new Faculty({ _id: id, FacultyName: FacultyName, FacultyPhone: FacultyPhone, FacultyEmail: FacultyEmail, CNIC: CNIC, UserID: UserID, FacultyDepartment: FacultyDepartment, FacultyRank: FacultyRank, DOB: DOB, Address: Address, City: City, State: State, PostalCode: PostalCode })

        newFaculty.save()
            .then(() => res.json({ id: id, addStatus: "Faculty Added" }))

    }).catch((err) => { res.status(500).json({ error: err }) })
    
})

router.get('/getMultipleFaculty/:faculty', (req, res) => {
    Faculty.find({ _id: { $in: req.params.faculty.split(",") } })
        .then(faculty => res.json(faculty))
        .catch(err => res.status(400).json({ error: err }))
})

router.post('/addFaculty', (req, res) => {
    Faculty.insertMany(req.body)
        .then(() => res.json({}))
        .catch((err) => { res.status(500).json({ error: err }) })

})

router.post('/updateFaculty/:id', (req, res) => {
    Faculty.findById(req.params.id)
        .then(faculty => {

            faculty.FacultyName = req.body.FacultyName
            faculty.FacultyPhone = req.body.FacultyPhone
            faculty.FacultyEmail = req.body.FacultyEmail
            faculty.CNIC = req.body.CNIC
            faculty.FacultyDepartment = req.body.FacultyDepartment
            faculty.FacultyRank = req.body.FacultyRank
            faculty.DOB = req.body.DOB
            faculty.Address = req.body.Address
            faculty.City = req.body.City
            faculty.State = req.body.State
            faculty.PostalCode = req.body.PostalCode

            faculty.save()
                .then(() => res.json("Faculty Updated"))
                .catch(err => res.status(400).json("Error: " + err))
        })
        .catch(err => res.status(400).json("Error: " + err))

})

router.delete('/deleteFaculty/:id', (req, res) => {
    Faculty.findByIdAndDelete(req.params.id)
        .then(() => res.status(201).json("Faculty Deleted"))
        .catch(err => res.status(400).json("Error: " + err))
})

module.exports = router