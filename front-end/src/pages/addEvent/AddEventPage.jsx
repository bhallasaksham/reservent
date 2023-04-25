import React, { useState } from "react";
import { MainLayout } from "../../layouts";
import axios from "axios";
import { Form, Button, Row, Col, OverlayTrigger, Tooltip, Modal, Spinner } from "react-bootstrap";
import styles from "./AddEventPage.module.css";
import { CustomBadge, TimeRangePicker, RoomPicker } from "../../components";
import { PersonPlusFill, CheckCircle, ArrowLeftCircle, QuestionCircle } from "react-bootstrap-icons";
import { useHistory } from "react-router-dom";
import { getRoundedDate, addMinutes, formatTime, getDate, getTime, checkTime } from "../../tools";
import { toast as customAlert } from "react-custom-alert";
import { useCookies } from "react-cookie";

export const AddEventPage = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [startTime, setStartTime] = useState(getRoundedDate(new Date()));
  const [endTime, setEndTime] = useState(addMinutes(getRoundedDate(new Date()), 60));
  const [numOfParticipant, setNumOfParticipant] = useState("");
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [curGuest, setCurGuest] = useState("");
  const [guestList, setGuestList] = useState([]);
  const [createdEvent, setCreatedEvent] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cookies] = useCookies(["jwt_token", "refresh_token", "user_privilege"]);
  const history = useHistory();

  const addGuest = (guest) => {
    if (curGuest !== "") {
      setCurGuest("");
      if (!/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(guest)) {
        return customAlert.warning("Please enter a valid email address");
      }
      if (guestList.includes(guest)) {
        return customAlert.warning(`You have already invited ${guest}`);
      }
      guestList.push(guest);
      setGuestList(guestList);
    }
  };

  const handleEnterKey = (event, guest) => {
    if (event.keyCode === 13) {
      addGuest(guest);
    }
  };

  const deleteGuest = (guest) => {
    setGuestList(guestList.filter((item) => item !== guest));
  };

  /*
  Create event and reserve room
  - Payload: title, description (optional), start_time, end_time, guests (optional), room, room_url
  - Privilege: all
  */
  const handleSubmit = () => {
    const reserveRoom = async () => {
      setLoading(true);
      const formattedStartTime = formatTime(startDate, startTime);
      const formattedEndTime = formatTime(startDate, endTime);
      const formattedGuestList = guestList.length > 0 ? guestList.toString() : null;
      try {
        await axios.post(
          `${process.env.REACT_APP_ROOM_RESERVATION_FACADE}/rooms/reserve`,
          {
            title: title,
            description: description ? description : null,
            start_time: formattedStartTime,
            end_time: formattedEndTime,
            guests: formattedGuestList,
            room: selectedRoom?.name,
            room_url: selectedRoom?.calendar_id
          },
          {
            headers: {
              Authorization: `Bearer ${cookies["jwt_token"]} ${cookies["refresh_token"]}`
            }
          }
        );
        setCreatedEvent({
          title: title,
          startDate: startDate,
          startTime: startTime,
          endTime: endTime,
          room: selectedRoom?.name
        });
        setLoading(false);
        setShowModal(true);
        clearForm();
      } catch (error) {
        console.error(error);
        setLoading(false);
        return customAlert.error("Failed to create event");
      }
    };

    if (!title) {
      return customAlert.warning("Please enter event title");
    }
    if (!selectedRoom) {
      return customAlert.warning("Please choose a room");
    }
    if (checkTime(startDate, startTime, endTime)) {
      reserveRoom();
    }
  };

  const clearForm = () => {
    setTitle("");
    setDescription("");
    setStartDate(new Date());
    setStartTime(getRoundedDate(new Date()));
    setEndTime(addMinutes(getRoundedDate(new Date()), 60));
    setNumOfParticipant("");
    setSelectedRoom(null);
    setCurGuest("");
    setGuestList([]);
  };

  return (
    <MainLayout>
      <h1 className="page-title">Add New Event</h1>
      <Form className={styles["add-event-form"]}>
        <h2>Event Details</h2>
        <p className={styles["note-info"]}>Fields marked with * are mandatory</p>
        <Form.Group className="mb-3" controlId="formTitle">
          <Form.Label>Title *</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autocomplete="off"
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formDescription">
          <Form.Label>Description</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            autocomplete="off"
          />
        </Form.Group>

        <TimeRangePicker
          startDate={startDate}
          startTime={startTime}
          endTime={endTime}
          setStartDate={setStartDate}
          setStartTime={setStartTime}
          setEndTime={setEndTime}
        />

        <Row>
          <Col md={3}>
            <Form.Group className="mb-3" controlId="formNumOfParticipant">
              <Form.Label>Number of Participants</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter number"
                value={numOfParticipant}
                onChange={(e) => setNumOfParticipant(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formRoom">
              <Form.Label>Room *</Form.Label>
              <RoomPicker
                startDate={startDate}
                startTime={startTime}
                endTime={endTime}
                numOfParticipant={numOfParticipant}
                selectedRoom={selectedRoom}
                setSelectedRoom={setSelectedRoom}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group className="mb-3" controlId="formInviteGuests">
              <Form.Label>
                Invite Guests{" "}
                <OverlayTrigger
                  overlay={<Tooltip>Once event created, we will send email notifications to your guests</Tooltip>}
                >
                  <QuestionCircle />
                </OverlayTrigger>
              </Form.Label>
              <div>
                <div className={styles["input-guest-wrapper"]}>
                  <Form.Control
                    type="email"
                    placeholder="Enter email address"
                    value={curGuest}
                    onChange={(e) => setCurGuest(e.target.value)}
                    onKeyUp={(e) => handleEnterKey(e, curGuest)}
                  />
                  <PersonPlusFill className={styles["add-guest-button"]} onClick={() => addGuest(curGuest)} />
                </div>
              </div>
              <div className={styles["guest-badge-group"]}>
                {guestList?.map((guest) => (
                  <CustomBadge content={guest} deleteContent={() => deleteGuest(guest)} />
                ))}
              </div>
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col>
            <Button variant="danger" className={styles["form-button"]} onClick={() => history.push("/event")}>
              <ArrowLeftCircle />
              <span>Cancel</span>
            </Button>
          </Col>
          <Col>
            <Button variant="primary" type="button" className={styles["form-button"]} onClick={handleSubmit}>
              {loading && <Spinner animation="grow" size="sm" />}
              {!loading && (
                <>
                  <CheckCircle />
                  <span>Create</span>
                </>
              )}
            </Button>
          </Col>
        </Row>
      </Form>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Event Created</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Congrats! Your event <strong>{createdEvent?.title}</strong> has been created.
          </p>
          <p>
            Room <strong>{createdEvent?.room}</strong> has been reserved on{" "}
            <strong>{getDate(createdEvent?.startDate)}</strong> from <strong>{getTime(createdEvent?.startTime)}</strong>{" "}
            to <strong>{getTime(createdEvent?.endTime)}</strong>.
          </p>
        </Modal.Body>
      </Modal>
    </MainLayout>
  );
};
