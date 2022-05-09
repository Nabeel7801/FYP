import React from 'react';

function Dialog(props) {
 
    return (props.dialogInfo.isOpened &&
        <React.Fragment>
 
            {props.dialogInfo.type === "Error" &&
                <div className='dialog row'>
                    <div className='col-1'><i className="fas fa-exclamation-triangle iconRed"></i></div>
                    <div className='col-10 errorMsg'>{props.dialogInfo.text}</div>
                    <div className='col-1'><button className='closeBtn' onClick={props.onClose}>x</button></div>
                </div>
            }

            {props.dialogInfo.type === "Success" &&
                <div className='dialog row'>
                    <div className='col-1'><i className="fas fa-check iconGreen"></i></div>
                    <div className='col-10 errorMsg'>{props.dialogInfo.text}</div>
                    <div className='col-1'><button className='closeBtn' onClick={props.onClose}>x</button></div>
                </div>
            }

            {props.dialogInfo.type === "Confirm" && 
                <div className="overlay" >
                    <div className='overlay-opacity' />
                    <div className='dialog confirmDialog row '>
                        <div className='col-1'><i className="fas fa-exclamation-triangle iconRed"></i></div>
                        <div className='col-11 errorMsg'>{props.dialogInfo.text}</div>
                        <div className='row justify-content-center'>
                            <div className='col-2'>
                                <button className='btn btn-primary' onClick={props.onTrue}>Yes</button>
                            </div>
                            <div className='col-2'>
                                <button className='btn btn-outline-danger' onClick={props.onFalse}>No</button>
                            </div>
                        </div>
                    </div>
                </div>
            }
            
        </React.Fragment>
    )

}
export default React.memo(Dialog);