import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router';

import StorageKey from '../../util/StorageKey';
import * as uiActions from '../../actions/uiActions';

class Logout extends Component {
    componentDidMount(){
        this.props.uiActions.loading("Efetuando logout...");
        setTimeout(() => {
            localStorage.removeItem(StorageKey.AUTENTICACAO);
            this.props.uiActions.stopLoading();
        }, 3000)
    }

    render() {
        return <Redirect to='/home'/>;
    }
}

Logout.propTypes = {
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
)(Logout);