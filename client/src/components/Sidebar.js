import React from 'react'
import SideBarItem from './SideBarItem'
import Accordion from 'react-bootstrap/Accordion';

function SideBar(props) {
    return (
        <section id="menu_section">

            <Accordion>
                {props.pageAccessible.includes("Dashboard") &&
                    <SideBarItem
                        itemKey="0"
                        title="Dashboard"
                        icon="fas fa-tachometer-alt"
                        redirect="/dashboard"
                    />
                }

                {props.pageAccessible.includes("Attendance") &&
                    <SideBarItem
                        itemKey="1"
                        title="Attendance"
                        icon="fab fa-autoprefixer"
                        redirect="/attendance"
                    />
                }
                
                {props.pageAccessible.includes("ScanQRCode") &&
                    <SideBarItem
                        itemKey="2"
                        title="Scan QR Code"
                        icon="fas fa-qrcode"
                        redirect="/scanQRCode"
                    />
                }

                {props.pageAccessible.includes("Exams Result") &&
                    <SideBarItem
                        itemKey="3"
                        title="Exams Result"
                        icon="fas fa-chart-bar"
                        redirect="/examsResult"
                    />
                }
                {props.pageAccessible.includes("Enrollments") &&
                    <SideBarItem
                        itemKey="13"
                        title="Enrollments"
                        icon="fas fa-chart-bar"
                        redirect="/enrollments"
                    />
                }

                {props.pageAccessible.includes("Fee Invoices") &&
                    <SideBarItem
                        itemKey="4"
                        title="Fee Invoices"
                        icon="far fa-money-bill"
                        redirect="/feeInvoices"
                    />
                }

                {props.pageAccessible.includes("Students") &&
                    <SideBarItem
                        itemKey="5"
                        title="Students"
                        icon="fas fa-graduation-cap"
                        subLinks={[
                            "Add Student", "List Students"
                        ]}
                    />
                }

                {props.pageAccessible.includes("Faculty") &&
                    <SideBarItem
                        itemKey="6"
                        title="Faculty"
                        icon="fas fa-chalkboard-teacher"
                        subLinks={[
                            "Add Faculty", "View All Faculty", "Assign Course"
                        ]}
                    />
                }



                {props.pageAccessible.includes("Degree") &&
                    <SideBarItem
                        itemKey="10"
                        title="Degree"
                        icon="fas fa-book"
                        subLinks={[
                            "Add Degree", "View All Degrees", "Add Course"
                        ]}
                    />
                }

                {props.pageAccessible.includes("Notifications") &&
                    <SideBarItem
                        itemKey="12"
                        title="Notifications"
                        icon="fas fa-bell"
                        redirect="/notifications"
                    />
                }

                {props.pageAccessible.includes("Settings") &&
                    <SideBarItem
                        itemKey="8"
                        title="Settings"
                        icon="fas fa-wrench"
                        subLinks={[
                            "Manage Users", "User Lists and Last Login", "Manage Roles"
                        ]}
                    />
                }

                {props.pageAccessible.includes("Configurations") &&
                    <SideBarItem
                        itemKey="9"
                        title="Configurations"
                        icon="fas fa-info-circle"
                        redirect="/configurations"
                    />
                }

            </Accordion>

        </section>

    );
}

export default React.memo(SideBar)