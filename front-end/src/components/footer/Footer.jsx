import { Container, Nav, Navbar } from "react-bootstrap";
import styles from "./Footer.module.css";
import { Github } from "react-bootstrap-icons";

export const Footer = () => {
  return (
    <div>
      <hr className={styles["hr"]}></hr>
      <Navbar expand="lg">
        <Container className={styles["nav-container"]}>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav>
              <Nav.Link>
                <span>SDA @Team 6</span>
              </Nav.Link>
              <Nav.Link href="https://github.com/bhallasaksham/sda-reservent-t6/">
                <Github />
                <span>GitHub</span>
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
};
