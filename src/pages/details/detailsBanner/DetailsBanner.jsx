// src/pages/detailsBanner/DetailsBanner.jsx
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import dayjs from "dayjs";

import "./style.scss";

import ContentWrapper from "../../../components/contentWrapper/ContentWrapper";
import useFetch from "../../../hooks/useFetch";
import Genres from "../../../components/genres/Genres";
import CircleRating from "../../../components/circleRating/CircleRating";
import Img from "../../../components/lazyLoadImage/Img.jsx";
import PosterFallback from "../../../assets/no-poster.png";
import VideoPopup from "../../../components/videoPopup/VideoPopup";
import EmbedPopup from "../../../components/embedPopup/EmbedPopup";

const DetailsBanner = ({ video, crew }) => {
    const [showVideoPopup, setShowVideoPopup] = useState(false);
    const [videoId, setVideoId] = useState(null);

    const [showEmbedPopup, setShowEmbedPopup] = useState(false);
    const [embedUrl, setEmbedUrl] = useState(null);

    const { mediaType, id } = useParams();
    const { data, loading, error } = useFetch(`/${mediaType}/${id}`);

    const { url } = useSelector((state) => state.home);

    const _genres = data?.genres?.map((g) => g.name);

    const director = crew?.filter((f) => f.job === "Director");
    const writer = crew?.filter(
        (f) => f.job === "Screenplay" || f.job === "Story" || f.job === "Writer"
    );

    const toHoursAndMinutes = (totalMinutes) => {
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        return `${hours}h${minutes > 0 ? ` ${minutes}m` : ""}`;
    };

    const handleWatch = () => {
        let embedUrlConstruct = "";
        if (mediaType === 'movie') {
            if (data.imdb_id) {
                embedUrlConstruct = `https://vidsrc.xyz/embed/movie?imdb=${data.imdb_id}`;
            } else if (data.id) {
                embedUrlConstruct = `https://vidsrc.xyz/embed/movie?tmdb=${data.id}`;
            }
            if (data.sub_url) {
                embedUrlConstruct += `&sub_url=${encodeURIComponent(data.sub_url)}`;
            }
            if (data.ds_lang) {
                embedUrlConstruct += `&ds_lang=${data.ds_lang}`;
            }
        } else if (mediaType === 'tv') {
            if (data.imdb_id) {
                embedUrlConstruct = `https://vidsrc.xyz/embed/tv?imdb=${data.imdb_id}`;
            } else if (data.id) {
                embedUrlConstruct = `https://vidsrc.xyz/embed/tv?tmdb=${data.id}`;
            }
            if (data.sub_url) {
                embedUrlConstruct += `&sub_url=${encodeURIComponent(data.sub_url)}`;
            }
            if (data.ds_lang) {
                embedUrlConstruct += `&ds_lang=${data.ds_lang}`;
            }
        } else if (mediaType === 'episode') {
            if (data.imdb_id && data.season_number && data.episode_number) {
                embedUrlConstruct = `https://vidsrc.xyz/embed/tv?imdb=${data.imdb_id}&season=${data.season_number}&episode=${data.episode_number}`;
            } else if (data.id && data.season_number && data.episode_number) {
                embedUrlConstruct = `https://vidsrc.xyz/embed/tv?tmdb=${data.id}&season=${data.season_number}&episode=${data.episode_number}`;
            }
            if (data.sub_url) {
                embedUrlConstruct += `&sub_url=${encodeURIComponent(data.sub_url)}`;
            }
            if (data.ds_lang) {
                embedUrlConstruct += `&ds_lang=${data.ds_lang}`;
            }
        }
        setEmbedUrl(embedUrlConstruct);
        setShowEmbedPopup(true);
    };

    const getPlatforms = () => {
        // Platform bilgilerini almak için API'den veya başka bir kaynaktan veri çekin
        // Örneğin, data.platforms alanını kullanabilirsiniz
        return data?.platforms || [];
    };

    const getImages = () => {
        // Ek resimleri almak için API'den veya başka bir kaynaktan veri çekin
        return data?.images?.backdrops || [];
    };

    return (
        <div className="detailsBanner">
            {!loading ? (
                <>
                    {!!data && (
                        <React.Fragment>
                            <div className="backdrop-img">
                                <Img src={url.backdrop + data.backdrop_path} alt="Backdrop" />
                            </div>
                            <div className="opacity-layer"></div>
                            <ContentWrapper>
                                <div className="content">
                                    <div className="left">
                                        {data.poster_path ? (
                                            <Img
                                                className="posterImg"
                                                src={url.backdrop + data.poster_path}
                                                alt={data.title || data.name}
                                            />
                                        ) : (
                                            <Img
                                                className="posterImg"
                                                src={PosterFallback}
                                                alt="No Poster"
                                            />
                                        )}
                                    </div>
                                    <div className="right">
                                        <div className="title">
                                            {`${data.name || data.title} (${dayjs(data?.release_date).format("YYYY")})`}
                                        </div>
                                        <div className="subtitle">
                                            {data.tagline}
                                        </div>

                                        <Genres data={_genres} />

                                        <div className="row">
                                            <CircleRating
                                                rating={data.vote_average.toFixed(1)}
                                            />
                                            {/* Fragman Butonu */}
                                            <div
                                                className="button playbtn"
                                                onClick={() => {
                                                    setShowVideoPopup(true);
                                                    setVideoId(video.key);
                                                }}
                                                aria-label="Fragman izle"
                                            >
                                                <span className="text">
                                                    Fragman
                                                </span>
                                            </div>
                                            {/* İzle Butonu */}
                                            <div
                                                className="button izlebtn"
                                                onClick={handleWatch}
                                                aria-label="İzle"
                                            >
                                                <span className="text">
                                                    İzle
                                                </span>
                                            </div>
                                        </div>

                                        <div className="overview">
                                            <div className="heading">
                                                Açıklama
                                            </div>
                                            
                                            <div className="description">
                                                {data.overview} Sinerüya iyi seyirler diler.
                                            </div>
                                        </div>

                                        <div className="info">
                                            {data.status && (
                                                <div className="infoItem">
                                                    <span className="text bold">
                                                        Durum:{" "}
                                                    </span>
                                                    <span className="text">
                                                        {data.status}
                                                    </span>
                                                </div>
                                            )}
                                            {data.release_date && (
                                                <div className="infoItem">
                                                    <span className="text bold">
                                                        Çıkış Tarihi:{" "}
                                                    </span>
                                                    <span className="text">
                                                        {dayjs(data.release_date).format("MMM D, YYYY")}
                                                    </span>
                                                </div>
                                            )}
                                            {data.runtime && (
                                                <div className="infoItem">
                                                    <span className="text bold">
                                                        Süre:{" "}
                                                    </span>
                                                    <span className="text">
                                                        {toHoursAndMinutes(data.runtime)}
                                                    </span>
                                                </div>
                                            )}
                                            {/* Platform Bilgisi */}
                                            {getPlatforms().length > 0 && (
                                                <div className="infoItem">
                                                    <span className="text bold">
                                                        Platformlar:{" "}
                                                    </span>
                                                    <span className="text">
                                                        {getPlatforms().map((platform, i) => (
                                                            <span key={i}>
                                                                {platform.name}
                                                                {getPlatforms().length - 1 !== i && ", "}
                                                            </span>
                                                        ))}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Yönetmen Bilgisi */}
                                        {director?.length > 0 && (
                                            <div className="info">
                                                <span className="text bold">
                                                    Yönetmen:{" "}
                                                </span>
                                                <span className="text">
                                                    {director.map((d, i) => (
                                                        <span key={i}>
                                                            {d.name}
                                                            {director.length - 1 !== i && ", "}
                                                        </span>
                                                    ))}
                                                </span>
                                            </div>
                                        )}

                                        {/* Yazar Bilgisi */}
                                        {writer?.length > 0 && (
                                            <div className="info">
                                                <span className="text bold">
                                                    Yazar:{" "}
                                                </span>
                                                <span className="text">
                                                    {writer.map((w, i) => (
                                                        <span key={i}>
                                                            {w.name}
                                                            {writer.length - 1 !== i && ", "}
                                                        </span>
                                                    ))}
                                                </span>
                                            </div>
                                        )}

                                        {/* Kurucu Bilgisi */}
                                        {data?.created_by?.length > 0 && (
                                            <div className="info">
                                                <span className="text bold">
                                                    Kurucu:{" "}
                                                </span>
                                                <span className="text">
                                                    {data.created_by.map((c, i) => (
                                                        <span key={i}>
                                                            {c.name}
                                                            {data.created_by.length - 1 !== i && ", "}
                                                        </span>
                                                    ))}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                {/* Görsel Galeri */}
                                {getImages().length > 0 && (
                                    <div className="imagesGallery">
                                        {getImages().slice(0, 5).map((image, index) => (
                                            <Img
                                                key={index}
                                                src={url.backdrop + image.file_path}
                                                alt={`Backdrop ${index + 1}`}
                                                className="galleryImage"
                                            />
                                        ))}
                                    </div>
                                )}
                            </ContentWrapper>
                            {/* Video Popup */}
                            <VideoPopup
                                show={showVideoPopup}
                                setShow={setShowVideoPopup}
                                videoId={videoId}
                            />
                            {/* Embed Popup */}
                            <EmbedPopup
                                show={showEmbedPopup}
                                setShow={setShowEmbedPopup}
                                embedUrl={embedUrl}
                            />
                        </React.Fragment>
                    )}
                </>
            ) : (
                <div className="detailsBannerSkeleton">
                    <ContentWrapper>
                        <div className="left skeleton"></div>
                        <div className="right">
                            <div className="row skeleton"></div>
                            <div className="row skeleton"></div>
                            <div className="row skeleton"></div>
                            <div className="row skeleton"></div>
                            <div className="row skeleton"></div>
                            <div className="row skeleton"></div>
                            <div className="row skeleton"></div>
                        </div>
                    </ContentWrapper>
                </div>
            )}
        </div>
    );

};

export default DetailsBanner;
