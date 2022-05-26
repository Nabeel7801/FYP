import React, { Component } from 'react';
import axios from 'axios';
import * as $ from 'jquery';
import Dialog from '../../components/Dialog'
import QRCodeGenerator from '../../components/QRCodeGenerator';

class MarkAttendance extends Component {

    state = {
        assignedCourseID: "",
        courseInfo: {},
        semester: "1",
        attendance: [],
        
        dialogInfo: {
            isOpened: false,
            text: ""
        },
        alreadyMarked: "", 
        dateSelected: "",
        QRCodeGeneratorOpened: false
    }

    constructor () {
        super();
        this.changeHandler = this.changeHandler.bind(this);
        this.uploadAttendance = this.uploadAttendance.bind(this);
    }

    componentDidMount() {
        this.setState({dateSelected: new Date().toJSON().slice(0,10)})        
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.dateSelected !== this.state.dateSelected) {
            const params = new URLSearchParams(window.location.search);
            const courseID = params.get("course");

            const facultyData = this.props.state.FacultyData;
            if (facultyData.length > 0) {
                const assignedCourse = facultyData.filter(course => course.Course._id === courseID)[0];
                if (assignedCourse) {
                    this.setState({ 
                        assignedCourseID: assignedCourse._id,
                        courseInfo:  assignedCourse.Course, 
                        semester: assignedCourse.Semester
                    });
                    axios.get(`${this.props.state.ATLAS_URI}/getEnrollmentByAssignedCourse/${assignedCourse._id}`)
                    .then(response => {
                        const enrollments = response.data;
                        const studentList = enrollments.map(enrollment => enrollment.Student);
                        
                        if (studentList.length > 0) {
                            axios.get(`${this.props.state.ATLAS_URI}/getMultipleStudentsByID/${studentList}`)
                            .then(res => {
                                const students = res.data;
                                
                                axios.get(`${this.props.state.ATLAS_URI}/getAttendanceByDate/${this.state.dateSelected}`)
                                .then(attendanceRes => {
                                    const attendanceData = attendanceRes.data;
                                    
                                    const newAttendanceData = []
                                    attendanceData.forEach(tempAttendance => {
                                        const filteredEnrollments = enrollments.filter(enrollment => enrollment._id === tempAttendance.EnrollmentID)[0];
                                        if (filteredEnrollments) {
                                            const enrollmentAssignedCourseID = filteredEnrollments.AssignedCourse
                                            if (enrollmentAssignedCourseID === assignedCourse._id) {
                                                newAttendanceData.push(tempAttendance)
                                            }
                                        }
                                    })
                                    const attendance = [];
                                    let alreadyMarked = false;
                                    if (newAttendanceData.length > 0) {
                                        alreadyMarked = true;
                                        students.forEach((student, index) => {
                                            const temp = {};
                                            const alreadyAttendance = attendanceData.filter(att => att.EnrollmentID === enrollments[index]._id)[0];
                                            
                                            if (alreadyAttendance) {
                                                temp.EnrollmentID = alreadyAttendance.EnrollmentID;
                                                temp.Date = alreadyAttendance.Date;
                                                temp.Status = alreadyAttendance.Status;

                                            }else {
                                                temp.EnrollmentID = enrollments[index]._id;
                                                temp.Date = this.state.dateSelected;
                                                temp.Status = "P";
                                            }
                                            temp.No = student._id;
                                            temp.Name = student.Name;
                                            
                                            attendance.push(temp);
                                        })

                                    }else {
                                        students.forEach((student, index) => {
                                            const temp = {};
                                            temp.EnrollmentID = enrollments.filter(enrollment => enrollment.Student === student._id)[0]._id;
                                            temp.Date = this.state.dateSelected;
                                            temp.No = student._id;
                                            temp.Name = student.Name;
                                            temp.Status = "P";
                                            attendance.push(temp);
                                        })
                                    }
                                    
                                    this.setState({attendance: attendance, alreadyMarked: alreadyMarked});

                                }).catch(err => console.log(err))

                            }).catch(err => console.log(err))
                
                        }

                    }).catch(err => console.log(err))
        
                }   
            }
        }
    }

    changeHandler(e) {

        if (e.target.type === "date") {
            this.setState({dateSelected: e.target.value})
        }else {
            const index = e.target.name;
            const tempAttendance = [...this.state.attendance];
            tempAttendance[index].Status = e.target.checked ? "P" : "A";
    
            this.setState({attendance: tempAttendance})
        }
        
    }

    uploadAttendance(e) {
        e.preventDefault();
        const yes = window.confirm("Are you sure you want to upload the Manual Attendance?");
        if (yes) {
            axios.post(`${this.props.state.ATLAS_URI}/addAttendance`, this.state.attendance)
            .then(response => {
                const newDialogInfo = { isOpened: true, text: "Attendance Uploaded Successfully", type: "Success" }
                this.setState({ dialogInfo: newDialogInfo, alreadyMarked: true })
                setTimeout(() => {this.setState({dialogInfo: { isOpened: false, text: "", type: "" }})}, 3000)
    
            }).catch(err => console.log(err))

        }
    }

    render() {
        return (
            <div className="content">

                <Dialog
                    onClose={(e) => this.setState({ dialogInfo: { isOpened: false, text: "" } })}
                    dialogInfo={this.state.dialogInfo}
                />

                <h2>Mark Attendance</h2>

                <section className="box p20">
                    <nav className="tabNavigation">
                        <ul>
                            <li className="active">Lecture</li>
                        </ul>
                    </nav>

                    <div className="attendanceInfo">
                        <div className="row">
                            <div className="col-4"><b>Course: </b>{this.state.courseInfo.CourseName}</div>
                            <div className="col-4"><b>Courses Code: </b>{this.state.courseInfo.CourseCode}</div>
                            <div className="col-4"><b>Instructor: </b>{this.props.state.operator.Name}</div>
                        </div>

                        <div className="row">
                            <div className="col-4"><b>Number of Students: </b> {this.state.attendance.length}</div>
                            <div className="col-4"><b>Semester: </b> {this.state.semester}</div>
                        </div>
                        
                        <div className="row">
                            <div className="col-8 col-md-4 mb10" style={{display: "flex"}}>
                                <b>Date: </b> 
                                <input id="attendanceDate" style={{margin: "0 20px"}} type="date" value={this.state.dateSelected} onChange={this.changeHandler} className="form-control"/>
                            </div>

                            <div className="col-12 col-md-8">
                                <button className="btn uploadButton" onClick={this.uploadAttendance} disabled={this.state.alreadyMarked}>
                                    {this.state.alreadyMarked ? "Attendance Marked" : "Upload Attendance"} 
                                </button>
                                &nbsp;&nbsp;&nbsp;&nbsp;
                                <button className="btn uploadButton" onClick={() => this.setState({QRCodeGeneratorOpened: true})} disabled={this.state.alreadyMarked}>
                                    Generate QR Code 
                                </button>
                            </div>

                        </div>
                    </div>

                    <table className="displayTable">
                        <thead className="primaryThead">
                            <tr>
                                <th>S.no</th>
                                <th>Student No</th>
                                <th>Student Name</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.attendance.map((data, index) => 
                                <tr key={index}>
                                    <td>{index+1}</td>
                                    <td>{data.No}</td>
                                    <td>{data.Name}</td>

                                    <td>
                                        <input type="checkbox" name={index} value={true}
                                            checked={data.Status === "P"}
                                            required
                                            disabled = {this.state.alreadyMarked}
                                            title="Check for Present"
                                            onChange={this.changeHandler} />
                                    </td>
                                </tr>
                            )}
                            
                        </tbody>
                    </table>

                </section>

                
                {this.state.QRCodeGeneratorOpened && 
                    <QRCodeGenerator 
                        isOpened={this.state.QRCodeGeneratorOpened} 
                        closeModal={() => this.setState({QRCodeGeneratorOpened: false}) } 
                        BACKEND_URI={this.props.state.ATLAS_URI}
                        courseData = {{
                            CourseCode: this.state.courseInfo.CourseCode,
                            AssignedCourseCode: this.state.assignedCourseID,
                            CourseName: this.state.courseInfo.CourseName,
                            InstructorName: this.props.state.operator.Name,
                            AttendanceDate: this.state.dateSelected,
                            TotalStudents: this.state.attendance.length,
                            Semester: this.state.semester
                        }}
                    />
                }

            </div>
        )
    }

}

export default MarkAttendance