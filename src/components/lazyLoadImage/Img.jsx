import React, { useRef } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

const Img = ({ src, alt, className }) => {
    const imgRef = useRef(null);

    return (
        <LazyLoadImage
            className={className || ""}
            alt={alt} // 'alt' prop'unu kullan
            effect="blur" // Blur etkisi
            src={src}
            ref={imgRef}
            placeholderSrc="/path/to/placeholder/image.png" // Yer tutucu görsel (isteğe bağlı)
        />
    );
};

export default Img;
