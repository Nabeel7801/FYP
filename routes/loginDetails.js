const express = require("express");
const router = express.Router();

const LoginDetails = require("../models/loginDetailsSchema")

router.get('/getLoginDetails', (req, res) => {
    LoginDetails.find()
        .then(loginDetails => res.json(loginDetails))
        .catch(err => res.status(400).json({error: err}))
})

router.get('/getLoginDetailsByUsername/:username', (req,res) => {
    LoginDetails.findOne({Username: req.params.username})
        .then(loginDetail => res.json(loginDetail))
        .catch(err => res.status(400).json({error: err}))
})

router.post('/addLoginDetail', (req, res) => {
    const {Name, Username, Role, LoginTime} = req.body;
    
    LoginDetails.find()
        .then((loginDetails) => {
            const id = loginDetails.length === 0 ? "0001" : ("0000" + String(parseInt(loginDetails[loginDetails.length - 1]._id) + 1)).slice(-4);
            const newLoginDetail = new LoginDetails({ _id: id, Name: Name, Username: Username, Role: Role, LoginTime: LoginTime });
            
            newLoginDetail.save()
                .then(() => { res.json({addedData: newLoginDetail}) })
                
        }).catch((err) => { res.status(500).json({ error: err }) })

})

module.exports = router