import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import LoadingScreen from 'react-loading-screen';
import { Switch, Route } from 'react-router-dom';

import BackPalavra from './pages/BackPalavra.js';
import Home from './pages/Home';
import Login from './pages/Login';
import Logout from './pages/Logout';
import LoginBack from './pages/LoginBack';
import NotFound from './pages/NotFound';
import * as uiActions from '../actions/uiActions';

import logo from '../images/Diamond_512.gif';

class AppRoutes extends Component {
    render() {
        return (
            <LoadingScreen loading={this.props.loading} bgColor='#f1f1f1' spinnerColor='#9ee5f8'
                textColor='#676767' logoSrc={logo} text='Carregando...'> 
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
            </LoadingScreen>
        );
    }
}

AppRoutes.propTypes = {
    uiActions: PropTypes.object,
    loading: PropTypes.bool
};
  
function mapStateToProps(state) {
  return {
    loading: state.userInterface
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