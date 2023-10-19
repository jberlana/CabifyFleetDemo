document.addEventListener("DOMContentLoaded", async function () {
  debugger;
  const tab = await chrome.tabs.query({
    active: true,
    lastFocusedWindow: true,
  });

  // Get the previous value on th elocal storage and save it on the extension storage
  await chrome.scripting.executeScript({
    target: { tabId: tab[0].id },
    func: async () => {
      const currentStatus = localStorage.getItem("demo");
      console.log("1. GetL " + currentStatus);
      await chrome.storage.local.set({
        demo: currentStatus == "true",
      });
    },
  });

  const demoSwitch = document.getElementById("switch");
  const headerImage = document.getElementById("popupImage");

  // Retreive status from extension stoarage and refresh the switch.
  chrome.storage.local.get("demo").then((result) => {
    console.log("2. GetR " + JSON.stringify(result.demo));
    demoSwitch.checked = result.demo;
    if (result.demo) {
      chrome.action.setIcon({ path: "../images/icon-16.png" });
      headerImage.src = "../images/icon-80-yes.png";
    } else {
      chrome.action.setIcon({ path: "../images/icon-16-no.png" });
      headerImage.src = "../images/icon-80-no.png";
    }
  });

  // Attach listener to the switch
  demoSwitch.addEventListener("change", function () {
    let newStatus = this.checked;

    // Prepare to anonimize the website data.
    if (newStatus) {
      activateDemoMode(tab[0]);
      hideSudoWarning(tab[0]);
      chrome.action.setIcon({ path: "../images/icon-16.png" });
      headerImage.src = "../images/icon-80-yes.png";
    } else {
      deactivateDemoMode(tab[0]);
      showSudoWarning(tab[0]);
      chrome.action.setIcon({ path: "../images/icon-16-no.png" });
      headerImage.src = "../images/icon-80-no.png";
    }
  });
});

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
