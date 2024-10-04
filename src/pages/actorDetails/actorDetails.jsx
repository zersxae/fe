import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import ReactPaginate from "react-paginate";
import Modal from "react-modal";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaGlobe } from "react-icons/fa";
import "./style.scss";

// Modal için kök elementini belirtin
Modal.setAppElement("#root");

const PlayerDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [playerData, setPlayerData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPageMovies, setCurrentPageMovies] = useState(0);
    const [currentPageTV, setCurrentPageTV] = useState(0);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const apikey = "095262b2872d2235d6da623056c10cd9";

    const itemsPerPage = 12;

    useEffect(() => {
        const fetchPlayerData = async () => {
            try {
                const response = await axios.get(
                    `https://api.themoviedb.org/3/person/${id}`,
                    {
                        params: {
                            api_key: apikey,
                            language: "tr",
                            append_to_response: "movie_credits,tv_credits,external_ids,images",
                        },
                    }
                );
                setPlayerData(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Oyuncu verileri alınırken hata oluştu:", error);
                setError("Oyuncu verileri alınırken bir hata oluştu. Lütfen daha sonra tekrar deneyin.");
                setLoading(false);
            }
        };

        fetchPlayerData();
    }, [id]);

    const handlePageClickMovies = (data) => {
        setCurrentPageMovies(data.selected);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handlePageClickTV = (data) => {
        setCurrentPageTV(data.selected);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const openModal = (image) => {
        setSelectedImage(image);
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
        setSelectedImage(null);
    };

    if (loading) return <div className="loading">Yükleniyor...</div>;
    if (error) return <div className="error">{error}</div>;

    const offsetMovies = currentPageMovies * itemsPerPage;
    const currentMovies = playerData.movie_credits.cast.slice(offsetMovies, offsetMovies + itemsPerPage);
    const pageCountMovies = Math.ceil(playerData.movie_credits.cast.length / itemsPerPage);

    const offsetTV = currentPageTV * itemsPerPage;
    const currentTV = playerData.tv_credits.cast.slice(offsetTV, offsetTV + itemsPerPage);
    const pageCountTV = Math.ceil(playerData.tv_credits.cast.length / itemsPerPage);

    return (
        <div className="playerDetails">
            <h1 className="player-name">{playerData.name}</h1>
            <div className="profile-container">
                <div className="profile-image-wrapper">
                    <img
                        src={
                            playerData.profile_path
                                ? `https://image.tmdb.org/t/p/w500${playerData.profile_path}`
                                : "https://via.placeholder.com/500"
                        }
                        alt={playerData.name}
                        className="profile-img"
                    />
                </div>
                <div className="profile-info">
                    <p className="biography">{playerData.biography || "Biyografi bulunamadı."}</p>
                    <p><strong>Doğum Tarihi:</strong> {playerData.birthday || "Bilinmiyor"}</p>
                    <p><strong>Doğum Yeri:</strong> {playerData.place_of_birth || "Bilinmiyor"}</p>
                    <p><strong>Popülerlik:</strong> {playerData.popularity}</p>
                    <p><strong>Cinsiyet:</strong> {playerData.gender === 1 ? "Kadın" : playerData.gender === 2 ? "Erkek" : "Bilinmiyor"}</p>

                    {/* Sosyal Medya Hesapları */}
                    <div className="social-media">
                        {playerData.external_ids.facebook_id && (
                            <a href={`https://www.facebook.com/${playerData.external_ids.facebook_id}`} target="_blank" rel="noopener noreferrer">
                                <FaFacebook />
                            </a>
                        )}
                        {playerData.external_ids.twitter_id && (
                            <a href={`https://www.twitter.com/${playerData.external_ids.twitter_id}`} target="_blank" rel="noopener noreferrer">
                                <FaTwitter />
                            </a>
                        )}
                        {playerData.external_ids.instagram_id && (
                            <a href={`https://www.instagram.com/${playerData.external_ids.instagram_id}`} target="_blank" rel="noopener noreferrer">
                                <FaInstagram />
                            </a>
                        )}
                        {playerData.external_ids.linkedin_id && (
                            <a href={`https://www.linkedin.com/in/${playerData.external_ids.linkedin_id}`} target="_blank" rel="noopener noreferrer">
                                <FaLinkedin />
                            </a>
                        )}
                        {playerData.homepage && (
                            <a href={playerData.homepage} target="_blank" rel="noopener noreferrer">
                                <FaGlobe />
                            </a>
                        )}
                    </div>

                    {/* Web sitesi linkini göstermek için */}
                    {playerData.homepage && (
                        <p><strong>Web Sitesi:</strong> <a href={playerData.homepage} target="_blank" rel="noopener noreferrer">{playerData.homepage}</a></p>
                    )}

                    {/* Bilinen diğer isimleri göstermek için */}
                    {playerData.also_known_as && playerData.also_known_as.length > 0 && (
                        <p>
                            <strong>Bilinen Diğer İsimler:</strong>{" "}
                            {playerData.also_known_as.map((name, index) => (
                                <span key={index}>{name}{index !== playerData.also_known_as.length - 1 && ", "}</span>
                            ))}
                        </p>
                    )}

                    {/* IMDb linkini göstermek için */}
                    {playerData.external_ids && playerData.external_ids.imdb_id && (
                        <p>
                            <strong>IMDb:</strong>{" "}
                            <a href={`https://www.imdb.com/name/${playerData.external_ids.imdb_id}`} target="_blank" rel="noopener noreferrer">
                                {playerData.external_ids.imdb_id}
                            </a>
                        </p>
                    )}
                </div>
            </div>

            {/* Oynadığı filmleri göstermek için */}
            {playerData.movie_credits && playerData.movie_credits.cast.length > 0 && (
                <div className="creditsSection">
                    <h2 className="section-title">Oynadığı Filmler</h2>
                    <div className="movieList">
                        {currentMovies.map((credit) => (
                            <div key={credit.id} className="movieItem">
                                <img
                                    src={credit.poster_path ? `https://image.tmdb.org/t/p/w200${credit.poster_path}` : "https://via.placeholder.com/200x300"}
                                    alt={`${credit.title} poster`}
                                    loading="lazy"
                                />
                                <p className="movie-title">{credit.title}</p>
                            </div>
                        ))}
                    </div>
                    {pageCountMovies > 1 && (
                        <ReactPaginate
                            previousLabel={"← Önceki"}
                            nextLabel={"Sonraki →"}
                            breakLabel={"..."}
                            breakClassName={"break-me"}
                            pageCount={pageCountMovies}
                            marginPagesDisplayed={2}
                            pageRangeDisplayed={3}
                            onPageChange={handlePageClickMovies}
                            containerClassName={"pagination"}
                            activeClassName={"active"}
                        />
                    )}
                </div>
            )}

            {/* Oynadığı TV dizilerini göstermek için */}
            {playerData.tv_credits && playerData.tv_credits.cast.length > 0 && (
                <div className="creditsSection">
                    <h2 className="section-title">Oynadığı TV Dizileri</h2>
                    <div className="movieList">
                        {currentTV.map((credit) => (
                            <div key={credit.id} className="movieItem">
                                <img
                                    src={credit.poster_path ? `https://image.tmdb.org/t/p/w200${credit.poster_path}` : "https://via.placeholder.com/200x300"}
                                    alt={`${credit.name} poster`}
                                    loading="lazy"
                                />
                                <p className="movie-title">{credit.name}</p>
                            </div>
                        ))}
                    </div>
                    {pageCountTV > 1 && (
                        <ReactPaginate
                            previousLabel={"← Önceki"}
                            nextLabel={"Sonraki →"}
                            breakLabel={"..."}
                            breakClassName={"break-me"}
                            pageCount={pageCountTV}
                            marginPagesDisplayed={2}
                            pageRangeDisplayed={3}
                            onPageChange={handlePageClickTV}
                            containerClassName={"pagination"}
                            activeClassName={"active"}
                        />
                    )}
                </div>
            )}

            {/* Oyuncunun fotoğraflarını göstermek için */}
            {playerData.images && playerData.images.profiles && playerData.images.profiles.length > 0 && (
                <div className="imagesSection">
                    <h2 className="section-title">Fotoğraflar</h2>
                    <div className="imagesList">
                        {playerData.images.profiles.map((image) => (
                            <img
                                key={image.file_path}
                                src={`https://image.tmdb.org/t/p/w300${image.file_path}`}
                                alt={`${playerData.name} fotoğrafı`}
                                className="profile-photo"
                                onClick={() => openModal(`https://image.tmdb.org/t/p/original${image.file_path}`)}
                                loading="lazy"
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );

};

export default PlayerDetails;
