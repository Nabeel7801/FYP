import React from 'react'
import * as $ from 'jquery'
import axios from 'axios'
import md5 from 'md5'
import BoxHeader from '../../components/BoxHeader'
import PageComponent from '../../components/PageComponent'
import SelectBox from '../../components/SelectBox'
import Dialog from '../../components/Dialog'

class AddStudent extends PageComponent {

    state = {

        resetNewRow: {
            _id: "",
            Name: "",
            Institution: "",
            Career: "",
            Program: "Select",
            Semester: "",
            Email: "",
            Phone: "",
            Department: ""

        },

        newTableRow: {},
        tableBodyList: [

        ],
        dialogInfo: {
            isOpened: false,
            text: ""
        },
        editingActivated: false,
        editingID: "",

        //Temp
        ProgramList: [],
        institutionsList: ["Szabist Karachi", "Szabist Islamabad"],
        DepartmentList: [{ _id: "001", Department: "CSE" }, { _id: "002", Department: "EE" }],

    }

    constructor(props) {
        super(props);
        this.addNewStudent = this.addNewStudent.bind(this);
        this.validateThenAddStudent = this.validateThenAddStudent.bind(this);

        if (props.state.currentPage !== "Students > Add Student") {
            props.state.setCurrentPage("Students > Add Student")
        }
    }

    componentDidMount() {

        if (typeof this.props.state.EditDetailsData.id !== 'undefined' && this.props.state.EditDetailsData.id !== null) {

            this.setState({ editingActivated: true })
            //Get Student with ID
            axios.get(`${this.props.state.ATLAS_URI}/getStudentByID/${this.props.state.EditDetailsData.id}`)
                .then(response => {
                    const responseData = response.data;
                    if (typeof responseData !== 'undefined' && responseData !== null) {
                        this.setState({ newTableRow: responseData })

                    }

                }).catch(err => console.log(err))
        } else {

            this.setState({ newTableRow: this.state.resetNewRow })

        }

        //Get All Programs
        axios.get(`${this.props.state.ATLAS_URI}/getDegrees/`)
            .then(response => {
                const responseData = response.data;

                if (typeof responseData !== 'undefined') {
                    this.setState({
                        ProgramList: responseData,
                    })

                }

            }).catch(err => console.log(err))

    }

    validateThenAddStudent(e) {
        e.preventDefault();
        if (this.state.newTableRow.Program === "Select") {
            const newDialogInfo = { isOpened: true, text: "Program Empty", type: "Error" }
            this.setState({ dialogInfo: newDialogInfo })
            setTimeout(() => { this.setState({ dialogInfo: { isOpened: false, text: "", type: "" } }) }, 3000)

        } else {
            this.addNewStudent(e);
        }
    }

    changeHandler(e) {
        let newValue;
        const tempData = this.state.newTableRow;
        
        newValue = e.target.value;
        if (e.target.type !== "button") {
            if (typeof $(e.target).attr("index") !== 'undefined') {
                newValue = [...tempData[e.target.name]]
                newValue[$(e.target).attr("index")] = e.target.value
            }

            if (e.target.type === "checkbox") {
                newValue = [...tempData[e.target.name]]
                if (e.target.checked) {
                    newValue.push(e.target.value)
                } else {
                    newValue = newValue.filter(data => data !== e.target.value)
                }
            }
        }

        tempData[e.target.name] = newValue;
        this.setState({ newTableRow: tempData })

    }


    addNewStudent(e) {
        e.preventDefault();

        const formData = new FormData();
        let updateWithoutImage = true;
        if (this.state.newTableRow.ImageSelected && this.state.newTableRow.ImageSelected !== "") {
            updateWithoutImage = false;
            formData.append('ImageSelected', this.state.newTableRow.ImageSelected);
        }
        formData.append('Name', this.state.newTableRow.Name);
        formData.append('Institution', this.state.newTableRow.Institution);
        formData.append('Career', this.state.newTableRow.Career);
        formData.append('Program', this.state.newTableRow.Program);
        formData.append('Semester', this.state.newTableRow.Semester);
        formData.append('Email', this.state.newTableRow.Email);
        formData.append('Phone', this.state.newTableRow.Phone);
        formData.append('Department', this.state.newTableRow.Department);

        if (!this.state.editingActivated) {

            //Register Login for Student
            const newUser = { Name: this.state.newTableRow.Name, Username: "", Password: "", Role: "0002" }

            const tempPassword = "123";
            newUser.Password = md5(tempPassword).substring(5, 25);

            const tempName = this.state.newTableRow.Name.split(" ");
            newUser.Username = (tempName.length > 1 ? tempName[0].substring(0, 1) + "_" + tempName[1] : tempName[0] + "_" + String(Date.now()).substring(3, 4)).toLowerCase();

            axios.post(`${this.props.state.ATLAS_URI}/addUser/`, newUser)
                .then(response => {

                    const responseData = response.data;
                    formData.append('UserID', responseData.addedData._id)

                    axios.post(`${this.props.state.ATLAS_URI}/addStudent/`, formData)
                        .then(() => {

                            if (response.status === 200) {

                                const newDialogInfo = { isOpened: true, text: "Student Added Successfully", type: "Success" }
                                this.setState({ newTableRow: this.state.resetNewRow, dialogInfo: newDialogInfo })
                                setTimeout(() => { this.setState({ dialogInfo: { isOpened: false, text: "", type: "" } }) }, 3000)

                            }
                        })
                        .catch(err => alert(err))

                })
                .catch(err => alert(err))

        } else {
            let updateAPI = "updateStudentWithoutImage";
            axios.post(`${this.props.state.ATLAS_URI}/${updateAPI}/` + this.props.state.EditDetailsData.id, updateWithoutImage ? this.state.newTableRow : formData)
                .then(response => {
                    const responseData = response.data;
                    if (typeof responseData !== 'undefined' && responseData.PreviousImage !== "") {
                        axios.delete(`${this.props.state.ATLAS_URI}/file/${responseData.PreviousImage}`);
                    }
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

                            <BoxHeader title={`${this.state.editingActivated ? "Edit" : "Add"} Student`} />

                            <form onSubmit={this.validateThenAddStudent}>
                                <div className="box-body bozero mx2p">

                                    <input type="hidden" name="ci_csrf_token" value="" />

                                    <div className="row">

                                        <div className="col-md-4">
                                            <div className="form-group">
                                                <label>Student Name</label> <small className="req"> *</small>
                                                <input name="Name" type="text" className="form-control" required value={this.state.newTableRow.Name} onChange={this.changeHandler} />
                                            </div>
                                        </div>

                                        <div className="col-md-4">
                                            <div className="form-group">
                                                <label>Student Phone</label> <small className="req"> *</small>
                                                <input name="Phone" type="text" className="form-control" required value={this.state.newTableRow.Phone} onChange={this.changeHandler} />
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="form-group">
                                                <label>Student Email</label> <small className="req"> *</small>
                                                <input name="Email" type="email" className="form-control" required value={this.state.newTableRow.Email} onChange={this.changeHandler} />
                                            </div>
                                        </div>

                                    </div>

                                    <h4 className="pagetitleh2 mb-4">Career Details</h4>
                                    <div className="row">
                                        <div className="col-md-4">
                                            <div className="form-group">
                                                <label>Institution</label> <small className="req"> *</small>
                                                <select required className="form-control" name="Institution" value={this.state.newTableRow.Institution} onChange={this.changeHandler} >
                                                    <option value="">Select</option>
                                                    {this.state.institutionsList.map((inst, key) => {
                                                        return <option key={key} value={inst}>{inst}</option>
                                                    })}

                                                </select>
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="form-group">
                                                <label>Department</label> <small className="req"> *</small>
                                                <select required className="form-control" name="Department" value={this.state.newTableRow.Department} onChange={this.changeHandler} >
                                                    <option value="">Select</option>
                                                    {this.state.DepartmentList.map((dept, key) => {
                                                        return <option key={key} value={dept.Department}>{dept.Department}</option>
                                                    })}

                                                </select>
                                            </div>
                                        </div>

                                        <div className='col-md-4'>
                                            <div className="form-group">
                                                <label>Career</label> <small className="req"> *</small>
                                                <select required className="form-control" name="Career" value={this.state.newTableRow.Career} onChange={this.changeHandler} >
                                                    <option value="">Select</option>
                                                    <option value="Under Graduate">Under Graduate</option>
                                                    <option value="Masters">Masters</option>
                                                    <option value="PhD">PhD</option>
                                                </select>
                                            </div>
                                        </div>


                                    </div>

                                    <div className='row'>
                                        <div className="col-md-6">

                                            <SelectBox
                                                label="Program"
                                                name="Program"
                                                options={this.state.ProgramList}
                                                attributeShown="DegreeName"
                                                changeHandler={this.changeHandler}
                                                value={this.state.newTableRow.Program}
                                                resetValue={() => this.setState(prevState => ({ newTableRow: { ...prevState.newTableRow, Program: "Select" } }))}
                                            />

                                        </div>

                                        <div className='col-md-6'>
                                            <div className="form-group">
                                                <label>Semester</label> <small className="req"> *</small>
                                                <select required className="form-control" name="Semester" value={this.state.newTableRow.Semester} onChange={this.changeHandler} >
                                                    <option value="">Select</option>
                                                    <option value="1st Semester">1st Semester</option>
                                                    <option value="2nd Semester">2nd Semester</option>
                                                    <option value="3rd Semester">3rd Semester</option>
                                                    <option value="4th Semester">4th Semester</option>
                                                    <option value="5th Semester">5th Semester</option>
                                                    <option value="6th Semester">6th Semester</option>
                                                    <option value="7th Semester">7th Semester</option>
                                                    <option value="8th Semester">8th Semester</option>

                                                </select>
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

export default AddStudent