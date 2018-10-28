import React, { Component } from 'react';
import { Navbar, NavbarBrand, NavbarNav, NavbarToggler, Collapse, NavItem, NavLink, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Fa } from 'mdbreact';
import { BrowserRouter as Router } from 'react-router-dom';
import logo from '../../images/stop_logo_v2.png';

import StorageKey from '../../util/StorageKey';
import Constants from '../../util/Constants';
import "../../css/menu.css";

export default class MenuTop extends Component {
    constructor(props) {
        super(props);
        this.state = {
            collapse: false,
            isWideEnough: false,
            user: JSON.parse(localStorage.getItem(StorageKey.AUTENTICACAO)),
            itens: null
        };
    }

    componentDidMount(){
        this.setState({
            itens: this.buildMenu()
        });
    }

    buildMenu = () => {
        let { user } = this.state;
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

    validRefresh = () => {
        if (window.location.pathname.includes("backoffice")) {
            window.location.reload()
        }
    }

    onClick = () => {
        this.setState({
            collapse: !this.state.collapse,
        });
    }

    refresh = () => {
        window.location.reload()
    }

    menuTop = () => {
        let { itens } = this.state;
        let menuBackoffice = (<Router>
            <Navbar color="elegant-color" dark expand="md" scrolling className="menu-header">
                <NavbarBrand href="/">
                    <img src={logo} className="logo_stop" alt="stop" />
                </NavbarBrand>
                { !this.state.isWideEnough && <NavbarToggler onClick={this.onClick} />}
                <Collapse isOpen = { this.state.collapse } navbar>
                    <NavbarNav right>
                        <NavItem>
                            {/* <input className="form-control mr-sm-2 mb-0 text-white" type="text" placeholder="Search" aria-label="Search"/> */}
                        </NavItem>
                        <NavItem>
                            <Dropdown>
                                <DropdownToggle nav caret> {this.state.user ? 
                                    <label><Fa icon="user" className="ml-1"/>
                                        {this.state.user.userName}
                                    </label> 
                                    : 
                                    <label><Fa icon="gear" className="ml-1"/>
                                        Configuração
                                    </label>}
                                </DropdownToggle>
                                <DropdownMenu>
                                    {itens ?
                                    itens.map((e, i) => {
                                        return (
                                            <DropdownItem key={i} href={"/" + e.link}>
                                                <Fa icon="{e.icon}" className="ml-1"/>
                                                {e.name}
                                            </DropdownItem>
                                        )
                                    }) : <div></div> }
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
                { !this.state.isWideEnough && <NavbarToggler onClick={this.onClick} />}
                <Collapse isOpen = { this.state.collapse } navbar>
                    <NavbarNav right>
                        <NavItem>
                            <NavLink onClick={this.refresh} to="/"><Fa icon="home" className="ml-1"/>Home</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink onClick={this.refresh} to="/loja"><Fa icon="shopping-basket" className="ml-1"/> Loja</NavLink>
                        </NavItem>
                        <NavItem>
                            <Dropdown>
                                <DropdownToggle nav caret><Fa icon="user" className="ml-1"/>
                                    Perfil
                                </DropdownToggle>
                                <DropdownMenu>
                                    {itens ?
                                    itens.map((e, i) => {
                                        return (
                                            <DropdownItem key={i} href={"/" + e.link}>
                                                <Fa icon="{e.icon}" className="ml-1"/>
                                                {e.name}
                                            </DropdownItem>
                                        )
                                    }) : <div></div> }
                                </DropdownMenu>
                            </Dropdown>
                        </NavItem>
                    </NavbarNav>
                </Collapse>
            </Navbar>
        </Router>)

        if(window.location.pathname.includes("backoffice")){
            return menuBackoffice
        } else if(window.location.pathname.includes("login")){
            return;
        } else {
            return menuGeral
        }

    }
    render() {
        return (
            <div>
                { this.menuTop() }
            </div>
        );
    }
}