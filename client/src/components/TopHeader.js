import React, {useState} from 'react'
import logo from '../img/logo.png'
import * as $ from 'jquery'
import ChangePassword from './ChangePassword';

function TopHeader(props) {
 
    const [isChangePasswordOpened, setChangePasswordOpened] = useState(false);

    const logoutOperator = e => {
        window.localStorage.removeItem("operator");
        window.location.replace("/");
    }

    const openProfileDropdown = e => {
        if ($(".dropDown").hasClass("visible")) {
            $(".showProfileOption > i").removeClass("fa-chevron-up").addClass("fa-chevron-down");
            $(".dropDown").removeClass("visible")
        } else {
            $(".showProfileOption > i").removeClass("fa-chevron-down").addClass("fa-chevron-up");
            $(".dropDown").addClass("visible")
        }
    }

    return (
        <React.Fragment>
            <section id="topHeader">

                <img alt="logo" style={{margin: "0 5px", objectFit: "cover"}} src={logo} height={35}></img>  
                <span className='brandTitle'>{props.Institution}</span>

                <span className="profileArea pull-right">

                    <div className='row'>
                        <div className='col-sm-2 col-6'>
                            <i className="fas fa-user-tie userProfile" />
                        </div>
                        <div className="col-sm-8 d-none d-sm-block userInfo">
                            <div className="fw700 fs16">{props.operator.Name}</div>
                            <div className="fs14 color-g">{props.operator.Role}</div>
                        </div>
                        <div className='col-sm-2 col-6'>
                            <button className='showProfileOption' onClick={openProfileDropdown}><i className="fas fa-chevron-down" /></button>
                        </div>
                    </div>

                    <span className="dropDown">

                        <div className='option'>
                            <button onClick={() => {setChangePasswordOpened(true)}}><i className="fas fa-cog" /> Change Password</button>
                        </div>

                        <div className='option'>
                            <button onClick={logoutOperator}><i className="fas fa-sign-out" /> Log Out</button>
                        </div>

                    </span>

                </span>

                <span className='lastLogin pull-right d-none d-md-block'>
                    <div className="fw700 fs16">Last Login</div>
                    <div className="fs14 color-g">{props.operator.LastLogin}</div>
                </span>

            </section>

            <ChangePassword 
                isOpened={isChangePasswordOpened} 
                closeModal={() => {setChangePasswordOpened(false)}} 
                username={props.operator.Username}
                BACKEND_URI={props.BACKEND_URI}/>

        </React.Fragment>
        
    )

}

export default React.memo(TopHeader)