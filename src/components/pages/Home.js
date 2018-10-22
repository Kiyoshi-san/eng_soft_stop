import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';

import MenuTop from '../shared/MenuTop';
import * as uiActions from '../../actions/uiActions';

class Home extends React.Component {
    render() {
        return (
            <div>
                <MenuTop/>
                Home
            </div>
        )
    }
}

Home.propTypes = {
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
)(Home);