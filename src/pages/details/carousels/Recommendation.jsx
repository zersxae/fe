import React from "react";
import Carousel from "../../../components/carousel/Carousel";
import useFetch from "../../../hooks/useFetch";

const Recommendation = ({ mediaType, id }) => {
    const { data, loading, error } = useFetch(
        `/${mediaType}/${id}/recommendations`
    );

   
    if (!data || !data.results || data.results.length === 0) {
        return null; // data yoksa veya boşsa hiçbir şey render etme
    }

    return (
        <Carousel
            title="Senin İçin Seçtiklerimiz"
            data={data.results}
            loading={loading}
            endpoint={mediaType}
        />
    );
};

export default Recommendation;
