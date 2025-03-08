import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./style.scss";
import ContentWrapper from "../../../components/contentWrapper/ContentWrapper";

const IframeSection = ({ data }) => {
    const { mediaType, id } = useParams();
    const [currentSource, setCurrentSource] = useState(0);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(true);
    const [showAdBlocker, setShowAdBlocker] = useState(!localStorage.getItem('adBlockerShown'));
    const [showSubtitleInfo, setShowSubtitleInfo] = useState(true);

    const trailer = data?.videos?.results?.find(
        (vid) => vid.type === "Trailer" && vid.site === "YouTube"
    );

    const videoSources = [
        ...(trailer?.key ? [{
            name: "Fragman",
            getUrl: () => `https://www.youtube.com/embed/${trailer.key}?autoplay=1&mute=0&controls=1&origin=https://example.com&hl=tr&modestbranding=1`
        }] : []),
        {
            name: "VidSrc", 
            getUrl: () => {
                if (!data || (!data.imdb_id && !data.id)) return "";
                const subtitleParams = [
                    "sub_lang=tr",
                    "lang=tr", 
                    "country=TR",
                    "default_subtitle=tr"
                ].join("&");

                if (mediaType === 'movie') {
                    return data?.imdb_id 
                        ? `https://vidsrc.me/embed/movie?imdb=${data.imdb_id}&${subtitleParams}`
                        : `https://vidsrc.me/embed/movie?tmdb=${data.id}&${subtitleParams}`;
                } else if (mediaType === 'tv') {
                    const season = data.season_number || 1;
                    const episode = data.episode_number || 1;
                    return data?.imdb_id 
                        ? `https://vidsrc.me/embed/tv?imdb=${data.imdb_id}&season=${season}&episode=${episode}&${subtitleParams}`
                        : `https://vidsrc.me/embed/tv?tmdb=${data.id}&season=${season}&episode=${episode}&${subtitleParams}`;
                }
                return "";
            }
        },
        {
            name: "VidLink",
            getUrl: () => {
                if (!data || !data.id) return "";
                const baseUrl = "https://vidlink.pro";
                const customParams = [
                    "primaryColor=63b8bc",
                    "secondaryColor=a2a2a2",
                    "iconColor=eefdec",
                    "icons=default",
                    "player=default",
                    "title=true",
                    "poster=true",
                    "autoplay=false",
                    "nextbutton=true",
                    "sub_lang=tr",
                    "sub_label=Türkçe"
                ].join("&");

                if (mediaType === 'movie') {
                    return `${baseUrl}/movie/${data.id}?${customParams}`;
                } else if (mediaType === 'tv') {
                    const season = data.season_number || 1;
                    const episode = data.episode_number || 1;
                    return `${baseUrl}/tv/${data.id}/${season}/${episode}?${customParams}`;
                }
                return "";
            }
        },
        {
            name: "SuperEmbed",
            getUrl: () => {
                if (!data || (!data.imdb_id && !data.id)) return "";
                if (mediaType === 'movie') {
                    return data?.imdb_id 
                        ? `https://multiembed.mov/directstream.php?video_id=${data.imdb_id}&lang=tr`
                        : `https://multiembed.mov/directstream.php?video_id=${data.id}&tmdb=1&lang=tr`;
                } else if (mediaType === 'tv') {
                    const season = data.season_number || 1;
                    const episode = data.episode_number || 1;
                    return data?.imdb_id 
                        ? `https://multiembed.mov/directstream.php?video_id=${data.imdb_id}&tv=1&s=${season}&e=${episode}&lang=tr`
                        : `https://multiembed.mov/directstream.php?video_id=${data.id}&tmdb=1&tv=1&s=${season}&e=${episode}&lang=tr`;
                }
                return "";
            }
        },
        {
            name: "VidStream",
            getUrl: () => {
                if (!data || (!data.imdb_id && !data.id)) return "";
                const baseUrl = "https://vidsrc.xyz/embed";
                if (mediaType === 'movie') {
                    return data?.imdb_id 
                        ? `${baseUrl}/movie/${data.imdb_id}?lang=tr`
                        : `${baseUrl}/tmdb/movie/${data.id}?lang=tr`;
                } else if (mediaType === 'tv') {
                    const season = data.season_number || 1;
                    const episode = data.episode_number || 1;
                    return data?.imdb_id 
                        ? `${baseUrl}/tv/${data.imdb_id}/${season}/${episode}?lang=tr`
                        : `${baseUrl}/tmdb/tv/${data.id}/${season}/${episode}?lang=tr`;
                }
                return "";
            }
        }
    ];

    useEffect(() => {
        if (data) {
            setLoading(false);
        }

        // İzleme ilerlemesini takip etmek için event listener
        const handlePlayerEvents = (event) => {
            if (event.origin !== 'https://vidlink.pro') return;
            
            if (event.data?.type === 'MEDIA_DATA') {
                const mediaData = event.data.data;
                localStorage.setItem('vidLinkProgress', JSON.stringify(mediaData));
            }

            if (event.data?.type === 'PLAYER_EVENT') {
                const { event: eventType, currentTime, duration } = event.data.data;
                // İzleme durumunu güncelle
                if (eventType === 'timeupdate') {
                    localStorage.setItem('lastWatchTime', currentTime);
                }
            }
        };

        window.addEventListener('message', handlePlayerEvents);
        return () => window.removeEventListener('message', handlePlayerEvents);
    }, [data]);

    const handleSourceChange = (event) => {
        setCurrentSource(Number(event.target.value));
        setError(false);
    };

    const handleAdBlockerClose = () => {
        localStorage.setItem('adBlockerShown', 'true');
        setShowAdBlocker(false);
    };

    if (loading) {
        return (
            <div className="iframeSection">
                <ContentWrapper>
                    <div className="videoContainer">
                        <div className="loadingMessage">
                            Video kaynakları yükleniyor...
                        </div>
                    </div>
                </ContentWrapper>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="iframeSection">
                <ContentWrapper>
                    <div className="videoContainer">
                        <div className="errorMessage">
                            Video kaynağı bulunamadı.
                        </div>
                    </div>
                </ContentWrapper>
            </div>
        );
    }

    const currentUrl = videoSources[currentSource]?.getUrl();

    return (
        <div className="iframeSection">
            <ContentWrapper>
                <div className="videoContainer">
                    {showAdBlocker && (
                        <div className="modalOverlay" onClick={handleAdBlockerClose}>
                            <div className="adBlockerModal" onClick={(e) => e.stopPropagation()}>
                                <div className="modalContent">
                                    <svg className="shieldIcon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                        <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 4c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm0 14c-2.67 0-8-1.33-8-4v-2c0-1.1.9-2 2-2h12c1.1 0 2 .9 2 2v2c0 2.67-5.33 4-8 4z"/>
                                    </svg>
                                    <h4>Daha İyi Bir İzleme Deneyimi İçin</h4>
                                    <p>Reklam engelleyici kullanmanızı öneririz:</p>
                                    <div className="adBlockerLinks">
                                        <a href="https://chrome.google.com/webstore/detail/ublock-origin/cjpalhdlnbpafiamejdnhcphjbkeiagm" target="_blank" rel="noopener noreferrer" className="adBlockButton">
                                            <span>uBlock Origin</span>
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7zm-2 16H5V12h2v5h5v2z"/>
                                            </svg>
                                        </a>
                                        <a href="https://chrome.google.com/webstore/detail/adblock-plus/cfhdojbkjhnklbpkdaibdccddilifddb" target="_blank" rel="noopener noreferrer" className="adBlockButton">
                                            <span>AdBlock Plus</span>
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7zm-2 16H5V12h2v5h5v2z"/>
                                            </svg>
                                        </a>
                                    </div>
                                    <button className="closeButton" onClick={handleAdBlockerClose}>
                                        Anladım
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                    {showSubtitleInfo && (
                        <div className="subtitleInfo">
                            <div className="subtitleContent">
                                <svg className="infoIcon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                    <path d="M11 7h2v2h-2zm0 4h2v6h-2zm1-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                                </svg>
                                <div className="subtitleMessage">
                                    <h4>Altyazı Ayarları</h4>
                                    <p>Video başladıktan sonra altyazı ayarlarından Türkçe'yi seçmeyi unutmayın.</p>
                                    <div className="subtitleSteps">
                                        <span>1. Altyazı ikonuna tıklayın ⚙️</span>
                                        <span>2. "Türkçe" seçeneğini seçin 🇹🇷</span>
                                    </div>
                                </div>
                                <button className="closeButton" onClick={() => setShowSubtitleInfo(false)}>
                                    Anladım
                                </button>
                            </div>
                        </div>
                    )}
                    <div className="sourceSelect">
                        <select 
                            value={currentSource} 
                            onChange={handleSourceChange}
                            className="sourceDropdown"
                        >
                            <option value="" disabled>Kaynak Seçin</option>
                            {videoSources.map((source, index) => (
                                <option key={index} value={index}>
                                    {source.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="iframeWrapper">
                        <iframe
                            src={currentUrl}
                            width="100%"
                            height="600"
                            frameBorder="0"
                            allowFullScreen
                            loading="lazy"
                            title="Video Player"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        ></iframe>
                        {error && (
                            <div className="errorOverlay">
                                <p>Bu kaynakta video şu anda kullanılamıyor.</p>
                                {currentSource < videoSources.length - 1 && (
                                    <button onClick={() => handleSourceChange({ target: { value: currentSource + 1 }})}>
                                        Diğer kaynağı dene
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </ContentWrapper>
        </div>
    );
};

export default IframeSection; 