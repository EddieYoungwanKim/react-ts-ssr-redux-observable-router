import { combineReducers } from 'redux';
import { createReducer } from 'typesafe-actions';

import { Todo } from 'Todo-Types';
import { loadTodosAsync, addTodo, removeTodo } from './actions';

export const isFetching = createReducer(false as boolean)
  .handleAction([loadTodosAsync.request], (state, action) => true)
  .handleAction(
    [loadTodosAsync.success, loadTodosAsync.failure],
    (state, action) => false
  );

export const items = createReducer([] as Todo[])
  .handleAction(loadTodosAsync.success, (state, action) => action.payload)
  .handleAction(addTodo, (state, action) => [...state, action.payload])
  .handleAction(removeTodo, (state, action) =>
    state.filter(i => i.id !== action.payload)
  );

const todosReducer = combineReducers({
  isFetching,
  items,
});

export default todosReducer;
export type TodosState = ReturnType<typeof todosReducer>;
