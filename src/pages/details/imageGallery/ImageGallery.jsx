import React, { useState, useRef } from "react";
import ContentWrapper from "../../../components/contentWrapper/ContentWrapper";
import Img from "../../../components/lazyLoadImage/Img";
import CarouselArrow from "../../../components/carousel/CarouselArrow";
import { IoClose } from "react-icons/io5";
import "./style.scss";

const ImageGallery = ({ images, loading }) => {
    const [showModal, setShowModal] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const carouselContainer = useRef();
    const modalImageRef = useRef();

    if (!loading && (!images || images.length === 0)) {
        return null;
    }

    const handleImageClick = (index) => {
        setCurrentImageIndex(index);
        setShowModal(true);
        document.body.style.overflow = 'hidden';
    };

    const handleClose = () => {
        setShowModal(false);
        document.body.style.overflow = 'auto';
    };

    const handlePrev = (e) => {
        e?.stopPropagation();
        setCurrentImageIndex((prev) => 
            prev === 0 ? images.length - 1 : prev - 1
        );
    };

    const handleNext = (e) => {
        e?.stopPropagation();
        setCurrentImageIndex((prev) => 
            prev === images.length - 1 ? 0 : prev + 1
        );
    };

    const navigation = (dir) => {
        const container = carouselContainer.current;
        const scrollAmount = dir === "left" 
            ? container.scrollLeft - (container.offsetWidth + 20)
            : container.scrollLeft + (container.offsetWidth + 20);

        container.scrollTo({
            left: scrollAmount,
            behavior: "smooth",
        });
    };

    const handleKeyDown = (e) => {
        if (e.key === "ArrowLeft") handlePrev();
        if (e.key === "ArrowRight") handleNext();
        if (e.key === "Escape") handleClose();
    };

    return (
        <div className="gallerySection">
            <ContentWrapper>
                <div className="sectionHeading">Galeri</div>
                {!loading ? (
                    <div className="galleryWrapper">
                        <CarouselArrow 
                            direction="left" 
                            onClick={() => navigation("left")} 
                            className="galleryArrow"
                        />
                        <CarouselArrow 
                            direction="right" 
                            onClick={() => navigation("right")} 
                            className="galleryArrow"
                        />
                        <div className="gallery" ref={carouselContainer}>
                            {images?.map((image, index) => (
                                <div 
                                    key={index} 
                                    className="imageItem"
                                    onClick={() => handleImageClick(index)}
                                >
                                    <Img src={image} />
                                    <div className="imageOverlay">
                                        <span>{index + 1}/{images.length}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="loadingSkeleton">
                        {[...Array(5)].map((_, index) => (
                            <div key={index} className="skeletonItem">
                                <div className="skeleton"></div>
                            </div>
                        ))}
                    </div>
                )}
            </ContentWrapper>

            {showModal && (
                <div 
                    className="modalOverlay" 
                    onClick={handleClose}
                    onKeyDown={handleKeyDown}
                    tabIndex={0}
                >
                    <div className="modalContent" onClick={(e) => e.stopPropagation()}>
                        <button className="closeButton" onClick={handleClose}>
                            <IoClose />
                        </button>
                        <div className="modalSlider">
                            <div className="modalImage" ref={modalImageRef}>
                                <Img src={images[currentImageIndex]} />
                            </div>
                            <div className="thumbnailsContainer">
                                {images.map((image, index) => (
                                    <div 
                                        key={index}
                                        className={`thumbnail ${index === currentImageIndex ? 'active' : ''}`}
                                        onClick={() => setCurrentImageIndex(index)}
                                    >
                                        <Img src={image} />
                                    </div>
                                ))}
                            </div>
                        </div>
                        <CarouselArrow 
                            direction="left"
                            onClick={handlePrev}
                            className="modalArrow"
                            style={{
                                position: "absolute",
                                top: "50%",
                                left: "30px",
                                transform: "translateY(-50%)",
                                width: "60px", 
                                height: "60px",
                                background: "rgba(255, 255, 255, 0.2)",
                                border: "3px solid rgba(255, 255, 255, 0.56)",
                                backdropFilter: "blur(20px)"
                            }}
                        />
                        <CarouselArrow
                            direction="right"
                            onClick={handleNext}
                            className="modalArrow"
                            style={{
                                position: "absolute", 
                                top: "50%",
                                right: "30px",
                                transform: "translateY(-50%)",
                                width: "60px",
                                height: "60px", 
                                background: "rgba(255, 255, 255, 0.2)",
                                border: "3px solid rgba(255, 255, 255, 0.56)",
                                backdropFilter: "blur(20px)"
                            }}
                        />
                        <div className="imageCounter">
                            {currentImageIndex + 1} / {images.length}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ImageGallery; 