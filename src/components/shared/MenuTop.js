import React, { Component } from 'react';
import { Navbar, NavbarBrand, NavbarNav, NavbarToggler, Collapse, NavItem, NavLink, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Container, Input } from 'mdbreact';
import { BrowserRouter as Router } from 'react-router-dom';
import logo from '../../images/stop_logo_v2.png';

// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faUser } from '@fortawesome/free-solid-svg-icons'
// import { faStoreAlt } from '@fortawesome/free-solid-svg-icons'
// import { faHome } from '@fortawesome/free-solid-svg-icons'

export default class MenuTop extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            collapse: false,
            isWideEnough: false,
        };
    this.onClick = this.onClick.bind(this);
    }

    onClick(){
        this.setState({
            collapse: !this.state.collapse,
        });
    }
    render() {
        return (
            <Router>
                <Navbar color="elegant-color" dark expand="md" scrolling>
                    <NavbarBrand href="/">
                        <img src={logo} className="logo_stop" alt="stop" />
                    </NavbarBrand>
                    { !this.state.isWideEnough && <NavbarToggler onClick = { this.onClick } />}
                    <Collapse isOpen = { this.state.collapse } navbar>
                        <NavbarNav right>
                          <NavItem active>
                              {/* <NavLink to="/"><FontAwesomeIcon icon={faHome} /> Home</NavLink> */}
                          </NavItem>
                          <NavItem>
                              {/* <NavLink to="/loja"><FontAwesomeIcon icon={faStoreAlt} /> Loja</NavLink> */}
                          </NavItem>
                          <NavItem>
                            <Dropdown>
                                {/* <DropdownToggle nav caret><FontAwesomeIcon icon={faUser} /> Perfil</DropdownToggle> */}
                                <DropdownMenu>
                                    <DropdownItem href="/conta">Conta</DropdownItem>
                                    <DropdownItem href="/itens">Itens</DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                          </NavItem>
                        </NavbarNav>
                    </Collapse>
                </Navbar>
            </Router>
        );
    }
}