import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./style.scss";

const PlayerDetails = () => {
    const { id } = useParams();
    const [playerData, setPlayerData] = useState(null);
    const [loading, setLoading] = useState(true);
    const apikey = "095262b2872d2235d6da623056c10cd9";

    useEffect(() => {
        const fetchPlayerData = async () => {
            try {
                // Oyuncu detaylarını getiren API isteği
                const response = await axios.get(
                    `https://api.themoviedb.org/3/person/${id}?api_key=${apikey}&language=tr`
                );
                setPlayerData(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching player data:", error);
                setLoading(false); // Hata durumunda da loading durumunu false yaparak yükleme durumunu kontrol edin
            }
        };

        fetchPlayerData();
    }, [id]);

    if (loading) return <div>Yükleniyor...</div>;

    return (
        <div className="playerDetails">
            <h1>{playerData.name}</h1>
            <div className="profile-container">
                <img
                    src={playerData.profile_path ? `https://image.tmdb.org/t/p/w500${playerData.profile_path}` : "https://via.placeholder.com/500"}
                    alt={playerData.name}
                    className="profile-img"
                />
                <div className="profile-info">
                    <p>{playerData.biography || "Biyografi bulunamadı."}</p>
                    <p><strong>Doğum Tarihi:</strong> {playerData.birthday || "Bilinmiyor"}</p>
                    <p><strong>Doğum Yeri:</strong> {playerData.place_of_birth || "Bilinmiyor"}</p>
                    <p><strong>Popülerlik:</strong> {playerData.popularity}</p>

                    {/* Web sitesi linkini göstermek için */}
                    {playerData.homepage && (
                        <p><strong>Web Sitesi:</strong> <a href={playerData.homepage} target="_blank" rel="noopener noreferrer">{playerData.homepage}</a></p>
                    )}

                    {/* Bilinen diğer isimleri göstermek için */}
                    {playerData.also_known_as && (
                        <p>
                            <strong>Bilinen Diğer İsimler:</strong>{" "}
                            {playerData.also_known_as.map((name, index) => (
                                <span key={index}>{name}{index !== playerData.also_known_as.length - 1 && ", "}</span>
                            ))}
                        </p>
                    )}

                    {/* IMDb linkini göstermek için */}
                    {playerData.external_ids && (
                        <p>
                            <strong>IMDb:</strong>{" "}
                            <a href={`https://www.imdb.com/name/${playerData.external_ids.imdb_id}`} target="_blank" rel="noopener noreferrer">
                                {playerData.external_ids.imdb_id}
                            </a>
                        </p>
                    )}
                </div>
            </div>

            {/* Oynadığı filmleri ve dizileri göstermek için */}
            {playerData.movie_credits && playerData.movie_credits.cast.length > 0 && (
                <div className="movieList">
                    <h2>Oynadığı Filmler ve Diziler</h2>
                    {playerData.movie_credits.cast.map((credit, index) => (
                        <div key={index} className="movieItem">
                            <img
                                src={`https://image.tmdb.org/t/p/w200${credit.poster_path}`}
                                alt={`${credit.title} film veya dizi görüntüsü`}
                            />
                            <p>{credit.title}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PlayerDetails;
