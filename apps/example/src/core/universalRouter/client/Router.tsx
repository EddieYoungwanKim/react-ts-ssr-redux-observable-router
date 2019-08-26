import React, { FC, useState, useEffect, ReactNode } from 'react';
import { useLocation } from './useLocation';

interface Props {
  router: { resolve: (path: string) => Promise<ReactNode> };
  history: any;
}
const Router: FC<Props> = ({ router, history, children }) => {
  const location = useLocation(history);
  const [Component, setComponent] = useState(children);
  const [isFirstRendering, setIsFirstRendering] = useState(true);
  useEffect(() => {
    if (isFirstRendering) {
      setIsFirstRendering(false);
      return;
    }
    router.resolve(location.pathname).then((NextComponent: ReactNode) => {
      setComponent(NextComponent);
    });
  }, [location]);
  return <>{Component}</>;
};

export default Router;
