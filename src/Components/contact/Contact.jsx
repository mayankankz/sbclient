import React from "react";
import { Button, Container, Row, Col } from "reactstrap";
import { Link } from "react-router-dom";
import BgImage from "../../assets/bg/01.png";

function Contact() {
  return (
    <div>
      <Container>
        <Row className="row">
          <Col className="col-12">
            <div
              className="bg-dark p-4 p-lg-10 rounded-4 text-center"
              style={{
                backgroundImage: `url(${BgImage})`,
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
            >
              <h2 className="text-white mb-0 font-w-7">
                500k Customer Have <br />
                Build a stunning site today.
              </h2>
              <p className="text-light my-4">
                We help our clients succeed by creating brand identities.
              </p>

              <Link to="contact-us" className="btn btn-primary">
                Let's Get Started
              </Link>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Contact;
