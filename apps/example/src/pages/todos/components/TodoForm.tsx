import React, { FC, useState, ReactEventHandler } from 'react';
import { Form } from 'semantic-ui-react';
interface TodoFormProps {
  addTodo: (title: string) => void;
}

type Props = TodoFormProps;

export const TodoFormComponent: FC<Props> = ({ addTodo }) => {
  const [title, setTitle] = useState('');
  const onInputChange: ReactEventHandler<HTMLInputElement> = event => {
    setTitle(event.currentTarget.value);
  };
  const onSubmit = () => {
    addTodo(title);
    setTitle('');
  };

  return (
    <Form>
      <Form.Group widths="equal">
        <Form.Input fluid value={title} placeholder="Enter new item" onChange={onInputChange} />
        <Form.Button type="submit" onClick={onSubmit} disabled={!title}>
          Add
        </Form.Button>
      </Form.Group>
    </Form>
  );
};
