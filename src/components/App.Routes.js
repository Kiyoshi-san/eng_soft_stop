import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import LoadingScreen from 'react-loading-screen';
import { Switch, Route } from 'react-router-dom';

import { BackRoute } from './shared/BackRoute';
import { PrivateRoute } from './shared/PrivateRoute';

import Account from './pages/Account';
import BackDashboard from './pages/BackDashboard.js';
import BackPalavra from './pages/BackPalavra.js';
import BackLigas from './pages/BackLigas.js';
import BackStore from './pages/BackStore.js';
import Home from './pages/Home';
import Login from './pages/Login';
import Logout from './pages/Logout';
import LoginBack from './pages/LoginBack';
import NotFound from './pages/NotFound';
import NewAccount from './pages/NewAccount';
import Match from './pages/Match';
import Score from './pages/Score';
import Shop from './pages/Shop';
import Profile from './pages/Profile';
import * as uiActions from '../actions/uiActions';

import logo from '../images/Diamond_512.gif';

class AppRoutes extends Component {
    render() {
        return (
            <LoadingScreen loading={this.props.loading} bgColor='#f1f1f1' spinnerColor='#9ee5f8'
                textColor='#676767' logoSrc={logo} text={this.props.message}> 
                <main className="mainContainer">
                    <Switch>
                        <Route exact path='/' component={Home}/>
                        <Route path='/home' component={Home}/>
                        <Route path='/login' component={Login}/>
                        <Route path='/logout' component={Logout}/>
                        <Route path='/login-back' component={LoginBack}/>
                        <Route path='/novo-usuario' component={NewAccount}/>
                        <PrivateRoute path='/match/:id' component={Match}/>
                        <PrivateRoute path='/score/:id' component={Score}/>
                        <PrivateRoute path='/account' component={Account} />
                        <PrivateRoute path='/shop' component={Shop}/>
                        <PrivateRoute path='/profile' component={Profile}/>
                        <BackRoute path='/backoffice-dashboard' component={BackDashboard}/>
                        <BackRoute path='/backoffice-categorias' component={BackPalavra}/>
                        <BackRoute path='/backoffice-ligas' component={BackLigas}/>
                        <BackRoute path='/backoffice-loja' component={BackStore}/>
                        <Route component={NotFound}/>
                    </Switch>
                </main>
            </LoadingScreen>
        );
    }
}

AppRoutes.propTypes = {
    uiActions: PropTypes.object,
    loading: PropTypes.bool,
    message: PropTypes.string
};
  
function mapStateToProps(state) {
  return {
    loading: state.userInterface.loading,
    message: state.userInterface.message
  };
}

function mapDispatchToProps(dispatch) {
    return {
        uiActions: bindActionCreators(uiActions, dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AppRoutes);