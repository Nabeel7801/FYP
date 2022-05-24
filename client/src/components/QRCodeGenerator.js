import React, { useState, useEffect } from 'react'
import axios from 'axios'
import * as $ from 'jquery'
import { Modal } from 'react-bootstrap'
import Dialog from './Dialog'
import QRCode from 'qrcode'

function QRCodeGenerator(props) {

    const [dialogInfo, setDialogInfo] = useState({isOpened: false, text: "", type: ""});
    const [countdownTimer, setCountdownTimer] = useState(15);
    const [imageURL, setImageURL] = useState("");

    useEffect(() => {
        const interval = setInterval(() => {

            if (countdownTimer == 15) {


                const url = props.BACKEND_URI + "/qrcodeattendance?courseID=" + props.courseData.AssignedCourseCode + "&session=" + (new Date()).getTime();

                generateQRCode(url);
            }

            setCountdownTimer(countdownTimer <= 0 ? 16 : countdownTimer - 1);

        }, 1000)

        return () => clearInterval(interval);
    }, [countdownTimer])

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

                            <div className="col-6 br">
                                
                                <div className="courseInfo">

                                    <div><b>Course: </b>{props.courseData.CourseName}</div>
                                    <div><b>Course Code: </b>{props.courseData.CourseCode}</div>
                                    <div><b>Instructor: </b>{props.courseData.InstructorName}</div>
                                    <div><b>AttendanceDate: </b>{props.courseData.AttendanceDate}</div>
                                    <div><b>Semester: </b>{props.courseData.Semester}</div>
                                    <br />
                                    <div><b>Total Students: </b>{props.courseData.TotalStudents}</div>
                                    <div><b>Students Present: </b>{props.courseData.TotalStudents}</div>

                                    <div>Refreshing QR Code in <b>{countdownTimer}</b> seconds</div>

                                </div>
                                
                            </div>

                            <div className="col-6">
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