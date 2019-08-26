import { Epic } from 'redux-observable';
import { from, of } from 'rxjs';
import { filter, switchMap, map, catchError, tap, delay } from 'rxjs/operators';
import {
  RootAction,
  RootState,
  EpicDependencies,
  isActionOf,
} from 'typesafe-actions';

import { loadTodosAsync } from './actions';

export const loadTodosEpic: Epic<
  RootAction,
  RootAction,
  RootState,
  EpicDependencies
> = (action$, state$, { api, http }) =>
  action$.pipe(
    filter(isActionOf(loadTodosAsync.request)),
    switchMap(action =>
      from(api.todos.fetchAll(http)).pipe(
        map(res => res.data.filter(todo => todo.id < 5)),
        delay(2000),
        map(loadTodosAsync.success),
        catchError(() => of(loadTodosAsync.failure())),
        tap(() => {
          if (action.payload.resolve) action.payload.resolve();
        })
      )
    )
  );
