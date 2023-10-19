
document.addEventListener("DOMContentLoaded", async function () {
  const tab = await chrome.tabs.query({
    active: true,
    lastFocusedWindow: true,
  });
  
  // Get the previous value on th elocal storage and save it on the extension storage
  await chrome.scripting.executeScript({
    target: { tabId: tab[0].id },
    func: async () => {
      const currentStatus = localStorage.getItem("demo");
      console.log('1. GetL ' + currentStatus);
      await chrome.storage.local.set({
        "demo": currentStatus == "true"
      });
    },
  });

  const demoSwitch = document.getElementById("switch");

  // Retreive status from extension stoarage and refresh the switch.
  chrome.storage.local.get("demo").then((result) => {
    console.log('2. GetR ' + JSON.stringify(result.demo));
    demoSwitch.checked = result.demo;
    setBadgeText(result.demo ? "ON" : null, result.demo ? "#994742" : null)
  });

  // Attach listener to the switch
  demoSwitch.addEventListener("change", function () {
    let newStatus = this.checked;

    // Prepare to anonimize the website data.
    if (newStatus) {
      activateDemoMode(tab[0]);
      hideSudoWarning(tab[0]);
      setBadgeText("ON", "#994742")
    } else {
      deactivateDemoMode(tab[0]);
      showSudoWarning(tab[0]);
      setBadgeText(null, null)
    }
  });
});


// Changes the text and the color of the extension badge.
async function setBadgeText(text, color) {
  await chrome.action.setBadgeText({ 
    text: text 
  });
  if (color != null) {
    await chrome.action.setBadgeBackgroundColor({ 
      color: color 
    });
  }
}

// Activate the property on the local storage to control anonimization.
async function activateDemoMode(tab) {
  await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => {
      localStorage.setItem("demo", true);
      window.location.reload();
    },
  });
}

// Deactivate the property on the local storage to control anonimization.
async function deactivateDemoMode(tab) {
  await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => {
      localStorage.setItem("demo", false);
      window.location.reload();
    },
  });
}

// Hide the impersonated card on the sidebar.
async function hideSudoWarning(tab) {
  // Insert the CSS file when the user turns the extension on
  await chrome.scripting.insertCSS({
    files: ["focus-mode.css"],
    target: { tabId: tab.id },
  });
}

// Show the impersonated card on the sidebar.
async function showSudoWarning(tab) {
  // Remove the CSS file when the user turns the extension off
  await chrome.scripting.removeCSS({
    files: ["focus-mode.css"],
    target: { tabId: tab.id },
  });
}