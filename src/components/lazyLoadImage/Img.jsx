import React from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

const Img = ({ src, alt, className }) => {
    return (
        <LazyLoadImage
            className={className || ""}
            alt={alt || ""}
            effect="blur"
            src={src}
        />
    );
};

export default Img;
