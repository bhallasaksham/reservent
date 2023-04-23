import React, { useState, useEffect } from "react";
import { MainLayout } from "../../layouts";
import axios from "axios";
import { Spinner, Button, Table, DropdownButton, Dropdown } from "react-bootstrap";
import styles from "./AdminPage.module.css";
import { useCookies } from "react-cookie";
import { PersonFillCheck } from "react-bootstrap-icons";
import { UserTableRow } from "../../components";
import { toast as customAlert } from "react-custom-alert";

export const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cookies, setCookie, removeCookie] = useCookies(["jwt_token", "refresh_token", "user_privilege"]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data: response } = await axios.get(`${process.env.REACT_APP_ADMIN_SERIVCE}/admin/users`, {
          headers: {
            Authorization: `Bearer ${cookies["jwt_token"]} ${cookies["refresh_token"]}`
          }
        });
        setUsers(response);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
        return customAlert.error("Failed to get users");
      }
    };

    fetchData();
  }, []);

  const deleteUserOnTable = (user) => {
    setUsers(users.filter((item) => item !== user));
  };

  return (
    <MainLayout>
      <h1 className="page-title">Users</h1>

      {loading && <Spinner className="loading-spinner" animation="border" />}
      {!loading && (
        <Table className={styles["user-table"]} hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email Address</th>
              <th>Privilege</th>
              <th width="25%"></th>
            </tr>
          </thead>
          <tbody>
            {users?.map((user, i) => (
              <UserTableRow user={user} i={i} updateTable={() => deleteUserOnTable(user)} />
            ))}
          </tbody>
        </Table>
      )}
    </MainLayout>
  );
};
