import React from 'react'
import axios from 'axios'
import BoxHeader from '../../components/BoxHeader'
import DataTable from '../../components/DataTable'
import PageComponent from '../../components/PageComponent'
import Dialog from '../../components/Dialog'

class ManageUsers extends PageComponent {

    state = {
        resetNewRow: {
            _id: "",
            Role: "",
            Pages: []
        },
        newTableRow: {
            _id: "",
            Role: "",
            Pages: []
        },
        tableBodyList: [

        ],
        checkPages: ["Dashboard", "Attendance", "ScanQRCode", "QRCodeAttendance", "Faculty", "Students", "Degree", "Settings"],
        editingActivated: false,
        editingID: "",
        APIs: {
            AddData: "addRole",
            UpdateData: "updateRole",
            DeleteData: "deleteRole"
        },
        dialogInfo: {
            isOpened: false,
            text: "",
            type: ""
        }
    }

    constructor(props) {
        super(props);


        if (props.state.currentPage !== "Settings > Manage Roles") {
            props.state.setCurrentPage("Settings > Manage Roles")
        }
    }

    componentDidMount() {
        //Get All Roles
        axios.get(`${this.props.state.ATLAS_URI}/getRoles/`)
            .then(response => {
                const responseData = response.data;
                if (typeof responseData !== 'undefined') {
                    this.setState({
                        newTableRow: this.state.resetNewRow,
                        tableBodyList: responseData
                    })

                }

            }).catch(err => console.log(err))

    }

    render() {

        return (
            <section className="content">
                <div className="row">
                    <Dialog
                        onFalse={(e) => this.setState({ dialogInfo: { isOpened: false, text: "" } })}
                        onTrue={(e) => this.deleteFromTable(e)}
                        dialogInfo={this.state.dialogInfo}
                    />
                    <div className="col-md-5">

                        <div className="box box-primary">

                            <BoxHeader title={`${this.state.editingActivated ? "Edit" : "Add"} Role`} />

                            <form onSubmit={this.insertIntoTable} autoComplete='off'>

                                <div className="box-body bozero">

                                    <input type="hidden" name="ci_csrf_token" value="" />

                                    <div className="form-group">
                                        <label >Role </label><small className="req"> *</small>
                                        <input name="Role" value={this.state.newTableRow.Role} onChange={this.changeHandler} required type="text" className="form-control" />
                                    </div>

                                    <div className="form-group">
                                        <label>Page Accessibility</label><small className="req"> *</small>


                                        <div className="section_checkbox">
                                            {typeof this.state.checkPages !== 'undefined' && typeof this.state.newTableRow.Pages !== 'undefined' &&
                                                this.state.checkPages.map(page =>

                                                    <div className="checkbox" key={page}>
                                                        <label>
                                                            <input type="checkbox" name="Pages" value={page}
                                                                checked={this.state.newTableRow.Pages.includes(page)}
                                                                required={this.state.newTableRow.Pages.length === 0}
                                                                onChange={this.changeHandler} /> {page}
                                                        </label>
                                                    </div>
                                                )}

                                        </div>

                                    </div>
                                </div>
                                <div className="box-footer">
                                    <button type="submit" className="btn btn-info pull-right ">Save</button>
                                </div>
                            </form>
                        </div>
                    </div>

                    <div className="col-md-7">
                        <div className="box box-primary">

                            <BoxHeader title="List of Added Roles" />

                            <div className="box-body">

                                <DataTable
                                    tableHeader={["_id", "Role", "Pages"]}
                                    searchField="Role"
                                    tableBody={this.state.tableBodyList}
                                    deleteFromTable={this.openDialog}
                                    editTableRow={this.editTableRow}
                                />

                            </div>
                        </div>
                    </div>

                </div>
            </section>
        )

    }

}

export default ManageUsers