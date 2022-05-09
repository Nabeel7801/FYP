import React from 'react'
import axios from 'axios'
import SelectBox from '../../components/SelectBox'
import BoxHeader from '../../components/BoxHeader'
import DataTable from '../../components/DataTable'
import PageComponent from '../../components/PageComponent'
import Dialog from '../../components/Dialog'
import * as $ from 'jquery'
import md5 from 'md5'

class ManageUsers extends PageComponent {

    state = {
        resetNewRow: {
            Name: "",
            Username: "",
            Password: "",
            Role: "Select"
        },
        newTableRow: {
            Name: "",
            Username: "",
            Password: "",
            Role: ""
        },
        tableBodyList: [],
        editingActivated: false,
        editingID: "",
        rolesList: [],
        APIs: {
            AddData: "addUser",
            UpdateData: "updateUser",
            DeleteData: "deleteUser"
        },
        dialogInfo: {
            isOpened: false,
            text: "",
            type: ""
        }
    }

    constructor(props) {
        super(props);

        
        if (props.state.currentPage !== "Settings > Manage Users") {
            props.state.setCurrentPage("Settings > Manage Users")
        }
    }
    
    componentDidMount() {
        //Get All Users
        axios.get(`${this.props.state.ATLAS_URI}/getUsers/`)
            .then(response => {
                const usersData = response.data;
                if (typeof usersData !== 'undefined') {

                    //Get All Roles
                    axios.get(`${this.props.state.ATLAS_URI}/getRoles/`)
                        .then(res => {
                            const rolesData = res.data;
                            if (typeof rolesData !== 'undefined') {

                                const newUsersData = usersData.map(user => {
                                    const temp = rolesData.filter(role => role._id === user.Role);
                                    if (temp.length !== 0) {
                                        user.Roles = temp[0].Role;
                                    } else {
                                        user.Role = "Select";
                                        user.Roles = "";
                                    }
                                    return user;
                                })

                                this.setState({
                                    newTableRow: this.state.resetNewRow,
                                    tableBodyList: newUsersData,
                                    rolesList: rolesData,
                                })

                            }
                        }).catch(err => console.log(err))

                }

            }).catch(err => console.log(err))


    }

    //Overloading insertIntoTable
    insertIntoTable(e) {
        e.preventDefault();
        const passwordEntered = $("#newPassword").val()
        if (!this.state.editingActivated) {
            //When Adding new Data
            let newUser = this.state.newTableRow;
            newUser.Password = md5(passwordEntered).substring(5, 25);
            axios.post(`${this.props.state.ATLAS_URI}/${this.state.APIs.AddData}/`, newUser)
                .then(response => {
                    if (response.status === 200) {
                        let newTableBodyList = [...this.state.tableBodyList];

                        let addedData = response.data.addedData
                        const temp = this.state.rolesList.filter(role => role._id === newUser.Role);
                        if (temp.length !== 0) {
                            addedData.Roles = temp[0].Role;
                        } else {
                            addedData.Role = "Select";
                            addedData.Roles = "";
                        }
                        newTableBodyList.push(addedData);

                        this.setState(prevState => ({
                            ...prevState,
                            tableBodyList: newTableBodyList,
                            newTableRow: this.state.resetNewRow
                        }))
                        $("#newPassword").val("");

                    }
                })
                .catch(err => alert(err))

        } else {
            //When Edit is Activated
            let editedUser = this.state.newTableRow;
            if (passwordEntered !== "") {
                editedUser.Password = md5(passwordEntered).substring(5, 25);
            }

            axios.post(`${this.props.state.ATLAS_URI}/${this.state.APIs.UpdateData}/` + this.state.editingID, editedUser)
            .then(() => {

                let addedData = editedUser
                const temp = this.state.rolesList.filter(role => role._id === editedUser.Role);
                if (temp.length !== 0) {
                    addedData.Roles = temp[0].Role;
                } else {
                    addedData.Role = "Select";
                    addedData.Roles = "";
                }

                const newTableBodyList = this.state.tableBodyList.map(data =>
                    data._id === this.state.editingID ? addedData : data
                )

                this.setState({
                    editingActivated: false,
                    tableBodyList: newTableBodyList,
                    newTableRow: this.state.resetNewRow
                })
                $("#newPassword").val("");
            
            }).catch(err => alert(err))
        }
    }

    render() {

        return (
            <section className="content">
                <div className="row">
                    <Dialog
                        onFalse={(e) => this.setState({ dialogInfo: { isOpened: false, text: "" } })}
                        onTrue={(e) => this.deleteFromTable(e)}
                        dialogInfo={this.state.dialogInfo}
                    />
                    <div className="col-md-5">

                        <div className="box box-primary">

                            <BoxHeader title={`${this.state.editingActivated ? "Edit" : "Add"} User`} />

                            <form onSubmit={this.insertIntoTable} autoComplete='off'>
                                <div className="box-body bozero">

                                    <input type="hidden" name="ci_csrf_token" value="" />

                                    <div className="form-group">
                                        <label>Name </label><small className="req"> *</small>
                                        <input name="Name" value={this.state.newTableRow.Name} onChange={this.changeHandler} required type="text" className="form-control" />
                                    </div>

                                    <div className="form-group">
                                        <label>Username </label><small className="req"> *</small>
                                        <input name="Username" value={this.state.newTableRow.Username} onChange={this.changeHandler} required type="text" className="form-control" />
                                    </div>

                                    <div className="form-group">
                                        <label>{this.state.editingActivated && "Change "}Password </label> {!this.state.editingActivated && <small className="req"> *</small>}
                                        <input 
                                            name="Password" 
                                            id='newPassword' 
                                            type="password" 
                                            className="form-control" 
                                            required={!this.state.editingActivated} 
                                            placeholder= {this.state.editingActivated && "Leave this field blank to keep Password same"}
                                        />
                                    </div>

                                    <SelectBox
                                        label="Role"
                                        name="Role"
                                        options={this.state.rolesList}
                                        attributeShown="Role"
                                        changeHandler={this.changeHandler}
                                        value={this.state.newTableRow.Role}
                                        resetValue={() => this.setState(prevState => ({ newTableRow: { ...prevState.newTableRow, Role: "Select" } }))}
                                    />

                                </div>
                                <div className="box-footer">
                                    <button type="submit" className="btn btn-info pull-right ">Save</button>

                                </div>
                            </form>
                        </div>
                    </div>

                    <div className="col-md-7">
                        <div className="box box-primary">

                            <BoxHeader title="List of Added Users" />

                            <div className="box-body">

                                <DataTable
                                    tableHeader={["_id", "Name", "Username", "Password", "Roles"]}
                                    searchField="Name"
                                    tableBody={this.state.tableBodyList}
                                    deleteFromTable={this.openDialog}
                                    editTableRow={this.editTableRow}
                                />

                            </div>
                        </div>
                    </div>

                </div>
            </section>
        )

    }

}

export default ManageUsers