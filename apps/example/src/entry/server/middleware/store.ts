import { createStore, applyMiddleware } from 'redux';
import { Request, Response, NextFunction } from 'express';
import axios from 'axios';
import { createEpicMiddleware } from 'redux-observable';
import { RootAction, RootState, EpicDependencies } from 'typesafe-actions';
import { createMemoryHistory } from 'history';

import rootReducer from 'stateManager/root-reducer';
import rootEpic from 'stateManager/root-epic';
import api from 'stateManager/root-api';

const configureStore = (req: Request) => {
  const http = axios.create({
    baseURL: 'https://jsonplaceholder.typicode.com',
    // headers: { Authorization: req.get('cookie') || '' },
  });
  const history = createMemoryHistory({ initialEntries: [req.path] });

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
  const store = createStore(rootReducer, {}, applyMiddleware(...middlewares));
  epicMiddleware.run(rootEpic);
  return store;
};

const storeMiddleware = () => (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const store = configureStore(req);
  req.store = store;
  next();
};

export default storeMiddleware;
