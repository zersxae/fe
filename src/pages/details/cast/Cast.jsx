import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import "./style.scss";
import ContentWrapper from "../../../components/contentWrapper/ContentWrapper";
import Img from "../../../components/lazyLoadImage/Img";
import avatar from "../../../assets/avatar.png";

const Cast = ({ data, loading }) => {
    const { url } = useSelector((state) => state.home);
    const navigate = useNavigate();

    const skeleton = () => {
        return (
            <div className="skItem">
                <div className="circle skeleton"></div>
                <div className="row skeleton"></div>
                <div className="row2 skeleton"></div>
            </div>
        );
    };

    const firstSixActors = data ? data.slice(0,) : [];

    if (!data || data.length === 0) return null;

    return (
        <div className="castSection">
            <ContentWrapper>
                <div className="sectionHeading">Öne Çıkan Oyuncular</div>
                {!loading ? (
                    <div className="listItems">
                        {firstSixActors.map((item) => {
                            let imgUrl = item.profile_path
                                ? url.profile + item.profile_path
                                : avatar;
                            return (
                                <div
                                    key={item.id}
                                    className="listItem"
                                    onClick={() => navigate(`/actor/${item.id}`)}
                                >
                                    <div className="profileImg">
                                        <Img src={imgUrl} />
                                    </div>
                                    <div className="name">{item.name}</div>
                                    <div className="character">
                                        {item.character}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="castSkeleton">
                        {skeleton()}
                        {skeleton()}
                        {skeleton()}
                        {skeleton()}
                        {skeleton()}
                        {skeleton()}
                    </div>
                )}
            </ContentWrapper>
        </div>
    );
};

export default Cast;
