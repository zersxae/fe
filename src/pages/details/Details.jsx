import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./style.scss";
import DetailsBanner from "./detailsBanner/DetailsBanner";
import Cast from "./cast/Cast";
import VideosSection from "./videosSection/VideosSection";
import Similar from "./carousels/Similar";
import Recommendation from "./carousels/Recommendation";
import IframeSection from "./iframeSection/IframeSection";
import Networks from "./networks/Networks";
import { fetchDataFromApi } from "../../utils/api";

const Details = () => {
    const { mediaType, id } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [networks, setNetworks] = useState([]);

    useEffect(() => {
        fetchDetails();
    }, [mediaType, id]);

    const fetchDetails = async () => {
        try {
            const data = await fetchDataFromApi(`/${mediaType}/${id}`);
            setData(data);
            
            if (data.networks && data.networks.length > 0) {
                setNetworks(data.networks);
            }
        } catch (error) {
            console.error("Detaylar yüklenirken hata oluştu:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="detailsBanner">
            {!loading ? (
                <>
                    <DetailsBanner video={data?.videos?.results?.[0]} crew={data?.credits?.crew} />
                    <IframeSection data={data} />
                    <Cast data={data?.credits?.cast} loading={loading} />
                    <VideosSection data={data?.videos} loading={loading} />
                    <Networks networks={networks} />
                    <Similar mediaType={mediaType} id={id} />
                    <Recommendation mediaType={mediaType} id={id} />
                </>
            ) : (
                <div className="loadingSkeleton">
                    Yükleniyor...
                </div>
            )}
        </div>
    );
};

export default Details;
