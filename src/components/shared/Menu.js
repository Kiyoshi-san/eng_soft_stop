import React, { Component } from 'react';
import Nav from 'react-bootstrap/lib/Nav';
import Navbar from 'react-bootstrap/lib/Navbar';

import logo from '../../images/stop_logo.png';

import "../../css/menu.css";

export default class Menu extends Component {
    constructor() {
        super ();
    }

    render () {
        return (
            <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark" className="menu">
                {/* <Navbar.Brand href="/">Stop App</Navbar.Brand> */}
                <Navbar.Brand href="/">
                    <img src={logo} className="logo_stop" alt="logo" />
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="mr-auto">
                    </Nav>
                    <Nav className="menu-itens">
                        <Nav.Link href="/">Home</Nav.Link>
                        <Nav.Link eventKey={2} href="#">Loja</Nav.Link>
                        <Nav.Link eventKey={3} href="/login">Login</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        );
    }
}