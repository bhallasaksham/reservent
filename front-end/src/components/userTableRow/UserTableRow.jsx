import React, { useState, useEffect } from "react";
import { Button, Dropdown, OverlayTrigger, Tooltip, Modal } from "react-bootstrap";
import styles from "./UserTableRow.module.css";
import { PersonFillCheck } from "react-bootstrap-icons";

export const UserTableRow = ({ user, i }) => {
  const [userPrivilege, setUserPrivilege] = useState(user.privilege);
  const [curPrivilege, setCurPrivilege] = useState(user.privilege);
  const [showModal, setShowModal] = useState(false);

  const updateUser = (user, curPrivilege) => {
    // check: can not downgrade myself?
    alert(`${user.email}, ${curPrivilege}`);
    setUserPrivilege(curPrivilege);
  };

  const isDisabled = curPrivilege === userPrivilege;

  const ConditionalTooltipWrapper = ({ condition, wrapper, children }) => (condition ? wrapper(children) : children);

  return (
    <>
      <tr>
        <td>{i + 1}</td>
        <td>{user.name}</td>
        <td>{user.email}</td>
        <td>
          <Dropdown>
            <Dropdown.Toggle variant="info" className={styles["dropdown-button"]}>
              {curPrivilege}
            </Dropdown.Toggle>

            <Dropdown.Menu>
              {curPrivilege !== "admin" && (
                <Dropdown.Item onClick={() => setCurPrivilege("admin")}>admin</Dropdown.Item>
              )}
              {curPrivilege !== "staff" && (
                <Dropdown.Item onClick={() => setCurPrivilege("staff")}>staff</Dropdown.Item>
              )}
              {curPrivilege !== "user" && <Dropdown.Item onClick={() => setCurPrivilege("user")}>user</Dropdown.Item>}
            </Dropdown.Menu>
          </Dropdown>
        </td>
        <td style={{ textAlign: "right" }}>
          <ConditionalTooltipWrapper
            condition={isDisabled}
            wrapper={(children) => (
              <OverlayTrigger overlay={<Tooltip>Nothing to update</Tooltip>}>
                <span className="d-inline-block">{children}</span>
              </OverlayTrigger>
            )}
          >
            <Button variant="primary" disabled={isDisabled} onClick={() => setShowModal(true)}>
              <PersonFillCheck />
              <span>Update</span>
            </Button>
          </ConditionalTooltipWrapper>
        </td>
      </tr>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Privilege Update</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            You are going to change the privilege of <strong>{user.name}</strong> from <strong>{userPrivilege}</strong>{" "}
            to <strong>{curPrivilege}</strong>.
          </p>
          <p>Please confirm your action.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={() => updateUser(user, curPrivilege)}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
