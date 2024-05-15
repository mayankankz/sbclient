import React from "react";
import Page_Heading from "../../Components/page-heading/Page_Heading";
import { Col, Container, Row } from "reactstrap";
import ContactForm from "./ContactForm";
import ContactInfo from "./ContactInfo";
import MapSection from "./MapSection";

function Contatct() {
  const firstBreadcrumb = { label: "Pages", link: "/contact-us" };
  const secondBreadcrumb = {
    label: "Contatct Us",
    link: "/contact-us",
    active: true,
  };
  const contactInfo = [
    {
      region: "North America",
      address: "423B, Road Worldwide Country, USA",
      phone: "+91-234-567-8900",
      email: "themeht23@gmail.com",
    },
    {
      region: "United Kingdom",
      address: "423B, Road Worldwide Country, USA",
      phone: "+91-234-567-8900",
      email: "themeht23@gmail.com",
    },
  ];
  return (
    <div className="page-wrapper">
      <Page_Heading
        title="Contact Us"
        firstBreadcrumb={firstBreadcrumb}
        secondBreadcrumb={secondBreadcrumb}
      />
      <section>
        <Container>
          <Row className="align-item-center">
            <Col lg={6} className=" mb-6 mb-lg-0">
              <ContactInfo contactInfo={contactInfo} />
            </Col>
            <Col lg={6} className="col-12 ps-lg-10">
              <ContactForm />
            </Col>
          </Row>
        </Container>
      </section>
      <section className="overflow-hidden pt-0">
        <Container fluid className="px-0">
          <Row>
            <Col>
              <MapSection />
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
}

export default Contatct;
