import React, { FC } from 'react';

import 'semantic-ui-css/semantic.min.css';
import './App.scss';
import Layout from '../layout/components/layout';
import Content from '../layout/components/content';
import Toolbar from '../layout/components/toolbar';
import ToolbarItem from '../layout/components/toolbar-item';

type LinkItem = {
  key: string;
  to: string;
  title: string;
};

interface Props {}

const App: FC<Props> = ({ children }) => {
  const links: LinkItem[] = [{ key: '1', title: 'Home', to: '/' }, { key: '2', title: 'Todos', to: '/todos' }];
  return (
    <Layout>
      <Toolbar>
        {links.map(link => (
          <ToolbarItem key={link.key} to={link.to}>
            {link.title}
          </ToolbarItem>
        ))}
      </Toolbar>
      <Content>{children}</Content>
    </Layout>
  );
};

export default App;
