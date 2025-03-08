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
import PageNotFound from "./pages/404/PageNotFound";
import ChannelDetail from "./pages/channels/ChannelDetail";
import PlayerDetails from "./pages/actorDetails/actorDetails";
import Explore from "./pages/explore/Explore";

function App() {
    const dispatch = useDispatch();
    const { url } = useSelector((state) => state.home);

    useEffect(() => {
        const init = async () => {
            try {
                console.log(`
███████╗███████╗██████╗ ███████╗
╚══███╔╝██╔════╝██╔══██╗██╔════╝
  ███╔╝ █████╗  ██████╔╝███████╗
 ███╔╝  ██╔══╝  ██╔══██╗╚════██║
███████╗███████╗██║  ██║███████║
╚══════╝╚══════╝╚═╝  ╚═╝╚══════╝

╔═══════════════════════════════╗
║     Developed with 💻 by      ║
║    ⚡ ZERS Development ⚡     ║
╚═══════════════════════════════╝

╔═══════════════════════════════╗
║      İletişim & Sosyal        ║
║  🔹 Telegram: @zersjs         ║
║  🌐 https://t.me/zersjs       ║
╚═══════════════════════════════╝
                `);
                console.log(
                    '%c"Eğer bir yazılımı kırabiliyorsan, ona gerçekten sahipsin demektir."',
                    'color: #FFC107; font-size: 14px; font-style: italic; text-align: center;'
                );

                await Promise.all([fetchApiConfig(), genresCall()]);
            } catch (error) {
                console.error("Uygulama başlatılırken bir hata oluştu:", error);
            }
        };

        init();
    }, []);

    const fetchApiConfig = async () => {
        try {
            const res = await fetchDataFromApi("/configuration");
            if (!res?.images?.secure_base_url) {
                throw new Error("API yapılandırması eksik veya hatalı");
            }
            
            const imageUrls = {
                backdrop: res.images.secure_base_url + "original",
                poster: res.images.secure_base_url + "original",
                profile: res.images.secure_base_url + "original",
            };
            
            dispatch(getApiConfiguration(imageUrls));
            return imageUrls;
        } catch (error) {
            console.error("API yapılandırması yüklenirken hata oluştu:", error);
            throw error;
        }
    };

    const genresCall = async () => {
        try {
            const endPoints = ["tv", "movie"];
            const promises = endPoints.map(type => 
                fetchDataFromApi(`/genre/${type}/list`)
            );

            const data = await Promise.all(promises);
            const allGenres = data.reduce((acc, { genres }) => {
                genres.forEach(item => {
                    acc[item.id] = item;
                });
                return acc;
            }, {});

            dispatch(getGenres(allGenres));
            return allGenres;
        } catch (error) {
            console.error("Türler yüklenirken hata oluştu:", error);
            throw error;
        }
    };

    return (
        <>
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
        </>
    );
}

export default App;
