import React, { Component } from 'react'
import DisplayTable from '../../components/DisplayTable'
import axios from 'axios'

class AttendanceDetail extends Component {

    state = {
        attendanceDetails: {
            course: {
                CourseCode: "",
                CourseName: ""
            },
            classAttended: "",
            classConducted: "",
            attendance: []
        }
    }

    constructor(props) {
        super(props);
        if (props.state.currentPage !== "Attendance Details") {
            props.state.setCurrentPage("Attendance Details")
        }
    }

    componentDidMount() {
        const params = new URLSearchParams(window.location.search);

        const tempDetails = this.state.attendanceDetails;
        tempDetails.course.CourseCode = params.get("code");
        tempDetails.course.CourseName = params.get("name");
        tempDetails.course.enrollmentID = params.get("enrollmentID");

        tempDetails.classConducted = tempDetails.attendance.length;
        tempDetails.classAttended = tempDetails.attendance.filter(attendance => attendance.Status === "P").length;

        axios.get(`${this.props.state.ATLAS_URI}/getAttendanceByEnrollment/${tempDetails.course.enrollmentID}`)
        .then(attendance => {
            const attendanceData = attendance.data;
            if (typeof attendanceData !== 'undefined' && attendanceData !== null) {

                const eAttendance = attendanceData.filter(x => x.EnrollmentID === tempDetails.course.enrollmentID)
                tempDetails.classConducted = eAttendance.length
                tempDetails.classAttended = eAttendance.filter(x => x.Status === "P").length
                tempDetails.attendancePercentage = tempDetails.classConducted === 0 ? "0.00%" : String((100*parseFloat(tempDetails.classAttended)/tempDetails.classConducted).toFixed(2)) + "%";
                tempDetails.attendance = eAttendance

                this.setState({ attendanceDetails: tempDetails });
            }
        }).catch(err => console.log(err))
    }

    render() {
        return (
            <div className="content">

                <h2>Attendance</h2>

                <section className="box p20">
                    <nav className="tabNavigation">
                        <ul>
                            <li className="active">Lecture</li>
                        </ul>
                    </nav>

                    <div className="attendanceInfo">
                        <div className="row">
                            <div className="col-4"><b>Course: </b>{this.state.attendanceDetails.course.CourseName}</div>
                            <div className="col-4"><b>Number of classes conducted: </b>{this.state.attendanceDetails.classConducted}</div>
                            <div className="col-4"><b>Attendance Percentage: </b>{this.state.attendanceDetails.attendancePercentage}</div>
                        </div>

                        <div className="row">
                            <div className="col-4"><b>Courses Code: </b>{this.state.attendanceDetails.course.CourseCode}</div>
                            <div className="col-4"><b>Number of classes attended: </b>{this.state.attendanceDetails.classAttended}</div>
                        </div>
                    </div>

                    <DisplayTable
                        displayField={["Date", "Status"]}
                        data={this.state.attendanceDetails.attendance}
                        primaryThead={true}
                    />

                </section>

            </div>

        )
    }

}

export default AttendanceDetail