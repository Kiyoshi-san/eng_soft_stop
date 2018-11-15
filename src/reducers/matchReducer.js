import initialState from './initialState';
import * as actionTypes from '../actions/actionTypes';

const match = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.MATCH_START:
          return {
            ...state,
            match: action.match
          };

        default:
          return state;
    }
}

export default match;