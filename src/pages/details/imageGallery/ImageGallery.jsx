import React, { useState, useRef } from "react";
import { useSelector } from "react-redux";
import ContentWrapper from "../../../components/contentWrapper/ContentWrapper";
import Img from "../../../components/lazyLoadImage/Img";
import "./style.scss";
import { IoCloseCircleOutline } from "react-icons/io5";
import { MdOutlineNavigateNext, MdOutlineNavigateBefore } from "react-icons/md";

const ImageGallery = ({ images, loading }) => {
    const [showModal, setShowModal] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const carouselContainer = useRef();

    if (!loading && (!images || images.length === 0)) {
        return null;
    }

    const handleImageClick = (index) => {
        setCurrentImageIndex(index);
        setShowModal(true);
    };

    const handleClose = () => {
        setShowModal(false);
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
                <div className="sectionHeading">Resim Galerisi</div>
                {!loading ? (
                    <div className="galleryWrapper">
                        <MdOutlineNavigateBefore
                            className="carouselLeftNav arrow"
                            onClick={() => navigation("left")}
                        />
                        <MdOutlineNavigateNext
                            className="carouselRightNav arrow"
                            onClick={() => navigation("right")}
                        />
                        <div className="gallery" ref={carouselContainer}>
                            {images?.map((image, index) => (
                                <div 
                                    key={index} 
                                    className="imageItem"
                                    onClick={() => handleImageClick(index)}
                                >
                                    <Img src={image} />
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
                            <IoCloseCircleOutline />
                        </button>
                        <button className="navButton prev" onClick={handlePrev}>
                            <MdOutlineNavigateBefore />
                        </button>
                        <div className="modalImage">
                            <Img src={images[currentImageIndex]} />
                        </div>
                        <button className="navButton next" onClick={handleNext}>
                            <MdOutlineNavigateNext />
                        </button>
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