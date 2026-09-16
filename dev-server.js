// Tiny static server for local preview (not deployed)
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const PORT = process.env.PORT || 8787;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml',
  '.webmanifest': 'application/manifest+json',
  '.md': 'text/markdown; charset=utf-8'
};

http.createServer((req, res) => {
  let urlPath = decodeURIComponent(req.url.split('?')[0]);
  if (urlPath.endsWith('/')) urlPath += 'index.html';
  // clean URLs: /json-formatter -> json-formatter.html
  let filePath = path.join(ROOT, urlPath);
  if (!path.extname(filePath) && !fs.existsSync(filePath)) {
    const withHtml = filePath + '.html';
    if (fs.existsSync(withHtml)) filePath = withHtml;
  }
  fs.readFile(filePath, (err, data) => {
    if (err) {
      // fallback to 404 page for navigations
      const notFound = path.join(ROOT, '404.html');
      if (!path.extname(filePath) && fs.existsSync(notFound)) {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        return res.end(fs.readFileSync(notFound));
      }
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      return res.end('Not found');
    }
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream', 'Cache-Control': 'no-cache' });
    res.end(data);
  });
}).listen(PORT, () => console.log('ToolBox Pro dev server at http://127.0.0.1:' + PORT));
