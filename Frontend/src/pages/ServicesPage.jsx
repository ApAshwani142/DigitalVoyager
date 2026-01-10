import React from "react";
import ServicesHero from "../components/ServicesHero";
import ServicesGrid from "../components/ServicesGrid";
import Stats from "../components/Stats";
import CTA from "../components/CTA";
import SectionWrapper from "../components/SectionWrapper";

const ServicesPage = () => {
  return (
    <div className="bg-[#0b1220] text-white min-h-screen flex flex-col">
      <SectionWrapper id="services-hero"><ServicesHero /></SectionWrapper>
      <SectionWrapper id="services-grid"><ServicesGrid /></SectionWrapper>
      <SectionWrapper id="stats"><Stats /></SectionWrapper>
      <SectionWrapper id="cta"><CTA /></SectionWrapper>
    </div>
  );
};

export default ServicesPage;
