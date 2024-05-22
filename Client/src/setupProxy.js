const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/codeforces',
    createProxyMiddleware({
      target: 'http://localhost:8080/codeforces',
      changeOrigin: true,
    })
  );
};