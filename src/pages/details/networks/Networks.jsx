import React from "react";
import { useNavigate } from "react-router-dom";
import "./style.scss";
import Img from "../../../components/lazyLoadImage/Img";

const noChannelLogo = "https://www.themoviedb.org/assets/2/v4/logos/v2/blue_square_2-d537fb228cf3ded904ef09b136fe3fec72548ebc1fea3fbbd1ad9e36364db38b.svg";

const Networks = ({ networks }) => {
    const navigate = useNavigate();

    const handleChannelClick = (channelId) => {
        navigate(`/channel/${channelId}`);
    };

    return (
        networks && networks.length > 0 && (
            <div className="networks">
                <h3 className="networkTitle">Yayınlandığı Kanallar</h3>
                <div className="networkList">
                    {networks.map((network) => (
                        <div 
                            key={network.id} 
                            className="networkItem"
                            onClick={() => handleChannelClick(network.id)}
                        >
                            <Img
                                src={
                                    network.logo_path
                                        ? `https://image.tmdb.org/t/p/original${network.logo_path}`
                                        : noChannelLogo
                                }
                                alt={network.name}
                            />
                            <span>{network.name}</span>
                        </div>
                    ))}
                </div>
            </div>
        )
    );
};

export default Networks; 