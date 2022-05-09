import React, { Component } from 'react'
import axios from 'axios';

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Login, Dashboard } from './Pages/Miscellaneous/All'
import TopHeader from './components/TopHeader'
import Header from './components/Header'
import SideBar from './components/Sidebar';

import { ManageUsers, ManageRoles, UsersListAndLastLogin } from './Pages/Settings/Settings'

class App extends Component {

  state = {

    ATLAS_URI: "http://localhost:5000",
    Institution: "SZABIST Karachi",
    operator: {
      Name: "",
      Username: "",
      Role: "",
      UserID: "",
      RoleID: ""
    },
    pageAccessible: [],

    currentPage: "Dashboard",
    setCurrentPage: page => {
      this.setState({ currentPage: page });
    }
  }

  constructor() {
    super();

    this.updateOperatorInfo = this.updateOperatorInfo.bind(this);

    let operator = JSON.parse(window.localStorage.getItem('operator'));
    if (operator) {
      this.state.operator = operator;
    }

  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextState !== this.state
  }

  componentDidMount() {

    if (this.state.operator.Username === "") {
      if (window.location.pathname !== "/") {
        window.location.replace("/")
      }

    } else {

      //Get All Roles
      axios.get(`${this.state.ATLAS_URI}/getRoleByID/${this.state.operator.RoleID}`)
      .then(response => {
        const roleData = response.data;
        if (typeof roleData !== 'undefined' && roleData !== null) {
          this.setState({
            pageAccessible: roleData.Pages
          })

        }
      }).catch(err => console.log(err))


    }

  }

  updateOperatorInfo(operator) {
    const start = parseInt(Math.random() * (operator.Username.length - 3));
    const sessionCode = operator.Username.substr(start, 3).toUpperCase() + (new Date()).getTime() + String(parseInt(Math.random() * 10));

    const newOperator = {
      UserID: operator.UserID,
      Name: operator.Name,
      Username: operator.Username,
      Role: operator.Role,
      RoleID: operator.RoleID,
      LastLogin: operator.LastLogin
    }
    this.setState({
      operator: newOperator,
      sessionID: sessionCode
    })

    window.localStorage.setItem('operator', JSON.stringify(newOperator));
  }

  render() {

    if (window.location.pathname === "/") {
      return <Login state={this.state} updateOperatorInfo={this.updateOperatorInfo} />
    }

    return (
      <React.Fragment>
        <Router>
          <TopHeader operator={this.state.operator} Institution={this.state.Institution} BACKEND_URI={this.state.ATLAS_URI} />
          <Header currentPage={this.state.currentPage} />

          <main id="pageContainer">

            <SideBar pageAccessible={this.state.pageAccessible} />

            <section id="page_section">
              {

                <Switch>

                  {/*--------------- Dashboard ---------------------*/}

                  {this.state.pageAccessible.includes("Dashboard") &&
                    <Route path="/dashboard" exact component={() => <Dashboard state={this.state} />} />}

                  {/*--------------- Settings ---------------------*/}

                  {this.state.pageAccessible.includes("Settings") &&
                    <Route path="/Settings/manageUsers" exact component={() => <ManageUsers state={this.state} />} />}
                  {this.state.pageAccessible.includes("Settings") &&
                    <Route path="/Settings/manageRoles" exact component={() => <ManageRoles state={this.state} />} />}
                  {this.state.pageAccessible.includes("Settings") &&
                    <Route path="/Settings/userListsAndLastLogin" exact component={() => <UsersListAndLastLogin state={this.state} />} />}


                </Switch>

              }
            </section>

          </main>

        </Router>
      </React.Fragment>


    );
  }

}


export default App;
