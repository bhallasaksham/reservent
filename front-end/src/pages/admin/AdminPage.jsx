import React, { useState, useEffect } from "react";
import { MainLayout } from "../../layouts";
import axios from "axios";
import {
  Spinner,
  Button,
  Table,
  DropdownButton,
  Dropdown,
} from "react-bootstrap";
import styles from "./AdminPage.module.css";
import { useCookies } from "react-cookie";
import { PersonFillCheck } from "react-bootstrap-icons";

export const AdminPage = () => {
  const [content, setContent] = useState();
  const [loading, setLoading] = useState(true);

  const [cookies, setCookie, removeCookie] = useCookies([
    "jwt_token",
    "refresh_token",
  ]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data: response } = await axios.get(
          "http://0.0.0.0:4000",
          {
            headers: {
              Authorization: `bearer ${cookies["jwt_token"]} ${cookies["refresh_token"]}`,
            },
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
      privilege: "admin",
    },
    {
      name: "Brittany Bristoll",
      email: "brittanyjade@andrew.cmu.edu",
      privilege: "staff",
    },
    {
      name: "Yixin Sun",
      email: "yixinsun@andrew.cmu.edu",
      privilege: "user",
    },
  ];

  return (
    <MainLayout>
      <h1 className="page-title">Users</h1>

      <Table className={styles["user-table"]} hover>
        <thead>
          <tr>
            <th style={{ width: "5%" }}>#</th>
            <th style={{ width: "30%" }}>Name</th>
            <th style={{ width: "40%" }}>Email Address</th>
            <th style={{ width: "15%" }}>Privilege</th>
            <th style={{ width: "10%" }}></th>
          </tr>
        </thead>
        <tbody>
          {fakeUserList?.map((user, i) => (
            <tr>
              <td>{i + 1}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>
                <DropdownButton variant="info" title={user.privilege}>
                  {user.privilege !== "admin" && (
                    <Dropdown.Item onClick={() => (user.privilege = "admin")}>
                      Admin
                    </Dropdown.Item>
                  )}
                  {user.privilege !== "staff" && (
                    <Dropdown.Item onClick={() => (user.privilege = "staff")}>
                      Staff
                    </Dropdown.Item>
                  )}
                  {user.privilege !== "user" && (
                    <Dropdown.Item onClick={() => (user.privilege = "user")}>
                      User
                    </Dropdown.Item>
                  )}
                </DropdownButton>
              </td>
              <td>
                <Button
                  variant="primary"
                  // onClick={}
                >
                  <PersonFillCheck />
                  <span>Update</span>
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </MainLayout>
  );
};
