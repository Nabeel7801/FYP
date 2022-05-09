import React, { useState, useEffect } from 'react'
import * as $ from 'jquery'
import Dropdown from 'react-bootstrap/Dropdown'
import FormControl from 'react-bootstrap/FormControl'

function SelectBox(props) {

    const options = props.options;

    const [value, setValue] = useState('');
    const [isDropDownVisible, setDropDownVisible] = useState(false);

    useEffect(() => {
        if (isDropDownVisible) {
            $(".searchSelect").blur(() => {
                setTimeout(() => {
                    setDropDownVisible(false);
                }, 300)
            });
            ((props.value !== "Select" && props.options.filter(data => data._id === props.value).length === 0) || typeof props.value === "undefined")
                && props.resetValue()

        }
    }, [props, isDropDownVisible])

    const optionSelected = e => {
        props.changeHandler(e);
        $(e.target).parents(".dropdown").find(".searchArea").focus();
        const key = $(e.target).attr("index");
        typeof props.callBackFn !== 'undefined' && props.callBackFn(props.label, props.options[key]);
    }

    const customClick = e => {
        e.preventDefault();
        setDropDownVisible(!isDropDownVisible);
    }

    return (
        <Dropdown>

            <div className="form-group">
                <label>{props.label}</label> <small className="req"> *</small>

                <button type="button" className="form-control dropdown-toggle" onClick={(e) => { customClick(e) }}>
                    {props.value === "Select" ? "Select" : props.options.filter(data => data._id === props.value).map(data => data[props.attributeShown])[0]}
                </button>
            </div>

            {isDropDownVisible &&
                <div className='dropdownContent'>
                    <div className="form-group searchArea">
                        <FormControl
                            autoFocus
                            className="searchSelect"
                            placeholder="Type to filter..."
                            onChange={(e) => setValue(e.target.value)}
                            value={value}
                        />
                    </div>

                    <ul className="list-unstyled">

                        {
                            typeof props.attributeShown === 'undefined' ?

                                options.filter(option => !value || option.toLowerCase().startsWith(value.toLowerCase())).map((option, key) =>
                                    <button type="button" name={props.name} className="dropdown-item" key={key} index={key} value={option} onClick={optionSelected} >{option}</button>
                                )
                                :
                                options.filter(option => !value || option[props.attributeShown].toLowerCase().startsWith(value.toLowerCase())).map((option, key) =>
                                    <button type="button" name={props.name} className="dropdown-item" key={key} index={key} value={option._id} onClick={optionSelected} >{option[props.attributeShown]}</button>
                                )
                        }
                    </ul>
                </div>
            }

        </Dropdown>
    )

}

export default React.memo(SelectBox)