import * as actionTypes from './actionTypes';

export function loading() {
    return {
      type: actionTypes.LOADING_TRUE
    }
}

export function stopLoading() {
    return {
      type: actionTypes.LOADING_FALSE
    }
}

