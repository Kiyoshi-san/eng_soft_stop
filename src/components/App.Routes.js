import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';

import BackPalavra from './pages/BackPalavra.js';
import Home from './pages/Home';
import Login from './pages/Login';
import Logout from './pages/Logout';
import LoginBack from './pages/LoginBack';
import NotFound from './pages/NotFound';

export default class AppRoutes extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        return (
            <main className="mainContainer">
                <Switch>
                    <Route exact path='/' component={Home}/>
                    <Route path='/login' component={Login}/>
                    <Route path='/logout' component={Logout}/>
                    <Route path='/login-back' component={LoginBack}/>
                    <Route path='/backoffice' component={BackPalavra}/>
                    <Route component={NotFound}/>
                </Switch>
            </main>
        );
    }
}