import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";
import Select from "react-select";
import "./style.scss";

import ContentWrapper from "../../components/contentWrapper/ContentWrapper";
import MovieCard from "../../components/movieCard/MovieCard";
import Spinner from "../../components/spinner/Spinner";
import useFetch from "../../hooks/useFetch";
import { fetchDataFromApi } from "../../utils/api";

const sortbyData = [
    { value: "popularity.desc", label: "Popülerlik (Azalan)" },
    { value: "popularity.asc", label: "Popülerlik (Artan)" },
    { value: "vote_average.desc", label: "Puan (Azalan)" },
    { value: "vote_average.asc", label: "Puan (Artan)" },
    { value: "primary_release_date.desc", label: "Yayın Tarihi (Yeni)" },
    { value: "primary_release_date.asc", label: "Yayın Tarihi (Eski)" },
    { value: "original_title.asc", label: "Başlık (A-Z)" },
    { value: "original_title.desc", label: "Başlık (Z-A)" },
];

const Archive = () => {
    const [data, setData] = useState(null);
    const [pageNum, setPageNum] = useState(1);
    const [loading, setLoading] = useState(false);
    const [genre, setGenre] = useState(null);
    const [year, setYear] = useState(null);
    const [sortby, setSortby] = useState(null);
    const [genres, setGenres] = useState([]);
    const navigate = useNavigate();
    const { mediaType } = useParams();

    const { data: genresData } = useFetch(`/genre/${mediaType}/list`);

    const fetchInitialData = () => {
        setLoading(true);
        fetchDataFromApi(
            `/discover/${mediaType}?page=${pageNum}&with_genres=${
                genre?.id || ""
            }&primary_release_year=${year?.value || ""}&sort_by=${
                sortby?.value || "popularity.desc"
            }`
        ).then((res) => {
            setData(res);
            setPageNum((prev) => prev + 1);
            setLoading(false);
        });
    };

    const fetchNextPageData = () => {
        fetchDataFromApi(
            `/discover/${mediaType}?page=${pageNum}&with_genres=${
                genre?.id || ""
            }&primary_release_year=${year?.value || ""}&sort_by=${
                sortby?.value || "popularity.desc"
            }`
        ).then((res) => {
            if (data?.results) {
                setData({
                    ...data,
                    results: [...data.results, ...res.results],
                });
            } else {
                setData(res);
            }
            setPageNum((prev) => prev + 1);
        });
    };

    useEffect(() => {
        setData(null);
        setPageNum(1);
        fetchInitialData();
    }, [genre, year, sortby]);

    useEffect(() => {
        if (genresData) {
            const allGenres = genresData.genres.map((g) => ({
                id: g.id,
                label: g.name,
            }));
            setGenres(allGenres);
        }
    }, [genresData]);

    const generateYearOptions = () => {
        const currentYear = new Date().getFullYear();
        const years = [];
        for (let i = currentYear; i >= 1900; i--) {
            years.push({ value: i, label: i.toString() });
        }
        return years;
    };

    const onGenreChange = (selectedGenre) => {
        setGenre(selectedGenre);
        setPageNum(1);
    };

    const onYearChange = (selectedYear) => {
        setYear(selectedYear);
        setPageNum(1);
    };

    const onSortbyChange = (selectedSort) => {
        setSortby(selectedSort);
        setPageNum(1);
    };

    return (
        <div className="archivePage">
            <ContentWrapper>
                <div className="pageHeader">
                    <div className="pageTitle">
                        {mediaType === "movie" ? "Film" : "Dizi"} Arşivi
                    </div>
                    <div className="filters">
                        <Select
                            className="genreSelect"
                            classNamePrefix="react-select"
                            placeholder="Tür Seçin"
                            isClearable
                            options={genres}
                            onChange={onGenreChange}
                            value={genre}
                        />
                        <Select
                            className="yearSelect"
                            classNamePrefix="react-select"
                            placeholder="Yıl Seçin"
                            isClearable
                            options={generateYearOptions()}
                            onChange={onYearChange}
                            value={year}
                        />
                        <Select
                            className="sortbySelect"
                            classNamePrefix="react-select"
                            placeholder="Sıralama"
                            isClearable
                            options={sortbyData}
                            onChange={onSortbyChange}
                            value={sortby}
                        />
                    </div>
                </div>
                {loading && <Spinner initial={true} />}
                {!loading && (
                    <>
                        {data?.results?.length > 0 ? (
                            <InfiniteScroll
                                className="content"
                                dataLength={data?.results?.length || []}
                                next={fetchNextPageData}
                                hasMore={pageNum <= data?.total_pages}
                                loader={<Spinner />}
                            >
                                {data?.results?.map((item, index) => {
                                    return (
                                        <MovieCard
                                            key={index}
                                            data={item}
                                            mediaType={mediaType}
                                        />
                                    );
                                })}
                            </InfiniteScroll>
                        ) : (
                            <span className="resultNotFound">
                                Sonuç bulunamadı
                            </span>
                        )}
                    </>
                )}
            </ContentWrapper>
        </div>
    );
};

export default Archive; 