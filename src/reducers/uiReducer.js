import initialState from './initialState';
import * as actionTypes from '../actions/actionTypes';

const userInterface = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.LOADING_TRUE:
          return Object.assign({}, state, {
              loading: true,
              message: action.message
            }
          )
        case actionTypes.LOADING_FALSE:
          return Object.assign({}, state, {
              loading: false,
              message: ""
            }
      )
        default:
          return state
    }
}

export default userInterface;