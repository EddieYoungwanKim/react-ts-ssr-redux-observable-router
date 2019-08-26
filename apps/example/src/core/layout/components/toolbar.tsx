import React, { FC } from 'react';
import { Container, Menu } from 'semantic-ui-react';

interface Props {}

const Toolbar: FC<Props> = ({ children }) => {
  return (
    <Menu fixed="top" inverted>
      <Container>{children}</Container>
    </Menu>
  );
};

export default Toolbar;
