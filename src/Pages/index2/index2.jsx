import React from "react";
import HeroBanner2 from "../../Components/heroBanner/HeroBanner2";
import Feature from "../../Components/feature2/Feature";
import About2 from "../../Components/about/About2";
import Testimonial from "../../Components/testimonial/Testimonial";
import Faq from "../../Components/faq/Faq";
import Team from "../../Components/team/Team";
import Pricing from "../../Components/pricing/Pricing";
import Blog from "../../Components/blog/Blog";
import Contact from "../../Components/contact/Contact";
import Testimonial2 from "../../Components/testimonial/Testimonial2";

function index2() {
  return (
    <div className="page-wrapper">
      <HeroBanner2 />
      <div className="page-content">
        <Feature />
        <About2 />
        <Testimonial2 />
        <Faq />
        <Team />
        <Pricing />
        <Blog />
        <Contact />
      </div>
    </div>
  );
}

export default index2;
