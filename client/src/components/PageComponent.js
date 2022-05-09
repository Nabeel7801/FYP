import { Component } from 'react'
import * as $ from 'jquery'
import axios from 'axios';

class PageComponent extends Component {

    constructor() {
        super();
        this.changeHandler = this.changeHandler.bind(this);
        this.insertIntoTable = this.insertIntoTable.bind(this);
        this.deleteFromTable = this.deleteFromTable.bind(this);
        this.editTableRow = this.editTableRow.bind(this);
        this.openInputModal = this.openInputModal.bind(this);
        this.closeInputModal = this.closeInputModal.bind(this);

        this.openFollowUpModal = this.openFollowUpModal.bind(this);
        this.closeFollowUpModal = this.closeFollowUpModal.bind(this);
        this.updateFollowUp = this.updateFollowUp.bind(this);
        this.deleteFollowUp = this.deleteFollowUp.bind(this);
        this.updateFollowUpStatus = this.updateFollowUpStatus.bind(this);

        this.openDialog = this.openDialog.bind(this);
        this.deleteImage = this.deleteImage.bind(this);
    }

    componentDidMount() {
        setTimeout(() => {
            this.setState({
                newTableRow: this.state.resetNewRow,
                tableBodyDisplayList: this.state.tableBodyList
            })
        }, 50)
    }

    changeHandler(e) {
        let newValue;
        if (e.target.type === "file") {
            newValue = Object.values(e.target.files)[0];

        } else {
            newValue = e.target.value;
            if (e.target.type !== "button") {
                if (typeof $(e.target).attr("index") !== 'undefined') {
                    newValue = [...this.state.newTableRow[e.target.name]]
                    newValue[$(e.target).attr("index")] = e.target.value
                }

                if (e.target.type === "checkbox") {
                    newValue = [...this.state.newTableRow[e.target.name]]
                    if (e.target.checked) {
                        newValue.push(e.target.value)
                    } else {
                        newValue = newValue.filter(data => data !== e.target.value)
                    }
                }
            }

        }

        this.setState(prevState => ({
            ...prevState,
            newTableRow: {
                ...prevState.newTableRow,
                [e.target.name]: newValue
            }
        }))
    }

    insertIntoTable(e) {
        e.preventDefault();
 
        if (!this.state.editingActivated) {
            //When Adding new Data
            axios.post(`${this.props.state.ATLAS_URI}/${this.state.APIs.AddData}/`, this.state.newTableRow)
                .then(response => {
                    if (response.status === 200) {

                        let newTableBodyList = [...this.state.tableBodyList];
                        newTableBodyList.push(response.data.addedData);
                        
                        this.setState(prevState => ({
                            ...prevState,
                            tableBodyList: newTableBodyList,
                            newTableRow: this.state.resetNewRow
                        }))

                    }
                })
                .catch(err => alert(err))

        } else {
            //When Edit is Activated
            axios.post(`${this.props.state.ATLAS_URI}/${this.state.APIs.UpdateData}/` + this.state.editingID, this.state.newTableRow)
                .then(() => {
                    const newTableBodyList = this.state.tableBodyList.map(data =>
                        data._id === this.state.editingID ? this.state.newTableRow : data
                    )
                    this.setState({
                        editingActivated: false,
                        tableBodyList: newTableBodyList,
                        newTableRow: this.state.resetNewRow
                    })
                })
                .catch(err => alert(err))



        }

    }

    openDialog(e) {
        const newDialogInfo = {
            isOpened: true,
            delID: e.target.parentElement.parentElement.id,
            text: "Are you sure you want to delete this Record?",
            type: "Confirm"
        }
        this.setState({ dialogInfo: newDialogInfo })
    }

    deleteFromTable(e) {

        const delID = this.state.dialogInfo.delID;
        axios.delete(`${this.props.state.ATLAS_URI}/${this.state.APIs.DeleteData}/` + delID)
            .then(() => {
                const newTableBodyList = this.state.tableBodyList.filter(data => data._id !== delID);
                this.setState({
                    tableBodyList: newTableBodyList,
                    tableBodyDisplayList: newTableBodyList,
                    newTableRow: this.state.resetNewRow,
                    dialogInfo: { isOpened: false, text: "", delID: "" }
                })
            })
            .catch(err => alert(err))

    }

    editTableRow(e) {
        const editRowID = e.target.parentElement.parentElement.id;
        const editData = this.state.tableBodyList.filter(data => data._id === editRowID)[0];
        this.setState({
            editingActivated: true,
            editingID: editRowID,
            newTableRow: editData
        })

    }

    openInputModal() {
        this.setState({ isModalOpen: true });
    }

    closeInputModal() {
        this.setState({ isModalOpen: false });
    }

    openFollowUpModal(e) {

        const editRowID = $(e.target).parents(".dtFieldRows").attr("id");
        const editData = this.state.tableBodyList.filter(data => data._id === editRowID)[0];
        this.setState({
            editingActivated: true,
            editingID: editRowID,
            newTableRow: editData,
            isFollowUpModalOpen: true
        })
    }

    closeFollowUpModal(e) {
        this.setState({
            isFollowUpModalOpen: false,
            newTableRow: this.state.resetNewRow
        })
    }

    updateFollowUp(e) {
        e.preventDefault();
        const newFollowUpData = {
            FollowUpTakenBy: this.props.state.operator.Name,
            FollowUpDate: this.getNormalDate($("#followUpDate").val()),
            Response: $("#followUpResponse").val(),
            Note: $("#followUpNote").val(),
        }

        let tempList = [...this.state.newTableRow.FollowUpList];
        tempList.unshift(newFollowUpData)
        let newLeadData = this.state.newTableRow;

        newLeadData.FollowUpList = tempList;
        newLeadData.LastFollowUpDate = this.getNormalDate($("#followUpDate").val());
        newLeadData.NextFollowUpDate = this.getNormalDate($("#nextFollowUpDate").val());


        axios.post(`${this.props.state.ATLAS_URI}/updateLead/` + this.state.editingID, newLeadData)
            .then(() => {
                const newTableBodyList = this.state.tableBodyList.map(data =>
                    data._id === this.state.editingID ? newLeadData : data
                )

                const newTableBodyDisplayList = typeof this.state.tableBodyDisplayList !== 'undefined' ?
                    this.state.tableBodyDisplayList.map(data =>
                        data._id === this.state.editingID ? newLeadData : data
                    ) : []

                this.setState({
                    tableBodyList: newTableBodyList,
                    tableBodyDisplayList: newTableBodyDisplayList
                })
                this.resetFollowUp()

            }).catch(err => alert(err))

    }

    updateFollowUpStatus(e) {

        let newLeadData = this.state.newTableRow;
        newLeadData.LeadStatus = e.target.value;

        axios.post(`${this.props.state.ATLAS_URI}/updateLead/` + this.state.editingID, newLeadData)
            .then(() => {
                const newTableBodyList = this.state.tableBodyList.map(data =>
                    data.ID === this.state.editingID ? this.state.newTableRow : data
                )

                const newTableBodyDisplayList = typeof this.state.tableBodyDisplayList !== 'undefined' ?
                    this.state.tableBodyDisplayList.map(data =>
                        data._id === this.state.editingID ? this.state.newTableRow : data
                    ) : []

                this.setState({
                    tableBodyList: newTableBodyList,
                    tableBodyDisplayList: newTableBodyDisplayList
                })

            }).catch(err => alert(err))
    }

    deleteFollowUp(e) {

        const confirmed = window.confirm("Are you sure you want to delete this Follow Up?");

        if (confirmed) {
            const deleteIndex = $(e.target).attr("index");
            let tempList = [...this.state.newTableRow.FollowUpList]
            tempList.splice(deleteIndex, 1);

            let tempLead = this.state.newTableRow;
            tempLead.FollowUpList = tempList;

            axios.post(`${this.props.state.ATLAS_URI}/updateLead/` + this.state.editingID, tempLead)
                .then(() => {

                    this.setState({
                        newTableRow: tempLead
                    })

                }).catch(err => alert(err))


        }

    }

    resetFollowUp() {
        const today = new Date();
        $("#followUpDate").val(today.getFullYear() + "-" + String(parseInt(today.getMonth()) + 1) + "-" + today.getDate());
        $("#nextFollowUpDate").val("");
        $("#followUpResponse").val("");
        $("#followUpNote").val("");

    }

    getNormalDate(inputDate) {
        return inputDate.substr(8, 2) + "-" + inputDate.substr(5, 2) + "-" + inputDate.substr(0, 4);
    }

    getInputDate(inputDate) {
        return inputDate.substr(6, 4) + "-" + inputDate.substr(3, 2) + "-" + inputDate.substr(0, 2);
    }

    getTodayTime() {
        return this.returnTime(this.getFormattedDate())
    }//return newDate().getTime() //not giving exact value
    returnDate(date) {
        if (typeof date !== "undefined") {
            return (new Date(date.replace(/(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3")))
        }
        return false
    }
    returnTime(date) {
        if (typeof date !== "undefined") {
            return (new Date(date.replace(/(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3"))).getTime()
        }
        return false
    }
    getFormattedDate() {
        let today = new Date();
        const date = today.getDate();
        const month = String(parseInt(today.getMonth()) + 1);
        const year = today.getFullYear();
        return (date < 10 && "0") + date + "-" + (month < 10 && "0") + month + "-" + year;
    }

    deleteImage(e) {
        e.preventDefault();
        const deletedSrc = this.state.dialogInfo.delID;

        axios.delete(deletedSrc)
            .then(() => {
                const deletedIndex = $(e.target.parentElement).attr("index");
                const newData = this.state.newTableRow;
                newData.Images.splice(deletedIndex, 1)
                axios.post(`${this.props.state.ATLAS_URI}/updateProject/` + this.props.state.EditDetailsData.id, newData)
                    .then(() => {
                        this.setState({ newTableRow: newData })
                    }).catch(err => alert(err))
            })
            .catch(err => alert(err))
    }

}

export default PageComponent