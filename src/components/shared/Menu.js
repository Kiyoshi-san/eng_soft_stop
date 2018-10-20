import React, { Component } from 'react';
import { Route } from 'react-router-dom';

import StorageKey from '../../util/StorageKey';
import Constants from '../../util/Constants';
import logo from '../../images/stop_logo_v2.png';
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

    render () {
        const { itens } = this.state;

        return (
            <div>

            </div>
        );
    }
}