import { createStore, applyMiddleware } from 'redux';
import axios from 'axios';
import { createEpicMiddleware } from 'redux-observable';
import { RootAction, RootState, EpicDependencies } from 'typesafe-actions';

import { composeEnhancers } from 'stateManager/utils';
import rootReducer from 'stateManager/root-reducer';
import rootEpic from 'stateManager/root-epic';
import api from 'stateManager/root-api';
import { History } from 'history';

const http = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com',
  //headers: { Authorization: localStorage.getItem('auth-token') },
});

// create store
const configureStore = (history: History) => {
  const epicMiddleware = createEpicMiddleware<
    RootAction,
    RootAction,
    RootState,
    EpicDependencies
  >({
    dependencies: { api, http, history },
  });

  // configure middlewares
  const middlewares = [epicMiddleware];
  // compose enhancers
  const enhancer = composeEnhancers(applyMiddleware(...middlewares));

  const preloadedState = window.PRELOADED_STATE;

  const store = createStore(rootReducer, preloadedState, enhancer);
  epicMiddleware.run(rootEpic);

  return store;
};

// export store singleton instance
export default configureStore;
