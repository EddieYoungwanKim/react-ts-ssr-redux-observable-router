import React, { FC } from 'react';
import { Todo } from 'Todo-Types';

interface TodoProps {
  todo: Todo;
  removeTodo: (id: number) => void;
}

type Props = TodoProps;
export const TodoComponent: FC<Props> = ({ todo, removeTodo }) => {
  return (
    <li>
      {todo.title}
      <button onClick={() => removeTodo(todo.id)}>Remove todo</button>
    </li>
  );
};
