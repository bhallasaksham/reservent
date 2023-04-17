import React, { useState, useEffect } from "react";
import { Button, Dropdown, OverlayTrigger, Tooltip, Modal } from "react-bootstrap";
import styles from "./UserTableRow.module.css";
import { PersonFillCheck } from "react-bootstrap-icons";
import { PrivilegeEnum } from "../../tools";
import { useCookies } from "react-cookie";
import jwt_decode from "jwt-decode";
import { toast as customAlert } from "react-custom-alert";
import axios from "axios";

export const UserTableRow = ({ user, i }) => {
  const [userPrivilege, setUserPrivilege] = useState(user.privilege);
  const [curPrivilege, setCurPrivilege] = useState(user.privilege);
  const [showModal, setShowModal] = useState(false);
  const [cookies, setCookie, removeCookie] = useCookies(["jwt_token", "refresh_token", "user_privilege"]);

  const isDisabled = curPrivilege === userPrivilege;
  const currentUser = cookies["jwt_token"] ? jwt_decode(cookies["jwt_token"]) : null;

  const getPrivilegeString = (privilege) => {
    return privilege === PrivilegeEnum.Admin ? "admin" : privilege === PrivilegeEnum.Staff ? "staff" : "student";
  };

  const openModal = () => {
    if (currentUser.email === user.email) {
      setCurPrivilege(userPrivilege);
      return customAlert.warning("you can't change the privilege of yourself");
    }
    setShowModal(true);
  };

  const updateUser = () => {
    const updateData = async () => {
      try {
        const { data: response } = await axios.put(
          "http://0.0.0.0:9000/admin/users/privilege",
          {
            target_user_email: user.email,
            privilege: curPrivilege
          },
          {
            headers: {
              Authorization: `bearer ${cookies["jwt_token"]} ${cookies["refresh_token"]}`
            }
          }
        );
        setUserPrivilege(curPrivilege);
        return customAlert.success("User privilege updated");
      } catch (error) {
        console.error(error);
        return customAlert.error("Failed to update user privilege");
      }
    };

    setShowModal(false);
    updateData();
  };

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
              <OverlayTrigger overlay={<Tooltip>Privilege doesn't change</Tooltip>}>
                <span className="d-inline-block">{children}</span>
              </OverlayTrigger>
            )}
          >
            <Button variant="primary" disabled={isDisabled} onClick={openModal}>
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
          <Button variant="primary" onClick={updateUser}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
