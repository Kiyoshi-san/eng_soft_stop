import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import firebase from 'firebase';

import * as matchActions from '../../actions/matchActions';
import * as uiActions from '../../actions/uiActions';

import StorageKey from '../../util/StorageKey';

class Match extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
          user: JSON.parse(localStorage.getItem(StorageKey.AUTENTICACAO)),
          loaded: false,
          match: {}
        };

        this.loadedRef = firebase.database().ref().child('loaded');
        this.partidasRef = firebase.database().ref().child('projetojogostop');

        this.setLoaded();
        this.listenMatch();
        this.listenLoaded();
    }

    render() {
        const { match, loaded } = this.state;

        return (
            <div>
                {match.map((e, i) => 
                    <div key={i} >
                        {e}
                    </div>
                )}
                <div>
                    {loaded}
                </div>
            </div>
        )
    }

    listenUsers() {
        
    }

    listenMatch() {
        this.partidasRef
          .on(this.props.match.matchId, match => {
            this.setState({
                match: match.val(),
            });
        });
    }

    listenLoaded(){
        this.loadedRef
          .on('loaded', loaded => {
            if (loaded) {
                this.setState({ loaded: loaded.val() });
                this.props.uiActions.stopLoading();
            }
        });
    }

    setLoaded() {

    }

    componentDidMount() {
        if (this.props.mainUser) {
            this.listenUsers();
        }
    }
}

Match.propTypes = {
    uiActions: PropTypes.object,
    matchActions: PropTypes.object,
    match: PropTypes.object
};

function mapStateToProps(state) {
    return {
      match: state.match.match
    };
  }

function mapDispatchToProps(dispatch) {
    return {
        matchActions: bindActionCreators(Object.assign({}, uiActions, matchActions), dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Match);