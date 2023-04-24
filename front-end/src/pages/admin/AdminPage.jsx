import React, { useState, useEffect } from "react";
import { MainLayout } from "../../layouts";
import axios from "axios";
import { Spinner, Table } from "react-bootstrap";
import styles from "./AdminPage.module.css";
import { useCookies } from "react-cookie";
import { UserTableRow } from "../../components";
import { toast as customAlert } from "react-custom-alert";

export const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cookies] = useCookies(["jwt_token", "refresh_token", "user_privilege"]);

  /*
  Get all users
  - Response: array of users (name, email, privilege)
  - Privilege: admin
  */
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data: response } = await axios.get(`${process.env.REACT_APP_ADMIN_SERVICE}/admin/users`, {
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
  }, [cookies]);

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
