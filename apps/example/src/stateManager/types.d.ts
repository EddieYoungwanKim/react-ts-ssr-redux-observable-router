import { StateType, ActionType } from 'typesafe-actions';
import { AxiosInstance } from 'axios';
import { History } from 'history';
declare module 'typesafe-actions' {
  export type Store = StateType<typeof import('./index').default>;
  export type RootState = StateType<typeof import('./root-reducer').default>;
  export type RootAction = ActionType<typeof import('./root-action').default>;
  export interface EpicDependencies {
    http: AxiosInstance;
    api: typeof import('./root-api').default;
    history: History;
  }
  interface Types {
    RootAction: RootAction;
  }
}
