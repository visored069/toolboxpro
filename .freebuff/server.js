const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const MIME = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.json': 'application/json',
    '.xml': 'application/xml',
    '.txt': 'text/plain'
};

function serveFile(res, filePath) {
    const ext = path.extname(filePath);
    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end('<h1>404 Not Found</h1>');
            return;
        }
        res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
        res.end(data);
    });
}

http.createServer((req, res) => {
    let urlPath = decodeURIComponent(req.url.split('?')[0]);
    if (urlPath === '/') urlPath = '/index.html';

    const filePath = path.join(ROOT, urlPath);

    // Try exact path first
    fs.stat(filePath, (err, stats) => {
        if (!err && stats.isFile()) {
            serveFile(res, filePath);
        } else if (!err && stats.isDirectory()) {
            // Redirect directory requests to index.html inside
            res.writeHead(302, { 'Location': urlPath + '/index.html' });
            res.end();
        } else {
            // Try adding .html extension (clean URLs)
            const htmlPath = filePath + '.html';
            fs.stat(htmlPath, (err2, stats2) => {
                if (!err2 && stats2.isFile()) {
                    serveFile(res, htmlPath);
                } else {
                    res.writeHead(404, { 'Content-Type': 'text/html' });
                    res.end('<h1>404 Not Found</h1><p>' + urlPath + '</p>');
                }
            });
        }
    });
}).listen(8000, '127.0.0.1', () => {
    console.log('ToolBox Pro running at http://127.0.0.1:8000');
});
