const express = require("express");
const router = express.Router();

const Users = require("../models/usersSchema")

router.get('/getServerTime', (req, res) => {
    res.json({date: (new Date()).getTime()});
})

router.get('/getUsers', (req, res) => {
    Users.find()
        .then(users => res.json(users))
        .catch(err => res.status(400).json({ error: err }))
})

router.get('/getRegNo/:prefix', (req, res) => {
    Users.findOne({}, {}, { sort: { '_id' : -1 } })
        .then(user => {
            const regNo = req.params.prefix + (!user ? "10001" : String(parseInt(user.Username) + 1).substring(1));
            res.json(regNo)
        })
        .catch(err => res.status(400).json({ error: err }))
})

router.get('/getUserByUsername/:username', (req, res) => {
    Users.findOne({ Username: req.params.username })
        .then(client => res.json(client))
        .catch(err => res.status(400).json({ error: err }))
})

router.post('/addUser', (req, res) => {
    const { Name, Username, Password, Role } = req.body;

    Users.find()
        .then((users) => {
            const id = users.length === 0 ? "0001" : ("0000" + String(parseInt(users[users.length - 1]._id) + 1)).slice(-4);
            const newUser = new Users({ _id: id, Name: Name, Username: Username, Password: Password, Role: Role })

            newUser.save()
                .then(() => { res.json({ addedData: newUser }) })

        }).catch((err) => { res.status(500).json({ error: err }) })

})


router.post('/updateUser/:id', (req, res) => {
    Users.findById(req.params.id)
        .then(user => {

            user.Name = req.body.Name
            user.Username = req.body.Username
            user.Password = req.body.Password
            user.Role = req.body.Role

            user.save()
                .then(() => res.json("User Updated"))
                .catch(err => res.status(400).json("Error: " + err))
        })
        .catch(err => res.status(400).json("Error: " + err))

})

router.delete('/deleteUser/:id', (req, res) => {
    Users.findByIdAndDelete(req.params.id)
        .then(() => res.status(201).json("User Deleted"))
        .catch(err => res.status(400).json("Error: " + err))
})

module.exports = router