import React, { useState } from "react";
import { Offcanvas, OverlayTrigger, Tooltip, Spinner } from "react-bootstrap";
import styles from "./RoomPicker.module.css";
import axios from "axios";
import { formatTime, checkTime } from "../../tools";
import { toast as customAlert } from "react-custom-alert";
import { RoomCard, CustomBadge } from "../../components";
import { useCookies } from "react-cookie";
import { PlusSquare, PencilSquare } from "react-bootstrap-icons";

export const RoomPicker = ({ startDate, startTime, endTime, numOfParticipant, selectedRoom, setSelectedRoom }) => {
  const [availableRooms, setAvailableRooms] = useState([]);

  const [showSidebar, setShowSidebar] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cookies] = useCookies(["jwt_token", "refresh_token", "user_privilege"]);

  /*
  Get available rooms
  - QueryParam: start_time, end_time, num_guests (optional)
  - Response: array of rooms (name, capacity, room_url)
  - Privilege: for student, only get small rooms; for staff/admin, get all rooms 
  */
  const searchRooms = () => {
    const fetchData = async () => {
      setLoading(true);
      const formattedStartTime = formatTime(startDate, startTime);
      const formattedEndTime = formatTime(startDate, endTime);
      try {
        const queryParams =
          `start_time=${formattedStartTime}&end_time=${formattedEndTime}` +
          (numOfParticipant > 0 ? `&num_guests=${numOfParticipant}` : "");
        const { data: response } = await axios.get(
          `${process.env.REACT_APP_ROOM_RESERVATION_FACADE}/rooms/available?${queryParams}`,
          {
            headers: {
              Authorization: `Bearer ${cookies["jwt_token"]} ${cookies["refresh_token"]}`
            }
          }
        );
        setAvailableRooms(response);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setShowSidebar(false);
        setLoading(false);
        return customAlert.error("Failed to get available rooms");
      }
    };

    if (checkTime(startDate, startTime, endTime)) {
      fetchData();
      setShowSidebar(true);
      setSelectedRoom(null);
    }
  };

  const chooseRoom = (room) => {
    setSelectedRoom(room);
    setShowSidebar(false);
    setAvailableRooms([]);
  };

  const deleteRoom = () => {
    setSelectedRoom(null);
  };

  return (
    <>
      <div>
        {selectedRoom && (
          <>
            <div className={styles["room-badge-group"]}>
              <CustomBadge content={selectedRoom.name} deleteContent={() => deleteRoom()} />
            </div>
            <PencilSquare className={styles["search-room-button"]} onClick={searchRooms} />
          </>
        )}
        {!selectedRoom && (
          <OverlayTrigger overlay={<Tooltip>Click to search available rooms</Tooltip>}>
            <PlusSquare className={styles["search-room-button"]} onClick={searchRooms} />
          </OverlayTrigger>
        )}
      </div>

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
    </>
  );
};
