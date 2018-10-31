import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { Fa } from 'mdbreact';

import * as uiActions from '../../actions/uiActions';
import "../../css/menu-side.css";

class MenuSide extends Component {
    render() {
        return (
            <div className="sidenav">
                <a href="/backoffice-dashboard">
                    <Fa icon="dashboard"/>
                </a>
                <a href="/backoffice">
                    <Fa icon="graduation-cap"/>
                </a>
                <a href="/logout">
                    <Fa icon="power-off"/>
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