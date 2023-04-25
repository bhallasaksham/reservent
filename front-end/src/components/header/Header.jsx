import { Container, Nav, Navbar } from "react-bootstrap";
import styles from "./Header.module.css";
import { Button } from "react-bootstrap";
import { useCookies } from "react-cookie";
import { useHistory } from "react-router-dom";
import jwt_decode from "jwt-decode";
import logo from "../../assets/reservent.svg";
import axios from "axios";
import { toast as customAlert } from "react-custom-alert";
import { PrivilegeEnum } from "../../tools";

export const Header = () => {
  const [cookies, setCookie, removeCookie] = useCookies(["jwt_token", "refresh_token", "user_privilege"]);
  const history = useHistory();

  const handleSignIn = () => {
    history.push("/signIn");
  };

  /*
  User Sign out 
  Remove cookies and redirect to sign in page
  */
  const handleSignOut = () => {
    const logOut = async () => {
      try {
        await axios.get(`${process.env.REACT_APP_USER_MANAGEMENT_SERVICE}/logout`, {
          headers: {
            Authorization: `Bearer ${cookies["jwt_token"]} ${cookies["refresh_token"]}`
          }
        });
        removeCookie("jwt_token");
        removeCookie("refresh_token");
        removeCookie("user_privilege");
        history.push("/signIn");
      } catch (error) {
        console.error(error);
        return customAlert.error("Failed to sign out");
      }
    };

    logOut();
  };

  const isAuthenticated = cookies["jwt_token"] && cookies["refresh_token"] && cookies["user_privilege"];
  const isAdmin = cookies["jwt_token"] && cookies["refresh_token"] && cookies["user_privilege"] == PrivilegeEnum.Admin; // "1" == 1
  const currentUser = cookies["jwt_token"] ? jwt_decode(cookies["jwt_token"]) : null;

  return (
    <Navbar className={styles["header"]} variant="dark" expand="md">
      <Container fluid className={styles["nav-container"]}>
        <Navbar.Brand className={styles["brand"]} href="/">
          <img src={logo} className={styles["brand-icon"]} alt="reservent icon" />
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
                <Nav.Link href="/event">
                  <span>Events</span>
                </Nav.Link>
              </Nav.Item>
            )}
            {isAuthenticated && (
              <Nav.Item className={styles["main-nav"]}>
                <Nav.Link href="/addEvent">
                  <span>Add Event</span>
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
