import React from 'react';
import ReactDOM from 'react-dom';
import { Provider as ReduxProvider } from 'react-redux';
import { createBrowserHistory } from 'history';
import { loadableReady } from '@loadable/component';

import ClientRouter from 'core/universalRouter/client/Router';
import universalRouter from 'core/universalRouter';
import configureStore from './helper/store';

const history = createBrowserHistory();
const store = configureStore(history);

loadableReady(async () => {
  // For matching html from SSR
  // TODO: this part we should sikp the resolvers. I think redux state is necessary
  const router = universalRouter({ store });
  const children = await router.resolve(history.location.pathname);
  ReactDOM.hydrate(
    <ReduxProvider store={store}>
      <ClientRouter history={history} router={router}>
        {children}
      </ClientRouter>
    </ReduxProvider>,
    document.getElementById('root')
  );
});
