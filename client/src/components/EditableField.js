import React from 'react';

function EditableField(props) {
    return (
        <div className="editableField">
            {props.icon && <i className={props.icon}/>}
            <div>
                <label>{props.label}</label><br />   
                <input type={props.type ? props.type : "text"} name={props.name} value={props.value} readOnly={!props.editable}/>
            </div>
            
        </div>
    )
}

export default React.memo(EditableField);