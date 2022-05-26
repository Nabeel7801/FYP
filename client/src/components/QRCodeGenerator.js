import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Modal } from 'react-bootstrap'
import Dialog from './Dialog'
import QRCode from 'qrcode'

function QRCodeGenerator(props) {

    const [dialogInfo, setDialogInfo] = useState({isOpened: false, text: "", type: ""});
    const [countdownTimer, setCountdownTimer] = useState(0);
    const [isLoading, setLoading] = useState(false);
    const [imageURL, setImageURL] = useState("");
    const [studentsPresent, setStudentsPresent] = useState(0);

    const getFormattedDate = (dateStr) => {
        const todayDate = new Date(parseInt(dateStr) + 5*3600*1000);

        const year = todayDate.getFullYear();
        let month = String(parseInt(todayDate.getMonth()) + 1);
        let day = todayDate.getDate()

        day = parseInt(day) < 10 ? "0"+day : day;
        month = parseInt(month) < 10 ? "0"+month : month;

        return year + '-' + month + "-" + day;
    }

    useEffect(() => {
        const interval = setInterval(() => {
            console.log(isLoading)
            if (countdownTimer === 0) {

                let url = props.BACKEND_URI + "/QRCodeAttendance?" + props.courseData.AssignedCourseCode + "?";
                setLoading(true);
                axios.get(`${props.BACKEND_URI}/getServerTime/`)
                .then(response => {
                    const responseData = response.data;
                    
                    axios.get(`${props.BACKEND_URI}/getAttendanceByDate/${getFormattedDate(responseData.date)}`)
                    .then(response => {
                        setStudentsPresent(response.data.length);
                    }).catch(err => console.log(err))

                    url = url + responseData.date;
                    generateQRCode(url);
                    setCountdownTimer(15);
                    setLoading(false);

                }).catch(err => console.log(err))
                
            }else {
                
                if (!isLoading) 
                    setCountdownTimer(countdownTimer - 1);
            }


        }, 1000)

        return () => clearInterval(interval);
    }, [countdownTimer, isLoading])

    const generateQRCode = async (url) => {
        try {
            const response = await QRCode.toDataURL(url);
            setImageURL(response);

        } catch (err) {
            console.log(err);
        }
    }

    return (
        
        <React.Fragment>
            <Dialog

                onClose={(e) => setDialogInfo({ isOpened: false, text: "", type: "" })}
                dialogInfo={dialogInfo}
            />
                
            <Modal show={props.isOpened} onHide={props.closeModal}>

                <Modal.Header closeButton>
                    <Modal.Title>Attendance QR Code Generator</Modal.Title>
                </Modal.Header>

                <Modal.Body>

                    <div className="qrCodeGeneratorArea">

                        <div className="row">

                            <div className="col-12 col-lg-5 br">
                                
                                <div className="courseInfo">

                                    <div><b>Course: </b>{props.courseData.CourseName}</div>
                                    <div><b>Course Code: </b>{props.courseData.CourseCode}</div>
                                    <div><b>Instructor: </b>{props.courseData.InstructorName}</div>
                                    <div><b>AttendanceDate: </b>{props.courseData.AttendanceDate}</div>
                                    <div><b>Semester: </b>{props.courseData.Semester}</div>
                                    <br />
                                    <div><b>Total Students: </b>{props.courseData.TotalStudents}</div>
                                    <div><b>Students Present: </b>{Math.min(studentsPresent, props.courseData.TotalStudents)}</div>

                                    <div>Refreshing QR Code in <b>{countdownTimer}</b> seconds</div>

                                </div>
                                
                            </div>

                            <div className="col-12 col-lg-7">
                                <img src={imageURL} />
                            </div>

                        </div>

                    </div>

                </Modal.Body>

            </Modal>
        </React.Fragment>


    )
}

export default React.memo(QRCodeGenerator)