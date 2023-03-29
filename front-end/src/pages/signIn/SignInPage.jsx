import React, { useState, useEffect } from "react";
import { MainLayout } from "../../layouts";
import axios from "axios";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import styles from "./SignInPage.module.css";
import { Google } from "react-bootstrap-icons";
import { setAuthToken } from "../../tools";

export const SignInPage = () => {
  const handleClick = () => {
    alert("sign in button clicked");
  };

  // TODO: write google authentication api logic here
  // here we only aims to get & store & use OAuth token, related page redirection will be implemented later

  // below is the example if we are using jwt
  const handleSubmit = (email, pass) => {
    // reqres registered sample user
    const loginPayload = {
      email: "eve.holt@reqres.in",
      password: "cityslicka",
    };

    const fetchToken = async () => {
      try {
        const { data: response } = await axios.post(
          "https://url/login",
          loginPayload
        );
        const jwt = response.token;
        localStorage.setItem("jwt", jwt); // set JWT token to local
        // setAuthToken(jwt); // set token to axios common header (ignore for now)
        // window.location.href = "/";  // redirect user to home page (ignore for now)
      } catch (error) {
        console.error(error);
      }
    };

    fetchToken();
  };

  // if we want to use the jwt token (aka connecting to user management service):
  const foo = () => {
    const jwt = localStorage.getItem("jwt");

    const baz = async () => {
      try {
        const { data: response } = await axios.get("https://url/info", {
          headers: {
            Authorization: `bearer ${jwt}`,
          },
        });
        console.log(response);
      } catch (error) {
        console.error(error);
      }
    };

    baz();
  };

  return (
    <MainLayout>
      <Container className={styles["signin-container"]}>
        <Row>
          <Col>
            <h1 className={styles["product-title"]}>Reservent</h1>
            <h3>Meet, Connect, Succeed: </h3>
            <p>Book Your Campus Room with Ease!</p>
          </Col>
          <Col>
            <Card className={styles["signin-card"]}>
              <Card.Body>
                <Card.Text>Please sign in with you andrew email</Card.Text>
                <Button
                  variant="primary"
                  style={{ width: "100%" }}
                  onClick={handleClick}
                >
                  <Google />
                  <span>Sign In</span>
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </MainLayout>
  );
};

// TODO: remove MainLayout when signin is ready
// TODO: fancy title text
// TODO: add more content (carousel, about us, etc)
// TODO: integrate setAuthToken tool
