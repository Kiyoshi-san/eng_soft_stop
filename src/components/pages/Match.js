import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';

import * as uiActions from '../../actions/uiActions';

class Match extends Component {
    render() {
        return (
            <div>
                Match
            </div>
        )
    }

    componentDidMount() {
        this.props.uiActions.stopLoading();
    }
}

Match.propTypes = {
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
)(Match);