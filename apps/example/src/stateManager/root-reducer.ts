import { combineReducers } from 'redux';
import todosReducer from './todos/reducer';
import { routerReducer } from './router/reducer';

const rootReducer = combineReducers({
  todos: todosReducer,
  router: routerReducer,
});

export default rootReducer;
