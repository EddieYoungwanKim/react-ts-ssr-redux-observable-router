import { createStandardAction } from 'typesafe-actions';
import { History } from 'history';

export const push = createStandardAction('[Router] PUSH')<string>();
export const replace = createStandardAction('[Router] REPLACE')<string>();
export const go = createStandardAction('[Router] GO')<number>();
export const goBack = createStandardAction('[Router] GO_BACK')();
export const goForward = createStandardAction('[Router] GO_FORWARD')();
export const locationChange = createStandardAction('[Router] LOCATION_CHANGE')<
  History.LocationState
>();
