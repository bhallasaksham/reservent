import React, { useState, useEffect } from "react";
import { MainLayout } from "../../layouts";
import axios from "axios";
import { Spinner } from "react-bootstrap";
import styles from "./EventPage.module.css";
import { useCookies } from "react-cookie";
import { EventCard } from "../../components";
import { toast as customAlert } from "react-custom-alert";
import { Link } from "react-router-dom";

export const EventPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cookies] = useCookies(["jwt_token", "refresh_token", "user_privilege"]);

  /*
  Get events
  - Response: array of events (id, title, description, startTime, endTime, room, creator, guests)
  - Privilege: for student, only get events created by students; for staff/admin, get all events 
  */
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
  }, [cookies]);

  const formatEvent = (event) => {
    event.guests = event.guests.filter((item) => item.trim() !== event?.creator);
    return event;
  };

  const deleteEventInList = (event) => {
    setEvents(events.filter((item) => item !== event));
  };


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
                <EventCard event={formatEvent(event)} updateCardList={() => deleteEventInList(event)} />
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
