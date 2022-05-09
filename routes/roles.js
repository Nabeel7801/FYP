const express = require("express");
const router = express.Router();

const Roles = require("../models/rolesSchema")

router.get('/getRoles', (req, res) => {
    Roles.find()
        .then(roles => res.json(roles))
        .catch(err => res.status(400).json({ error: err }))
})

router.get('/getRoleByID/:id', (req, res) => {
    Roles.findById(req.params.id )
        .then(role => res.json(role))
        .catch(err => res.status(400).json({ error: err }))
})

router.post('/addRole', (req, res) => {
    const { Role, Pages } = req.body;

    Roles.find()
        .then((roles) => {
            const id = roles.length === 0 ? "0001" : ("0000" + String(parseInt(roles[roles.length - 1]._id) + 1)).slice(-4);
            const newRole = new Roles({ _id: id, Role: Role, Pages: Pages })

            newRole.save()
                .then(() => { res.json({ addedData: newRole }) })

        }).catch((err) => { res.status(500).json({ error: err }) })

})


router.post('/updateRole/:id', (req, res) => {
    Roles.findById(req.params.id)
        .then(role => {

            role.Role = req.body.Role
            role.Pages = req.body.Pages

            role.save()
                .then(() => res.json("Role Updated"))
                .catch(err => res.status(400).json("Error: " + err))
        })
        .catch(err => res.status(400).json("Error: " + err))

})

router.delete('/deleteRole/:id', (req, res) => {
    Roles.findByIdAndDelete(req.params.id)
        .then(() => res.status(201).json("Role Deleted"))
        .catch(err => res.status(400).json("Error: " + err))
})

module.exports = router