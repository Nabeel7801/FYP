import React, { Component } from 'react'
import * as $ from 'jquery'
import emptyTableImg from '../img/addnewitem.svg'
import { Link } from 'react-router-dom';

class DataTable extends Component {

    state = {
        currentPage: 1,
        maxPages: 1,
        maxRecordsPerPage: 10,
        tableBody: [],
        tableBodyActive: []
    }

    constructor() {
        super();
        this.handleChangePage = this.handleChangePage.bind(this);
        this.handleMaxRecordChange = this.handleMaxRecordChange.bind(this);
        this.onSearchChange = this.onSearchChange.bind(this);
    }

    componentDidMount() {
        this.setState({
            maxPages: parseInt(this.props.tableBody.length / this.state.maxRecordsPerPage) + 1,
            tableBody: this.props.tableBody,
            tableBodyActive: this.props.tableBody
        });

        this.state.maxPages > this.state.currentPage ? $("#dtNextBtn").removeClass("disabled") : $("#dtNextBtn").addClass("disabled")

    }

    shouldComponentUpdate(prevProps, prevState) {
        return (prevProps.tableBody !== this.state.tableBody ||
            prevState.tableBodyActive !== this.state.tableBodyActive) ||
            prevState.currentPage !== this.state.currentPage ||
            prevState.maxRecordsPerPage !== this.state.maxRecordsPerPage
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.tableBody !== this.props.tableBody) {
            this.setState({
                maxPages: parseInt(this.props.tableBody.length / (this.state.maxRecordsPerPage + 1)) + 1,
                tableBody: this.props.tableBody,
                tableBodyActive: this.props.tableBody
            });

            setTimeout(() => {
                $("#dtSearch").val("");
                this.state.maxPages > this.state.currentPage ? $("#dtNextBtn").removeClass("disabled") : $("#dtNextBtn").addClass("disabled")
            }, 50)
        }

        if (prevState.tableBodyActive !== this.state.tableBodyActive || prevState.maxRecordsPerPage !== this.state.maxRecordsPerPage) {
            const temp = parseInt(this.state.tableBodyActive.length / this.state.maxRecordsPerPage);
            this.setState({
                maxPages: this.state.tableBodyActive.length % this.state.maxRecordsPerPage === 0 ? temp : temp + 1,
                tableBodyActive: this.state.tableBodyActive,
                currentPage: 1
            });
            $("#dtPrevBtn").addClass("disabled")

            setTimeout(() => {
                this.state.maxPages > this.state.currentPage ? $("#dtNextBtn").removeClass("disabled") : $("#dtNextBtn").addClass("disabled")
            }, 50)
        }

    }

    getPageRecord() {
        if (typeof this.props.tableBody === 'undefined' || this.state.tableBodyActive.length === 0) {
            return "0 to 0 of 0";

        } else {
            const startPage = (this.state.currentPage - 1) * this.state.maxRecordsPerPage + 1;
            const totalRecords = this.state.tableBodyActive.length;
            const endPage = this.state.tableBodyActive.length < this.state.currentPage * this.state.maxRecordsPerPage ? this.state.tableBodyActive.length : this.state.currentPage * this.state.maxRecordsPerPage

            return startPage + " to " + endPage + " of " + totalRecords;

        }

    }

    getBodyStartIndex() {
        return (this.state.currentPage - 1) * this.state.maxRecordsPerPage;
    }

    getBodyEndIndex() {
        return this.state.tableBodyActive.length < this.state.currentPage * this.state.maxRecordsPerPage ? this.state.tableBodyActive.length : this.state.currentPage * this.state.maxRecordsPerPage
    }

    handleChangePage(e) {

        let currPage = e.target.name === "next" ? this.state.currentPage + 1 : this.state.currentPage - 1;
        currPage < this.state.maxPages ? $("#dtNextBtn").removeClass("disabled") : $("#dtNextBtn").addClass("disabled")
        currPage > 1 ? $("#dtPrevBtn").removeClass("disabled") : $("#dtPrevBtn").addClass("disabled")

        this.setState({ currentPage: currPage })
    }

    onSearchChange(e) {
        const newTableBody = this.state.tableBody.filter(data => {
            const tempData = data[this.props.searchField];
            if (tempData) {
                return e.target.value.toLowerCase() === tempData.substr(0, e.target.value.length).toLowerCase()
            }else {
                return false
            }
            
        })

        this.setState({
            tableBodyActive: newTableBody
        })
    }

    handleMaxRecordChange(e) {
        this.setState({ maxRecordsPerPage: parseInt(e.target.value) })
    }

    render() {
        return (
            <div className="table-responsive mailbox-messages">

                <div id="DataTables_Table_0_wrapper" className="dataTables_wrapper no-footer">

                    <div className="dataTables_maxRecords form-group">
                        <label>
                            <select className="form-control" value={String(this.state.maxRecordsPerPage)} onChange={this.handleMaxRecordChange} >
                                <option value="5">5</option>
                                <option value="10" defaultValue={"10"}>10</option>
                                <option value="25">25</option>
                                <option value="50">50</option>
                            </select> Records per page
                        </label>

                    </div>

                    <div className="dataTables_filter">
                        <input type="search" placeholder={`Search by ${this.props.searchField}`} id='dtSearch' name="searchValue" onChange={this.onSearchChange} />
                    </div>

                    <table className="table table-bordered table-hover dataTable no-footer" cellSpacing="0" width="100%" id="DataTables_Table_0" role="grid" aria-describedby="DataTables_Table_0_info" style={{ "width": "100%" }}>
                        <thead>
                            <tr>

                                {this.props.tableHeader.map(tableHeader =>
                                    <th key={tableHeader} tabIndex="0" aria-controls="DataTables_Table_0" rowSpan="1" colSpan="1">
                                        {tableHeader === "_id" ? "ID" : tableHeader}
                                    </th>
                                )}

                                {typeof this.props.noActions === 'undefined' &&
                                    <th className="text-right" tabIndex="0" aria-controls="DataTables_Table_0" rowSpan="1" colSpan="1" aria-label="Action: activate to sort column ascending">
                                        Action
                                    </th>
                                }

                            </tr>
                        </thead>

                        <tbody>
                            {typeof this.props.tableBody === 'undefined' || this.props.tableBody.length === 0 ?
                                <tr className='odd'>
                                    <td valign="top" colSpan="12" className="dataTables_empty">
                                        <div align="center">
                                            No data available in table
                                            <br /><br />
                                            <img alt='Empty Table' src={emptyTableImg} width="150" />
                                            <br /><br />
                                            <span className="text-success bolds">
                                                <i className="fa fa-arrow-left"></i>
                                                &nbsp;Add new record or search with different criteria.
                                            </span>
                                            <div></div>
                                        </div>
                                    </td>
                                </tr>
                                :
                                this.state.tableBodyActive
                                    .slice(this.getBodyStartIndex(), this.getBodyEndIndex()).map(bodyData =>
                                        <tr className='dtFieldRows' id={bodyData._id} key={bodyData._id}>

                                            {this.props.tableHeader.map(bodyField =>
                                                <td className="bodyDataFields" key={bodyField}>
                                                    {typeof bodyData[bodyField.replace(/\s/g, '')] !== 'undefined' && 
                                                        (typeof bodyData[bodyField.replace(/\s/g, '')] === 'string'
                                                            ? bodyData[bodyField.replace(/\s/g, '')]
                                                            : Array.isArray(bodyData[bodyField.replace(/\s/g, '')]) &&
                                                                bodyData[bodyField.replace(/\s/g, '')].map(data => <div key={data} className="dtMultiData">{data}</div>)
                                                        )
                                                    }
                                                </td>
                                            )}

                                            {typeof this.props.noActions === 'undefined' &&
                                                <td className="bodyDataActions">

                                                    {(typeof this.props.customAction === 'undefined') ?
                                                        <React.Fragment>
                                                            <button className="btn btn-default btn-xs no-focus" title="Edit" onClick={this.props.editTableRow}>
                                                                <i className="fas fa-pencil"></i>
                                                            </button>
                                                            <button className="btn btn-default btn-xs no-focus" title="Delete" onClick={this.props.deleteFromTable}>
                                                                <i className="fas fa-times text-red"></i>
                                                            </button>
                                                        </React.Fragment>
                                                        :

                                                        <React.Fragment>
                                                            {this.props.customAction.map(action =>
                                                                
                                                                (action.title === "Attempt" || action.title === "Update") ?
                                                                    <Link key={action.title} className="btn btn-default btn-xs no-focus" onClick={action.onClickEvent} to={action.redirectTo}><i className={`fas fa-${action.icon}`}></i></Link>
                                                                    :
                                                                    ((!action.fieldCondition || bodyData[Object.keys(action.fieldCondition)[0]] === Object.values(action.fieldCondition)[0]) &&
                                                                        <button key={action.title} className="btn btn-default btn-xs no-focus" title={action.title} onClick={action.onClickEvent}><i className={`fas fa-${action.icon}`}></i></button>
                                                                    )
                                                            )}
                                                        </React.Fragment>

                                                    }

                                                </td>
                                            }

                                        </tr>
                                    )

                            }

                        </tbody>

                    </table>

                    <section className="dtBottomSection row">

                        <div className="dtPageDetails col-md-6">{`Record: ${this.getPageRecord()}`}</div>

                        <div className="dtPaginationArea col-md-6">

                            <button className="dtPageBtn disabled" id='dtPrevBtn' name="previous" onClick={this.handleChangePage}>
                                <i className="fa fa-angle-left"></i>
                            </button>

                            <div id="dtCurrentPage">{this.state.currentPage}</div>

                            <button className="dtPageBtn disabled" id='dtNextBtn' name="next" onClick={this.handleChangePage}>
                                <i className="fa fa-angle-right"></i>
                            </button>

                        </div>
                    </section>

                </div>

            </div>

        )
    }


}

export default DataTable