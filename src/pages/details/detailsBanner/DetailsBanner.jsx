// src/pages/detailsBanner/DetailsBanner.jsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import 'dayjs/locale/tr'; // Türkçe dil desteği

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
    const { data, loading } = useFetch(`/${mediaType}/${id}?append_to_response=videos,external_ids`);
    const { url } = useSelector((state) => state.home);

    const _genres = data?.genres?.map((g) => g.name);
    const trailer = data?.videos?.results?.find(
        (vid) => vid.type === "Trailer" && vid.site === "YouTube"
    );

    useEffect(() => {
        if (trailer?.key) {
            setVideoId(trailer.key);
        }
    }, [trailer]);

    const director = crew?.filter((f) => f.job === "Director");
    const writer = crew?.filter(
        (f) => f.job === "Screenplay" || f.job === "Story" || f.job === "Writer"
    );

    const toHoursAndMinutes = (totalMinutes) => {
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        return `${hours}s${minutes > 0 ? ` ${minutes}dk` : ""}`;
    };

    // Türkçe tarih formatı için
    dayjs.locale('tr');

    const translateCountry = (countryName) => {
        const countryTranslations = {
            "United States of America": "Amerika Birleşik Devletleri",
            "United Kingdom": "Birleşik Krallık",
            "France": "Fransa",
            "Germany": "Almanya",
            "Italy": "İtalya",
            "Spain": "İspanya",
            "Japan": "Japonya",
            "China": "Çin",
            "Russia": "Rusya",
            "Canada": "Kanada",
            "Australia": "Avustralya",
            "Brazil": "Brezilya",
            "Mexico": "Meksika",
            "South Korea": "Güney Kore",
            "India": "Hindistan"
        };
        return countryTranslations[countryName] || countryName;
    };

    const translateLanguage = (langName) => {
        const langTranslations = {
            "English": "İngilizce",
            "Italiano": "İtalyanca",
            "Latin": "Latince",
            "French": "Fransızca",
            "German": "Almanca",
            "Spanish": "İspanyolca",
            "Japanese": "Japonca",
            "Chinese": "Çince",
            "Russian": "Rusça",
            "Korean": "Korece",
            "Hindi": "Hintçe",
            "Arabic": "Arapça",
            "Portuguese": "Portekizce",
            "Turkish": "Türkçe"
        };
        return langTranslations[langName] || langName;
    };

    const getPlatforms = () => {
        return data?.platforms || [];
    };

    const getImages = () => {
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
                                                alt="Poster Yok"
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

                                        <div className="genres">
                                            <Genres data={_genres} />
                                        </div>

                                        {/* Film Açıklaması */}
                                        <div className="overview">
                                            <div className="heading">Özet</div>
                                            {data.overview && (
                                                <div className="description">
                                                    {data.overview}
                                                </div>
                                            )}
                                        </div>

                                        {/* Yaş Sınırı, Durum, Yayın Tarihi ve Süre Bilgileri */}
                                        <div className="contentRating">
                                            <span className={`rating ${data.adult ? 'adult' : data.vote_average >= 7 ? 'general' : 'teen'}`}>
                                                {data.adult ? '18+' : 
                                                 data.vote_average >= 7 ? 'Genel İzleyici' : 
                                                 '13+'}
                                            </span>
                                            <span className="imdb-rating">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                                    <path fill="#F5C518" d="M11.107 8.417h-1.17v7.165h1.17V8.417zm4.667 0h-1.213l-.922 3.937-.898-3.937h-1.236l1.278 4.78-.19.723c-.071.27-.223.401-.446.401a1.28 1.28 0 01-.49-.096v.912a2.19 2.19 0 00.648.113c.697 0 1.094-.412 1.19-1.237l1.279-5.596zm4.67 1.036V8.417h-3.686v7.165h3.686v-1.036h-2.515v-2.177h2.283v-1.025h-2.283V9.453h2.515zm-11.97 5.093V9.453h.855c.697 0 1.112.39 1.112 1.248v2.55c0 .847-.415 1.26-1.112 1.26l-.856-.001zm-.153-6.13h-2.01v7.166h1.859c1.713 0 2.485-.802 2.485-2.374v-2.374c0-1.605-.772-2.418-2.334-2.418z"/>
                                                    <path fill="#F5C518" d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 1.5c4.687 0 8.5 3.813 8.5 8.5 0 4.687-3.813 8.5-8.5 8.5-4.687 0-8.5-3.813-8.5-8.5 0-4.687 3.813-8.5 8.5-8.5z"/>
                                                </svg>
                                                <span>{data.vote_average.toFixed(1)}</span>
                                            </span>
                                            {data.status && (
                                                <span className="status">
                                                    {data.status === "Released" ? "Yayınlandı" : 
                                                     data.status === "Ended" ? "Bitti" :
                                                     data.status === "Returning Series" ? "Devam Ediyor" :
                                                     data.status === "Canceled" ? "İptal Edildi" :
                                                     data.status === "In Production" ? "Yapım Aşamasında" : 
                                                     data.status}
                                                </span>
                                            )}
                                            {data.release_date && (
                                                <span className="info-text">
                                                    {dayjs(data.release_date).format("D MMMM YYYY")}
                                                </span>
                                            )}
                                            {data.runtime && (
                                                <span className="info-text">
                                                    {toHoursAndMinutes(data.runtime)}
                                                </span>
                                            )}
                                            {data.production_countries?.length > 0 && (
                                                <span className="info-text location">
                                                    {data.production_countries.map((country, i) => (
                                                        translateCountry(country.name)
                                                    )).join(", ")}
                                                </span>
                                            )}
                                            {data.spoken_languages?.length > 0 && (
                                                <span className="info-text language">
                                                    {data.spoken_languages.map((lang, i) => (
                                                        translateLanguage(lang.name)
                                                    )).join(", ")}
                                                </span>
                                            )}
                                        </div>

                                        {/* Sosyal Medya Linkleri */}
                                        <div className="socialMedia">
                                            <div className="heading">Sosyal Medya</div>
                                            <div className="socialLinks">
                                                {data?.external_ids?.facebook_id && (
                                                    <a 
                                                        href={`https://facebook.com/${data.external_ids.facebook_id}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        <svg width="24" height="24" viewBox="0 0 24 24">
                                                            <path fill="currentColor" d="M12 2.04C6.5 2.04 2 6.53 2 12.06C2 17.06 5.66 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.85C10.44 7.34 11.93 5.96 14.22 5.96C15.31 5.96 16.45 6.15 16.45 6.15V8.62H15.19C13.95 8.62 13.56 9.39 13.56 10.18V12.06H16.34L15.89 14.96H13.56V21.96A10 10 0 0 0 22 12.06C22 6.53 17.5 2.04 12 2.04Z"/>
                                                        </svg>
                                                        <span>{data.external_ids.facebook_id}</span>
                                                    </a>
                                                )}
                                                {data?.external_ids?.instagram_id && (
                                                    <a 
                                                        href={`https://instagram.com/${data.external_ids.instagram_id}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        <svg width="24" height="24" viewBox="0 0 24 24">
                                                            <path fill="currentColor" d="M7.8,2H16.2C19.4,2 22,4.6 22,7.8V16.2A5.8,5.8 0 0,1 16.2,22H7.8C4.6,22 2,19.4 2,16.2V7.8A5.8,5.8 0 0,1 7.8,2M7.6,4A3.6,3.6 0 0,0 4,7.6V16.4C4,18.39 5.61,20 7.6,20H16.4A3.6,3.6 0 0,0 20,16.4V7.6C20,5.61 18.39,4 16.4,4H7.6M17.25,5.5A1.25,1.25 0 0,1 18.5,6.75A1.25,1.25 0 0,1 17.25,8A1.25,1.25 0 0,1 16,6.75A1.25,1.25 0 0,1 17.25,5.5M12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9Z"/>
                                                        </svg>
                                                        <span>{data.external_ids.instagram_id}</span>
                                                    </a>
                                                )}
                                                {data?.external_ids?.twitter_id && (
                                                    <a 
                                                        href={`https://twitter.com/${data.external_ids.twitter_id}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        <svg width="24" height="24" viewBox="0 0 24 24">
                                                            <path fill="currentColor" d="M22.46,6C21.69,6.35 20.86,6.58 20,6.69C20.88,6.16 21.56,5.32 21.88,4.31C21.05,4.81 20.13,5.16 19.16,5.36C18.37,4.5 17.26,4 16,4C13.65,4 11.73,5.92 11.73,8.29C11.73,8.63 11.77,8.96 11.84,9.27C8.28,9.09 5.11,7.38 3,4.79C2.63,5.42 2.42,6.16 2.42,6.94C2.42,8.43 3.17,9.75 4.33,10.5C3.62,10.5 2.96,10.3 2.38,10C2.38,10 2.38,10 2.38,10.03C2.38,12.11 3.86,13.85 5.82,14.24C5.46,14.34 5.08,14.39 4.69,14.39C4.42,14.39 4.15,14.36 3.89,14.31C4.43,16 6,17.26 7.89,17.29C6.43,18.45 4.58,19.13 2.56,19.13C2.22,19.13 1.88,19.11 1.54,19.07C3.44,20.29 5.7,21 8.12,21C16,21 20.33,14.46 20.33,8.79C20.33,8.6 20.33,8.42 20.32,8.23C21.16,7.63 21.88,6.87 22.46,6Z"/>
                                                        </svg>
                                                        <span>{data.external_ids.twitter_id}</span>
                                                    </a>
                                                )}
                                                {data?.imdb_id && (
                                                    <a 
                                                        href={`https://www.imdb.com/title/${data.imdb_id}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="imdb-link"
                                                    >
                                                        <svg width="24" height="24" viewBox="0 0 24 24">
                                                            <path fill="currentColor" d="M14.31 9.588v4.824h-.664V9.588h.664zm4.23 0v4.824h-.664V9.588h.664zm-2.668 0H17.2v4.824h-1.328v-3.35l-.532 3.35h-.928l-.556-3.32v3.32h-1.328V9.588h1.328l.676 3.894.676-3.894zm-7.831 0v4.824H6.713v-3.35l-.532 3.35h-.928l-.556-3.32v3.32H3.369V9.588h1.328l.676 3.894.676-3.894h1.328zM19.879 9.588v4.824h-1.784V9.588h1.784zM22 6H2v12h20V6z"/>
                                                        </svg>
                                                        <span>IMDb</span>
                                                    </a>
                                                )}
                                            </div>
                                        </div>

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

                                        {writer?.length > 0 && (
                                            <div className="info">
                                                <span className="text bold">
                                                    Senarist:{" "}
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

                                        {data?.created_by?.length > 0 && (
                                            <div className="info">
                                                <span className="text bold">
                                                    Yapımcı:{" "}
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

                                        {/* Sezon ve Bölüm Bilgisi (TV Dizileri için) */}
                                        {mediaType === "tv" && (
                                            <div className="seriesInfo info">
                                                {data.number_of_seasons && (
                                                    <div className="infoItem">
                                                        <span className="text bold">Sezon Sayısı: </span>
                                                        <span className="text">{data.number_of_seasons}</span>
                                                    </div>
                                                )}
                                                {data.number_of_episodes && (
                                                    <div className="infoItem">
                                                        <span className="text bold">Bölüm Sayısı: </span>
                                                        <span className="text">{data.number_of_episodes}</span>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                {getImages().length > 0 && (
                                    <div className="imagesGallery">
                                        {getImages().slice(0, 5).map((image, index) => (
                                            <Img
                                                key={index}
                                                src={url.backdrop + image.file_path}
                                                alt={`Arka Plan ${index + 1}`}
                                                className="galleryImage"
                                            />
                                        ))}
                                    </div>
                                )}
                            </ContentWrapper>
                            <VideoPopup
                                show={showVideoPopup}
                                setShow={setShowVideoPopup}
                                videoId={videoId}
                            />
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
