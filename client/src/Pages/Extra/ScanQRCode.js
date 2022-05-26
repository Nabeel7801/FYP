import React, {useState, useEffect} from 'react';
import axios from 'axios'
import QrReader from 'modern-react-qr-reader'

function ScanQRCode(props) {

    const [isCameraOn, setCameraOn] = useState(false);
    const [scannerPaused, setScannerPaused] = useState(false);

    useEffect(() => {
        setCameraOn(true);

        return () => setCameraOn(false);
    }, [])

    const getFormattedDate = (dateStr) => {
        const todayDate = new Date(parseInt(dateStr) + 5*3600*1000);

        const year = todayDate.getFullYear();
        let month = String(parseInt(todayDate.getMonth()) + 1);
        let day = todayDate.getDate()

        day = parseInt(day) < 10 ? "0"+day : day;
        month = parseInt(month) < 10 ? "0"+month : month;

        return year + '-' + month + "-" + day;
    }

    const handleErrorWebCamera = error => {
        console.log(error);
    }

    const handleScanWebCamera = result => {
        if (result && !scannerPaused) {
            setScannerPaused(true);
            const temp = result.split('?');

            axios.get(`${props.BACKEND_URI}/getServerTime/`)
            .then(response => {
                const responseData = response.data;
                const timeDiff = parseInt(responseData.date) - parseInt(temp[2]);

                if (timeDiff < 15000) {
                    setCameraOn(false);

                    axios.get(`${props.BACKEND_URI}/getEnrollmentByAssignedCourseStudent/${temp[1]}/${props.StudentID}`)
                    .then(enrollment => {
                        const enrollmentData = enrollment.data[0];
                        const todayDate = getFormattedDate(responseData.date);
                        if (typeof enrollmentData !== 'undefined') {
                            axios.get(`${props.BACKEND_URI}/getAttendanceByDateEnrollment/${todayDate}/${enrollmentData._id}`)
                            .then(info => {
                                if (info.data.length > 0) {
                                    alert("Attendance Already Marked for Today's Class (" + todayDate + ")")
                                    setCameraOn(true);
                                    setScannerPaused(false);

                                }else {
                                    const attendanceObject = [{
                                        "EnrollmentID": enrollmentData._id,
                                        "Date": todayDate,
                                        "Status": "P"
                                    }]
                                    axios.post(`${props.BACKEND_URI}/addAttendance`, attendanceObject)
                                    .then(() => {
                                        alert("Attendance Marked Successfully");
                                        window.location.replace("/attendance");
                                    })

                                }
                            })
                        }

                    }).catch(err => console.log(err))

                }else {
                    alert("QR Code Expired. Try Again!");
                    setScannerPaused(false);
                }

            }).catch(err => console.log(err))
        
        }
    }

    return (
        <div className="content scannerPage">


            {isCameraOn && 
                <div className="scannerArea">
                    <QrReader 
                        delay={300}
                        facingMode={"environment"}
                        style={{width: "100%"}}
                        onError={handleErrorWebCamera}
                        onScan={handleScanWebCamera}
                    />
                </div>
            }

        </div>
    )

}

export default React.memo(ScanQRCode);