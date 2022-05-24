import React, { Component } from 'react'
import AttendanceBox from '../../components/AttendanceBox'
import axios from 'axios'

class Attendance extends Component {

    state = {
        attendances: [],
        courses: []
    }

    constructor(props) {
        super(props);
        if (props.state.currentPage !== "Attendance") {
            props.state.setCurrentPage("Attendance")
        }
    }

    componentDidMount() {

        if (this.props.state.operator.Role === "Student") {

            const StudentData = this.props.state.StudentData;
            const enrollments = (StudentData.map(x => { return x.EnrollmentID }).toString())

            axios.get(`${this.props.state.ATLAS_URI}/getAttendanceByEnrollment/${enrollments}`)
                .then(attendance => {
                    const attendanceData = attendance.data;

                    if (typeof attendanceData !== 'undefined' && attendanceData !== null) {
                        const Student = StudentData.map(student => {
                            const eAttendance = attendanceData.filter(x => x.EnrollmentID === student.EnrollmentID)
                            student.attendancePercent = eAttendance.length !== 0 ?
                                String((eAttendance.filter(x => x.Status === "P").length / (eAttendance.length)) * 100)
                                : '0'

                            return student
                        })
                        this.setState({ attendances: Student })
                    }
                }).catch(err => console.log(err))

        } else {

            const facultyData = this.props.state.FacultyData;

            if (facultyData.length > 0) {
                this.setState({ 
                    courses: facultyData 
                });
            }
            
        }
    }


    render() {
        return (
            <div className="content">

                <h2>Attendance</h2>

                <section className="box p20">
                    <nav className="tabNavigation">
                        <ul>
                            <li className="active">Active Classes</li>
                        </ul>
                    </nav>

                    <div className="row">
                        {this.props.state.operator.Role === "Student" ?
                            this.state.attendances.map(attendance =>
                                <AttendanceBox attendance={attendance} user="Student" />
                            )
                            :
                            this.state.courses.map(course =>
                                <AttendanceBox course={course} user="Faculty" />
                            )
                        }
                    </div>

                </section>

            </div>

        )
    }

}

export default Attendance;