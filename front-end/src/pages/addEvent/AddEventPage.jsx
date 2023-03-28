import React, { useState, useEffect } from "react";
import { MainLayout } from "../../layouts";
import axios from "axios";
import { Form, Button, Row, Col } from "react-bootstrap";
import styles from "./AddEventPage.module.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export const AddEventPage = () => {
  const getRoundedDate = (date) => {
    const coeff = 1000 * 60 * 30; // 30 minutes
    const roundedDate = new Date(Math.ceil(date.getTime() / coeff) * coeff); // round up to the nearest 30 minutes
    return roundedDate;
  };

  const addMinutes = (date, diff) => {
    const coeff = 1000 * 60; // 1 minute
    return new Date(date.getTime() + diff * coeff);
  };

  const [title, setTitle] = useState();
  const [description, setDescription] = useState();
  const [startDate, setStartDate] = useState(new Date());
  const [startTime, setStartTime] = useState(getRoundedDate(new Date()));
  const [endTime, setEndTime] = useState(
    addMinutes(getRoundedDate(new Date()), 60)
  );
  const [numOfParticipant, setNumOfParticipant] = useState();

  const handleSubmit = (event) => {
    event.preventDefault(); // the default action that belongs to the event will not occur - whether we need this?

    //reset the values of input fields ?

    alert(
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
        "\nnum: " +
        numOfParticipant
    );
  };

  return (
    <MainLayout>
      <h1 className="page-title">Add New Event</h1>
      <Form className={styles["add-event-form"]} onSubmit={handleSubmit}>
        <h2>Event Details</h2>
        <Form.Group className="mb-3" controlId="formTitle">
          <Form.Label>Title</Form.Label>
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
              <Form.Label>Date</Form.Label>
              <DatePicker
                className={`styles["date-picker"] form-control`}
                showIcon
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                isClearable
                placeholderText="Choose date (MM/DD/YYYY)"
              />
            </Form.Group>
          </Col>
          <Col md={5}>
            <Form.Group className="mb-3" controlId="formTime">
              <Form.Label>Time</Form.Label>
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
        {/* <div className={styles["note-info"]}>Based on Pacific Time</div> */}

        <Form.Group className="mb-3" controlId="formNumOfParticipant">
          <Form.Label>Number of Participants</Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter number of participants"
            value={numOfParticipant}
            onChange={(e) => setNumOfParticipant(e.target.value)}
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          <span>Search Rooms</span>
        </Button>
      </Form>
    </MainLayout>
  );
};

// TODO: more styles on form & cards
// TODO: find a better waty for note-info
// TODO: handle required fields
