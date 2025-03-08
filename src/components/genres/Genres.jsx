import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import "./style.scss";

const Genres = ({ data, mediaType }) => {
    const { genres } = useSelector((state) => state.home);
    const navigate = useNavigate();

    const handleGenreClick = (genreId, genreName) => {
        navigate(`/discover?genre=${genreId}&type=${mediaType || 'movie'}`);
    };

    return (
        <div className="genres">
            {data?.map((genre) => {
                if (!genre?.id) return null;
                return (
                    <div 
                        key={genre.id} 
                        className="genre"
                        onClick={() => handleGenreClick(genre.id, genre.name)}
                    >
                        <span>{genre.name}</span>
                    </div>
                );
            })}
        </div>
    );
};

export default Genres;
