import { Epic } from 'redux-observable';
import { filter, map } from 'rxjs/operators';
import {
  RootAction,
  RootState,
  EpicDependencies,
  isActionOf,
} from 'typesafe-actions';

import {
  push,
  replace,
  go,
  goBack,
  goForward,
  locationChange,
} from './actions';

export const pushEpic: Epic<
  RootAction,
  RootAction,
  RootState,
  EpicDependencies
> = (action$, state$, { history }) =>
  action$.pipe(
    filter(isActionOf(push)),
    map(action => {
      history.push(action.payload);
      return locationChange(history.location);
    })
  );
