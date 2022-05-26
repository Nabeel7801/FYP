import React from 'react'
import axios from 'axios'
import BoxHeader from '../../components/BoxHeader'
import PageComponent from '../../components/PageComponent'
import SelectBox from '../../components/SelectBox'
import Dialog from '../../components/Dialog'
import * as $ from 'jquery'

class AddDegree extends PageComponent {

    state = {

        resetNewRow: {
            DegreeName: "",
            CreditHours: "",
            Department: "",
            Semester: [{
                Semester: '1',
                Courses: ["Select"]
            },],

        },

        newTableRow: {
            DegreeName: "",
            CreditHours: "",
            Department: "",
            Semester: [
                {
                    Semester: '1',
                    Courses: ["Select"]
                },
            ],
        },

        tableBodyList: [

        ],
        dialogInfo: {
            isOpened: false,
            text: ""
        },
        editingActivated: false,
        editingID: "",

        //Temp
        CoursesList: [{
            _id: '001',
            CourseCode: "HU-100",
            CourseName: ""
        }, {
            _id: '002',
            CourseCode: "SE-200",
            CourseName: ""
        }, {
            _id: '003',
            CourseCode: "CS-300",
            CourseName: ""
        }],
        DepartmentList: [{ _id: "001", Department: "CS" }, { _id: "002", Department: "EE" }]
    }

    constructor(props) {
        super(props);
        this.addNewDegree = this.addNewDegree.bind(this);
        this.validateThenAddDegree = this.validateThenAddDegree.bind(this);
        this.updateAdditionalFields = this.updateAdditionalFields.bind(this)
        this.updateCourse = this.updateCourse.bind(this)
        this.newChangeHandler = this.newChangeHandler.bind(this)

        if (props.state.currentPage !== "Degree > Add Degree") {
            props.state.setCurrentPage("Degree > Add Degree")
        }
    }

    newChangeHandler(e, sem, cId) {
        let newValue = e.target.value;
        const semClone = [...this.state.newTableRow.Semester];
        const tempSem = semClone.filter(semester => semester.Semester === sem.Semester)[0];
        if (tempSem) {
            tempSem.Courses[cId] = newValue;
        }
        this.setState(prevState => ({
            ...prevState,
            newTableRow: {
                ...prevState.newTableRow,
                Semester: semClone
            }
        }))
    }

    componentDidMount() {

        if (typeof this.props.state.EditDetailsData.id !== 'undefined' && this.props.state.EditDetailsData.id !== null) {

            this.setState({ editingActivated: true })
            //Get Degree with ID
            axios.get(`${this.props.state.ATLAS_URI}/getDegreeByID/${this.props.state.EditDetailsData.id}`)
                .then(response => {
                    const responseData = response.data;
                    console.log(responseData)
                    if (typeof responseData !== 'undefined' && responseData !== null) {
                        this.setState({ newTableRow: responseData })

                    }
                }).catch(err => console.log(err))
        } else {
            this.setState({ newTableRow: this.state.resetNewRow })
        }

        axios.get(`${this.props.state.ATLAS_URI}/getCourses/`)
            .then(response => {
                const responseData = response.data;
                if (typeof responseData !== 'undefined') {
                    let newArray = []
                    for (let i = 0; i < responseData.length; i++) {
                        let response = responseData[i]
                        let x = {
                            _id: response._id,
                            CourseCode: response.CourseCode,
                            CourseName: response.CourseName,
                            CreditHours: response.CreditHours,
                            Course: response.CourseCode + "  " + response.CourseName
                        }
                        newArray.push(x)
                    }
                    this.setState({
                        CoursesList: newArray,
                    })
                }
            }).catch(err => console.log(err))
    }

    validateThenAddDegree(e) {
        e.preventDefault()
        let sem = this.state.newTableRow.Semester
        for (let x = 0; x < sem.length; x++) {
            let course = sem[x].Courses
            for (let y = 0; y < course.length; y++) {
                if (course[y] === "Select") {
                    e.preventDefault();
                    const newDialogInfo = { isOpened: true, text: "Courses Empty", type: "Error" }
                    this.setState({ dialogInfo: newDialogInfo })
                    setTimeout(() => { this.setState({ dialogInfo: { isOpened: false, text: "", type: "" } }) }, 3000)
                    return;
                }
            }
        }
        this.addNewDegree(e);
    }

    addNewDegree(e) {
        e.preventDefault();
        if (!this.state.editingActivated) {
            axios.post(`${this.props.state.ATLAS_URI}/AddDegree/`, this.state.newTableRow)
                .then(response => {
                    if (response.status === 200) {
                        const newDialogInfo = { isOpened: true, text: "Degree Added Successfully", type: "Success" }
                        this.setState({ dialogInfo: newDialogInfo, newTableRow: this.state.resetNewRow })
                    }
                })
                .catch(err => alert(err))
        } else {
            axios.post(`${this.props.state.ATLAS_URI}/updateDegree/` + this.props.state.EditDetailsData.id, this.state.newTableRow)
                .then(() => {
                    this.props.redirectFromEditDetails(this.props.state.EditDetailsData.redirectFrom)
                })
                .catch(err => alert(err))
        }
    }

    updateAdditionalFields(e, sem) {

        e.preventDefault();
        let temp = [...this.state.newTableRow.Semester]
        let tempData = {
            Semester: String(temp.length + 1),
            Courses: ["Select"]
        }

        if (e.target.name === "increase") {
            temp.push(tempData)
        } else {
            if (sem === temp.length)
                temp.splice(sem - 1, 1);
            else {
                temp.splice(sem - 1, 1);
                for (let x = sem - 1; x < temp.length; x++) {
                    temp[x].Semester = String(x + 1);
                }
            }
        }
        this.setState(prevState => ({
            ...prevState,
            newTableRow: {
                ...prevState.newTableRow,
                Semester: temp
            }
        }))

    }

    getAdditionalFields() {
        if (typeof this.state.newTableRow.Semester === 'undefined')
            return;

        return this.state.newTableRow.Semester.map((sem) =>
            <div className="card">
                <div className="card-header">
                    <h3 >
                        Semester {sem.Semester}
                        <button className="transparentBtn text-danger pull-right" name="decrease" onClick={(e) => this.updateAdditionalFields(e, sem.Semester)}><i className="fas fa-times"></i></button>
                        <button className="btn btn-primary pull-right mr20" name="increase" onClick={(e) => this.updateCourse(e, sem)}>Add Course</button>
                    </h3>
                </div>
                <div >
                    <div className="card-body">
                        {this.getCourse(sem)}
                    </div>
                </div>
            </div>
        )
    }

    updateCourse(e, semester, course) {
        e.preventDefault();

        let semClone = [...this.state.newTableRow.Semester]
        for (let i = 0; i < semClone.length; i++) {

            if (semClone[i].Semester === semester.Semester) {

                if (e.target.name === "decrease") {
                    semClone[i].Courses.splice(course, 1);
                }
                if (e.target.name === "increase") {
                    let l = semClone[i].Courses.length + 1
                    semClone[i].Courses.push("Select");
                }
                break;
            }
        }
        this.setState(prevState => ({
            ...prevState,
            newTableRow: {
                ...prevState.newTableRow,
                Semester: semClone
            }

        }))
    }
    getCourse(sem) {
        if (typeof this.state.newTableRow.Semester === 'undefined')
            return;

        return this.state.newTableRow.Semester[sem.Semester - 1].Courses.map((value, cId) =>
            <div className='row'>
                <div className='col-md-10'>
                    <SelectBox
                        label="Courses"
                        name="Courses"
                        options={this.state.CoursesList}
                        attributeShown="Course"
                        changeHandler={(e) => this.newChangeHandler(e, sem, cId)}
                        value={this.state.newTableRow.Semester[sem.Semester - 1].Courses[cId]}
                        resetValue={() => this.setState(prevState => ({ ...prevState }))}
                    />
                </div>
                <div className='col-md-2 mt-4'>
                    <button className='btn btn-dark' name='decrease' onClick={(e) => this.updateCourse(e, sem, cId)}>Remove Course</button>
                </div>
            </div>
        )
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
                            <BoxHeader title={`${this.state.editingActivated ? "Edit" : "Add"} Degree`} />

                            <form onSubmit={this.validateThenAddDegree}>
                                <div className="box-body bozero mx2p">
                                    <input type="hidden" name="ci_csrf_token" value="" />
                                    <div className="row">
                                        <div className="col-md-4">
                                            <div className="form-group">
                                                <label>Degree Name</label> <small className="req"> *</small>
                                                <input name="DegreeName" type="text" className="form-control" required value={this.state.newTableRow.DegreeName} onChange={this.changeHandler} />
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="form-group">
                                                <label>Total Credit Hours</label> <small className="req"> *</small>
                                                <input name="CreditHours" pattern="[0-9]*" type="text" className="form-control" required value={this.state.newTableRow.CreditHours} onChange={this.changeHandler} />
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="form-group">
                                                <label>Department</label> <small className="req"> *</small>
                                                <select required className="form-control" name="Department" value={this.state.newTableRow.Department} onChange={this.changeHandler} >
                                                    <option value="">Select</option>
                                                    {typeof this.state.DepartmentList != 'undefined' && this.state.DepartmentList.map(x => {
                                                        return <option value={x.Department}>{x.Department}</option>
                                                    })}
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="form-group">
                                            <button className="btn btn-xs btn-info " name="increase" onClick={(e) => this.updateAdditionalFields(e, -1)}>Add Semester</button>
                                        </div>
                                        <div>
                                            <div className="accordion" >
                                                {this.getAdditionalFields()}
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

export default AddDegree