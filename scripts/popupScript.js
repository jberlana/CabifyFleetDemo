
document.addEventListener('DOMContentLoaded', function () {
    // Initialize switch based on stored value
    chrome.storage.local.get(['demo'], function (result) {
      document.getElementById('switch').checked = result.switchValue || false;
    });
  
    // Attach listener to the switch
    document.getElementById('switch').addEventListener('change', function () {
      let value = this.checked;
      localStorage.setItem('demo', value);
      console.log('Value is set to ' + value);
    });
  });

// Hide the impersonated card on the sidebar.
async function hideSudoWarning(tab) {
    // Insert the CSS file when the user turns the extension on
    await chrome.scripting.insertCSS({
        files: ['focus-mode.css'],
        target: { tabId: tab.id }
    });
}

// Show the impersonated card on the sidebar.
async function showSudoWarning(tab) {
    // Remove the CSS file when the user turns the extension off
    await chrome.scripting.removeCSS({
        files: ['focus-mode.css'],
        target: { tabId: tab.id }
    });
}