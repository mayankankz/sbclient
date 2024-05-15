import React from "react";
import { Container, Row, Col } from "reactstrap";
import TeamMembers from "./TeamMemberCard";
function Team() {
  const teamMembers = [
    {
      id: 1,
      name: "Cherie Kerl",
      position: "Manager",
      imgSrc: "images/team/01.jpg",
      emaiId: "themeht23@gmail.com",
      phoneNo: "+91-234-567-8900",
      socialMedia: [
        { icon: "bi-facebook", link: "/index-2" },
        { icon: "bi-dribbble", link: "/index-2" },
        { icon: "bi-twitter", link: "/index-2" },
        { icon: "bi-linkedin", link: "/index-2" },
      ],
    },
    {
      id: 2,
      name: "Rashvin Kathiriya",
      position: "CEO",
      imgSrc: "images/team/02.jpg",
      emaiId: "rashvinKathiriya10@gmail.com",
      phoneNo: "+91-234-567-8900",
      socialMedia: [
        { icon: "bi-facebook", link: "/index-2" },
        { icon: "bi-dribbble", link: "/index-2" },
        { icon: "bi-twitter", link: "/index-2" },
        { icon: "bi-linkedin", link: "/index-2" },
      ],
    },
    {
      id: 3,
      name: "Loung Willey",
      position: "Founder",
      imgSrc: "images/team/03.jpg",
      emaiId: "themeht23@gmail.com",
      phoneNo: "+91-234-567-8900",
      socialMedia: [
        { icon: "bi-facebook", link: "/index-2" },
        { icon: "bi-dribbble", link: "/index-2" },
        { icon: "bi-twitter", link: "/index-2" },
        { icon: "bi-linkedin", link: "/index-2" },
      ],
    },
    {
      id: 4,
      name: "Angel Jessica",
      position: "Supervisor",
      imgSrc: "images/team/04.jpg",
      emaiId: "themeht23@gmail.com",
      phoneNo: "+91-234-567-8900",
      socialMedia: [
        { icon: "bi-facebook", link: "/index-2" },
        { icon: "bi-dribbble", link: "/index-2" },
        { icon: "bi-twitter", link: "/index-2" },
        { icon: "bi-linkedin", link: "/index-2" },
      ],
    },
  ];
  return (
    <div>
      <section>
        <Container>
          <div className="row justify-content-center text-center mb-6">
            <Col xs="12" lg="8">
              <div>
                <h6 className="border-bottom border-dark border-2 d-inline-block">
                  Team
                </h6>
                <h2 className="font-w-6">Meet Our Expert Advisor</h2>
                <p className="lead mb-0">
                  We are a team of experienced developers who are passionate
                  about their work. No coding required to make customizations.
                </p>
              </div>
            </Col>
          </div>
          <Row>
            <TeamMembers teamMembers={teamMembers} />
          </Row>
        </Container>
      </section>
    </div>
  );
}

export default Team;
