import React, { useState, useEffect } from "react";
import { MainLayout } from "../../layouts";
import axios from "axios";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import styles from "./SignInPage.module.css";
import { Google } from "react-bootstrap-icons";

export const SignInPage = () => {
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
                <Button variant="primary" style={{ width: "100%" }}>
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
// add more content (carousel, about us, etc)
