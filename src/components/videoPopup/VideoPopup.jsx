import React, { useState } from "react";
import ReactPlayer from "react-player/youtube";
import "./style.scss";

const VideoPopup = ({ show, setShow, videoId, setVideoId }) => {
    const [error, setError] = useState(false);

    const hidePopup = () => {
        setShow(false);
        setVideoId(null);
        setError(false);
    };

    return (
        <div className={`videoPopup ${show ? "visible" : ""}`}>
            <div className="opacityLayer" onClick={hidePopup}></div>
            <div className="videoPlayer">
                <span className="closeBtn" onClick={hidePopup}>
                    Kapat
                </span>
                {videoId && !error ? (
                    <ReactPlayer
                        url={`https://www.youtube.com/watch?v=${videoId}`}
                        controls
                        width="100%"
                        height="100%"
                        playing={true}
                        onError={() => setError(true)}
                    />
                ) : (
                    <div className="error">Fragman Bulunamadı</div>
                )}
            </div>
        </div>
    );
};

export default VideoPopup;
