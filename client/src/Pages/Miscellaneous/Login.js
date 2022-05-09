import React, { Component } from 'react'
import * as $ from 'jquery'
import axios from 'axios';
import md5 from 'md5';
import Dialog from '../../components/Dialog'

class Login extends Component {

    state = {
        dialogInfo: {
            isOpened: false,
            text: ""
        }
    }

    constructor() {
        super();
        this.loginOperator = this.loginOperator.bind(this);
    }

    loginOperator(e) {
        e.preventDefault();

        const enteredUsername = $("#username").val();
        axios.get(`${this.props.state.ATLAS_URI}/getUserByUsername/${enteredUsername}`)
        .then(res1 => {
            const userData = res1.data;
            if (typeof userData !== 'undefined' && userData !== null) {
                const { _id, Username, Password, Name, Role } = userData;
                if (Password === md5($("#password").val()).substring(5, 25)) {

                    axios.get(`${this.props.state.ATLAS_URI}/getRoleByID/${Role}`)
                        .then(role => {
                            if (typeof role !== 'undefined') {

                                const roleData = role.data;
                                const loginTime = this.getCurrentTime();
                                const addedData = {UserID: _id, Name: Name, Username: Username, Role: roleData.Role, RoleID: Role, LoginTime: loginTime };
                                
                                axios.post(`${this.props.state.ATLAS_URI}/addLoginDetail/`, addedData)
                                .then(response => {
                                    if (response.status === 200) {
                                        
                                        addedData.LastLogin = loginTime;

                                        this.props.updateOperatorInfo(addedData);
                                        window.location.href = "/dashboard"

                                    }
                                }).catch(err => alert(err))
                            }
                        }).catch(err => alert(err))

                } else {
                    const newDialogInfo = { isOpened: true, text: "Incorrect Password", type: "Error" }
                    this.setState({ dialogInfo: newDialogInfo })
                    $(".errorMsg").css({ "font-size": "14px" })
                    setTimeout(() => { this.setState({ dialogInfo: { isOpened: false, text: "", type: "" } }) }, 3000)
                }

            } else {
                const newDialogInfo = { isOpened: true, text: "Incorrect Username", type: "Error" }
                this.setState({ dialogInfo: newDialogInfo })
                $(".errorMsg").css({ "font-size": "14px" })
                setTimeout(() => { this.setState({ dialogInfo: { isOpened: false, text: "", type: "" } }) }, 3000)
            }

        }).catch(err => console.log(err))
    }

    getCurrentTime() {
        const today = new Date();

        const date = today.getDate();
        const month = String(parseInt(today.getMonth()) + 1);

        return (date < 10 && "0") + date + "-" + (month < 10 && "0") + month + "-" + today.getFullYear() + "  " +
            ("0" + today.getHours()).slice(-2) + ":" + ("0" + today.getMinutes()).slice(-2) + ":" + ("0" + today.getSeconds()).slice(-2);
    }

    render() {
        return (
            <React.Fragment>
                <Dialog
                    onClose={(e) => this.setState({ dialogInfo: { isOpened: false, text: "" } })}
                    dialogInfo={this.state.dialogInfo}
                />
                <main id="loginSection">

                    <div className='login_container'>

                        <p className='login_heading'>{this.props.state.Institution}</p>
                        <p className='login_subHeading'>User Login</p>

                        <div className="login_card">

                            <form onSubmit={this.loginOperator} autoComplete="off">

                                <br /><br />

                                <div className="form-floating loginFormField">
                                    <input type="email" className="form-control loginField" required id="username" placeholder="Email" />
                                    <label>Email</label>
                                    <i className="inputIcon fas fa-user"></i>
                                </div>

                                <div className="form-floating loginFormField">
                                    <input type="password" className="form-control loginField" required id="password" placeholder="Password" />
                                    <label>Password</label>
                                    <i className="inputIcon fas fa-lock"></i>
                                </div>

                                <button type="submit" id="loginBtn" className="btn btn-success">Sign in</button>

                                <br /><br />
                            </form>

                            <br />
                        </div>
                    </div>

                </main>

            </React.Fragment>
        );
    }

}

export default Login