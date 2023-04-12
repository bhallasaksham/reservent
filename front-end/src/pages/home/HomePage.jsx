import React, { useState, useEffect } from "react";
import { MainLayout } from "../../layouts";
import axios from "axios";
import { Spinner, Button, Card } from "react-bootstrap";
import styles from "./HomePage.module.css";
import { useCookies } from "react-cookie";

export const HomePage = () => {
  const [content, setContent] = useState();
  const [loading, setLoading] = useState(true);

  const [cookies, setCookie, removeCookie] = useCookies(["jwt_token", "refresh_token"]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data: response } = await axios.get(
          "http://0.0.0.0:4000",
          {
            headers: {
              Authorization: `bearer ${cookies["jwt_token"]} ${cookies["refresh_token"]}`
            }
          }
          // {
          //   withCredentials: true,
          // }
        );
        setContent(response["message"]);
        // const responseJSON = JSON.parse(response);
        // setContent(responseJSON["message"]);
      } catch (error) {
        console.error(error);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  return (
    <MainLayout>
      <h1 className="page-title">Home (Content TBD)</h1>
      {loading && <Spinner className={styles["loading-spinner"]} animation="border" />}
      {!loading && (
        <Card style={{ width: "18rem" }}>
          <Card.Body>
            <Card.Title>message from 4000:</Card.Title>
            <Card.Text>{content}</Card.Text>
            <Button variant="primary">Go somewhere</Button>
          </Card.Body>
        </Card>
      )}
    </MainLayout>
  );
};
