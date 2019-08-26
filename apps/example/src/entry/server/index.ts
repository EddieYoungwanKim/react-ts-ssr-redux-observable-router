import express, { Request, Response } from 'express';

let app = require('./middleware').default;

if (module.hot) {
  module.hot.accept('./middleware', () => {
    console.log('Server reloading...');
    try {
      app = require('./middleware').default;
    } catch (error) {
      // Do nothing
    }
  });
}

express()
  .use((req: Request, res: Response) => app.handle(req, res))
  .listen(process.env.PORT || 3000, () => {
    console.log(`App is running: http://localhost:${process.env.PORT || 3000}`);
  });
