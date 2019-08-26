import { useState, useEffect } from 'react';

export const useLocation = (history: any) => {
  const [location, setLocation] = useState(history.location);
  useEffect(() => {
    const unlisten = history.listen((location: any) => setLocation(location));
    return () => unlisten();
  }, [history]);

  return location;
};
