import axios from "axios";

const BASE_URL = "https://api.themoviedb.org/3";
const TMDB_TOKEN = import.meta.env.VITE_APP_TMDB_TOKEN;
const headers = {
    Authorization: "Bearer " + TMDB_TOKEN,
};

const getBrowserLanguage = () => {
    const browserLanguage = navigator.language || navigator.userLanguage;
    return browserLanguage.startsWith("tr") ? "tr" : "en";
};

export const fetchDataFromApi = async (endpoint, queryParams) => {
    try {
        const language = getBrowserLanguage();
        const params = { ...queryParams, language };
        const response = await axios.get(`${BASE_URL}${endpoint}`, {
            headers,
            params,
        });

        return response.data;
    } catch (error) {
        console.error("API'den veri alınırken hata oluştu:", error);
        return null;
    }
};

export default fetchDataFromApi;
