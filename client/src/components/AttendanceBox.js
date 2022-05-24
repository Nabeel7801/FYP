import React from 'react';

function AttendanceBox(props) {
    return (

        <div className="col-12 col-sm-6 col-md-4 col-lg-3">
            {props.user === "Student" ?
                <div className="attendanceBox">
                    <div className="topArea" onClick={() =>
                        window.location.href = ("attendanceDetail?code=" + props.attendance.CourseData.CourseCode + "&name=" + props.attendance.CourseData.CourseName + "&enrollmentID=" + props.attendance._id)
                    }>
                        <h4>{props.attendance.CourseData.CourseName}</h4>
                        <h6>{props.attendance.CourseData.CourseCode}</h6>
                    </div>
                    <div className="attendanceArea">
                        <div>Attendance: {props.attendance.attendancePercent}%</div>
                        <progress value={props.attendance.attendancePercent} max="100"></progress>
                    </div>
                    <span className="flag">
                        {(Number(props.attendance.Semester) % 2 === 0 ? "Spring " : "Fall ") + props.attendance.Year}
                    </span>
                </div>
                :
                <div className="resultBox">
                    <div className="topArea" onClick={() =>
                        window.location.replace("Faculty/markAttendance?course=" + props.course.Course._id)
                    }>
                        <h4>{props.course.Course.CourseName}</h4>
                        <h6>{props.course.Course.CourseCode}</h6>
                    </div>
                    <div className="detailsArea">
                        <span><b>Credits: </b> {parseFloat(props.course.Course.CreditHours).toFixed(1)}</span>
                        <span className="courseStatus">Class in progress</span><br />
                        <div className="mt10"><b>{props.course.Semester}</b></div>

                    </div>
                    <span className="flag">
                        {(Number(props.course.Semester) % 2 === 0 ? "Spring " : "Fall ") + props.course.Year}

                    </span>
                </div>
            }

        </div>
    )

}

export default React.memo(AttendanceBox)