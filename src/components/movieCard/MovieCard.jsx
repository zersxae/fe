import React from "react";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import "./style.scss";
import Img from "../lazyLoadImage/Img";
import CircleRating from "../circleRating/CircleRating";
import Genres from "../genres/Genres";
import PosterFallback from "../../assets/no-poster.png";

const MovieCard = ({ data, fromSearch, mediaType }) => {
    const { url } = useSelector((state) => state.home);
    const navigate = useNavigate();

    const getPosterUrl = () => {
        if (!data?.poster_path) return PosterFallback;
        if (!url?.poster) {
            console.warn("Poster URL yapılandırması bulunamadı");
            return PosterFallback;
        }
        return url.poster + data.poster_path;
    };

    const posterUrl = getPosterUrl();

    return (
        <div
            className="movieCard"
            onClick={() =>
                navigate(`/${data.media_type || mediaType}/${data.id}`)
            }
        >
            <div className="posterBlock">
                <Img className="posterImg" src={posterUrl} alt={data.title || data.name} />
                {!fromSearch && (
                    <React.Fragment>
                        <CircleRating rating={data.vote_average?.toFixed(1) || "0"} />
                        <Genres data={data.genre_ids?.slice(0, 2) || []} />
                    </React.Fragment>
                )}
            </div>
            <div className="textBlock">
                <span className="title">{data.title || data.name}</span>
                <span className="date">
                    {dayjs(data.release_date || data.first_air_date).format(
                        "MMM D, YYYY"
                    )}
                </span>
            </div>
        </div>
    );
};

export default MovieCard;
