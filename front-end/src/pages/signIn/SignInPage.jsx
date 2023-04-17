import React, { useState, useEffect } from "react";
import { MainLayout } from "../../layouts";
import axios from "axios";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import styles from "./SignInPage.module.css";
import { Google } from "react-bootstrap-icons";
import { useCookies } from "react-cookie";
import { useHistory } from "react-router-dom";

export const SignInPage = () => {
  const [cookies, setCookie, removeCookie] = useCookies(["jwt_token", "refresh_token", "user_privilege"]);
  const history = useHistory();

  const isAuthenticated = cookies["jwt_token"] && cookies["refresh_token"] && cookies["user_privilege"];

  useEffect(() => {
    if (isAuthenticated) {
      history.push("/");
    }
  }, [cookies, history]);

  const handleClick = () => {
    window.location.href = "http://127.0.0.1:4000/login";
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
                <Button variant="primary" style={{ width: "100%" }} onClick={handleClick}>
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

// TODO: fancy title text
// TODO: add more content (carousel, about us, etc)
