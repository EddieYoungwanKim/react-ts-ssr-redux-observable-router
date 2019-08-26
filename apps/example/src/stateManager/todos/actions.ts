import { createStandardAction, createAsyncAction } from 'typesafe-actions';
import { Todo } from 'Todo-Types';

export const addTodo = createStandardAction('ADD_TODO').map(
  (title: string): { payload: Todo } => ({
    payload: {
      title,
      id: Math.floor(Math.random() * 10000),
    },
  })
);

export const removeTodo = createStandardAction('REMOVE_TODO')<number>();

export const loadTodosAsync = createAsyncAction(
  'LOAD_TODOS_REQUEST',
  'LOAD_TODOS_SUCCESS',
  'LOAD_TODOS_FAILURE'
)<{ resolve?: () => void }, Todo[], undefined>();
