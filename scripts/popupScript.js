document.addEventListener("DOMContentLoaded", async function () {
  debugger;
  const tab = await chrome.tabs.query({
    active: true,
    lastFocusedWindow: true,
  });
  const switchId = "switch";
  const demoSwitch = document.getElementById(switchId);

  console.log("TAB " + JSON.stringify(tab));

  await chrome.scripting.executeScript({
    target: { tabId: tab[0].id },
    func: async () => {
      const currentStatus = localStorage.getItem("demo");
      console.log("CURRENT STATUS", currentStatus);
      await chrome.storage.local.set({
        demo: currentStatus === "true",
      });
    },
  });

  chrome.storage.local.get("demo").then((result) => {
    console.log("IS CHECKED", result.demo);
    demoSwitch.checked = result.demo;
    if (demoSwitch.checked) {
      setBadgeText("ON");
      setBadgeColor("#994742");
    } else {
      setBadgeText(null);
      setBadgeColor(null);
    }
  });

  // Attach listener to the switch
  demoSwitch.addEventListener("change", function () {
    let newStatus = this.checked;

    // Prepare to anonimize the website data.
    if (newStatus) {
      activateDemoMode(tab[0]);
      hideSudoWarning(tab[0]);
      setBadgeText("ON");
      setBadgeColor("#994742");
    } else {
      deactivateDemoMode(tab[0]);
      showSudoWarning(tab[0]);
      setBadgeText(null);
    }
  });
});

// Changes the text and the color of the extension badge.
async function setBadgeText(text) {
  await chrome.action.setBadgeText({
    text,
  });
}

async function setBadgeColor(color) {
  await chrome.action.setBadgeBackgroundColor({
    color,
  });
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
