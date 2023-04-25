import { Card, Button } from "react-bootstrap";
import styles from "./RoomCard.module.css";

export const RoomCard = ({ room, chooseRoom }) => {
  return (
    <Card className={styles["room-card"]}>
      <Card.Body>
        <Card.Title>{room.name}</Card.Title>
        <Card.Text>{room.capacity} people</Card.Text>
        <Button variant="primary" onClick={chooseRoom}>
          <span>Select</span>
        </Button>
      </Card.Body>
    </Card>
  );
};
