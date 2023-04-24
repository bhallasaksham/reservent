import { Nav } from "react-bootstrap";
import styles from "./Footer.module.css";
import { Github } from "react-bootstrap-icons";

export const Footer = () => {
  return (
    <div>
      <hr className={styles["hr"]}></hr>
      <Nav className="justify-content-center">
        <Nav.Item>
          <Nav.Link active={false}>
            <span>SDA @Team 6</span>
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link href="https://github.com/cmusv-sasd/sda-reservent-t6">
            <Github />
            <span>GitHub</span>
          </Nav.Link>
        </Nav.Item>
      </Nav>
    </div>
  );
};
