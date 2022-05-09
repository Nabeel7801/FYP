import React, { useState } from 'react'
import axios from 'axios'
import * as $ from 'jquery'
import { Modal } from 'react-bootstrap'
import Dialog from './Dialog'
import md5 from 'md5'

function ChangePassword(props) {

    const [dialogInfo, setDialogInfo] = useState({isOpened: false, text: "", type: ""});

    const updatePassword = e => {
        e.preventDefault();
        if ($("#newPassword").val() === $("#confirmPassword").val()) {
            axios.get(`${props.BACKEND_URI}/getUserByUsername/${props.username}`)
            .then(res1 => {
                const userData = res1.data;
                if (typeof userData !== 'undefined' && userData !== null) {
                    //Password is from 5 to 25 Character;
                    if (userData.Password === md5($("#oldPassword").val()).substring(5, 25)) {

                        userData.Password = md5($("#newPassword").val()).substring(5, 25)
                        
                        axios.post(`${props.BACKEND_URI}/updateUser/${userData._id}`, userData)
                        .then(() => {
                            const newDialogInfo = {isOpened: true, text: "Password Changed Successfully", type: "Success"}
                            setDialogInfo(newDialogInfo)
                            setTimeout(() => setDialogInfo({ isOpened: false, text: "", type: "" }), 3000)    
                        })
                        .catch(err => alert(err))

                    } else {
                        const newDialogInfo = {isOpened: true, text: "Incorrect Old Password", type: "Error"}
                        setDialogInfo(newDialogInfo)
                        setTimeout(() => setDialogInfo({ isOpened: false, text: "", type: "" }), 3000)
                    }
    
                }
            })
        }else {
            const newDialogInfo = {isOpened: true, text: "Passwords does not match", type: "Error"}
            setDialogInfo(newDialogInfo)
            setTimeout(() => setDialogInfo({ isOpened: false, text: "", type: "" }), 3000)    
        }
        
    }

    return (
        
        <React.Fragment>
            <Dialog
                onClose={(e) => setDialogInfo({ isOpened: false, text: "", type: "" })}
                dialogInfo={dialogInfo}
            />
                
            <Modal dialogClassName="smallerModal" show={props.isOpened} onHide={props.closeModal}>

                <Modal.Header closeButton>
                    <Modal.Title>Change Password</Modal.Title>
                </Modal.Header>

                <Modal.Body>

                    <div className="taskFieldArea">
                        <form onSubmit={updatePassword}>
                            <div className="row">

                                <div className="col-11">
                                    <div className="form-group">
                                        <label>Old Password</label><small className="req"> *</small>
                                        <input type="password" id="oldPassword" className="form-control" />
                                    </div>
                                </div>

                                <div className="col-11">
                                    <div className="form-group">
                                        <label>New Password</label><small className="req"> *</small>
                                        <input type="password" id="newPassword" className="form-control" />
                                    </div>
                                </div>

                                <div className="col-11">
                                    <div className="form-group">
                                        <label>Confirm Password</label><small className="req"> *</small>
                                        <input type="password" id="confirmPassword" className="form-control" />
                                    </div>
                                </div>

                            </div>

                            <div className="box-footer pr0">
                                <button className="btn btn-info pull-right">Save</button>
                            </div>

                        </form>

                    </div>

                </Modal.Body>

            </Modal>
        </React.Fragment>


    )
}

export default React.memo(ChangePassword)