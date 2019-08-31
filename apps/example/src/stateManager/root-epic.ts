import { combineEpics } from 'redux-observable';

import * as todosEpics from './todos/epics';
import * as routerEpics from './router/epics';

export default combineEpics(...Object.values({ ...todosEpics, ...routerEpics }));
