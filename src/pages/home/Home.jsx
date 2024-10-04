import React from 'react';

import "./style.scss";

import HeroBanner from "./heroBanner/HeroBanner";
import TrendFilmler from "./trendFilmler/trendfilmler";
import Popular from "./popular/Popular";
import TopRated from "./topRated/TopRated";
import TrendDiziler from "./trendDiziler/trenddiziler";
import Oyuncular from "./oyuncular/oyuncular"


HeroBanner;

const Home = () => {
  return (
     <div className="homePage">
        <HeroBanner />
        <TrendFilmler />
        <TrendDiziler />
        <Oyuncular/>
        <Popular />
        <TopRated />
        <div style={{ height: 1 }}></div>
  </div>
  );
};

export default Home;