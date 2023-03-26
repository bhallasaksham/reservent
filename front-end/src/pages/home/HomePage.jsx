import React, { useState, useEffect } from "react";
import { MainLayout } from "../../layouts";
import axios from "axios";
import { Spinner, Button, Card } from "react-bootstrap";
import styles from "./HomePage.module.css";

export const HomePage = () => {
  const [content, setContent] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      console.log(loading);
      try {
        // const { data: response } = await axios.get('/content');
        // const responseJSON = JSON.parse(response)
        // setContent(responseJSON);
        setContent("this is content");
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
      {loading && (
        <Spinner className={styles["loading-spinner"]} animation="border" />
      )}
      {!loading && (
        <Card style={{ width: "18rem" }}>
          <Card.Body>
            <Card.Title>Card Title</Card.Title>
            <Card.Text>
              Some quick example text to build on the card title and make up the
              bulk of the card's content.
            </Card.Text>
            <Button variant="primary">Go somewhere</Button>
          </Card.Body>
        </Card>
      )}
    </MainLayout>
  );
};
