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
  const [loading, setLoading] = useState(false);
  const [cookies, setCookie, removeCookie] = useCookies(["jwt_token", "refresh_token", "user_privilege"]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data: response } = await axios.get(`${process.env.REACT_APP_ROOM_RESERVATION_FACADE}/events`, {
          headers: {
            Authorization: `Bearer ${cookies["jwt_token"]} ${cookies["refresh_token"]}`
          }
        });
        setEvents(response);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
        return customAlert.error("Failed to get events");
      }
    };

    fetchData();
  }, []);

  const formatEvent = (event) => {
    // console.log(event.guests.filter((item) => item !== event?.creator))
    event.guests = event.guests.filter((item) => item.trim() !== event?.creator);
    return event;
  }

  const deleteEventInList = (event) => {
    setEvents(events.filter((item) => item !== event));
  };

  // const fakeEvents = [
  //   {
  //     id: 2,
  //     title: "Test Email 1",
  //     description: "Test Description",
  //     startTime: "Sat Apr 22 04:00PM",
  //     endTime: "Sat Apr 22 05:00PM",
  //     room: "RM120",
  //     creator: "yixinsun@andrew.cmu.edu",
  //     guests: ["ahpatel@andrew.cmu.edu"]
  //   },
  //   {
  //     id: 3,
  //     title: "Test Email 2",
  //     description: "Test Description",
  //     startTime: "Sat Apr 22 04:00PM",
  //     endTime: "Sat Apr 22 05:00PM",
  //     room: "RM120",
  //     creator: "ahpatel@andrew.cmu.edu",
  //     guests: ["patelami3431@gmail.com"]
  //   },
  //   {
  //     id: 4,
  //     title: "Test Email 3",
  //     description: "Test Description",
  //     startTime: "Sat Apr 22 04:00PM",
  //     endTime: "Sat Apr 22 05:00PM",
  //     room: "RM120",
  //     creator: "ahpatel@andrew.cmu.edu",
  //     guests: ["patelami3431@gmail.com"]
  //   }
  // ];

  // const fakeEvents2 = [];

  return (
    <MainLayout>
      <h1 className="page-title">Upcoming Events</h1>

      {loading && <Spinner className="loading-spinner" animation="border" />}
      {!loading && (
        <div className={styles["event-container"]}>
          {events.length === 0 && <p style={{ textAlign: "center" }}>Sorry, we couldn't find any upcoming events.</p>}
          {events.length > 0 && (
            <div className={styles["event-list"]}>
              {events?.map((event, i) => (
                <EventCard event={formatEvent(event)} updateCardList={deleteEventInList} />
              ))}
            </div>
          )}
          <p style={{ textAlign: "center" }}>
            You may want to <Link to="/addEvent">add a new event</Link>.
          </p>
        </div>
      )}
    </MainLayout>
  );
};
