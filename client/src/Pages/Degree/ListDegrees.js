import React, { Component } from 'react'
import axios from 'axios'
import BoxHeader from '../../components/BoxHeader'
import DataTable from '../../components/DataTable'
import Dialog from '../../components/Dialog'

class ListDegrees extends Component {

    state = {
        tableBodyList: [],
        dialogInfo: {
            isOpened: false,
            text: "",
            type: ""
        },
    }

    constructor(props) {
        super(props);
        this.openDialog = this.openDialog.bind(this);
        this.deleteFromTable = this.deleteFromTable.bind(this);
        this.editRecord = this.editRecord.bind(this);

        if (props.state.currentPage !== "Degree > List Degrees") {
            props.state.setCurrentPage("Degree > List Degrees")
        }
    }

    componentDidMount() {
        //Get All Clients
        axios.get(`${this.props.state.ATLAS_URI}/getDegrees/`)
            .then(response => {
                const responseData = response.data;
                if (typeof responseData !== 'undefined') {
                    this.setState({ tableBodyList: responseData })
                }
            }).catch(err => console.log(err))

    }

    editRecord(e) {
        const temp = e.target.parentElement.parentElement.id;
        this.props.updateEditDetails({ id: temp, editingActivated: true, redirectFrom: "/Degree/viewAllDegrees", pageFlag: "Degree > Add Degree" });
    }

    openDialog(e) {
        const newDialogInfo = {
            isOpened: true,
            delID: e.target.parentElement.parentElement.id,
            text: "Are you sure you want to delete this Degree?",
            type: "Confirm"
        }
        this.setState({ dialogInfo: newDialogInfo })
    }

    deleteFromTable(e) {

        const delID = this.state.dialogInfo.delID;
        axios.delete(`${this.props.state.ATLAS_URI}/deleteDegree/` + delID)
            .then(() => {
                const newTableBodyList = this.state.tableBodyList.filter(data => data._id !== delID);
                this.setState({
                    tableBodyList: newTableBodyList,
                    dialogInfo: { isOpened: false, text: "", delID: "" }
                })
            })
            .catch(err => alert(err))

    }

    render() {

        return (
            <div className="content">
                <div className="row">
                    <Dialog
                        onFalse={(e) => this.setState({ dialogInfo: { isOpened: false, text: "" } })}
                        onTrue={(e) => this.deleteFromTable(e)}
                        dialogInfo={this.state.dialogInfo}
                    />
                    <div className="col-md-12">

                        <div className="box box-primary">

                            <BoxHeader title="Students List" />

                            <div className="box-body">

                                <DataTable
                                    tableHeader={["_id", "Degree Name", "Credit Hours", "Department"]}
                                    tableBody={this.state.tableBodyList}
                                    searchField="DegreeName"
                                    customAction={[
                                        { title: "Update", icon: "edit", redirectTo: "/Degree/addDegree", onClickEvent: this.editRecord },
                                        { title: "Delete", icon: "times text-red", onClickEvent: this.openDialog }
                                    ]}
                                />
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        )
    }

}

export default ListDegrees