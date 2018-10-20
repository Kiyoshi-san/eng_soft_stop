import { combineReducers, createStore } from 'redux';

import userInterface from './reducers/userInterface';

const combinedReducers = combineReducers({ 
    userInterface
})

const store = createStore(combinedReducers, {});

export default store;