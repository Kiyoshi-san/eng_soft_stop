import React, { Component } from 'react';
import { Route } from 'react-router-dom';

import SideNav, { NavItem, NavIcon, NavText } from '@trendmicro/react-sidenav';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import StorageKey from '../../storage/StorageKey';
import logo from '../../images/stop_logo_v2.png';
import "../../css/react-sidenav.css";
import "../../css/menu.css";

export default class Menu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            itens: this.buildMenu()
        }
    }

    buildMenu = () => {
        let user = JSON.parse(localStorage.getItem(StorageKey.AUTENTICACAO));
        let itens = [];

        if (user) {
            if (user.type === 1) {
                itens = [
                    {
                        name: "Cadastro",
                        link: "backoffice",
                        icon: "paste"
                    },
                    {
                        name: "Perfil",
                        link: "user",
                        icon: "user"
                    },
                    {
                        name: "Sair",
                        link: "logout",
                        icon: "logout"
                    }
                ];
            } else if (user.type === 2) {
                itens = [
                    {
                        name: "Jogar",
                        link: "game",
                        icon: "game"
                    },
                    {
                        name: "Perfil",
                        link: "user",
                        icon: "user"
                    },
                    {
                        name: "Sair",
                        link: "logout",
                        icon: "logout"
                    }
                ];
            } else {
                itens = [
                    {
                        name: "Login",
                        link: "login",
                        icon: "login"
                    }
                ];
            }
        } else {
            itens = [
                {
                    name: "Login",
                    link: "login",
                    icon: "login"
                }
            ];
        }

        return itens;
    }

    render () {
        const { itens } = this.state;

        return (
            <Route render={({ location, history }) => (
                <React.Fragment>
                    <SideNav
                        onSelect={(selected) => {
                            const to = '/' + selected;
                            if (location.pathname !== to) {
                                history.push(to);
                            }
                        }}
                    >
                        <SideNav.Toggle />
                        <SideNav.Nav defaultSelected="backoffice">
                            <img src={logo} className="logo_stop" alt="stop" />
                            {itens.map((item, index) => 
                                <NavItem key={index} eventKey={item.link}>
                                    <NavIcon>
                                        <FontAwesomeIcon icon={item.icon} />
                                    </NavIcon>
                                    <NavText>
                                        {item.name}
                                    </NavText>
                                </NavItem>
                            )}
                        </SideNav.Nav>
                    </SideNav>
                </React.Fragment>
            )}
            />
        );
    }
}