import { Container, Nav, Navbar } from "react-bootstrap";
import { CalendarWeek } from "react-bootstrap-icons";
import styles from "./Header.module.css";
import { Button } from "react-bootstrap";
import { useCookies } from "react-cookie";
import { Redirect, useHistory } from "react-router-dom";

export const Header = () => {
  const [cookies, setCookie, removeCookie] = useCookies([
    "jwt_token",
    "refresh_token",
  ]);
  const history = useHistory();

  const handleSignIn = () => {
    history.push("/signIn");
  };

  const handleSignOut = () => {
    removeCookie("jwt_token");
    removeCookie("refresh_token");
    history.push("/signIn");
  };

  return (
    <Navbar className={styles["header"]} expand="lg">
      <Container className={styles["nav-container"]}>
        <Navbar.Brand className={styles["brand"]} href="/">
          <CalendarWeek />
          <span>Reservent</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav>
            <Nav.Link href="/">
              <span>Home</span>
            </Nav.Link>
            <Nav.Link href="/addEvent">
              <span>Event</span>
            </Nav.Link>
            <Nav.Link href="/admin">
              <span>Users</span>
            </Nav.Link>
          </Nav>
          <div>
            <Button variant="outline-primary" onClick={handleSignIn}>
              <span>Sign In</span>
            </Button>
            <span> </span>
            <Button variant="outline-primary" onClick={handleSignOut}>
              <span>Sign Out</span>
            </Button>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
