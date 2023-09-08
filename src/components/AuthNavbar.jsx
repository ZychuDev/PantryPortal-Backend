import React from 'react';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { FaBars } from 'react-icons/fa';

const AuthNavbar= () => {
  return (
    <Navbar bg="dark" expand="lg" className="d-flex justify-content-center ">
      <Container>
        <Navbar.Brand href="/home" className="text-white">Pantry Portal</Navbar.Brand>
        <Navbar.Toggle bg='Yellow' aria-controls="basic-navbar-nav" className="ms-auto">
        <p class="text-warning">Expand</p>
          <FaBars class="text-warning" />
        </Navbar.Toggle>
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-center">
          <Nav>
          <Nav.Link href="/login" bg="light"><p class="text-warning">Login</p></Nav.Link>
            <Nav.Link href="/sign"><p class="text-warning">Sign In</p></Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AuthNavbar;