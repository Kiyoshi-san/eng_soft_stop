import initialState from './initialState';
import * as actionTypes from '../actions/actionTypes';

const userInterface = (state = initialState.loading, action) => {
    switch (action.type) {
        case actionTypes.LOADING_TRUE:
          return [
            ...state,
            {
              loading: true
            }
          ]
        case actionTypes.LOADING_FALSE:
          return [
            ...state,
            {
              loading: false
            }
          ]
        default:
          return state
    }
}

export default userInterface;