import React from "react";
import Page_Heading from "../../Components/page-heading/Page_Heading";
import { Col, Container, Row } from "reactstrap";
import Contact from "../../Components/contact/Contact";
import { useSelector } from "react-redux";

function PortFolioSingle() {
  const portfolioItems = useSelector((state) => state.portFolio.portFolioItems);
  const title = useSelector((state) => state.portFolio.selectedPortFolio);
  let selectedPortfolio = portfolioItems.find((p) => p.title === title);
  const firstBreadcrumb = { label: "Pages", link: "/product-single" };
  const secondBreadcrumb = {
    label: "Product Single",
    link: "/product-single",
    active: true,
  };
  if (
    selectedPortfolio == undefined
      ? (selectedPortfolio = portfolioItems[0])
      : selectedPortfolio
  )
    return (
      <div className="page-wrapper">
        <Page_Heading
          title="Portfolio Single"
          firstBreadcrumb={firstBreadcrumb}
          secondBreadcrumb={secondBreadcrumb}
        />

        <Container>
          <Row>
            <Col lg={8} className="col-12 pe-lg-10 my-4">
              <img
                className="img-fluid w-100 rounded-4 mb-5"
                src={selectedPortfolio.imgSrc}
                alt=""
              />
              <h2>{selectedPortfolio.title}</h2>
              <p className="lead text-dark mb-3">
                {selectedPortfolio.description}
              </p>
              <p>{selectedPortfolio.details}</p>
              <h5>Project Challenge</h5>
              <div className="d-flex align-items-start mb-2">
                <div className="me-2">
                  <i className="bi bi-check2-all fs-5 text-primary"></i>
                </div>
                <div>
                  <p className="mb-0">Collaborate on ideas 7x faster</p>
                </div>
              </div>
              <div className="d-flex align-items-start mb-2">
                <div className="me-2">
                  <i className="bi bi-check2-all fs-5 text-primary"></i>
                </div>
                <div>
                  <p className="mb-0">Easy ways to implement</p>
                </div>
              </div>
              <div className="d-flex align-items-start mb-2">
                <div className="me-2">
                  <i className="bi bi-check2-all fs-5 text-primary"></i>
                </div>
                <div>
                  <p className="mb-0">We make spending stress free</p>
                </div>
              </div>
              <div className="d-flex align-items-start">
                <div className="me-2">
                  <i className="bi bi-check2-all fs-5 text-primary"></i>
                </div>
                <div>
                  <p className="mb-0">We are proud of our works</p>
                </div>
              </div>
            </Col>
            <Col lg={4} className="col-12 my-4">
              <div className="bg-white shadow p-5 rounded-4">
                <h4 className="mb-4">About The Project</h4>
                <ul className="cases-meta list-unstyled text-muted">
                  <li className="mb-3 border-bottom border-light pb-3">
                    <span className="text-dark font-w-6"> Client: </span> Your
                    client name
                  </li>
                  <li className="mb-3 border-bottom border-light pb-3">
                    <span className="text-dark font-w-6"> Created by: </span>{" "}
                    ThemeHt
                  </li>
                  <li className="mb-3 border-bottom border-light pb-3">
                    <span className="text-dark font-w-6"> Category: </span>{" "}
                    Landing Page
                  </li>
                  <li className="mb-3 border-bottom border-light pb-3">
                    <span className="text-dark font-w-6"> Date: </span> October
                    23, 2022
                  </li>
                  <li className="mb-3 border-bottom border-light pb-3">
                    <span className="text-dark font-w-6"> Location: </span>{" "}
                    423B, Road Wordwide Country, USA
                  </li>
                  <li>
                    <span className="text-dark font-w-6"> Website: </span>
                    www.yourwebsite.com
                  </li>
                </ul>
              </div>
            </Col>
          </Row>
        </Container>

        <Contact />
      </div>
    );
}

export default PortFolioSingle;
