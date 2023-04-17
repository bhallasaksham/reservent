import React, { useState, useEffect } from "react";
import { Button, Dropdown, OverlayTrigger, Tooltip, Modal } from "react-bootstrap";
import styles from "./UserTableRow.module.css";
import { PersonFillCheck } from "react-bootstrap-icons";
import { PrivilegeEnum } from "../../tools";

export const UserTableRow = ({ user, i }) => {
  const [userPrivilege, setUserPrivilege] = useState(user.privilege);
  const [curPrivilege, setCurPrivilege] = useState(user.privilege);
  const [showModal, setShowModal] = useState(false);

  const updateUser = (user, curPrivilege) => {
    // check: can not downgrade myself?
    alert(`${user.email}, ${curPrivilege}`);
    setUserPrivilege(curPrivilege);
    setShowModal(false);
  };

  const getPrivilegeString = (privilege) => {
    return privilege === PrivilegeEnum.Admin ? "admin" : privilege === PrivilegeEnum.Staff ? "staff" : "student";
  };

  const isDisabled = curPrivilege === userPrivilege;

  const ConditionalTooltipWrapper = ({ condition, wrapper, children }) => (condition ? wrapper(children) : children);

  return (
    <>
      <tr>
        <td>{i + 1}</td>
        <td>{user.username}</td>
        <td>{user.email}</td>
        <td>
          <Dropdown>
            <Dropdown.Toggle variant="info" className={styles["dropdown-button"]}>
              {getPrivilegeString(curPrivilege)}
            </Dropdown.Toggle>

            <Dropdown.Menu>
              {curPrivilege !== PrivilegeEnum.Admin && (
                <Dropdown.Item onClick={() => setCurPrivilege(PrivilegeEnum.Admin)}>admin</Dropdown.Item>
              )}
              {curPrivilege !== PrivilegeEnum.Staff && (
                <Dropdown.Item onClick={() => setCurPrivilege(PrivilegeEnum.Staff)}>staff</Dropdown.Item>
              )}
              {curPrivilege !== PrivilegeEnum.Student && (
                <Dropdown.Item onClick={() => setCurPrivilege(PrivilegeEnum.Student)}>student</Dropdown.Item>
              )}
            </Dropdown.Menu>
          </Dropdown>
        </td>
        <td style={{ textAlign: "right" }}>
          <ConditionalTooltipWrapper
            condition={isDisabled}
            wrapper={(children) => (
              <OverlayTrigger overlay={<Tooltip>Priviledge doesn't change</Tooltip>}>
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
            You are going to change the privilege of <strong>{user.username}</strong> from{" "}
            <strong>{getPrivilegeString(userPrivilege)}</strong> to <strong>{getPrivilegeString(curPrivilege)}</strong>.
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
