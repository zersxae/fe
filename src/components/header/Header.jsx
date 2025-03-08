import React, { useState, useEffect } from "react";
import { HiOutlineSearch } from "react-icons/hi";
import { SlMenu } from "react-icons/sl";
import { VscChromeClose } from "react-icons/vsc";
import { MdNightlightRound, MdWbSunny } from "react-icons/md";
import { useNavigate, useLocation } from "react-router-dom";
import ContentWrapper from "../contentWrapper/ContentWrapper";
import logo from "../../assets/log.png";
import "./style.scss";

const Header = () => {
    const [show, setShow] = useState("top");
    const [lastScrollY, setLastScrollY] = useState(0);
    const [mobileMenu, setMobileMenu] = useState(false);
    const [query, setQuery] = useState("");
    const [showSearch, setShowSearch] = useState(false);
    const [darkMode, setDarkMode] = useState(() => localStorage.getItem("theme") === "dark");

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        document.body.classList.toggle("dark-mode", darkMode);
        localStorage.setItem("theme", darkMode ? "dark" : "light");
    }, [darkMode]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location]);

    useEffect(() => {
        window.addEventListener("scroll", controlNavbar);
        return () => {
            window.removeEventListener("scroll", controlNavbar);
        };
    }, [lastScrollY]);

    const controlNavbar = () => {
        if (window.scrollY > 200) {
            if (window.scrollY > lastScrollY && !mobileMenu) {
                setShow("hide");
            } else {
                setShow("show");
            }
        } else {
            setShow("top");
        }
        setLastScrollY(window.scrollY);
    };

    const searchQueryHandler = (event) => {
        if (event.key === "Enter" && query.length > 0) {
            navigate(`/search/${query}`);
            setTimeout(() => {
                setShowSearch(false);
            }, 1000);
        }
    };

    const toggleDarkMode = () => {
        setDarkMode(prevMode => !prevMode);
    };

    const openSearch = () => {
        setShowSearch(true);
        setMobileMenu(false);
    };

    const openMobileMenu = () => {
        setMobileMenu(true);
        setShowSearch(false);
    };

    const navigationItems = [
        {
            name: "Anasayfa",
            path: "/"
        },
        {
            name: "Filmler",
            path: "/explore/movie"
        },
        {
            name: "Diziler",
            path: "/explore/tv"
        },

    ];

    return (
        <header className={`header2 ${mobileMenu ? "mobileView" : ""} ${show}`}>
            <ContentWrapper>
                <div className="logo" onClick={() => navigate("/")}>
                    <img src={logo} alt="Site Logo" />
                </div>
                <ul className="menuItems">
                    {navigationItems.map((item) => (
                        <li 
                            key={item.name} 
                            className="menuItem"
                            onClick={() => {
                                navigate(item.path);
                                setMobileMenu(false);
                            }}
                        >
                            {item.name}
                        </li>
                    ))}
                </ul>
                <div className="mobileMenuItems">
                    <HiOutlineSearch onClick={openSearch} className="mobileOnly" />
                    {mobileMenu ? (
                        <VscChromeClose onClick={() => setMobileMenu(false)} className="mobileOnly" />
                    ) : (
                        <SlMenu onClick={openMobileMenu} className="mobileOnly" />
                    )}
                </div>
            </ContentWrapper>
            {showSearch && (
                <div className="searchBar">
                    <ContentWrapper>
                        <div className="searchInput">
                            <input
                                type="text"
                                placeholder="Film veya Dizi Ara.."
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyUp={searchQueryHandler}
                            />
                            <VscChromeClose onClick={() => setShowSearch(false)} />
                        </div>
                    </ContentWrapper>
                </div>
            )}
        </header>
    );
};

export default Header;
