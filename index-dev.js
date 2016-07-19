// the entry point for running in dev.
// index.js is the production equivalent
process.env.NODE_ENV = 'development';

require('babel-register');
require('./app/server.js');
require('./build/runDevServer.js');
