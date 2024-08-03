const axios = require('axios');
const https = require('https');

async function makeHttpsCall() {
  try {
    const response = await axios.get('https://10.0.2.2:3443/redfish/v1', {
      // Ignore self-signed certificate errors (for development purposes
      // only)
      httpsAgent: new https.Agent({rejectUnauthorized: false})
    });
    console.log('Response data:', response.data);
  } catch (error) {
    console.error('Error making HTTPS call:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response headers:', error.response.headers);
      console.error('Response data:', error.response.data);
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Error setting up request:', error.message);
    }
  }
}

makeHttpsCall();