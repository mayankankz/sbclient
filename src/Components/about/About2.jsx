import React from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col } from "reactstrap";
import LottiePlayer from "../player";

function About2() {
  return (
    <div>
      <section className="py-4">
        <Container>
          <Row className="align-items-center">
            <Col xs={12} lg={6} className=" mb-lg-0 order-lg-1">
              <LottiePlayer src="https://lottie.host/f83a82e9-604e-4d44-9fcb-e889c7b5404b/EuPKpfBQSu.json" />
            </Col>
            <Col xs={12} lg={6} className="pt-10">
              <h6 className="border-bottom border-dark border-2 d-inline-block">
                About Us
              </h6>
              <h2 className="font-w-6">
                For Sites That Attention Better Experience
              </h2>
              <p className="lead mb-4">
                We’ve been a nearly strategic thought leader for five we are
                bring unrivaled decades incididunt aliqua.
              </p>
              <div className="d-flex align-items-start mb-3">
                <div className="me-3">
                  <i className="bi bi-check2-all fs-2 text-primary"></i>
                </div>
                <div>
                  <h6 className="mb-2">Collaborate on ideas 7x faster</h6>
                  <p className="mb-0">
                    We provide the modern work way for business development.
                  </p>
                </div>
              </div>
              <div className="d-flex align-items-start">
                <div className="me-3">
                  <i className="bi bi-check2-all fs-2 text-primary"></i>
                </div>
                <div>
                  <h6 className="mb-2">Easy ways to implement</h6>
                  <p className="mb-0">
                    We provide the modern work way for business development.
                  </p>
                </div>
              </div>

              <Link className="btn btn-dark mt-6" to="/about-us">
                Learn More About
              </Link>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
}

export default About2;
