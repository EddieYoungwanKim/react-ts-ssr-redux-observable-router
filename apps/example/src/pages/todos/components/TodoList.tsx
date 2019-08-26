import React, { FC, Fragment, ReactNode } from 'react';
import { Todo } from 'Todo-Types';

interface TodoListProps {
  todos: Todo[];
  render: (todo: Todo) => ReactNode;
}

type Props = TodoListProps;
export const TodoListComponent: FC<Props> = ({ todos, render }) => {
  return (
    <div>
      {todos.map(todo => (
        <Fragment key={todo.id}>{render(todo)}</Fragment>
      ))}
    </div>
  );
};
