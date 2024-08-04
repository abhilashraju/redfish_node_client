// Function to get query parameters
function getQueryParams() {
  const params = {};
  const queryString = window.location.search.substring(1);
  const regex = /([^&=]+)=([^&]*)/g;
  let m;
  while (m = regex.exec(queryString)) {
    params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
  }
  return params;
}

// Get the username from the query parameters
const params = getQueryParams();
const username = params['username'] || 'Guest';

// Function to submit the selected bypass option
async function submitBypassOption() {
  const selectedOption = document.getElementById('bypass-options').value;
  uri =
      `/redfish/v1/AccountService/Accounts/${localStorage.getItem('username')}`;
  data = {
    MFABypass: {
      BypassTypes:
          'xyz.openbmc_project.User.MFABypass.MFABypassType.' + selectedOption
    }
  };
  try {
    const response = await fetch(uri, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'X-Auth-Token': localStorage.getItem('xAuthToken')
      },
      body: JSON.stringify(data)
    });

    if (response.ok) {
      const responseData = await response.text();
      console.log('Request successful:', responseData);
    } else {
      console.error('Request failed:', response.status, response.statusText);
    }
  } catch (error) {
    console.error('Request error:', error);
  }
}
function showErrorMessage(color, message) {
  const errorMessage = document.getElementById('error-message');
  errorMessage.style.color = color;
  errorMessage.textContent = message;
  errorMessage.style.display = 'block';
  setTimeout(() => {
    errorMessage.style.display = 'none';
  }, 5000);  // Hide after 5 seconds
}
document.addEventListener('DOMContentLoaded', function() {
  let googleCheckbox = document.getElementById('google-authenticator');
  let microsoftCheckbox = document.getElementById('microsoft-authenticator');
  const errorMessage = document.getElementById('error-message');
  fetch('/redfish/v1/AccountService/')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log('Account Service Data:', data);
        microsoftCheckbox.checked = data.MicrosoftAuthenticatorEnabled;
        googleCheckbox.checked = data.GoogleAuthenticatorEnabled;
        // Handle the data as needed
      })
      .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
      });
  googleCheckbox.addEventListener('change', function() {
    handleMfaOptionChange('google-authenticator', googleCheckbox.checked);
  });

  microsoftCheckbox.addEventListener('change', function() {
    handleMfaOptionChange('microsoft-authenticator', microsoftCheckbox.checked);
  });

  function handleMfaOptionChange(option, isEnabled) {
    let body = {};
    if (option === 'google-authenticator') {
      body.GoogleAuthenticator = {Enabled: isEnabled};
    }
    if (option === 'microsoft-authenticator') {
      body.MicrosoftAuthenticator = {Enabled: isEnabled};
    }
    fetch('/redfish/v1/AccountService/', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'X-Auth-Token': localStorage.getItem('xAuthToken')
      },
      body: JSON.stringify(body)
    })
        .then(response => {
          // if (!response.ok || response.status !== 204) {
          //   throw new Error('Failed to update MFA option.');
          // }
          showErrorMessage('blue', 'MFA option updated successfully.');
        })
        .catch(error => {
          showErrorMessage(
              'red', 'An error occurred while updating MFA option.');
        });
  }
});