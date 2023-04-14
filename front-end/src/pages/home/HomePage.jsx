import React, { useState, useEffect } from "react";
import { MainLayout } from "../../layouts";
import axios from "axios";
import { Accordion, Carousel } from "react-bootstrap";
import styles from "./HomePage.module.css";
import { useCookies } from "react-cookie";

export const HomePage = () => {
  const [content, setContent] = useState();
  const [loading, setLoading] = useState(true);

  const [cookies, setCookie, removeCookie] = useCookies(["jwt_token", "refresh_token"]);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     setLoading(true);
  //     try {
  //       const { data: response } = await axios.get(
  //         "http://0.0.0.0:4000",
  //         {
  //           headers: {
  //             Authorization: `bearer ${cookies["jwt_token"]} ${cookies["refresh_token"]}`
  //           }
  //         }
  //         // {
  //         //   withCredentials: true,
  //         // }
  //       );
  //       setContent(response["message"]);
  //       // const responseJSON = JSON.parse(response);
  //       // setContent(responseJSON["message"]);
  //     } catch (error) {
  //       console.error(error);
  //     }
  //     setLoading(false);
  //   };

  //   fetchData();
  // }, []);

  return (
    <MainLayout>
      <div className={styles["home-container"]}>
        <h1 className="page-title">Home </h1>

        <h2>About Reservent</h2>
        <p>
          Reservent is a software solution for students and staffs at CMU-SV aimed at streamlining the processes of
          event creation and room reservation.
        </p>
        <br />

        <h2>Main Features</h2>
        <Carousel className={styles["home-carousel"]}>
          <Carousel.Item>
            <img className="d-block w-100" src="bd23.jpg" />
            <Carousel.Caption>
              <h3>Create Event</h3>
              <p>Create events and invite your guests.</p>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <img className="d-block w-100" src="bd23.jpg" />
            <Carousel.Caption>
              <h3>Reserve Room</h3>
              <p>Search and reserve rooms on campus.</p>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <img className="d-block w-100" src="bd23.jpg" />
            <Carousel.Caption>
              <h3>Email Notofication</h3>
              <p>Email notification for all participants.</p>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <img className="d-block w-100" src="bd23.jpg" />
            <Carousel.Caption>
              <h3>User Management</h3>
              <p>Manage user privileges (for admin only).</p>
            </Carousel.Caption>
          </Carousel.Item>
        </Carousel>
        <br />

        <h2>Different Users</h2>
        <Accordion>
          <Accordion.Item eventKey="0">
            <Accordion.Header>Student</Accordion.Header>
            <Accordion.Body>
              Students can create events, reserve rooms and invite guests. Only small and medium meeting rooms can be
              reserved by students.
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="1">
            <Accordion.Header>Staff</Accordion.Header>
            <Accordion.Body>
              Staff can reserve all rooms on campus, including large classrooms and the hall.
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="2">
            <Accordion.Header>Administrator</Accordion.Header>
            <Accordion.Body>
              The administrator can view each user's information and modify their privileges.
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </div>
    </MainLayout>
  );
};

// TODO: add more pics for carousel
