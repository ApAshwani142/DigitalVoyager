import React from "react";
import Hero from "../components/Hero";
import Services from "../components/Services";
import Stats from "../components/Stats";
import SectionWrapper from "../components/SectionWrapper";

const Home = () => {
  return (
    <div className="bg-[#0b1220] "> 
      <SectionWrapper id="hero"><Hero /></SectionWrapper>
      <SectionWrapper id="services"><Services /></SectionWrapper>
      <SectionWrapper id="stats"><Stats /></SectionWrapper>
    </div>
  );
};

export default Home;
