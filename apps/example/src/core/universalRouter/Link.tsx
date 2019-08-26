import React, { FC, MouseEvent } from 'react';
import { useDispatch } from 'react-redux';
import * as routerAction from 'stateManager/router/actions';

interface Props {
  to: string;
}

export const Link: FC<Props> = props => {
  const dispatch = useDispatch();
  const handleClick = (ent: MouseEvent) => {
    ent.preventDefault();
    dispatch(routerAction.push(props.to));
  };

  return (
    <a onClick={handleClick} {...props}>
      {props.children}
    </a>
  );
};
