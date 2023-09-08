import React from 'react';
import { Button, Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { FaBars } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";

const NavigationBar = () => {

    const navigate = useNavigate();
    const logout = () => {
        localStorage.clear();
        navigate('/login');
    }

    return (
        <Navbar bg="primary" expand="lg" className="d-flex justify-content-center">
        <Container>
            <Navbar.Brand href="/dashboard" className="text-white">Pantry Portal</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" className="ms-auto">
            <FaBars />
            </Navbar.Toggle>
            <Navbar.Collapse id="basic-navbar-nav" className="justify-content-center">
            <Nav>
                <Nav.Link href="/dashboard">Dashboard</Nav.Link>
                <Nav.Link href="/pantry">Pantry</Nav.Link>
                <NavDropdown title="Plan" id="basic-nav-dropdown" >
                <NavDropdown.Item href="/plan">Plan</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="/recipes/">Recipies</NavDropdown.Item>
                </NavDropdown>
                <Nav.Link> <Button className="btn-success" onClick={logout}>Logout</Button> </Nav.Link>
            </Nav>
            </Navbar.Collapse>
        </Container>
        </Navbar>
    );
};

export default NavigationBar;