// import { createSelector } from 'reselect';

import { TodosState } from './reducer';

export const getTodos = (state: TodosState) => state.items;
export const getIsFetching = (state: TodosState) => state.isFetching;
