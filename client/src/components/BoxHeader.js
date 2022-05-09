import React from 'react'

function BoxHeader(props) {
    let boxTools = [];
    if (typeof props.boxTools !== 'undefined') {
        boxTools = props.boxTools
    }

    return (
        <div className="box-header with-border">

            <h3 className="box-title">{props.title}</h3>

            <div className="box-tools pull-right">

                {boxTools.map(boxTool =>
                    <button type="button" className="btn btn-sm btn-primary" onClick={props.openInputModal}>
                        <i className="fa fa-plus pt5"></i> Add
                    </button>
                )}

            </div>

        </div>
    )

}

export default React.memo(BoxHeader)