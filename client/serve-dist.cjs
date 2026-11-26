const http = require('http');
const fs = require('fs');
const path = require('path');

let currentPort = parseInt(process.env.PORT || '5174', 10);
const DIST_DIR = path.join(__dirname, 'dist');

const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.wav': 'audio/wav',
  '.mp3': 'audio/mpeg'
};

process.on('uncaughtException', (err) => {
  console.error('[Frontend Server] Uncaught Exception:', err.message);
});

process.on('unhandledRejection', (reason) => {
  console.error('[Frontend Server] Unhandled Rejection:', reason);
});

const server = http.createServer((req, res) => {
  req.on('error', (err) => {
    console.error('[Request Error]:', err.message);
  });
  
  res.on('error', (err) => {
    console.error('[Response Error]:', err.message);
  });

  // Normalize URL
  let safeUrl = req.url.split('?')[0];
  if (safeUrl === '/') safeUrl = '/index.html';
  
  let filePath = path.join(DIST_DIR, safeUrl);
  
  // Security check: ensure within DIST_DIR
  if (!filePath.startsWith(DIST_DIR)) {
    res.statusCode = 403;
    res.end('Forbidden');
    return;
  }
  
  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // Fallback to index.html for SPA routing
      filePath = path.join(DIST_DIR, 'index.html');
    }
    
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    
    fs.readFile(filePath, (readErr, content) => {
      if (readErr) {
        if (!res.headersSent) {
          res.statusCode = 500;
          res.end('Server Error');
        }
        return;
      }
      if (!res.headersSent) {
        res.writeHead(200, {
          'Content-Type': contentType,
          'Access-Control-Allow-Origin': '*'
        });
        res.end(content);
      }
    });
  });
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`Port ${currentPort} is already in use, trying port ${currentPort + 1}...`);
    currentPort += 1;
    setTimeout(() => {
      server.listen(currentPort, '0.0.0.0');
    }, 200);
  } else {
    console.error('[Server Error]:', err.message);
  }
});

server.listen(currentPort, '0.0.0.0', () => {
  console.log(`Frontend studio running at http://localhost:${currentPort}`);
});
