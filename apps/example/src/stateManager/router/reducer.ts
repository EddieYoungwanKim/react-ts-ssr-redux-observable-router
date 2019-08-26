import { createReducer } from 'typesafe-actions';
import { locationChange } from './actions';
import { History } from 'history';

export const routerReducer = createReducer({
  pathname: '/',
  search: '',
  hash: '',
} as History.LocationState).handleAction(
  locationChange,
  (state, action) => action.payload
);

export default routerReducer;
export type RouterState = ReturnType<typeof routerReducer>;
