import React from "react";
import AboutHero from "../components/AboutHero";
import Mission from "../components/Mission";
import ExpertTeam from "../components/ExpertTeam";
import ExpertiseSectors from "../components/ExpertiseSectors";
import SectionWrapper from "../components/SectionWrapper";

const About = () => {
  return (
    <div className="bg-[#0b1220]">
      <SectionWrapper id="aboutHero"><AboutHero /></SectionWrapper>
      <SectionWrapper id="mission"><Mission /></SectionWrapper>
      <SectionWrapper id="expertTeam"><ExpertTeam /></SectionWrapper>
      <SectionWrapper id="expertiseSectors"><ExpertiseSectors /></SectionWrapper>
    </div>
  );
};

export default About;
