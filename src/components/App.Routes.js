import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';

import Login from './pages/Login';
import LoginBack from './pages/LoginBack';
import Home from './pages/Home';
import BackPalavra from './pages/BackPalavra.js';
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
                    <Route path='/login-back' component={LoginBack}/>
                    <Route path='/backoffice' component={BackPalavra}/>
                    {/* <Route path='/backoffice-categorias' component={BackCategoria}/> */}
                </Switch>
            </main>
        );
    }
}