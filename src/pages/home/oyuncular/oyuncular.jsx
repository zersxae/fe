import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import "./style.scss";
import ContentWrapper from "../../../components/contentWrapper/ContentWrapper";
import axios from "axios";

const Cast = () => {
    const { url } = useSelector((state) => state.home);
    const [actors, setActors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedActor, setSelectedActor] = useState(null);
    const carouselContainer = useRef(null);
    const apikey = "095262b2872d2235d6da623056c10cd9";
    const navigate = useNavigate();

    const navigation = (dir) => {
        const container = carouselContainer.current;

        const scrollAmount =
            dir === "left"
                ? container.scrollLeft - (container.offsetWidth + 20)
                : container.scrollLeft + (container.offsetWidth + 20);

        container.scrollTo({
            left: scrollAmount,
            behavior: "smooth",
        });
    };

    useEffect(() => {
        const fetchPopularActors = async () => {
            try {
                const response = await axios.get(
                    `https://api.themoviedb.org/3/person/popular?api_key=${apikey}&language=tr`
                );
                setActors(response.data.results);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching popular actors:", error);
            }
        };

        fetchPopularActors();
    }, []);

    const handleActorHover = (actor) => {
        setSelectedActor(actor);
    };

    const handleMouseLeave = () => {
        setSelectedActor(null);
    };

    return (
        <div className="castSection">
            <ContentWrapper>
                <FiChevronLeft
                    className="carouselLeftNav arrow"
                    onClick={() => navigation("left")}
                />
                <FiChevronRight
                    className="carouselRightNav arrow"
                    onClick={() => navigation("right")}
                />
                <div className="sectionHeading">Popüler Aktörler</div>
                <div className="listItems" ref={carouselContainer}>
                    {!loading &&
                        actors.map((actor) => (
                            <div
                                key={actor.id}
                                className="listItem"
                                onMouseEnter={() => handleActorHover(actor)}
                                onMouseLeave={handleMouseLeave}
                                onClick={() => navigate(`/actor/${actor.id}`)}
                            >
                                <div className="profileImg">
                                    <img
                                        src={actor.profile_path ? `${url.profile}${actor.profile_path}` : "https://via.placeholder.com/150"}
                                        alt={actor.name}
                                    />
                                </div>
                                <div className="name">{actor.name}</div>
                            </div>
                        ))}
                </div>
            </ContentWrapper>
        </div>
    );
};

export default Cast;
