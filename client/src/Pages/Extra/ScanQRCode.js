import React, {useState, useEffect} from 'react';
import { QrReader } from 'react-qr-reader';

function ScanQRCode(props) {

    const [scanResultWebCam, setScanResultWebCam] = useState("");
    const [isCameraOn, setCameraOn] = useState(false);

    useEffect(() => {
        setCameraOn(true);

        return () => setCameraOn(false);
    }, [])

    const handleErrorWebCamera = error => {
        console.log(error);
    }

    const handleScanWebCamera = result => {
        if (result) {
            setScanResultWebCam(result);
        }
    }

    return (
        <div className="content scannerPage">

            <div className="scannerArea">
                <QrReader 
                    delay={300}
                    style={{width: "100%"}}
                    onError={handleErrorWebCamera}
                    onScan={handleScanWebCamera}
                    facingMode="environment"
                    legacyMode={true}
                />
            </div>
            

        </div>
    )

}

export default React.memo(ScanQRCode);