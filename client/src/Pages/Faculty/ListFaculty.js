import React, { Component } from 'react'
import axios from 'axios'
import BoxHeader from '../../components/BoxHeader'
import DataTable from '../../components/DataTable'
import Dialog from '../../components/Dialog'

class ListFaculty extends Component {

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

        if (props.state.currentPage !== "Faculty > List Faculty") {
            props.state.setCurrentPage("Faculty > List Faculty")
        }
    }

    componentDidMount() {
        //Get All Faculty
        axios.get(`${this.props.state.ATLAS_URI}/getFaculty/`)
            .then(response => {
                const responseData = response.data;
                if (typeof responseData !== 'undefined') {
                    this.setState({ tableBodyList: responseData })

                }

            }).catch(err => console.log(err))

    }

    editRecord(e) {
        const temp = e.target.parentElement.parentElement.id;
        this.props.updateEditDetails({ id: temp, editingActivated: true, redirectFrom: "/Faculty/viewAllFaculty", pageFlag: "Faculty > Add Faculty" });
    }

    openDialog(e) {
        const newDialogInfo = {
            isOpened: true,
            delID: e.target.parentElement.parentElement.id,
            text: "Are you sure you want to delete this Faculty?",
            type: "Confirm"
        }
        this.setState({ dialogInfo: newDialogInfo })
    }

    deleteFromTable(e) {

        const delID = this.state.dialogInfo.delID;
        axios.delete(`${this.props.state.ATLAS_URI}/deleteFaculty/` + delID)
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

                            <BoxHeader title="Faculty List" />

                            <div className="box-body">

                                <DataTable
                                    tableHeader={["_id", "Faculty Name", "Faculty Phone", "Faculty Email", "Faculty Department", "Faculty Rank"]}
                                    tableBody={this.state.tableBodyList}
                                    searchField="FacultyName"
                                    customAction={[
                                        { title: "Update", icon: "edit", redirectTo: "/Faculty/addFaculty", onClickEvent: this.editRecord },
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

export default ListFaculty