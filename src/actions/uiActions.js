import * as actionTypes from './actionTypes';

export function loading(message) {
    return {
      type: actionTypes.LOADING_TRUE,
      message: message ? message : "Carregando..."
    }
}

export function stopLoading() {
    return {
      type: actionTypes.LOADING_FALSE
    }
}

