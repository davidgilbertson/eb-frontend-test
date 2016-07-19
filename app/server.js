import path from 'path';
import React from 'react';
import {renderToString} from 'react-dom/server';
import express from 'express';
import compression from 'compression';

import Product from './components/Product/Product.jsx';

const app = express();
app.use(compression()); // Although not necessary if we're going through a CDN
app.use(express.static('public', {maxAge: '1000d'})); // Again could be removed if set by a CDN

const port = process.env.PORT || 8080;

// get the hash used in the file names from the last build
const assetHash = require('../build/assetHash.json');

function getHtml() {
  let scriptSrc = '';
  let cssRef = '';

  if (process.env.NODE_ENV === 'development') {
    // we don't need a reference to the CSS in dev mode since webpack's style-loader
    // will insert the CSS in a style tag
    scriptSrc = 'http://localhost:8081/webpack-bundle.js';
  } else {
    scriptSrc = `/js/main.${assetHash}.js`;
    cssRef = `<link rel="stylesheet" href="/css/main.${assetHash}.css" />`;
  }

  const appHtml = renderToString(<Product />);

  // For more complex apps, this could be an <HTML /> React component
  const html =
    `<!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>Ebay frontend test</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        ${cssRef}
      </head>
      
      <body>
        <div id="app">${appHtml}</div>
        <script async src="${scriptSrc}"></script>
      </body>
      </html>`;

  return html;
}

// decouple URL from data source (rather than server content.json out of static public directory)
app.get('/api/data', (req, res) => {
  res.sendFile(path.join(__dirname, 'data', 'content.json'));
});

app.get('*', (req, res) => {
  res.send(getHtml());
});

app.listen(port, '0.0.0.0', (err) => {
  err && console.error(err);
  console.info(`> App listening on port ${port}`);
});
