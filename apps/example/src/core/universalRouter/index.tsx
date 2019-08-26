import React from 'react';
import UniversalRouter from 'universal-router';
import loadable from '@loadable/component';

import { universalRouterProps } from './types';
import App from 'core/App';
import todoResolver from 'pages/todos/resolver';

export default (props: universalRouterProps) => {
  const isServer = props.req ? true : false;
  const routes = [
    {
      path: '/',
      async action(context: any) {
        const children = await context.next();
        return <App {...context}>{children}</App>;
      },
      children: [
        {
          path: '',
          async action(context: any) {
            const Home = loadable(() => import('pages/home'));
            return <Home {...context} />;
          },
        },
        {
          path: '/todos',
          async action(context: any) {
            const Todos = loadable(() => import('pages/todos'));
            // conditionally wait for the resolver
            if (isServer) {
              await todoResolver(props);
            } else {
              // need to skip this for the first client side rendering
              // todoResolver(props);
            }

            return <Todos {...context} />;
          },
        },
      ],
    },
  ];
  return new UniversalRouter(routes);
};
