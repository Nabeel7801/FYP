import React, { Component } from 'react'

class Dashboard extends Component {

    state = {
        role: this.props.state.operator.Role
    }

    constructor(props) {
        super(props);
        if (props.state.currentPage !== "Dashboard") {
            props.state.setCurrentPage("Dashboard")
        }
    }

    render() {

        return (
            <div className="content">
                <h1 className="centerInPage">Logged in as <b>{this.state.role}</b></h1>
            </div>
        )
    }

}

export default Dashboard