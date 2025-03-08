import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import "./style.scss";
import logo from "../../../assets/analogo.png";

import useFetch from "../../../hooks/useFetch";

import Img from "../../../components/lazyLoadImage/Img";
import ContentWrapper from "../../../components/contentWrapper/ContentWrapper";

const HeroBanner = () => {
    const [background, setBackground] = useState("");
    const [query, setQuery] = useState("");
    const navigate = useNavigate();
    const { url } = useSelector((state) => state.home);
    const { data } = useFetch("/movie/upcoming");
    const [imageContent, setImageContent] = useState("");

    useEffect(() => {
        if (data) {
            // Günün indeksini hesapla
            const today = new Date();
            const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
            const index = dayOfYear % (data.results?.length || 1); // Gün sayısına göre döngüsel indeks
            
            const selectedMovie = data?.results?.[index];       
            const bg = url.backdrop + selectedMovie?.backdrop_path;
            setBackground(bg);
            setImageContent(selectedMovie);
        }
    }, [data, url]);

    const handleImageClick = () => {
        if (imageContent) {
            navigate(`/movie/${imageContent.id}`);
        }
    };

    const searchQueryHandler = (event) => {
        if (event.key === "Enter" && query.length > 0) {
            navigate(`/search/${query}`);
        }
    };

    return (
        <div className="heroBanner">
            {data && (
                <div className="backdrop-img">   
                        <Img src={background}/>
                </div>
            )}

            <div className="opacity-layer"></div>
            <ContentWrapper>
                <div className="heroBannerContent">
                    <span className="subTitle">
                        Milyonlarca film, dizi ve kişi.
                    </span>
                    <div className="searchInput">
                        <input
                            type="text"
                            placeholder="Ara..."
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyUp={searchQueryHandler}
                        />
                    </div>
                    <div>   
                        <span className="imageContent" onClick={handleImageClick}>
                            Günün İçeriği: {imageContent?.title}
                        </span>
                    </div>
                </div>

              
            </ContentWrapper>
        </div>
    );
};
export default HeroBanner;