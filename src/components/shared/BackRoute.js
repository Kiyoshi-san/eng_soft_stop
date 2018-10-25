import React from 'react';
import { Redirect, Route } from 'react-router-dom';

import StorageKey from '../../util/StorageKey';

export default BackRoute = ({component: Component, ...rest}) => {
    <Route {...rest} render={props => {
        let user = JSON.parse(localStorage.getItem(StorageKey.AUTENTICACAO));
        if (user && user.type === 1) {
            return (<Component {...props} />)
        } else {
            <Redirect to ={{
                pathname: "/login",
                state: { from: props.location }
            }} />
        }
    }} />
}