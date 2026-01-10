import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import ContactHero from "../components/ContactHero";
import ContactInfo from "../components/ContactInfo";
import ContactOffice from "../components/ContactOffice";
import SectionWrapper from "../components/SectionWrapper";

const ContactPage = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash === "#emergency") {
      setTimeout(() => {
        const element = document.getElementById("emergency");
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 300);
    }
  }, [location.hash]);

  return (
    <div className="bg-[#0b1220]">
      <SectionWrapper id="contactHero"><ContactHero /></SectionWrapper>
      <SectionWrapper id="contactInfo"><ContactInfo /></SectionWrapper>
      <SectionWrapper id="contactOffice"><ContactOffice /></SectionWrapper>
    </div>
  );
};

export default ContactPage;
