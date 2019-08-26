import React, { FC } from 'react';
import { Layout } from 'antd';

interface Props {}

const Footer: FC<Props> = () => {
  return (
    <Layout.Footer style={{ textAlign: 'center' }}>
      Ant Design ©2018 Created by Ant UED
    </Layout.Footer>
  );
};

export default Footer;
