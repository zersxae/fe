import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./style.scss";
import ContentWrapper from "../../components/contentWrapper/ContentWrapper";
import { fetchDataFromApi } from "../../utils/api";
import Carousel from "../../components/carousel/Carousel";
import useFetch from "../../hooks/useFetch";
import Spinner from "../../components/spinner/Spinner";

const ChannelDetail = () => {
    const { id } = useParams();
    const [channel, setChannel] = useState(null);
    const [loading, setLoading] = useState(true);

    // Dizileri çek
    const { data: tvShows, loading: tvLoading } = useFetch(
        `/discover/tv?with_networks=${id}&sort_by=popularity.desc&page=1`
    );

    // Filmleri çek
    const { data: movies, loading: movieLoading } = useFetch(
        `/discover/movie?with_companies=${id}&sort_by=popularity.desc&page=1`
    );

    useEffect(() => {
        fetchChannelDetails();
    }, [id]);

    const fetchChannelDetails = async () => {
        try {
            const data = await fetchDataFromApi(`/network/${id}`);
            setChannel(data);
            setLoading(false);
        } catch (error) {
            console.error("Kanal detayları çekilemedi:", error);
            setLoading(false);
        }
    };

    if (loading || tvLoading || movieLoading) {
        return (
            <div className="channelDetailPage">
                <ContentWrapper>
                    <div className="loadingSpinner">
                        <Spinner />
                    </div>
                </ContentWrapper>
            </div>
        );
    }

    return (
        <div className="channelDetailPage">
            <ContentWrapper>
                {/* Kanal Başlığı */}
                <div className="channelHeader">
                    <div className="channelLogo">
                        {channel?.logo_path ? (
                            <img
                                src={`https://image.tmdb.org/t/p/original${channel.logo_path}`}
                                alt={channel.name}
                            />
                        ) : (
                            <div className="fallbackLogo">
                                {channel?.name?.charAt(0)}
                            </div>
                        )}
                    </div>
                    <div className="channelInfo">
                        <h1>{channel?.name}</h1>
                        {channel?.headquarters && (
                            <p className="headquarters">
                                Merkez: {channel.headquarters}
                            </p>
                        )}
                        {channel?.origin_country && (
                            <p className="country">
                                Ülke: {channel.origin_country}
                            </p>
                        )}
                    </div>
                </div>

                {/* Popüler Diziler */}
                {tvShows?.results?.length > 0 && (
                    <div className="carouselSection">
                        <div className="sectionHeading">
                            <h2>Popüler Diziler</h2>
                        </div>
                        <Carousel 
                            data={tvShows.results} 
                            loading={tvLoading}
                            endpoint="tv"
                        />
                    </div>
                )}

                {/* Popüler Filmler */}
                {movies?.results?.length > 0 && (
                    <div className="carouselSection">
                        <div className="sectionHeading">
                            <h2>Popüler Filmler</h2>
                        </div>
                        <Carousel 
                            data={movies.results} 
                            loading={movieLoading}
                            endpoint="movie"
                        />
                    </div>
                )}

                {/* İçerik Bulunamadı */}
                {!tvShows?.results?.length && !movies?.results?.length && (
                    <div className="noContent">
                        Bu kanal için gösterilecek içerik bulunamadı.
                    </div>
                )}
            </ContentWrapper>
        </div>
    );
};

export default ChannelDetail; 