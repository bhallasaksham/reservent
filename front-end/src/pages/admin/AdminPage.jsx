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
  const [loading, setLoading] = useState(true);
  const [cookies, setCookie, removeCookie] = useCookies(["jwt_token", "refresh_token", "user_privilege"]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data: response } = await axios.get("http://0.0.0.0:9000/admin/users", {
          headers: {
            Authorization: `bearer ${cookies["jwt_token"]} ${cookies["refresh_token"]}`
          }
        });
        setUsers(response);
      } catch (error) {
        console.error(error);
        return customAlert.error("Failed to get users");
      }
      setLoading(false);
    };

    fetchData();
  }, []);

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
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users?.map((user, i) => (
              <UserTableRow user={user} i={i} />
            ))}
          </tbody>
        </Table>
      )}
    </MainLayout>
  );
};
