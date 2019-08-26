import React, { FC } from 'react';
import { Container } from 'semantic-ui-react';

interface Props {}

const MainContent: FC<Props> = ({ children }) => {
  return (
    <Container text style={{ marginTop: '7em' }}>
      {children}
    </Container>
  );
};

export default MainContent;
