import React, { FC } from 'react';
import { Menu } from 'semantic-ui-react';
import { Link } from 'core/universalRouter/Link';

interface Props {
  to: string;
}

const Toolbar: FC<Props> = ({ to, children }) => {
  return (
    <Menu.Item>
      <Link to={to}>{children}</Link>
    </Menu.Item>
  );
};

export default Toolbar;
