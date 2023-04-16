import React, { useState, useEffect } from "react";
import { MainLayout } from "../../layouts";
import axios from "axios";
import { Spinner, Button, Table, DropdownButton, Dropdown } from "react-bootstrap";
import styles from "./AdminPage.module.css";
import { useCookies } from "react-cookie";
import { PersonFillCheck } from "react-bootstrap-icons";
import { UserTableRow } from "../../components";

export const AdminPage = () => {
  const [content, setContent] = useState();
  const [loading, setLoading] = useState(true);

  const [cookies, setCookie, removeCookie] = useCookies(["jwt_token", "refresh_token"]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data: response } = await axios.get(
          "http://0.0.0.0:4000",
          {
            headers: {
              Authorization: `bearer ${cookies["jwt_token"]} ${cookies["refresh_token"]}`
            }
          }
          // {
          //   withCredentials: true,
          // }
        );
        setContent(response["message"]);
        // const responseJSON = JSON.parse(response);
        // setContent(responseJSON["message"]);
      } catch (error) {
        console.error(error);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  const fakeUserList = [
    {
      name: "Hakan Erdogmus",
      email: "hakane@andrew.cmu.edu",
      privilege: "admin"
    },
    {
      name: "Brittany Bristoll",
      email: "brittanyjade@andrew.cmu.edu",
      privilege: "staff"
    },
    {
      name: "Yixin Sun",
      email: "yixinsun@andrew.cmu.edu",
      privilege: "user"
    }
  ];

  return (
    <MainLayout>
      <h1 className="page-title">Users</h1>

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
          {fakeUserList?.map((user, i) => (
            <UserTableRow user={user} i={i} />
          ))}
        </tbody>
      </Table>
    </MainLayout>
  );
};
