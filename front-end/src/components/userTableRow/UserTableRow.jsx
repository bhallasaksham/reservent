import React, { useState } from "react";
import { Button, Dropdown, OverlayTrigger, Tooltip, Modal } from "react-bootstrap";
import styles from "./UserTableRow.module.css";
import { PersonCheck, PersonDash } from "react-bootstrap-icons";
import { PrivilegeEnum } from "../../tools";
import { useCookies } from "react-cookie";
import jwt_decode from "jwt-decode";
import { toast as customAlert } from "react-custom-alert";
import axios from "axios";

export const UserTableRow = ({ user, i, updateTable }) => {
  const [userPrivilege, setUserPrivilege] = useState(user.privilege);
  const [curPrivilege, setCurPrivilege] = useState(user.privilege);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [cookies] = useCookies(["jwt_token", "refresh_token", "user_privilege"]);

  const isDisabled = curPrivilege === userPrivilege;
  const currentUser = cookies["jwt_token"] ? jwt_decode(cookies["jwt_token"]) : null;

  const getPrivilegeString = (privilege) => {
    return privilege === PrivilegeEnum.Admin ? "admin" : privilege === PrivilegeEnum.Staff ? "staff" : "student";
  };

  const openUpdateModal = () => {
    if (currentUser.email === user.email) {
      setCurPrivilege(userPrivilege);
      return customAlert.warning("you can't change the privilege of yourself");
    }
    setShowUpdateModal(true);
  };

  const openDeleteModal = () => {
    if (currentUser.email === user.email) {
      return customAlert.warning("you can't delete yourself");
    }
    setShowDeleteModal(true);
  };

  /*
  Update user privilege
  - Payload: target_user_email, privilege
  - Response: updated user (email, privilege)
  - Privilege: admin
  */
  const updateUser = () => {
    const updateData = async () => {
      try {
        const { data: response } = await axios.put(
          `${process.env.REACT_APP_ADMIN_SERVICE}/admin/users/privilege`,
          {
            target_user_email: user.email,
            privilege: curPrivilege
          },
          {
            headers: {
              Authorization: `Bearer ${cookies["jwt_token"]} ${cookies["refresh_token"]}`
            }
          }
        );
        setUserPrivilege(response.privilege);
        return customAlert.success("User privilege updated");
      } catch (error) {
        console.error(error);
        return customAlert.error("Failed to update user privilege");
      }
    };

    setShowUpdateModal(false);
    updateData();
  };

  /*
  Delete user
  - Payload: target_user_email
  - Privilege: admin
  */
  const deleteUser = () => {
    const deleteData = async () => {
      try {
        await axios.delete(`${process.env.REACT_APP_ADMIN_SERVICE}/admin/users`, {
          headers: {
            Authorization: `Bearer ${cookies["jwt_token"]} ${cookies["refresh_token"]}`
          },
          data: {
            target_user_email: user.email
          }
        });
        updateTable();
        return customAlert.success("User deleted");
      } catch (error) {
        console.error(error);
        return customAlert.error("Failed to delete user");
      }
    };

    setShowDeleteModal(false);
    deleteData();
  };

  // this is used to add tooltip for disabled button only
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
              <OverlayTrigger overlay={<Tooltip>Nothing to update</Tooltip>}>
                <span className="d-inline-block">{children}</span>
              </OverlayTrigger>
            )}
          >
            <Button variant="primary" disabled={isDisabled} onClick={openUpdateModal}>
              <PersonCheck />
              <span>Update</span>
            </Button>
          </ConditionalTooltipWrapper>
          <Button variant="danger" style={{ marginLeft: "1rem" }} onClick={openDeleteModal}>
            <PersonDash />
            <span>Delete</span>
          </Button>
        </td>
      </tr>

      <Modal show={showUpdateModal} onHide={() => setShowUpdateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Update User Privilege</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            You are going to change the privilege of <strong>{user.username}</strong> from{" "}
            <strong>{getPrivilegeString(userPrivilege)}</strong> to <strong>{getPrivilegeString(curPrivilege)}</strong>.
          </p>
          <p>Please confirm your action.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={() => setShowUpdateModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={updateUser}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Delete User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            You are going to delete <strong>{user.username}</strong> from the system. This action cannot be undone.
          </p>
          <p>Please confirm your action.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={deleteUser}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
