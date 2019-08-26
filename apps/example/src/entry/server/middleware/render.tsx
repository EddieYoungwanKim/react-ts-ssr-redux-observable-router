import path from 'path';
import escapeStringRegexp from 'escape-string-regexp';
import { Request, Response } from 'express';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { ServerStyleSheet } from 'styled-components';
import { Provider as ReduxProvider } from 'react-redux';
import serialize from 'serialize-javascript';
import { ChunkExtractor } from '@loadable/server';
import universalRouter from 'core/universalRouter';

const renderMiddleware = () => async (req: Request, res: Response) => {
  let html = req.html || '';
  const store = req.store;
  const sheet = new ServerStyleSheet();
  const statsFile = path.resolve(__dirname, 'public/loadable-stats.json');
  const extractor = new ChunkExtractor({ statsFile });

  const router = universalRouter({ store, req, res });
  const content = await router.resolve(req.path);

  const htmlContent = ReactDOMServer.renderToString(
    <ReduxProvider store={store}>
      {extractor.collectChunks(sheet.collectStyles(<>{content}</>))}
    </ReduxProvider>
  );
  const htmlReplacements: StringMap = {
    HTML_CONTENT: htmlContent,
    STYLE_TAGS: sheet.getStyleTags(),
    CSS_CHUNKS: extractor.getStyleTags(),
    JS_CHUNKS: extractor.getScriptTags(),
    PRELOADED_STATE: serialize(store.getState(), { isJSON: true }),
  };

  Object.keys(htmlReplacements).forEach(key => {
    const value = htmlReplacements[key];
    html = html.replace(
      new RegExp('__' + escapeStringRegexp(key) + '__', 'g'),
      value
    );
  });
  res.send(html);
};

export default renderMiddleware;
