import React, { useState, useEffect } from 'react'

function SlideShow(props) {

    const [announcements, setAnnouncements] = useState([...props.announcements]);

    useEffect(() => {
        setAnnouncements([...props.announcements])
    }, [props.announcements])

    const moveCarouselToLeft = e => {
        const tempArray = [...announcements];
        tempArray.unshift(tempArray.pop())
        setAnnouncements(tempArray)
    }

    const moveCarouselToRight = e => {
        const tempArray = [...announcements];
        tempArray.push(tempArray.shift());
        setAnnouncements(tempArray)
    }    

    return (
        <div className="announcementCarousel">
            {announcements.map((announcement, index) => 
                <div key={index} className={"item" + ( index === 2 ? " active" : "")}>
                    <div className="container">
                        <img src={announcement.Image} alt="slideshow img" className="img-responsive"/>
                        <h4>{announcement.NotificationHeader}</h4>
                        <p>{announcement.Date}</p>
                    </div>
                </div>
            )}

            <button className="prev" onClick={moveCarouselToLeft}>
                <i className="fas fa-chevron-left"></i>
            </button>
            <button className="right" onClick={moveCarouselToRight}>
                <i className="fas fa-chevron-right"></i>
            </button>
                  
        </div>
        
    )

}

export default SlideShow