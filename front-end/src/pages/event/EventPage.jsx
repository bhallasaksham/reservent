import React, { useState, useEffect } from "react";
import { MainLayout } from "../../layouts";
import axios from "axios";
import { Spinner, Button, Table, DropdownButton, Dropdown } from "react-bootstrap";
import styles from "./EventPage.module.css";
import { useCookies } from "react-cookie";
import { PersonFillCheck } from "react-bootstrap-icons";
import { EventCard } from "../../components";
import { toast as customAlert } from "react-custom-alert";
import { Link } from "react-router-dom";

export const EventPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false); // TODO: change it to true
  const [cookies, setCookie, removeCookie] = useCookies(["jwt_token", "refresh_token", "user_privilege"]);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     setLoading(true);
  //     try {
  //       const { data: response } = await axios.get("http://0.0.0.0:9000/admin/users", {
  //         headers: {
  //           Authorization: `Bearer ${cookies["jwt_token"]} ${cookies["refresh_token"]}`
  //         }
  //       });
  //       setEvents(response);
  //     } catch (error) {
  //       console.error(error);
  //       return customAlert.error("Failed to get users");
  //     }
  //     setLoading(false);
  //   };

  //   fetchData();
  // }, []);

  const fakeEvents = [
    {
      id: 2,
      title: "Test Email 1",
      description: "Test Description",
      startTime: "Sat Apr 22 04:00PM",
      endTime: "Sat Apr 22 05:00PM",
      room: "RM120",
      creator: "yixinsun@andrew.cmu.edu",
      guests: ["ahpatel@andrew.cmu.edu"]
    },
    {
      id: 3,
      title: "Test Email 2",
      description: "Test Description",
      startTime: "Sat Apr 22 04:00PM",
      endTime: "Sat Apr 22 05:00PM",
      room: "RM120",
      creator: "ahpatel@andrew.cmu.edu",
      guests: ["patelami3431@gmail.com"]
    },
    {
      id: 4,
      title: "Test Email 3",
      description: "Test Description",
      startTime: "Sat Apr 22 04:00PM",
      endTime: "Sat Apr 22 05:00PM",
      room: "RM120",
      creator: "ahpatel@andrew.cmu.edu",
      guests: ["patelami3431@gmail.com"]
    }
  ];

  const fakeEvents2 = [];

  return (
    <MainLayout>
      <h1 className="page-title">Upcoming Events</h1>

      {loading && <Spinner className="loading-spinner" animation="border" />}
      {!loading && (
        <div className={styles["event-container"]}>
          {fakeEvents.length === 0 && (
            <p style={{ textAlign: "center" }}>Sorry, we couldn't find any upcoming events.</p>
          )}
          {fakeEvents.length > 0 && (
            <div className={styles["event-list"]}>
              {fakeEvents?.map((event, i) => {
                return <EventCard event={event} />;
              })}
            </div>
          )}
          <p style={{ textAlign: "center" }}>
            You may want to <Link to="/addEvent">add an new event</Link>.
          </p>
        </div>
      )}
    </MainLayout>
  );
};
