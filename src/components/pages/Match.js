import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import firebase from 'firebase';

import * as matchActions from '../../actions/matchActions';

class Match extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
          userId: props.userId,
          matchId: props.matchId,
          loaded: false,
          match: []
        };

        this.loadedRef = firebase.database().ref().child('loaded');
        
        this.partidasRef = firebase.database().ref().child('projetojogostop');
        this.listenMatch();
        this.listenLoaded();
    }

    render() {
        return (
            <div>
                Match
            </div>
        )
    }

    setLoaded() {
        if (this.state.loaded){
            this.partidasRef.set()
        }
    }

    listenMatch() {
        this.partidasRef
          .on(this.state.matchId, match => {
            this.setState({
                match: Object.values(match.val()),
            });
        });
    }

    listenLoaded(){
        this.loadedRef
          .on('loaded', loaded => {
            this.setState({
              loaded: loaded.val(),
            });
        });
    }

    componentDidMount() {
        this.props.uiActions.stopLoading();
        if (this.props.mainUser) {
            this.setLoaded();
        }
    }
}

Match.propTypes = {
    matchActions: PropTypes.object,
    matchId: PropTypes.number,
    letter: PropTypes.string,
    userList: PropTypes.array,
    categoryList: PropTypes.array,
    skillList: PropTypes.array
};

function mapStateToProps(state) {
    return {
      matchId: state.match.matchId,
      letter: state.match.letter,
      userList: state.match.userList,
      categoryList: state.match.categoryList,
      skillList: state.match.skillList
    };
  }

function mapDispatchToProps(dispatch) {
    return {
        matchActions: bindActionCreators(matchActions, dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Match);