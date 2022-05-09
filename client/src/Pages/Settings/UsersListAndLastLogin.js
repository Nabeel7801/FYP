import React from 'react'
import axios from 'axios'
import BoxHeader from '../../components/BoxHeader'
import DataTable from '../../components/DataTable'
import PageComponent from '../../components/PageComponent'

class UsersListAndLastLogin extends PageComponent {

    state = {
        resetNewRow: {
            Sno: "",
            Name: "",
            Username: "",
            UserType: "",
            LastLogin: ""
        },
        newTableRow: {},
        tableBodyList: [

        ],
        newRowID: "1001",
        editingActivated: false,
        editingID: "",

    }
    
    constructor(props) {
        super(props);

        
        if (props.state.currentPage !== "Settings > Users List and Last Login") {
            props.state.setCurrentPage("Settings > Users List and Last Login")
        }
    }
    
    componentDidMount() {
        //Get All Login Details
        axios.get(`${this.props.state.ATLAS_URI}/getLoginDetails/`)
        .then(res => {
            const loginDetailsData = res.data;
            if (typeof loginDetailsData !== 'undefined') {

                this.setState({tableBodyList: loginDetailsData})

            }
        }).catch(err => console.log(err))

    }

    render() {

        return (
            <section className="content">
                <div className="row">

                    <div className="col-md-12">
                        <div className="box box-primary">

                            <BoxHeader title="Users Last Login List" />

                            <div className="box-body">
                                <DataTable
                                    tableHeader={["_id", "Name", "Username", "Role", "Login Time"]}
                                    tableBody={this.state.tableBodyList}
                                    searchField="Name"
                                    deleteFromTable={this.deleteFromTable}
                                    editTableRow={this.editTableRow}
                                    noActions={""}
                                />
                            </div>

                        </div>
                    </div>


                </div>
            </section>
        )

    }

}

export default UsersListAndLastLogin