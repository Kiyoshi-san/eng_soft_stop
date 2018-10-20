import React, { Component } from 'react';
import { Redirect } from 'react-router';

import StorageKey from '../../util/StorageKey';

export default class Logout extends Component {
    constructor() {
        super();
        localStorage.removeItem(StorageKey.AUTENTICACAO);
    }

    render() {
        window.location.reload();
        return <Redirect to='/home'/>;
    }
}