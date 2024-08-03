const http = require('http');
const https = require('https');
const url = require('url');
const path = require('path');

const REDFISH_SERVER = 'localhost';
const REDFISH_PORT = 3443;  // Assuming the Redfish server uses HTTPS

const server = http.createServer((req, res) => {
  if (req.url.startsWith('/redfish')) {
    const parsedUrl = url.parse(req.url);
    const options = {
      hostname: REDFISH_SERVER,
      port: REDFISH_PORT,
      path: parsedUrl.path,
      method: req.method,
      headers: req.headers,
    };

    const proxyReq = https.request(
        {
          ...options,
          rejectUnauthorized: false  // Allow self-signed certificates
        },
        (proxyRes) => {
          res.writeHead(proxyRes.statusCode, proxyRes.headers);
          proxyRes.pipe(res, {end: true});
        });

    proxyReq.on('error', (err) => {
      console.error('Error in proxy request:', err);
      res.writeHead(500, {'Content-Type': 'text/plain'});
      res.end('Proxy error: ' + err.message);
    });

    // Forward the request body
    req.pipe(proxyReq, {end: true});
  } else if (req.url === '/createsecretkey') {
    const secretKey =
        'ZX6ECCQ7FIDSJDXUNEAMXNY27I';  // Replace with your actual secret key
    const issuer = 'abhilash';         // Replace with your issuer name
    const qrCodeData =
        `otpauth://totp/abhilashraju@abhilashs-MacBook-Pro.local?secret=${
            secretKey}&issuer=${issuer}`;
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify(
        {qrCodeUrl: qrCodeData, secretKey: secretKey}));  // Send JSON response
  } else if (req.url === '/') {
    res.sendFile(path.join(__dirname, 'myview.html'));
  } else {
    res.writeHead(404, {'Content-Type': 'text/plain'});
    res.end('Not Found');
  }
});

server.listen(3001, () => {
  console.log('Server listening on port 3001');
});