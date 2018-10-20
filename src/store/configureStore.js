import { applyMiddleware, combineReducers, createStore } from 'redux';
import thunk from 'redux-thunk';

import userInterface from '../reducers/uiReducer';

const combinedReducers = combineReducers({ 
    userInterface
})

export default function configureStore() {
     return createStore(
        combinedReducers,
        applyMiddleware(thunk)
    );
}
