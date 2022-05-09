import React from 'react'
import { Link } from "react-router-dom";
import Accordion from 'react-bootstrap/Accordion';

function SideBarItem(props) {

    const titleLink = "/" + props.title.replace(/\s/g, '') + "/";

    const getLink = str => {

        return titleLink + str.replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
            return index === 0 ? word.toLowerCase() : word.toUpperCase();
        }).replace(/\s+/g, '');

    }

    if (typeof props.subLinks === 'undefined') {
        return (
            <Link className="sideBarBtn" to={props.redirect}>
                <i className={props.icon}></i>
                <b>{props.title}</b>
            </Link>

        )

    } else {
        return (
            <Accordion.Item eventKey={props.itemKey}>

                <Accordion.Header>
                    <i className={props.icon}></i>
                    <b>{props.title}</b>
                </Accordion.Header>

                <Accordion.Body>
                    {props.subLinks.map(subLink =>
                        <Link key={subLink} className="accordion_submenu sideBarSubBtn" to={getLink(subLink)}><i className="fas fa-chevron-double-right" />{subLink}</Link>
                    )}
                </Accordion.Body>

            </Accordion.Item>

        )
    }

}

export default React.memo(SideBarItem)