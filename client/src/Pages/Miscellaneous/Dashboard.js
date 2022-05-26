import React, { Component } from 'react'
import profile from '../../img/profile.png'
import axios from 'axios'
import DashboardBox from '../../components/DashboardBox'

class Dashboard extends Component {

    state = {
        allCourses: [],
        studentInfo: {
            Name: this.props.state.operator.Name,
            _id: this.props.state.operator.Role,
            Institution: "Szabist Karachi"
        }
    }

    constructor(props) {
        super(props);
        if (props.state.currentPage !== "Dashboard") {
            props.state.setCurrentPage("Dashboard");
        }
    }

    componentDidMount() {

        //Get All Students
        const StudentData = this.props.state.StudentData
        if (this.props.state.operator.Role === "Student") {
            axios.get(`${this.props.state.ATLAS_URI}/getStudentByUserID/${this.props.state.operator.UserID}`)
            .then(response => {
                const responseData = response.data;

                if (typeof responseData !== 'undefined') {

                    const enrollments = (StudentData.map(x => { return x.EnrollmentID }).toString())
                    
                    axios.get(`${this.props.state.ATLAS_URI}/getAttendanceByEnrollment/${enrollments}`)
                        .then(attendance => {
                            const attendanceData = attendance.data;

                            if (typeof attendanceData !== 'undefined' && attendanceData !== null) {

                                const Student = StudentData.map(student => {
                                    const eAttendance = attendanceData.filter(x => x.EnrollmentID === student.EnrollmentID)
                                    student.attendancePercent = eAttendance.length !== 0 ? String((eAttendance.filter(x => x.Status === "P").length / (eAttendance.length)) * 100) : '0'
                                    return student
                                })

                                this.setState({ allCourses: Student, studentInfo: responseData })
                            }
                        }).catch(err => console.log(err))
                }
            }).catch(err => console.log(err))
            
        }else {
            const facultyData = this.props.state.FacultyData;

            if (facultyData.length > 0) {
                this.setState({allCourses: facultyData});
            }
        }

    }

    render() {

        return (
            <div className="content">
                <div className="box">

                    <div className="dashboardBox">
                        <h2 className="boxHeader">Academics</h2>
                        <div className="row">

                            <div className="col-12 col-md-4">
                                <div style={{ display: "flex" }}>
                                    <img src={profile} alt="profile" className="profilePic" />
                                    <div className="studentInfo">
                                        <h4>{this.state.studentInfo.Name}</h4>
                                        <p>{this.state.studentInfo._id}</p>
                                        <p>{this.state.studentInfo.Institution}</p>
                                    </div>
                                </div>

                            </div>


                            {this.props.state.operator.Role === "Student" &&
                            
                                <>
                                    <div className="col-12 col-md-4">
                                        <div className="studentInfo">
                                            <p><b>Academic standings:</b> Excellent</p>
                                            <p><b>Semester:</b> {this.state.studentInfo.Semester}</p>
                                            <p><b>CGPA:</b> 3.78</p>
                                        </div>
                                    </div>

                                    <div className="col-12 col-md-4">
                                        <div className="studentInfo">
                                            <p><b>Completed Cr. / Total Cr :</b> 78.0 / 96.0</p>
                                            <p><b>Inprogress Cr :</b> 18.0</p>
                                        </div>
                                    </div>
                                </>
                            }

                        </div>
                    </div>

                    <div className="dashboardBox">
                        <h2 className="boxHeader">Classes, Grades and Attendance</h2>
                        <div className="row">

                            {this.state.allCourses.map(courses =>
                                <DashboardBox course={courses} user={this.props.state.operator.Role}/>
                            )}
                        </div>
                    </div>

                    <br/>

                </div>
            </div>
        )
    }

}

export default Dashboard