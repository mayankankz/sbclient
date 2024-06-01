import React, { useState } from "react";
import { Col, Container, Row } from "reactstrap";
import { Form, FormGroup, Input, Label, Button } from "reactstrap";

import LottiePlayer from "../../Components/player";
import { apiUrl } from "../../utils/constant";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

function SignIn() {
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    debugger;
    const data = new FormData(event.currentTarget);
    let username = data.get("username");
    let password = data.get("password");

    if (!username.trim() || !password.trim()) {
      toast.error("Username and password required.");
      return;
    }

    try {
      setLoading(true);
      const user = await axios
        .post(`${apiUrl}/auth/login`, { username, password })
        .then((response) => {
          console.log(response.data.userDetails.isAdmin);

          if (response.data.userDetails.isAdmin) {
            setLoading(false);
            localStorage.setItem('auth', true);
            navigate("/admin/");
          } else {
            setLoading(false);
            toast.error('You are not allowed to access this.')
          }
        })
        .catch((error) => {
          toast.error(error.response.data.Error);
        })
        .finally(() => {
          setLoading(false);
        });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="page-wrapper">
      <div className="page-content">
        <section>
          <Container>
            <Row className="align-items-center justify-content-between">
              <Col xs={12} lg={6}>
                <LottiePlayer src="https://lottie.host/cbbc0c83-044c-4cf0-ba2e-54438fcbafd8/6M8MI7snvI.json" />
              </Col>
              <Col lg={5} xs={12} className="mt-5">
                <div
                  className="border border-light rounded-4 p-5"
                  style={{ boxShadow: "rgba(0, 0, 0, 0.8) 0px 5px 15px" }}
                >
                  <h2 className="mb-5">Login Your Account</h2>
                  <Form id="contact-form" onSubmit={handleSubmit}>
                    <div className="messages"></div>
                    <FormGroup>
                      <Input
                        type="text"
                        name="username"
                        id="form_name"
                        placeholder="User name"
                        required
                      />
                    </FormGroup>
                    <FormGroup>
                      <Input
                        type="password"
                        name="password"
                        id="form_password"
                        placeholder="Password"
                        required
                      />
                    </FormGroup>

                    <Button color="primary">Login Now</Button>
                  </Form>
                </div>
              </Col>
            </Row>
          </Container>
        </section>
      </div>
    </div>
  );
}

export default SignIn;
