import React from 'react'
import axios from 'axios'
import md5 from 'md5'
import BoxHeader from '../../components/BoxHeader'
import PageComponent from '../../components/PageComponent'
import Dialog from '../../components/Dialog'

class AddFaculty extends PageComponent {

    state = {
        resetNewRow: {
            FacultyName: "",
            FacultyPhone: "",
            FacultyEmail: "",
            FacultyDepartment: "Select",
            FacultyRank: "",
            Degree: "",
            Subject: "",
        },
        newTableRow: {
            FacultyName: "",
            FacultyPhone: "",
            FacultyEmail: "",
            FacultyDepartment: "Select",
            FacultyRank: "",
            Degree: "",
            Subject: "",
        },
        tableBodyList: [

        ],
        dialogInfo: {
            isOpened: false,
            text: ""
        },
        editingActivated: false,
        editingID: "",

        //Temporary
        DepartmentList: [{ _id: "001", Department: "CS" }, { _id: "002", Department: "EE" }]
    }

    constructor(props) {
        super(props);
        this.addNewFaculty = this.addNewFaculty.bind(this);
        this.validateThenAddFaculty = this.validateThenAddFaculty.bind(this);

        if (props.state.currentPage !== "Faculty > Add Faculty") {
            props.state.setCurrentPage("Faculty > Add Faculty")
        }
    }

    componentDidMount() {
        if (typeof this.props.state.EditDetailsData.id !== 'undefined' && this.props.state.EditDetailsData.id !== null) {

            //Get Faculty with ID
            axios.get(`${this.props.state.ATLAS_URI}/getFacultyByID/${this.props.state.EditDetailsData.id}`)
                .then(response => {
                    const responseData = response.data;
                    if (typeof responseData !== 'undefined' && responseData !== null) {
                        this.setState({ newTableRow: responseData, editingActivated: true })

                    }

                }).catch(err => console.log(err))
        } else {
            this.setState({ newTableRow: this.state.resetNewRow })
        }

        //Get All Subjects
        axios.get(`${this.props.state.ATLAS_URI}/getSubjects/`)
            .then(response => {
                const responseData = response.data;
                if (typeof responseData !== 'undefined') {
                    this.setState({
                        SubjectList: responseData,
                    })

                }

            }).catch(err => console.log(err))

    }

    validateThenAddFaculty(e) {
        if (this.state.newTableRow.Source === "Select") {
            e.preventDefault();
            const newDialogInfo = { isOpened: true, text: "Department Empty", type: "Error" }
            this.setState({ dialogInfo: newDialogInfo })
            setTimeout(() => { this.setState({ dialogInfo: { isOpened: false, text: "", type: "" } }) }, 3000)
        } else {
            this.addNewFaculty(e);
        }

    }

    addNewFaculty(e) {
        e.preventDefault();

        if (!this.state.editingActivated) {
            
            //Register Login for Student
            const newUser = {Name: this.state.newTableRow.FacultyName, Username: "", Password: "", Role: "0003"}
            
            const tempPassword = "123";
            newUser.Password = md5(tempPassword).substring(5, 25);

            const tempName = this.state.newTableRow.FacultyName.split(" ");
            newUser.Username = (tempName.length > 1 ? tempName[0].substring(0,1) + "_" + tempName[1] : tempName[0] + "_" + String(Date.now()).substring(3, 4)).toLowerCase() + "@szabist.pk";

            axios.post(`${this.props.state.ATLAS_URI}/addUser/`, newUser)
            .then(res => {
                const newData = this.state.newTableRow;
                newData.UserID = res.data.addedData._id;

                axios.post(`${this.props.state.ATLAS_URI}/addFaculty/`, newData)
                .then(response => {
                    if (response.status === 200) {

                        const newDialogInfo = { isOpened: true, text: "Faculty Added Successfully", type: "Success" }
                        this.setState({ dialogInfo: newDialogInfo, newTableRow: this.state.resetNewRow })
                        setTimeout(() => {this.setState({dialogInfo: { isOpened: false, text: "", type: "" }})}, 3000)

                    }
                }).catch(err => alert(err))

            }).catch(err => alert(err))

        } else {
            axios.post(`${this.props.state.ATLAS_URI}/updateFaculty/` + this.props.state.EditDetailsData.id, this.state.newTableRow)
                .then(() => {
                    this.props.redirectFromEditDetails(this.props.state.EditDetailsData.redirectFrom)
                })
                .catch(err => alert(err))

        }

    }

    render() {

        return (
            <section className="content">
                <div className="row">
                    <Dialog
                        onClose={(e) => this.setState({ dialogInfo: { isOpened: false, text: "" } })}
                        dialogInfo={this.state.dialogInfo}
                    />
                    <div className="col-md-12">

                        <div className="box box-primary">

                            <BoxHeader title={`${this.state.editingActivated ? "Edit" : "Add"} Faculty`} />

                            <form onSubmit={this.validateThenAddFaculty}>
                                <div className="box-body bozero mx2p">

                                    <input type="hidden" name="ci_csrf_token" value="" />

                                    <div className="row">

                                        <div className="col-md-4">
                                            <div className="form-group">
                                                <label>Faculty Name</label> <small className="req"> *</small>
                                                <input name="FacultyName" type="text" className="form-control" required value={this.state.newTableRow.FacultyName} onChange={this.changeHandler} />
                                            </div>
                                        </div>

                                        <div className="col-md-4">
                                            <div className="form-group">
                                                <label>Faculty Phone</label> <small className="req"> *</small>
                                                <input name="FacultyPhone" type="text" className="form-control" required value={this.state.newTableRow.FacultyPhone} onChange={this.changeHandler} />
                                            </div>
                                        </div>

                                        <div className="col-md-4">
                                            <div className="form-group">
                                                <label>Faculty Email</label> <small className="req"> *</small>
                                                <input name="FacultyEmail" type="email" className="form-control" required value={this.state.newTableRow.FacultyEmail} onChange={this.changeHandler} />
                                            </div>
                                        </div>
                                    </div>

                                    <div className='row'>
                                        <div className='col-md-8'>
                                            
                                            <div className="row">
                                                <div className='col-md-6'>
                                                    <div className="form-group">
                                                        <label>Faculty Department</label> <small className="req"> *</small>
                                                        <select required className="form-control" name="FacultyDepartment" value={this.state.newTableRow.FacultyDepartment} onChange={this.changeHandler} >
                                                            <option value="">Select</option>

                                                            {console.log(this.state.DepartmentList)}
                                                            {this.state.DepartmentList.map(x => {
                                                                return <option value={x.Department}>{x.Department}</option>
                                                            })}

                                                        </select>
                                                    </div>

                                                </div>
                                                <div className='col-md-6'>
                                                    <div className="form-group">
                                                        <label>Faculty Rank</label> <small className="req"> *</small>
                                                        <select required className="form-control" name="FacultyRank" value={this.state.newTableRow.FacultyRank} onChange={this.changeHandler} >
                                                            <option value="">Select</option>
                                                            <option value="Professor">Professor</option>
                                                            <option value="Associate Professor">Associate Professor</option>
                                                            <option value="Assistant Professor">Assistant Professor</option>
                                                            <option value="Instructor">Instructor</option>
                                                            <option value="Visiting">Visiting</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                                <div className="box-footer">
                                    <button type="submit" className="btn btn-info pull-right">Save</button>
                                </div>
                            </form>
                        </div>

                    </div>

                </div>
            </section>
        )

    }

}

export default AddFaculty