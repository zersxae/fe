import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { fetchDataFromApi } from "./utils/api";
import { useSelector, useDispatch } from "react-redux";
import { getApiConfiguration, getGenres } from "./store/homeSlice";
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import Home from "./pages/home/Home";
import Details from "./pages/details/Details";
import SearchResult from "./pages/searchResult/SearchResult";
import Explore from "./pages/explore/Explore";
import PageNotFound from "./pages/404/PageNotFound";
    import ChannelDetail from "./pages/channels/ChannelDetail";
import PlayerDetails from "./pages/actorDetails/actorDetails";

function App() {
    const dispatch = useDispatch();
    const { url } = useSelector((state) => state.home);

    useEffect(() => {
        fetchApiConfig();
        genresCall();
    }, []);

    const fetchApiConfig = async () => {
        try {
            const res = await fetchDataFromApi("/configuration");
            const url = {
                backdrop: res.images.secure_base_url + "original",
                poster: res.images.secure_base_url + "original",
                profile: res.images.secure_base_url + "original",
            };
            dispatch(getApiConfiguration(url));
        } catch (error) {
            console.error("API yapılandırması yüklenirken hata oluştu:", error);
        }
    };

    const genresCall = async () => {
        try {
            let promises = [];
            let endPoints = ["tv", "movie"];
            let allGenres = {};

            endPoints.forEach((url) => {
                promises.push(fetchDataFromApi(`/genre/${url}/list`));
            });

            const data = await Promise.all(promises);
            data.map(({ genres }) => {
                genres.map((item) => (allGenres[item.id] = item));
            });

            dispatch(getGenres(allGenres));
        } catch (error) {
            console.error("Türler yüklenirken hata oluştu:", error);
        }
    };

    return (
        <div className="app">
            <Header />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/:mediaType/:id" element={<Details />} />
                <Route path="/search/:query" element={<SearchResult />} />
                <Route path="/explore/:mediaType" element={<Explore />} />
                <Route path="/channel/:id" element={<ChannelDetail />} />
                <Route path="/player/:id" element={<PlayerDetails />} />
                <Route path="*" element={<PageNotFound />} />
            </Routes>
            <Footer />
        </div>
    );
}

export default App;
