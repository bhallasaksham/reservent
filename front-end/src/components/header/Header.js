import { Container, Nav, Navbar } from 'react-bootstrap';
import { CalendarWeek } from 'react-bootstrap-icons';
import styles from './Header.module.css';

export const Header = () => {
  return (
    <Navbar className={styles["header"]} expand="lg">
      <Container className={styles["nav-container"]}>
        <Navbar.Brand className={styles["brand"]} href="/">
        <CalendarWeek /><span style={{ color: 'black' }}>Reservent</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav>
            <Nav.Link href="/"><span>Home</span></Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};