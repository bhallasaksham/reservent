import { Form, Row, Col, OverlayTrigger, Tooltip } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { QuestionCircle } from "react-bootstrap-icons";

export const TimeRangePicker = ({ startDate, startTime, endTime, setStartDate, setStartTime, setEndTime }) => {
  return (
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
            className="form-control"
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
                className="form-control"
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
                className="form-control"
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
  );
};
