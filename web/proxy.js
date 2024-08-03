const express = require('express');
const cors = require('cors');
const {createProxyMiddleware} = require('http-proxy-middleware');
const path = require('path');

const app = express();
const fs = require('fs');


const configPath = path.resolve(__dirname, 'config.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

const forwardingUrl = config.forwardingUrl;

const proxyConfig = {
  target: forwardingUrl,
  // other proxy configurations
};

console.log(proxyConfig);



// Create a proxy middleware for the Redfish API
app.use('/redfish', createProxyMiddleware({

          target: proxyConfig.target,
          changeOrigin: false,  // Required for proper redirection
          secure: false,  // Ignore certificate errors (for development only)
          pathRewrite: (path, req) => {
            return `/redfish${path}`;
          },
          onProxyReq: (proxyReq, req, res) => {
            console.log('onProxyReq triggered');  // Check if this is printed
            console.log('Request URL:', req.url);
            console.log('Request Headers:', req.headers);
            console.log(
                'Proxy Request Headers to target:', proxyReq.getHeaders());
          },
          onProxyRes: (proxyRes, req, res) => {
            console.log('onProxyRes triggered');  // Check if this is printed
            console.log('Response Headers from target:', proxyRes.headers);
            let body = '';
            proxyRes.on('data', (chunk) => {
              body += chunk;
            });
            proxyRes.on('end', () => {
              console.log('Response Body from target:', body);
            });
            proxyRes.on('error', (err) => {
              console.error('Error in proxy response:', err);
              console.log('Response Headers from target:', proxyRes.headers);
            });
          }
        }));
// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, '.')));

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'loginview.html'));
});
app.listen(3001, () => console.log('Proxy server listening on port 3001'));
