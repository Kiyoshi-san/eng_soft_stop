import React, { Component } from 'react';
import { Route } from 'react-router-dom';

import SideNav, { NavItem, NavIcon, NavText } from '@trendmicro/react-sidenav';

// Be sure to include styles at some point, probably during your bootstraping
// import '@trendmicro/react-sidenav/dist/react-sidenav.css';
import "../../css/react-sidenav.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import logo from '../../images/stop_logo_v2.png';

import "../../css/menu.css";

export default class Menu extends Component {
    render () {
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
                        <SideNav.Nav defaultSelected="backoffice"><img src={logo} className="logo_stop_menu_bkfc" alt="logo" />
                            {/* <a href="/backoffice"> */}
                                <NavItem eventKey="backoffice">
                                        <NavIcon>
                                            <FontAwesomeIcon icon="paste" />
                                            {/* <i className="fas fa-paste" style={{ fontSize: '1.75em' }} /> */}
                                        </NavIcon>
                                        <NavText>
                                            Respostas
                                        </NavText>
                                </NavItem>
                            {/* </a> */}
                            {/* <a href="/backoffice"> */}
                                <NavItem eventKey="backoffice-categorias">
                                    <NavIcon href="/">
                                        <FontAwesomeIcon icon="clipboard-list" />
                                    </NavIcon>
                                    <NavText href="/">
                                        Categorias
                                    </NavText>
                                    {/* <NavItem eventKey="charts/linechart">
                                        <NavText>
                                            Line Chart
                                    </NavText>
                                    </NavItem>
                                    <NavItem eventKey="charts/barchart">
                                        <NavText>
                                            Bar Chart
                                    </NavText>
                                    </NavItem> */}
                                </NavItem>
                            {/* </a> */}
                        </SideNav.Nav>
                    </SideNav>
                </React.Fragment>
            )}
            />
        );
    }
}