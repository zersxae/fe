import axios from "axios";

const BASE_URL = "https://api.themoviedb.org/3";
const TMDB_TOKEN = import.meta.env.VITE_APP_TMDB_TOKEN;
const IPAPI_URL = "https://ipapi.co/json/";
const headers = {
    Authorization: "Bearer " + TMDB_TOKEN,
};
const getBrowserLanguage = () => {
    const browserLanguage = navigator.language || navigator.userLanguage;
    return browserLanguage.startsWith("tr") ? "tr" : "en";
};

const getCountryBasedLanguage = async () => {
    try {
        const response = await axios.get(IPAPI_URL);
        const countryCode = response.data.country_code;
        switch (countryCode) {
            case "TR":
                return "tr";
            case "US":
                return "en";

            default:
                return "en";
        }
    } catch (error) {
        console.error("IP API'sinden ülke verileri alınırken hata oluştu:", error);
        return "tr"; 
    }
};

export const fetchDataFromApi = async (endpoint, queryParams) => {
    try {
        const browserLanguage = getBrowserLanguage();
        const countryBasedLanguage = await getCountryBasedLanguage();
        const language = countryBasedLanguage || browserLanguage;
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
