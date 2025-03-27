import React from "react";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import "./style.scss";

const CarouselArrow = ({ direction, onClick, className, style }) => {
    return (
        <button 
            className={`carouselArrow ${direction === "left" ? "left" : "right"} ${className || ""}`}
            onClick={onClick}
            style={style}
            aria-label={`${direction === "left" ? "Previous" : "Next"} slide`}
        >
            <div className="arrowCircle">
                {direction === "left" ? (
                    <MdKeyboardArrowLeft />
                ) : (
                    <MdKeyboardArrowRight />
                )}
            </div>
        </button>
    );
};

export default CarouselArrow; 