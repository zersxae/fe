// src/components/embedPopup/EmbedPopup.jsx
import React from "react";
import "./EmbedPopup.scss";

const EmbedPopup = ({ show, setShow, embedUrl }) => {
    if (!show) return null;

    const handleClose = () => {
        setShow(false);
    };

    const handleBackgroundClick = (e) => {
        if (e.target.classList.contains('embedPopup')) {
            handleClose();
        }
    };

    return (
        <div className={`embedPopup ${show ? 'active' : ''}`} onClick={handleBackgroundClick}>
            <div className={`embedPopupContent ${show ? 'active' : ''}`}>
                {/* Geri Butonu */}
                <button className="backBtn" onClick={handleClose} aria-label="Geri">
                    <span>Geri</span>
                </button>
                {/* Embed Video */}
                {embedUrl && (
                    <iframe
                        src={embedUrl}
                        title="Vidsrc Embed"
                        frameBorder="0"
                        allowFullScreen
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    ></iframe>
                )}
            </div>
        </div>
    );
};

export default EmbedPopup;
