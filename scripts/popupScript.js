
console.log('Script loaded')

document.addEventListener('DOMContentLoaded', function () {

  const switchId = 'switch'
  const demoSwitch = document.getElementById(switchId)

  console.log('Init ' + JSON.stringify(chrome.storage.sync));

  // Initialize switch based on stored value
  chrome.storage.sync.get("demo").then((result) => {
    console.log('Get ' + JSON.stringify(result));
    demoSwitch.checked = result.demo;
  });

  // Attach listener to the switch
  demoSwitch.addEventListener('change', function () {
    let value = this.checked;

    // Save value to local storage
    chrome.storage.sync.set({"demo": value}).then(() => {
      console.log('Set ' + value);
    });

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