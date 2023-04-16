import { Container, Nav, Navbar } from "react-bootstrap";
import { CalendarWeek } from "react-bootstrap-icons";
import styles from "./Header.module.css";
import { Button } from "react-bootstrap";
import { useCookies } from "react-cookie";
import { Redirect, useHistory } from "react-router-dom";
import jwt_decode from "jwt-decode";
import logo from "../../assets/reservent.svg";

export const Header = () => {
  const [cookies, setCookie, removeCookie] = useCookies(["jwt_token", "refresh_token"]);
  const history = useHistory();

  const handleSignIn = () => {
    history.push("/signIn");
  };

  const handleSignOut = () => {
    removeCookie("jwt_token");
    removeCookie("refresh_token");
    history.push("/signIn");
  };

  const isAuthenticated = cookies["jwt_token"] && cookies["refresh_token"];
  const isAdmin = cookies["jwt_token"] && cookies["refresh_token"]; // TODO: update for admin
  const currentUser = cookies["jwt_token"] ? jwt_decode(cookies["jwt_token"]) : null;

  return (
    <Navbar className={styles["header"]} variant="dark" expand="md">
      <Container fluid className={styles["nav-container"]}>
        <Navbar.Brand className={styles["brand"]} href="/">
          <img src={logo} className={styles["brand-icon"]} />
          <span>Reservent</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav>
            <Nav.Item className={styles["main-nav"]}>
              <Nav.Link href="/">
                <span>Home</span>
              </Nav.Link>
            </Nav.Item>
            {isAuthenticated && (
              <Nav.Item className={styles["main-nav"]}>
                <Nav.Link href="/addEvent">
                  <span>Event</span>
                </Nav.Link>
              </Nav.Item>
            )}
            {isAdmin && (
              <Nav.Item className={styles["main-nav"]}>
                <Nav.Link href="/admin">
                  <span>Users</span>
                </Nav.Link>
              </Nav.Item>
            )}
          </Nav>
        </Navbar.Collapse>
        <div className={styles["login-wrapper"]}>
          {isAuthenticated && (
            <>
              <span>Hi, {currentUser.name}</span>
              <Button variant="error" className={styles["login-button"]} onClick={handleSignOut}>
                Sign Out
              </Button>
            </>
          )}
          {!isAuthenticated && (
            <Button variant="success" className={styles["login-button"]} onClick={handleSignIn}>
              Sign In
            </Button>
          )}
        </div>
      </Container>
    </Navbar>
  );
};
