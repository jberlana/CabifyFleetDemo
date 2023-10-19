console.log("Script loaded");

document.addEventListener("DOMContentLoaded", async function () {
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
      await chrome.storage.local.set({
        demo: currentStatus === "true" ? true : false,
      });
    },
  });

  chrome.storage.local.get("demo").then((result) => {
    console.log("Get " + JSON.stringify(result));
    demoSwitch.checked = result.demo;
  });

  // Attach listener to the switch
  demoSwitch.addEventListener("change", function () {
    let newStatus = this.checked;
    console.log("WRITE " + newStatus);

    if (newStatus) {
      activateDemoMode(tab[0]);
      hideSudoWarning(tab[0]);
    } else {
      deactivateDemoMode(tab[0]);
      showSudoWarning(tab[0]);
    }
  });
});

async function activateDemoMode(tab) {
  await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => {
      localStorage.setItem("demo", true);
      window.location.reload();
    },
  });
}

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

async function updateBadge(tab, text) {
  await chrome.action.setBadgeText({
    tabId: tab.id,
    text: text,
  });
}
