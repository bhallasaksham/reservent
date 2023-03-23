import React, { useState, useEffect } from "react";
import { MainLayout } from '../../layouts';
import axios from 'axios';
import { Spinner } from 'react-bootstrap';
import styles from './HomePage.module.css';

export const HomePage = () => {
  const [content, setContent] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      console.log(loading)
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
      <h1>HomePage</h1>
      {loading && <Spinner className={styles["loading-spinner"]} animation="border" />}
      {!loading && <div>{content}</div>}
    </MainLayout>
  )
};


