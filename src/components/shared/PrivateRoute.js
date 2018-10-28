import React from 'react';
import { Route } from 'react-router-dom';

import StorageKey from '../../util/StorageKey';

export const PrivateRoute = ({component: Component, ...rest}) => (
    <Route {...rest} render={props => {
        let user = JSON.parse(localStorage.getItem(StorageKey.AUTENTICACAO));
        if (user && [1, 2].indexOf(user.type) > -1) {
            return (<Component {...props} />);
        } else {
            window.location.href = '/login';
        }
    }} />
)