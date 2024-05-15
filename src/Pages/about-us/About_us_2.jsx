import React from "react";
import Page_Heading from "../../Components/page-heading/Page_Heading";
import Counter from "../../Components/counter/Counter";
import Faq from "../../Components/faq/Faq";
import About from "../../Components/about/About";
import Team from "../../Components/team/Team";
import Blog from "../../Components/blog/Blog";
import Contact from "../../Components/contact/Contact";
function About_us_2() {
  const firstBreadcrumb = { label: "Pages", link: "/about-us-1" };
  const secondBreadcrumb = {
    label: "About Us 2",
    link: "/about-us-2",
    active: true,
  };
  return (
    <div>
      <Page_Heading
        title="About Us 2"
        firstBreadcrumb={firstBreadcrumb}
        secondBreadcrumb={secondBreadcrumb}
      />
      <div className="page-content">
        <Counter />
        <Faq />
        <About />
        <Team />
        <Blog />
        <Contact />
      </div>
    </div>
  );
}

export default About_us_2;
