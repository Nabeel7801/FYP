import React, {useState} from 'react'
import * as $ from 'jquery'

function EditableSelect(props) {

    const [options, setOptions] = useState(props.options); 
    const [value, setValue] = useState('');
        
    const filterOptions = e => {
        var temp = e.target.value;
        setOptions(props.options.filter(option => option.toLowerCase().substring(0, temp.length) === temp.toLowerCase()))
        setValue(temp)
    }

    return (
        <React.Fragment>

            <div className="form-group">
                <label >{props.label} </label><small className="req"> *</small>
                <input list="products" autoComplete="off" type="text" className="form-control  br10" value={value} placeholder={props.searchCriteria} onChange={filterOptions} /> 
            </div>
            
            <datalist id="products">
                {typeof options !== 'undefined' &&
                    options.map((dataListitem, key) => 
                        typeof dataListitem !== 'undefined' && <option key={key} value={dataListitem} />
                    )
                }
            </datalist>
        </React.Fragment>
    )

}

export default React.memo(EditableSelect)