import React from 'react'

function Footer() {
    if (window.top === window.self) {
        return (
            <footer id="footer">
                <span className="footer_text1">&copy; Copyright 2021</span>
                <span className="footer_text2">All Rights Reserved | School Management</span>
            </footer>

        );

    } else {
        return <div></div>
    }
}

export default React.memo(Footer)