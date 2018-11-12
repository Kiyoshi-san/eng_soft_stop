import initialState from './initialState';
import * as actionTypes from '../actions/actionTypes';

const match = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.MATCH_START:
          return Object.assign({}, state, {
            matchid: action.matchid,
            letter: action.letter,
            userList: action.userList,
            categoryList: action.categoryList,
            skillList: action.skillList
          }
        );
        default:
          return state;
    }
}

export default match;