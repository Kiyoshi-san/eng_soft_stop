import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { Fa } from 'mdbreact';

import * as uiActions from '../../actions/uiActions';
import "../../css/vertical-menu.css";

class MenuSide extends Component {
    render() {
        return (
            <div className="sidenav">
                <a href="/backoffice-dashboard">
                    <Fa icon="dashboard"/>
                    <span className="description">Dashboard</span>
                </a>
                <a href="/backoffice-categorias">
                    <Fa icon="graduation-cap"/>
                    <span className="description">Categorias</span>
                </a>
                <a href="/backoffice-ligas">
                    <Fa icon="sitemap"/>
                    <span className="description">Ligas</span>
                </a>
                <a href="/logout">
                    <Fa icon="power-off"/>
                    <span className="description">Logout</span>
                </a>
            </div>
        )
    }

    componentDidMount() {
        this.props.uiActions.stopLoading();
    }
}

MenuSide.propTypes = {
    uiActions: PropTypes.object
};

function mapDispatchToProps(dispatch) {
    return {
        uiActions: bindActionCreators(uiActions, dispatch)
    };
}

export default connect(
    null,
    mapDispatchToProps
)(MenuSide);