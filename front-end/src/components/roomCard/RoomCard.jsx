import { Card, Button } from "react-bootstrap";
import styles from "./RoomCard.module.css";
import { Github } from "react-bootstrap-icons";

export const RoomCard = ({ room, chooseRoom }) => {
  return (
    <Card>
      <Card.Body>
        <Card.Title>{room.name}</Card.Title>
        <Card.Text>{room.size} people</Card.Text>
        <Button variant="primary" onClick={chooseRoom}>
          <span>Select</span>
        </Button>
      </Card.Body>
    </Card>
  );
};
