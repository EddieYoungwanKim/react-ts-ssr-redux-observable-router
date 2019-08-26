import { Request, Response } from 'express';
import { Store } from 'typesafe-actions';

export type universalRouterProps = {
  store: Store;
  req?: Request;
  res?: Response;
};
