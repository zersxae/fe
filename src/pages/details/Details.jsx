import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./style.scss";
import useFetch from "../../hooks/useFetch";
import DetailsBanner from "./detailsBanner/DetailsBanner";
import Cast from "./cast/Cast";
import VideosSection from "./videosSection/VideosSection";
import Similar from "./carousels/Similar";
import Recommendation from "./carousels/Recommendation";
import IframeSection from "./iframeSection/IframeSection";
import ImageGallery from "./imageGallery/ImageGallery";
import Networks from "./networks/Networks";
import { fetchDataFromApi } from "../../utils/api";
import { useSelector } from "react-redux";

const Details = () => {
    const { mediaType, id } = useParams();
    const { data, loading } = useFetch(`/${mediaType}/${id}`);
    const [images, setImages] = useState([]);
    const [networks, setNetworks] = useState([]);
    const { url } = useSelector((state) => state.home);

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const response = await fetchDataFromApi(`/${mediaType}/${id}/images?include_image_language=en,null,tr`);
                const imageUrls = [];
                
                // Sadece backdrop resimleri
                response.backdrops?.forEach((image) => {
                    imageUrls.push(url.backdrop + image.file_path);
                });

                setImages(imageUrls);
            } catch (error) {
                console.error("Resimler yüklenirken hata oluştu:", error);
            }
        };

        if (id) {
            fetchImages();
        }
    }, [mediaType, id, url]);

    const fetchDetails = async () => {
        try {
            const data = await fetchDataFromApi(`/${mediaType}/${id}`);
            setData(data);
            
            if (data.networks && data.networks.length > 0) {
                setNetworks(data.networks);
            }
        } catch (error) {
            console.error("Detaylar yüklenirken hata oluştu:", error);
        }
    };

    return (
        <div className="detailsBanner">
            {!loading ? (
                <>
                    <DetailsBanner video={data?.videos?.results?.[0]} crew={data?.credits?.crew} />
                    <Cast data={data?.credits?.cast} loading={loading} />
                    <VideosSection data={data?.videos} loading={loading} />
                    <IframeSection video={data?.videos?.results?.[0]} data={data} />
                    <ImageGallery images={images} loading={loading} />
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
