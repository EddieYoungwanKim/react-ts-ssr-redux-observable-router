import { universalRouterProps } from 'core/universalRouter/types';
import * as actions from 'stateManager/todos/actions';

export default ({ store: { dispatch } }: universalRouterProps) => {
  return Promise.all([new Promise(resolve => dispatch(actions.loadTodosAsync.request({ resolve })))]);
};
