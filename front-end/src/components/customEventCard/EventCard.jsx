import React, { useState } from "react";
import { Card, Button, Modal } from "react-bootstrap";
import styles from "./EventCard.module.css";
import { TextLeft, PersonCircle, People, Clock, DoorOpen } from "react-bootstrap-icons";
import { useCookies } from "react-cookie";
import jwt_decode from "jwt-decode";
import axios from "axios";
import { toast as customAlert } from "react-custom-alert";

export const EventCard = ({ event, updateCardList }) => {
  const [showModal, setShowModal] = useState(false);
  const [cookies] = useCookies(["jwt_token", "refresh_token", "user_privilege"]);

  const currentUser = cookies["jwt_token"] ? jwt_decode(cookies["jwt_token"]) : null;
  const isCurrentUser = currentUser.email === event.creator;

  const getTimeString = (startTime, endTime) => {
    return startTime.slice(0, 10) + ", " + startTime.slice(11, 18) + " - " + endTime.slice(11, 18);
  };

  const getGuestString = (guests) => {
    return guests.join(", ");
  };

  /*
  Delete event
  - QureyParam: event id
  - Privilege: users can only delete their own events
  */
  const deleteEvent = () => {
    const deleteData = async () => {
      try {
        await axios.delete(`${process.env.REACT_APP_ROOM_RESERVATION_FACADE}/events/${event.id}`, {
          headers: {
            Authorization: `Bearer ${cookies["jwt_token"]} ${cookies["refresh_token"]}`
          }
        });
        updateCardList();
        return customAlert.success("Event deleted");
      } catch (error) {
        console.error(error);
        return customAlert.error("Failed to delete event");
      }
    };

    setShowModal(false);
    deleteData();
  };

  return (
    <>
      <Card className={styles["event-card"]}>
        <Card.Body>
          <Card.Title>{event.title}</Card.Title>
          <Card.Text>
            <div>
              {event.description && (
                <div>
                  <TextLeft /> <span>{event.description}</span>
                </div>
              )}
              <div>
                <Clock /> <span>{getTimeString(event.startTime, event.endTime)}</span>
              </div>
              <div>
                <DoorOpen /> <span>{event.room}</span>
              </div>
              <div>
                <PersonCircle />{" "}
                <span>
                  {event.creator} {isCurrentUser && "(you)"}
                </span>
              </div>
              {event.guests?.length > 0 && (
                <div>
                  <People /> <span>{getGuestString(event.guests)}</span>
                </div>
              )}
            </div>
          </Card.Text>
          {isCurrentUser && (
            <Button variant="danger" onClick={() => setShowModal(true)}>
              Delete Event
            </Button>
          )}
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Event</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            You are going to delete event <strong>{event.title}</strong> from the system. This action cannot be undone.
          </p>
          <p>Please confirm your action.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={deleteEvent}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
