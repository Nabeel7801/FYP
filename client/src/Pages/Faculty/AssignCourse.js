import React from 'react'
import BoxHeader from '../../components/BoxHeader'
import axios from 'axios'
import DataTable from '../../components/DataTable'
import PageComponent from '../../components/PageComponent'
import SelectBox from '../../components/SelectBox'
import Dialog from '../../components/Dialog'

class AssignCourse extends PageComponent {


    state = {
        resetNewRow: {
            Department: "",
            Semester: "",
            Degree: "Select",
            Course: "",
            Year: "",
            Faculty: "Select",
            _Course: "",
            _Faculty: "",
            _Degree: "",

        },
        newTableRow: {
            Department: "",
            Degree: "Select",
            Semester: "",
            Course: "Select",
            Year: "",
            Faculty: "Select",
            _Course: "",
            _Faculty: "",
            _Degree: "",

        },
        tableBodyList: [

        ],

        editingActivated: false,
        editingID: "",
        APIs: {
            AddData: "assignCourse",
            UpdateData: "updateAssignedCourse",
            DeleteData: "deleteAssignedCourse"
        },
        dialogInfo: {
            isOpened: false,
            text: "",
            type: ""
        },
        DegreeList: [],
        CoursesList: [],
        FacultyList: [],
        DepartmentList: [{ _id: "001", Department: "CSE" }, { _id: "002", Department: "EE" }]
    }

    constructor(props) {
        super(props);
        this.filterCourses = this.filterCourses.bind(this)
        if (props.state.currentPage !== "Faculty > Assign Course") {
            props.state.setCurrentPage("Faculty > Assign Course")
        }
    }

    componentDidMount() {

        axios.get(`${this.props.state.ATLAS_URI}/getDegrees/`)
            .then(degree => {
                const degreeData = degree.data;
                if (typeof degreeData !== 'undefined') {

                    axios.get(`${this.props.state.ATLAS_URI}/getCourses/`)
                        .then(course => {
                            const courseData = course.data;
                            if (typeof courseData !== 'undefined') {
                                courseData.map(x => {
                                    x.Course = x.CourseCode + " " + x.CourseName
                                    return x
                                })

                                axios.get(`${this.props.state.ATLAS_URI}/getFaculty/`)
                                    .then(faculty => {
                                        const facultyData = faculty.data;
                                        if (typeof facultyData !== 'undefined') {

                                            axios.get(`${this.props.state.ATLAS_URI}/getAssignedCourses/`)
                                                .then(response => {
                                                    const responseData = response.data;

                                                    responseData.map(assigned => {
                                                        let tempDegree = degreeData.filter(degree => degree._id === assigned.Degree);
                                                        let tempCourse = courseData.filter(course => course._id === assigned.Course)[0]
                                                        let tempFaculty = facultyData.filter(fac => fac._id === assigned.Faculty)

                                                        assigned._Degree = tempDegree.length !== 0 && tempDegree[0].DegreeName
                                                        assigned._Course = tempCourse.length !== 0 && (tempCourse.CourseCode + " " + tempCourse.CourseName)
                                                        assigned._Faculty = tempFaculty.length !== 0 && tempFaculty[0].FacultyName

                                                        return assigned;
                                                    })

                                                    this.setState({
                                                        tableBodyList: responseData,
                                                        FacultyList: facultyData,
                                                        DegreeList: degreeData,
                                                        CoursesList: courseData
                                                    })
                                                }).catch(err => console.log(err))

                                        }
                                    }).catch(err => console.log(err))
                            }
                        }).catch(err => console.log(err))
                }
            }).catch(err => console.log(err))

    }


    insertIntoTable(e) {
        e.preventDefault();

        if (!this.state.editingActivated) {
            //When Adding new Data
            axios.post(`${this.props.state.ATLAS_URI}/${this.state.APIs.AddData}/`, this.state.newTableRow)
                .then(response => {
                    if (response.status === 200) {

                        let newTableBodyList = [...this.state.tableBodyList];
                        newTableBodyList.push(response.data.addedData);

                        newTableBodyList.map(assigned => {
                            let tempDegree = this.state.DegreeList.filter(degree => degree._id === assigned.Degree);
                            let tempCourse = this.state.CoursesList.filter(course => course._id === assigned.Course)[0]
                            let tempFaculty = this.state.FacultyList.filter(fac => fac._id === assigned.Faculty)

                            assigned._Degree = tempDegree.length !== 0 && tempDegree[0].DegreeName
                            assigned._Course = tempCourse.length !== 0 && (tempCourse.CourseCode + " " + tempCourse.CourseName)
                            assigned._Faculty = tempFaculty.length !== 0 && tempFaculty[0].FacultyName

                            return assigned;
                        })

                        this.setState(prevState => ({
                            ...prevState,
                            tableBodyList: newTableBodyList,
                            newTableRow: this.state.resetNewRow
                        }))

                    }
                })
                .catch(err => alert(err))

        } else {
            //When Edit is Activated
            axios.post(`${this.props.state.ATLAS_URI}/${this.state.APIs.UpdateData}/` + this.state.editingID, this.state.newTableRow)
                .then(() => {
                    const newTableBodyList = this.state.tableBodyList.map(data =>
                        data._id === this.state.editingID ? this.state.newTableRow : data
                    )


                    newTableBodyList.map(assigned => {
                        let tempDegree = this.state.DegreeList.filter(degree => degree._id === assigned.Degree);
                        let tempCourse = this.state.CoursesList.filter(course => course._id === assigned.Course)[0]
                        let tempFaculty = this.state.FacultyList.filter(fac => fac._id === assigned.Faculty)

                        assigned._Degree = tempDegree.length !== 0 && tempDegree[0].DegreeName
                        assigned._Course = tempCourse.length !== 0 && (tempCourse.CourseCode + " " + tempCourse.CourseName)
                        assigned._Faculty = tempFaculty.length !== 0 && tempFaculty[0].FacultyName

                        return assigned;
                    })

                    this.setState({
                        editingActivated: false,
                        tableBodyList: newTableBodyList,
                        newTableRow: this.state.resetNewRow
                    })
                })
                .catch(err => alert(err))



        }

    }

    filterCourses() {

        let degree = this.state.DegreeList.filter(degree => degree._id === this.state.newTableRow.Degree)[0]
        if (typeof degree !== 'undefined' && this.state.newTableRow.Semester !== '') {

            let semester = degree.Semester.filter(sem => sem.Semester === this.state.newTableRow.Semester)[0].Courses
            const courses = this.state.CoursesList.filter((item) => semester?.includes(item._id));
            return courses
        }
        else
            return []
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

                            <BoxHeader title={`${this.state.editingActivated ? "Edit Assigned Course" : "Assign Courses"} `} />
                            <form onSubmit={this.insertIntoTable} autoComplete='off'>
                                <div className="box-body bozero">
                                    <input type="hidden" name="ci_csrf_token" value="" />

                                    <div className="form-group">
                                        <label>Department</label> <small className="req"> *</small>
                                        <select required className="form-control" name="Department" value={this.state.newTableRow.Department} onChange={this.changeHandler} >
                                            <option value="">Select</option>
                                            {this.state.DepartmentList.map(x => {
                                                return <option value={x.Department}>{x.Department}</option>
                                            })}

                                        </select>
                                    </div>

                                    <SelectBox
                                        label="Degree"
                                        name="Degree"
                                        options={this.state.DegreeList.filter((dept) =>
                                            dept.Department === this.state.newTableRow.Department
                                        )}
                                        attributeShown="DegreeName"
                                        changeHandler={this.changeHandler}
                                        value={this.state.newTableRow.Degree}
                                        resetValue={() => this.setState(prevState => ({ newTableRow: { ...prevState.newTableRow, Degree: "Select" } }))}
                                    />

                                    <div className="form-group">
                                        <label>Semester</label> <small className="req"> *</small>
                                        <select required className="form-control" name="Semester" value={this.state.newTableRow.Semester} onChange={this.changeHandler} >
                                            <option value="">Select</option>
                                            <option value="1">Semester 1</option>
                                            <option value="2">Semester 2</option>
                                            <option value="3">Semester 3</option>
                                            <option value="4">Semester 4</option>
                                            <option value="5">Semester 5</option>
                                            <option value="6">Semester 6</option>
                                            <option value="7">Semester 7</option>
                                            <option value="8">Semester 8</option>
                                        </select>
                                    </div>

                                    <SelectBox
                                        label="Course"
                                        name="Course"
                                        options={this.filterCourses()}
                                        attributeShown="Course"
                                        changeHandler={this.changeHandler}
                                        value={this.state.newTableRow.Course}
                                        resetValue={() => this.setState(prevState => ({ newTableRow: { ...prevState.newTableRow, Course: "Select" } }))}
                                    />

                                    <SelectBox
                                        label="Faculty"
                                        name="Faculty"
                                        options={this.state.FacultyList.filter((dept) =>
                                            dept.FacultyDepartment === this.state.newTableRow.Department
                                        )}
                                        attributeShown="FacultyName"
                                        changeHandler={this.changeHandler}
                                        value={this.state.newTableRow.Faculty}
                                        resetValue={() => this.setState(prevState => ({ newTableRow: { ...prevState.newTableRow, Faculty: "Select" } }))}
                                    />
                                    <div className="form-group">
                                        <label>Year</label> <small className="req"> *</small>
                                        <input name="Year" type="text" className="form-control" required value={this.state.newTableRow.Year} onChange={this.changeHandler} />
                                    </div>
                                </div>
                                <div className="box-footer">
                                    <button type="submit" className="btn btn-info pull-right ">Save</button>
                                </div>
                            </form>
                        </div>
                    </div>

                    <div className="col-md-7">
                        <div className="box box-primary">
                            <BoxHeader title="List of Assigned Courses" />
                            <div className="box-body">
                                <DataTable
                                    tableHeader={["_id", "Department", "_Degree", "Semester", "_Course", "_Faculty", "Year"]}
                                    searchField="_Course"
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

export default AssignCourse