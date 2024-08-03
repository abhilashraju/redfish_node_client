const express = require('express');
const cors = require('cors');
const https = require('https');
const bodyParser = require('body-parser');


const app = express();

// Enable CORS for requests from your Vue.js application
app.use(cors({
  origin: 'http://localhost:5500'
}));  // Replace with your Vue.js app's origin

// Define a route to handle requests to the Redfish API
app.use(bodyParser.json());
app.all('/redfish/*', async (req, res) => {
  try {
    // Construct the full URL for the Redfish API request
    const targetUrl = `http://localhost:3001${req.url}`;

    // Create an HTTPS agent to handle the request
    const agent = new https.Agent(
        {rejectUnauthorized: false});  // Ignore certificate errors
    var contentLength = Buffer.byteLength(JSON.stringify(req.body));
    req.headers['Content-Length'] = contentLength;
    if (req.method !== 'GET') {
      console.log('Request Body:', req.body);
      console.log('Request Length:', req.headers['Content-Length']);
    }
    // Forward the request to the Redfish API
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: req.headers,
      body: req.method === 'GET' ? undefined : JSON.stringify(req.body),
      agent,
    });

    // Forward the response to the client
    res.status(response.status);
    response.headers.forEach((value, key) => {
      res.setHeader(key, value);
    });
    res.send(await response.text());  // Forward the response body as text
  } catch (error) {
    console.error('Error forwarding request:', error);
    res.status(500).send('Error forwarding request');
  }
});

// Start the proxy server
app.listen(3000, () => console.log('Proxy server listening on port 3000'));
