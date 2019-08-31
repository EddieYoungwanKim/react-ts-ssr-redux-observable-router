import React, { FC } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { RootState } from "typesafe-actions";
import { Todo } from "Todo-Types";
import { Button } from "semantic-ui-react";
import { TodoFormComponent, TodoListComponent, TodoComponent } from "./components";
import * as selectors from "stateManager/todos/selectors";
import * as actions from "stateManager/todos/actions";

const Title = styled.h1`
  font-size: 1.5em;
`;

const TodosPage: FC<Props> = ({ isFetching, addTodo, removeTodo, loadTodos, todos }) => {
  if (isFetching) {
    return <p>Loading...</p>;
  }
  return (
    <div>
      <Title>Todos Page</Title>
      <div>
        <Button
          onClick={() => {
            loadTodos({});
          }}
        >
          Load Todos!
        </Button>
      </div>
      <TodoFormComponent addTodo={addTodo} />
      <TodoListComponent todos={todos} render={(todo: Todo) => <TodoComponent todo={todo} removeTodo={removeTodo} />} />
    </div>
  );
};
const mapStateToProps = (state: RootState) => ({
  isFetching: state.todos.isFetching,
  todos: selectors.getTodos(state.todos),
});
const dispatchProps = {
  addTodo: actions.addTodo,
  removeTodo: actions.removeTodo,
  loadTodos: actions.loadTodosAsync.request,
};

interface TodosPageProps {}

type Props = ReturnType<typeof mapStateToProps> & typeof dispatchProps & TodosPageProps;

export default connect(
  mapStateToProps,
  dispatchProps,
)(TodosPage);
