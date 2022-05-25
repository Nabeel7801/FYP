import React, { Component } from 'react'
import axios from 'axios';

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Login, Dashboard, Attendance, AttendanceDetail } from './Pages/Miscellaneous/All'
import TopHeader from './components/TopHeader'
import Header from './components/Header'
import SideBar from './components/Sidebar';

import { ManageUsers, ManageRoles, UsersListAndLastLogin } from './Pages/Settings/Settings'

import { AddStudent, ListStudents } from './Pages/Students/Students'
import { AddFaculty, ListFaculty, AssignCourse } from './Pages/Faculty/Faculty'
import { AddDegree, ListDegrees, AddCourse } from './Pages/Degree/Degree'

import { MarkAttendance, ScanQRCode } from './Pages/Extra/Extra'

class App extends Component {

  state = {

    ATLAS_URI: "http://localhost:5000",
    //ATLAS_URI: "https://szabist.herokuapp.com",
    Institution: "SZABIST Karachi",
    operator: {
      Name: "",
      Username: "",
      Role: "",
      UserID: "",
      RoleID: ""
    },
    EditDetailsData: {},

    pageAccessible: [],
    StudentData: [],
    FacultyData: [],

    currentPage: "Dashboard",
    setCurrentPage: page => {
      this.setState({ currentPage: page });
    }
  }

  constructor() {
    super();

    this.updateOperatorInfo = this.updateOperatorInfo.bind(this);
    this.updateEditDetails = this.updateEditDetails.bind(this);
    this.redirectFromEditDetails = this.redirectFromEditDetails.bind(this);

    let operator = JSON.parse(window.localStorage.getItem('operator'));
    if (operator) {
      this.state.operator = operator;
    }

  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextState !== this.state
  }

  componentDidMount() {

    if (this.state.operator.Username === "") {
      if (window.location.pathname !== "/") {
        window.location.replace("/")
      }

    } else {

      //Get All Roles
      axios.get(`${this.state.ATLAS_URI}/getRoleByID/${this.state.operator.RoleID}`)
      .then(response => {
        const roleData = response.data;
        if (typeof roleData !== 'undefined' && roleData !== null) {
          this.setState({
            pageAccessible: roleData.Pages
          })

        }
      }).catch(err => console.log(err))


      if (this.state.operator.Role === 'Student') {

        //Get Student ID
        axios.get(`${this.state.ATLAS_URI}/getStudentByUserID/${this.state.operator.UserID}`)
          .then(student => {
            const studentData = student.data;

            if (typeof studentData !== 'undefined' && studentData !== null) {

              axios.get(`${this.state.ATLAS_URI}/getEnrollmentByStudent/${studentData._id}`)
                .then(enrollment => {

                  const enrollmentData = enrollment.data;
                  const searchAssignedCourse = (enrollmentData.map(x => { return x.AssignedCourse })).toString()

                  if (typeof enrollmentData !== 'undefined' && enrollmentData !== null) {

                    axios.get(`${this.state.ATLAS_URI}/getMultipleAssignedCourses/${searchAssignedCourse}`)
                      .then(assigned => {

                        const assignedData = assigned.data;
                        if (typeof assignedData !== 'undefined' && assignedData !== null) {

                          const searchCourse = (assignedData.map(x => { return x.Course })).toString()

                          axios.get(`${this.state.ATLAS_URI}/getMultipleCourses/${searchCourse}`)
                            .then(allCourses => {

                              const allCourseData = allCourses.data;
                              if (typeof allCourseData !== 'undefined' && allCourseData !== null) {


                                const finalData = []

                                enrollmentData.forEach(enroll => {
                                  const eAssignCourse = assignedData.filter(x => { return x._id === enroll.AssignedCourse && x.Semester === studentData.Semester.substring(0, 1) })[0]
                                  if (typeof eAssignCourse !== 'undefined') {
                                    const eCourses = allCourseData.filter(x => x._id === eAssignCourse.Course)[0]
                                    enroll.Year = eAssignCourse.Year
                                    enroll.Semester = eAssignCourse.Semester
                                    enroll.CourseData = eCourses
                                    enroll.EnrollmentID = enroll._id
                                    finalData.push(enroll)
                                  }
                                })

                                this.setState({ StudentData: finalData })

                              }
                            }).catch(err => console.log(err))
                        }
                      }).catch(err => console.log(err))
                  }
                }).catch(err => console.log(err))
            }
          }).catch(err => console.log(err))

      } else {
        console.log("User ID: " + this.state.operator.UserID);
        //Get All Faculties
        axios.get(`${this.state.ATLAS_URI}/getFacultyByUserID/${this.state.operator.UserID}`)
          .then(faculty => {
            const facultyData = faculty.data;
            console.log("Faculty ID: " + facultyData._id);

            if (typeof facultyData !== 'undefined' && facultyData !== null) {

              axios.get(`${this.state.ATLAS_URI}/getAssignedCoursesByFaculty/${facultyData._id}`)
                .then(assignedCourses => {
                  const assignedCoursesData = assignedCourses.data;
                  if (typeof assignedCoursesData !== 'undefined' && assignedCoursesData.length > 0) {

                    const searchCourse = (assignedCoursesData.map(x => { return x.Course })).toString()

                    axios.get(`${this.state.ATLAS_URI}/getMultipleCourses/${searchCourse}`)
                      .then(allCourses => {
                        const allCourseData = allCourses.data;

                        axios.get(`${this.state.ATLAS_URI}/getDegrees`)
                          .then(allDegree => {
                            const allDegreeData = allDegree.data;

                            if (typeof allCourseData !== 'undefined' && allCourseData !== null) {

                              const finalData = assignedCoursesData.map(tempAssignedCourses => {
                                tempAssignedCourses.Course = allCourseData.filter(course => course._id === tempAssignedCourses.Course)[0];
                                tempAssignedCourses.Semester = this.getFormattedSemester(tempAssignedCourses.Semester)
                                tempAssignedCourses.Degree = allDegreeData.filter(degree => degree._id === tempAssignedCourses.Degree)[0];
                                return tempAssignedCourses
                              })

                              this.setState({ FacultyData: finalData })
                            }

                          }).catch(err => console.log(err))

                      }).catch(err => console.log(err))
                  }
                }).catch(err => console.log(err))
            }
          }).catch(err => console.log(err))

      }

    }

  }

  getFormattedSemester(semester) {
    let temp;
    switch (semester) {
      case "1":
        temp = "1st Semester";
        break;

      case "2":
        temp = "2nd Semester";
        break;

      case "3":
        temp = "3rd Semester";
        break;

      default:
        temp = semester + "th Semester";
        break;
    }
    return temp;
  }

  setAttendance(attendance) {
    this.setState({ attendances: attendance })
  }

  updateOperatorInfo(operator) {
    const start = parseInt(Math.random() * (operator.Username.length - 3));
    const sessionCode = operator.Username.substr(start, 3).toUpperCase() + (new Date()).getTime() + String(parseInt(Math.random() * 10));

    const newOperator = {
      UserID: operator.UserID,
      Name: operator.Name,
      Username: operator.Username,
      Role: operator.Role,
      RoleID: operator.RoleID,
      LastLogin: operator.LastLogin
    }
    this.setState({
      operator: newOperator,
      sessionID: sessionCode
    })

    window.localStorage.setItem('operator', JSON.stringify(newOperator));
  }

  updateEditDetails(newEditDetailsData) {
    this.state.EditDetailsData = newEditDetailsData;
  }

  redirectFromEditDetails(page) {
    this.state.EditDetailsData = {};
    if (page !== null) {
      window.location.replace(page)
    }
  }

  render() {

    if (window.location.pathname === "/") {
      return <Login state={this.state} updateOperatorInfo={this.updateOperatorInfo} />
    }

    return (
      <React.Fragment>
        <Router>
          <TopHeader operator={this.state.operator} Institution={this.state.Institution} BACKEND_URI={this.state.ATLAS_URI} />
          <Header currentPage={this.state.currentPage} />

          <main id="pageContainer">

            <SideBar pageAccessible={this.state.pageAccessible} />

            <section id="page_section">
              {

                <Switch>

                  {/*--------------- Dashboard ---------------------*/}

                  {this.state.pageAccessible.includes("Dashboard") &&
                    <Route path="/dashboard" exact component={() => <Dashboard state={this.state} />} />}

                  {/*--------------- Attendance ---------------------*/}

                  {this.state.pageAccessible.includes("Attendance") &&
                    <Route path="/attendance" exact component={() => <Attendance state={this.state} zsetAttendance={this.setAttendance} />} />}
                  {this.state.pageAccessible.includes("Attendance") &&
                    <Route path="/attendanceDetail" exact component={() => <AttendanceDetail state={this.state} />} />}


                  {/*--------------- Students ---------------------*/}

                  {this.state.pageAccessible.includes("Students") &&
                    <Route path="/Students/addStudent" exact component={() => <AddStudent state={this.state} redirectFromEditDetails={this.redirectFromEditDetails} />} />}
                  {this.state.pageAccessible.includes("Students") &&
                    <Route path="/Students/listStudents" exact component={() => <ListStudents state={this.state} updateEditDetails={this.updateEditDetails} />} />}


                  {/* --------------- Faculty ---------------------*/}

                  {this.state.pageAccessible.includes("Faculty") &&
                    <Route path="/Faculty/addFaculty" exact component={() => <AddFaculty state={this.state} redirectFromEditDetails={this.redirectFromEditDetails} />} />}
                  {this.state.pageAccessible.includes("Faculty") &&
                    <Route path="/Faculty/viewAllFaculty" exact component={() => <ListFaculty state={this.state} updateEditDetails={this.updateEditDetails} />} />}
                  {this.state.pageAccessible.includes("Faculty") &&
                    <Route path="/Faculty/assignCourse" exact component={() => <AssignCourse state={this.state} updateEditDetails={this.updateEditDetails} />} />}

                  {/* --------------- Extras --------------- */}
                  {this.state.operator.Role === "Faculty" &&
                    <Route path="/Faculty/markAttendance" exact component={() => <MarkAttendance state={this.state} />} />}

                  {/*--------------- Degree ---------------------*/}

                  {this.state.pageAccessible.includes("Degree") &&
                    <Route path="/Degree/addDegree" exact component={() => <AddDegree state={this.state} redirectFromEditDetails={this.redirectFromEditDetails} />} />}
                  {this.state.pageAccessible.includes("Degree") &&
                    <Route path="/Degree/viewAllDegrees" exact component={() => <ListDegrees state={this.state} updateEditDetails={this.updateEditDetails} />} />}
                  {this.state.pageAccessible.includes("Degree") &&
                    <Route path="/Degree/addCourse" exact component={() => <AddCourse state={this.state} redirectFromEditDetails={this.redirectFromEditDetails} />} />}

                  {/* --------------- Scan QR Code --------------- */}
                  {this.state.pageAccessible.includes("ScanQRCode") &&
                    <Route path="/scanQRCode" exact component={() => <ScanQRCode state={this.state} />} />}
                  

                  {/*--------------- Settings ---------------------*/}

                  {this.state.pageAccessible.includes("Settings") &&
                    <Route path="/Settings/manageUsers" exact component={() => <ManageUsers state={this.state} />} />}
                  {this.state.pageAccessible.includes("Settings") &&
                    <Route path="/Settings/manageRoles" exact component={() => <ManageRoles state={this.state} />} />}
                  {this.state.pageAccessible.includes("Settings") &&
                    <Route path="/Settings/userListsAndLastLogin" exact component={() => <UsersListAndLastLogin state={this.state} />} />}


                </Switch>

              }
            </section>

          </main>

        </Router>
      </React.Fragment>


    );
  }

}


export default App;
