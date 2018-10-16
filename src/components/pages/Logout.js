import React, { Component } from 'react';
import { Redirect } from 'react-router';

import StorageKey from '../../storage/StorageKey';

export default class Logout extends Component {
    constructor() {
        super();
        localStorage.removeItem(StorageKey.AUTENTICACAO);
    }

    render() {
        return <Redirect to='/home'/>;
    }
}