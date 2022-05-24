import React from 'react'
import * as $ from 'jquery'
import BoxHeader from '../../components/BoxHeader'
import axios from 'axios'
import DataTable from '../../components/DataTable'
import PageComponent from '../../components/PageComponent'
import Dialog from '../../components/Dialog'

class AddCourse extends PageComponent {


    state = {
        resetNewRow: {
            CourseCode: "",
            CourseName: "",
            CreditHours: "",
            CourseType: "",
        },
        newTableRow: {},
        tableBodyList: [],

        editingActivated: false,
        editingID: "",
        APIs: {
            AddData: "addCourse",
            UpdateData: "updateCourse",
            DeleteData: "deleteCourse"
        },
        dialogInfo: {
            isOpened: false,
            text: "",
            type: ""
        }
    }

    constructor(props) {
        super(props);
        if (props.state.currentPage !== "Degree > Add Course") {
            props.state.setCurrentPage("Degree > Add Course")
        }
    }

    componentDidMount() {
        axios.get(`${this.props.state.ATLAS_URI}/getCourses/`)
            .then(response => {
                const responseData = response.data;
                if (typeof responseData !== 'undefined') {
                    this.setState({
                        newTableRow: this.state.resetNewRow,
                        tableBodyList: responseData
                    })
                }
            }).catch(err => console.log(err))
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
                            <BoxHeader title={`${this.state.editingActivated ? "Edit" : "Add"} Course`} />
                            <form onSubmit={this.insertIntoTable} autoComplete='off'>
                                <div className="box-body bozero">
                                    <input type="hidden" name="ci_csrf_token" value="" />
                                    <div className="form-group">
                                        <label >Course Code </label><small className="req"> *</small>
                                        <input name="CourseCode" value={this.state.newTableRow.CourseCode} onChange={this.changeHandler} required type="text" className="form-control" />
                                    </div>
                                    <div className="form-group">
                                        <label >Course Name </label><small className="req"> *</small>
                                        <input name="CourseName" value={this.state.newTableRow.CourseName} onChange={this.changeHandler} required type="text" className="form-control" />
                                    </div>
                                    <div className="form-group">
                                        <label >Credit Hours </label><small className="req"> *</small>
                                        <input name="CreditHours" value={this.state.newTableRow.CreditHours} onChange={this.changeHandler} required type="text" className="form-control" />
                                    </div>
                                    <div className="form-group">
                                        <label>Course Type</label> <small className="req"> *</small>
                                        <select required className="form-control" name="CourseType" value={this.state.newTableRow.CourseType} onChange={this.changeHandler} >
                                            <option value="">Select</option>
                                            <option value="Compulsory">Compulsory</option>
                                            <option value="Elective">Elective</option>

                                        </select>
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
                            <BoxHeader title="List of Added Courses" />
                            <div className="box-body">
                                <DataTable
                                    tableHeader={["_id", "Course Code", "Course Name", "Credit Hours", "Course Type"]}
                                    searchField="CourseName"
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

export default AddCourse