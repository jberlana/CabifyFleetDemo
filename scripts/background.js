const fleet_app = 'https://partners.cabify.com/';

chrome.runtime.onInstalled.addListener(() => {
  chrome.action.setBadgeText({
    text: 'OFF'
  });
});

// When the user clicks on the extension action
chrome.action.onClicked.addListener(async (tab) => {
  if (tab.url.startsWith(fleet_app)) {

    // We retrieve the action badge to check if the extension is 'ON' or 'OFF'
    const prevState = await chrome.action.getBadgeText({ tabId: tab.id });
    const nextState = prevState === 'ON' ? 'OFF' : 'ON';

    updateBadge(tab, nextState)

    if (nextState === 'ON') {
      hideSudoWarning(tab)
      enableDemoMode(tab)
    } else if (nextState === 'OFF') {
      showSudoWarning(tab)
      disableDemoMode(tab)
    }
  }
});

// Update the extension icon with a badge.
async function updateBadge(tab, text) {
  await chrome.action.setBadgeText({
    tabId: tab.id,
    text: text
  });
}

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

// Write a key on the loal storage.
async function enableDemoMode(tab) {
  await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => {
      localStorage.setItem('demo', true);
    },
  });
}

async function disableDemoMode(tab) {
  await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => {
      localStorage.setItem('demo', false);
    },
  });
}