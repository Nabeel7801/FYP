import React, { useState, useEffect } from 'react'
import * as $ from 'jquery'

function Header(props) {

    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        if (!menuOpen) {
            //When Sidebar is hovered
            $("#menu_section").on("mouseenter", () => {
                $("#menu_section").css({ "min-width": "calc(225px*(1/var(--ratio)))", "width": "calc(225px*(1/var(--ratio)))", "padding-left": "0" });
                $(".navTitle").css({ "width": "calc(175px*(1/var(--ratio)))", "padding-left": "20px" });
            })
        
            $("#menu_section").on("mouseleave", () => {
                $("#menu_section").css({ "width": "60px", "min-width": "60px", "padding-left": "5px" });
                $(".navTitle").css({ "width": "0px", "padding-left": "0px" });
                $(".sideBarItem .accordion-button").addClass("collapsed");
                $(".sideBarItem .accordion-collapse").removeClass("show");
            })
        }else {
            $("#menu_section").off("mouseenter").off("mouseleave");
        }
    }, [menuOpen])

    useEffect(() => {
        if (props.mobileHideMenu) {
            hideFullMenu();
        }
    }, [props.mobileHideMenu])

    
    const hideFullMenu = () => {
        $("#menu_section").css({ "width": "var(--menuWidth)", "min-width": "var(--menuWidth)", "padding-left": "5px" });
        $(".navTitle").css({ "width": "0px", "padding-left": "0px" });
        $(".sideBarItem .accordion-button").addClass("collapsed");
        $(".sideBarItem .accordion-collapse").removeClass("show");
    }

    const showFullMenu = () => {
        $("#menu_section").css({ "min-width": "calc(225px*(1/var(--ratio)))", "width": "calc(225px*(1/var(--ratio)))", "padding-left": "0" });
        $(".navTitle").css({ "width": "calc(175px*(1/var(--ratio)))", "padding-left": "20px" });
    }

    const onMenuClick = () => {
        if (!menuOpen) {
            document.querySelector('.menu_btn').classList.add('menuOpen');
            showFullMenu();
            setMenuOpen(true)
        } else {
            document.querySelector('.menu_btn').classList.remove('menuOpen');
            hideFullMenu();
            setMenuOpen(false)
        }
    }

    return (
        <header>
            <div className="navTitle">Navigation</div>

            <button className='menuArea' onClick={onMenuClick}>
                <span id="sideMenu" className="menu_btn">
                    <span className="menu_btn_burger"></span>
                </span>
            </button>

            <span className="breadcrumbs">
                <a href="/dashboard"><i className="fas fa-home"></i></a>
                <i className="fas fa-chevron-right"></i>  
                <span>{props.currentPage}</span>
            </span>
            
        </header>
    );

}

export default React.memo(Header)