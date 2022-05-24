import React from 'react';

function DisplayTable(props) {

    return (
        <table className="displayTable">
            <thead className={props.primaryThead ? "primaryThead" : ""}>
                <tr>
                    <th>S.no</th>
                    {props.displayField.map((data, index) => 
                        <th key={index}>{data}</th>
                    )}
                </tr>
            </thead>
            <tbody>
                {props.data.map((data, index) => 
                    <tr key={index}>
                        <td>{index+1}</td>
                        {props.displayField.map((field, key) => 
                            field === "Download" ?
                            <td key={key}><i className="fa fa-download"></i></td> :
                            <td key={key}>{data[field]}</td>
                        )}
                    </tr>
                )}
                
            </tbody>
        </table>
    )

}

export default React.memo(DisplayTable)