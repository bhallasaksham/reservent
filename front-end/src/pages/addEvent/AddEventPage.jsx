import React, { useState, useEffect } from "react";
import { MainLayout } from "../../layouts";
import axios from "axios";
import { Form, Button, Row, Col, Offcanvas, OverlayTrigger, Tooltip, Modal, Spinner } from "react-bootstrap";
import styles from "./AddEventPage.module.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { RoomCard, CustomBadge } from "../../components";
import {
  PlusSquare,
  PencilSquare,
  PersonPlusFill,
  CheckCircleFill,
  ArrowLeftCircleFill,
  QuestionCircle
} from "react-bootstrap-icons";
import { useHistory } from "react-router-dom";
import { getRoundedDate, addMinutes, formatTime, getDate, getTime } from "../../tools";
import { toast as customAlert } from "react-custom-alert";
import { useCookies } from "react-cookie";

export const AddEventPage = () => {
  const [title, setTitle] = useState();
  const [description, setDescription] = useState();
  const [startDate, setStartDate] = useState(new Date());
  const [startTime, setStartTime] = useState(getRoundedDate(new Date()));
  const [endTime, setEndTime] = useState(addMinutes(getRoundedDate(new Date()), 60));
  const [numOfParticipant, setNumOfParticipant] = useState();
  const [selectedRoom, setSelectedRoom] = useState();
  const [curGuest, setCurGuest] = useState("");
  const [guestList, setGuestList] = useState([]);
  const [availableRooms, setAvailableRooms] = useState([]);

  const [showSidebar, setShowSidebar] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [cookies, setCookie, removeCookie] = useCookies(["jwt_token", "refresh_token", "user_privilege"]);
  const history = useHistory();

  const searchRooms = () => {
    if (!startDate) {
      return customAlert.warning("Please choose event date");
    }
    if (!startTime) {
      return customAlert.warning("Please choose start time");
    }
    if (!endTime) {
      return customAlert.warning("Please choose end time");
    }
    if (!numOfParticipant) {
      return customAlert.warning("Please enter number of participants");
    }

    const fetchData = async () => {
      setLoading(true);
      const formattedStartTime = formatTime(startDate, startTime);
      const formattedEndTime = formatTime(startDate, endTime);
      try {
        const { data: response } = await axios.get(
          `http://0.0.0.0:1024/rooms/available?start_time=${formattedStartTime}&end_time=${formattedEndTime}&num_guests=${numOfParticipant}`,
          {
            headers: {
              Authorization: `Bearer ${cookies["jwt_token"]} ${cookies["refresh_token"]}`
            }
          }
        );
        setAvailableRooms(response);
      } catch (error) {
        console.error(error);
        return customAlert.error("Failed to get available rooms");
      }
      setLoading(false);
    };

    fetchData();

    setShowSidebar(true);
    setSelectedRoom(null);
  };

  const chooseRoom = (room) => {
    console.log("select: " + room.name);
    setSelectedRoom(room);
    setShowSidebar(false);
  };

  const deleteRoom = (room) => {
    console.log("delete: " + room.name);
    setSelectedRoom(null);
  };

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
    console.log(guestList);
  };

  const deleteGuest = (guest) => {
    setGuestList(guestList.filter((item) => item !== guest));
    console.log(guestList);
  };

  const handleSubmit = (event) => {
    event.preventDefault(); // the default action that belongs to the event will not occur - whether we need this?

    if (!title) {
      return customAlert.warning("Please enter event title");
    }
    if (!startDate) {
      return customAlert.warning("Please choose event date");
    }
    if (!startTime) {
      return customAlert.warning("Please choose start time");
    }
    if (!endTime) {
      return customAlert.warning("Please choose end time");
    }
    if (!numOfParticipant) {
      return customAlert.warning("Please enter number of participants");
    }
    if (!selectedRoom) {
      return customAlert.warning("Please choose a room");
    }

    setShowModal(true);

    console.log(
      "title: " +
        title +
        "\ndes: " +
        description +
        "\ndate: " +
        startDate +
        "\nstime: " +
        startTime +
        "\netime: " +
        endTime +
        "\nnum of p: " +
        numOfParticipant +
        "\ninvite guests: " +
        guestList +
        "\nroom: " +
        selectedRoom?.name
    );
  };

  return (
    <MainLayout>
      <h1 className="page-title">Add New Event</h1>
      <Form className={styles["add-event-form"]} onSubmit={handleSubmit}>
        <h2>Event Details</h2>
        <Form.Group className="mb-3" controlId="formTitle">
          <Form.Label>Title *</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formDescription">
          <Form.Label>Description</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Form.Group>

        <Row>
          <Col md={4}>
            <Form.Group className="mb-3" controlId="formDate">
              <Form.Label>
                Date *{" "}
                <OverlayTrigger overlay={<Tooltip>Pacific Daylight Time (PDT)</Tooltip>}>
                  <QuestionCircle />
                </OverlayTrigger>
              </Form.Label>
              <DatePicker
                className={`styles["date-picker"] form-control`}
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                isClearable
                placeholderText="Choose date (MM/DD/YYYY)"
              />
            </Form.Group>
          </Col>
          <Col md={5}>
            <Form.Group className="mb-3" controlId="formTime">
              <Form.Label>Time *</Form.Label>
              <Row>
                <Col>
                  <DatePicker
                    className={`styles["date-picker"] form-control`}
                    selected={startTime}
                    onChange={(time) => setStartTime(time)}
                    showTimeSelect
                    showTimeSelectOnly
                    isClearable
                    timeIntervals={15}
                    timeCaption="Time"
                    dateFormat="h:mm aa"
                    placeholderText="Choose start time"
                  />
                </Col>
                <Col xs="auto">
                  <span>-</span>
                </Col>
                <Col>
                  <DatePicker
                    className={`styles["date-picker"] form-control`}
                    selected={endTime}
                    onChange={(time) => setEndTime(time)}
                    showTimeSelect
                    showTimeSelectOnly
                    isClearable
                    timeIntervals={15}
                    timeCaption="Time"
                    dateFormat="h:mm aa"
                    placeholderText="Choose end time"
                  />
                </Col>
              </Row>
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={3}>
            <Form.Group className="mb-3" controlId="formNumOfParticipant">
              <Form.Label>Number of Participants *</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter number"
                value={numOfParticipant}
                onChange={(e) => setNumOfParticipant(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formRoom">
              <Form.Label>
                Room *{" "}
                <OverlayTrigger overlay={<Tooltip>To create an event, you must choose a room</Tooltip>}>
                  <QuestionCircle />
                </OverlayTrigger>
              </Form.Label>
              <div>
                {selectedRoom && (
                  <>
                    <div className={styles["room-badge-group"]}>
                      <CustomBadge content={selectedRoom.name} deleteContent={() => deleteRoom(selectedRoom)} />
                    </div>
                    <PencilSquare className={styles["search-room-button"]} onClick={searchRooms} />
                  </>
                )}
                {!selectedRoom && <PlusSquare className={styles["search-room-button"]} onClick={searchRooms} />}
              </div>
            </Form.Group>
          </Col>
          <Col>
            <Form.Group className="mb-3" controlId="formInviteGuests">
              <Form.Label>Invite Guests</Form.Label>
              <div>
                <div className={styles["input-guest-wrapper"]}>
                  <Form.Control
                    type="email"
                    placeholder="Enter email address"
                    value={curGuest}
                    onChange={(e) => setCurGuest(e.target.value)}
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
            <Button variant="danger" className={styles["form-button"]} onClick={() => history.push("/")}>
              <ArrowLeftCircleFill />
              <span>Cancel</span>
            </Button>
          </Col>
          <Col>
            <Button variant="primary" type="submit" className={styles["form-button"]}>
              <CheckCircleFill />
              <span>Confirm</span>
            </Button>
          </Col>
        </Row>
      </Form>

      <Offcanvas show={showSidebar} placement={"end"} onHide={() => setShowSidebar(false)}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Available Rooms</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {loading && <Spinner className="loading-spinner" animation="border" />}
          {!loading && (
            <>
              {availableRooms.length === 0 && (
                <>
                  <p>Sorry, we couldn't find a available room.</p>
                  <p>Please try searching for a different time period or number of participants.</p>
                </>
              )}
              {availableRooms.length > 0 &&
                availableRooms?.map((room) => <RoomCard room={room} chooseRoom={() => chooseRoom(room)} />)}
            </>
          )}
        </Offcanvas.Body>
      </Offcanvas>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Event Created</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Congrats! Your event <strong>{title}</strong> has been created.
          </p>
          <p>
            Room <strong>{selectedRoom?.name}</strong> has been reserved on <strong>{getDate(startDate)}</strong> from{" "}
            <strong>{getTime(startTime)}</strong> to <strong>{getTime(endTime)}</strong>.
          </p>
        </Modal.Body>
      </Modal>
    </MainLayout>
  );
};

// TODO: more styles on form & cards
// TODO: seperate offcanvas
