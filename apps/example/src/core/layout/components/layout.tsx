import React, { FC } from 'react';

interface Props {}

const DefaultLayout: FC<Props> = ({ children }) => {
  return <>{children}</>;
};

export default DefaultLayout;
