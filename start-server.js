/* Wrapper: force PORT=8787 (environment may inject PORT=0), then start dev-server. */
process.env.PORT = '8787';
require('./dev-server.js');
