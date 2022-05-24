import React, { Component } from 'react'
import axios from 'axios'
import BoxHeader from '../../components/BoxHeader'
import DataTable from '../../components/DataTable'
import Dialog from '../../components/Dialog'

class ListStudents extends Component {

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

        if (props.state.currentPage !== "Students > List Students") {
            props.state.setCurrentPage("Students > List Students")
        }
    }

    componentDidMount() {

        axios.get(`${this.props.state.ATLAS_URI}/getDegrees/`)
        .then(res => {
            const degreeData = res.data;

            //Get All Students
            axios.get(`${this.props.state.ATLAS_URI}/getStudents/`)
            .then(response => {
                const responseData = response.data;
                if (typeof responseData !== 'undefined') {

                    responseData.map(student => {
                        const deg = degreeData.filter(x => x._id === student.Program);
                        if (deg.length > 0) {
                            student._Program = deg[0].DegreeName;
                        }
                        return student;
                    })

                    this.setState({ tableBodyList: responseData })

                }

            }).catch(err => console.log(err))

        })
        
    }

    editRecord(e) {
        const temp = e.target.parentElement.parentElement.id;
        this.props.updateEditDetails({ id: temp, editingActivated: true, redirectFrom: "/Students/listStudents", pageFlag: "Students > Add Student" });
    }

    openDialog(e) {
        const newDialogInfo = {
            isOpened: true,
            delID: e.target.parentElement.parentElement.id,
            text: "Are you sure you want to delete this Student?",
            type: "Confirm"
        }
        this.setState({ dialogInfo: newDialogInfo })
    }

    deleteFromTable(e) {

        const delID = this.state.dialogInfo.delID;
        axios.delete(`${this.props.state.ATLAS_URI}/deleteStudent/` + delID)
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
                                    tableHeader={["_id", "Name", "Phone", "Email", "_Program", "Semester"]}
                                    tableBody={this.state.tableBodyList}
                                    searchField="Name"
                                    customAction={[
                                        { title: "Update", icon: "edit", redirectTo: "/Students/addStudent", onClickEvent: this.editRecord },
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

export default ListStudents