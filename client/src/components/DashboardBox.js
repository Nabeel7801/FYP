import React from 'react';

function DashboardBox(props) {

    if (props.user === "Faculty" && typeof props.course.Course === 'undefined') {
        return <div></div>
    }

    return (
        <div className="col-12 col-sm-6 col-md-4 col-lg-3">
            {props.user === "Student" ? 
                <div className="dashboardBox">
                    <div className="topArea" onClick={() =>
                        window.location.replace("attendanceDetail?code=" + props.course.CourseData.CourseCode + "&name=" + props.course.CourseData.CourseName + "&enrollmentID=" + props.course._id)
                    }>
                        <h4>{props.course.CourseData.CourseName}</h4>
                        <h6>{props.course.CourseData.CourseCode}</h6>
                    </div>
                    <div className="detailsArea">

                        <span><b>Credits: </b>{parseFloat(props.course.CourseData.CreditHours).toFixed(1)}</span>
                        <span className="courseStatus">Class in progress</span>
                        <div><b>Attendance: </b>{parseFloat(props.course.attendancePercent).toFixed(2)}%</div>
                    </div>
                    <span className="flag">
                        {Number(props.course.Semester) % 2 === 0 ? "Spring " + props.course.Year : "Fall " + props.course.Year
                        }
                    </span>

                </div>
                : 
                <div className="dashboardBox">
                    <div className="topArea" onClick={() =>
                        window.location.replace("Faculty/markAttendance?course=" + props.course.Course._id)
                    }>
                        <h4>{props.course.Course.CourseName}</h4>
                        <h6>{props.course.Course.CourseCode}</h6>
                    </div>
                    <div className="detailsArea">

                        <span><b>Credits: </b>{parseFloat(props.course.Course.CreditHours).toFixed(1)}</span>
                        <span className="courseStatus">Class in progress</span>
                    </div>
                    <span className="flag">
                        {Number(props.course.Semester) % 2 === 0 ? "Spring " + props.course.Year : "Fall " + props.course.Year}
                    </span>

                </div> 
            }
        </div>
    )

}

export default React.memo(DashboardBox)