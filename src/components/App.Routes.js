import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';

import Login from './pages/Login';
import Home from './pages/Home';
import Backoffice from './pages/Backoffice.js';
import BackCategoria from './pages/BackCategoria';

export default class AppRoutes extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        return (
            <main>
                <Switch>
                    <Route exact path='/' component={Home}/>
                    <Route path='/login' component={Login}/>
                    <Route path='/backoffice' component={Backoffice}/>
                    <Route path='/backoffice-categorias' component={BackCategoria}/>
                </Switch>
            </main>
        );
    }
}