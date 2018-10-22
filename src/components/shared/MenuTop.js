import React, { Component } from 'react';
import { Navbar, NavbarBrand, NavbarNav, NavbarToggler, Collapse, NavItem, NavLink, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Container, Input } from 'mdbreact';
import { BrowserRouter as Router } from 'react-router-dom';
import logo from '../../images/stop_logo_v2.png';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'
import { faStoreAlt } from '@fortawesome/free-solid-svg-icons'
import { faHome } from '@fortawesome/free-solid-svg-icons'

import StorageKey from '../../util/StorageKey';
import Constants from '../../util/Constants';

export default class MenuTop extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            collapse: false,
            isWideEnough: false,
        };
        this.onClick = this.onClick.bind(this);
        this.state = {
            itens: this.buildMenu()
        }        
    }

    buildMenu = () => {
        let user = JSON.parse(localStorage.getItem(StorageKey.AUTENTICACAO));
        let itens = [];

        if (user) {
            if (user.type === 1) {
                itens = Constants.SU_LINKS;
            } else if (user.type === 2) {
                itens = Constants.LOGED_LINKS;
            } else {
                itens = Constants.PUBLIC_LINKS;
            }
        } else {
            itens = Constants.PUBLIC_LINKS;
        }

        return itens;
    }
    
    onClick(){
        this.setState({
            collapse: !this.state.collapse,
        });
    }

    menuTop = () => {
        let menuBackoffice = (<Router>
            <Navbar color="elegant-color" dark expand="md" scrolling>
                <NavbarBrand href="/">
                    <img src={logo} className="logo_stop" alt="stop" />
                </NavbarBrand>
                { !this.state.isWideEnough && <NavbarToggler onClick = { this.onClick } />}
                <Collapse isOpen = { this.state.collapse } navbar>
                    <NavbarNav right>
                        <NavItem>
                            <input className="form-control mr-sm-2 mb-0 text-white" type="text" placeholder="Search" aria-label="Search"/>
                        </NavItem>
                        <NavItem>
                            <Dropdown>
                                <DropdownToggle nav caret><FontAwesomeIcon icon={faUser} />{}</DropdownToggle>
                                <DropdownMenu>
                                    <DropdownItem href="/conta">bbb</DropdownItem>
                                    <DropdownItem href="/itens">cc</DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                        </NavItem>
                    </NavbarNav>
                </Collapse>
            </Navbar>
        </Router>)
        
        let menuGeral = (<Router>
            <Navbar color="elegant-color" dark expand="md" scrolling>

                <NavbarBrand href="/">
                    <img src={logo} className="logo_stop" alt="stop" />
                </NavbarBrand>
                { !this.state.isWideEnough && <NavbarToggler onClick = { this.onClick } />}
                <Collapse isOpen = { this.state.collapse } navbar>
                    <NavbarNav right>

                        <NavItem active>
                            <NavLink to="/"><FontAwesomeIcon icon={faHome} /> Home</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink to="/loja"><FontAwesomeIcon icon={faStoreAlt} /> Loja</NavLink>
                        </NavItem>
                        <NavItem>
                            <Dropdown>
                                <DropdownToggle nav caret><FontAwesomeIcon icon={faUser} /> Perfil</DropdownToggle>
                                <DropdownMenu>
                                    <DropdownItem href="/conta">Conta</DropdownItem>
                                    <DropdownItem href="/itens">Itens</DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                        </NavItem>
                    </NavbarNav>
                </Collapse>
            </Navbar>
        </Router>)

        if(window.location.pathname == "/backoffice"){             
            return menuBackoffice
        } else if(window.location.pathname == "/login"){
            return;
        } else {
            return menuGeral                    
        }

    }
    render() {
        console.log(Constants.SU_LINKS)
        console.log(Constants.LOGED_LINKS)
        console.log(Constants.PUBLIC_LINKS)
        let { tela } = this.props;
        const { itens } = this.state;
        return (
            <div>
            { this.menuTop() }
            </div>
        );
    }
}