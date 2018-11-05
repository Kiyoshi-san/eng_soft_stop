import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';

import NewAccountShared from '../shared/NewAccountShared';
import * as uiActions from '../../actions/uiActions';

class NewAccount extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false,
        };
    }

    componentDidMount() {
        this.props.uiActions.stopLoading();
        this.toggle();
    }

    toggle = () => {
        this.setState({
            modal: !this.state.modal
        });
    }

    render() {
        return (
            <div>
                <NewAccountShared modal={this.state.modal} toggle={this.toggle} />
            </div>
        )
    }
}

NewAccount.propTypes = {
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
)(NewAccount);