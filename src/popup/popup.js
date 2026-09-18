/** Jira Unsuckify — popup. On/off switches plus the status of the current tab. */

const DEFAULTS = { enabled: true, stickyHeaders: true };

const el = {
  status: document.getElementById("status"),
  statusTitle: document.getElementById("status-title"),
  statusDetail: document.getElementById("status-detail"),
  enabled: document.getElementById("enabled"),
  stickyHeaders: document.getElementById("stickyHeaders"),
  version: document.getElementById("version"),
  options: document.getElementById("open-options"),
};

el.version.textContent = "v" + chrome.runtime.getManifest().version;

el.options.addEventListener("click", (event) => {
  event.preventDefault();
  chrome.runtime.openOptionsPage();
});

function setStatus(tone, title, detail) {
  el.status.dataset.tone = tone;
  el.statusTitle.textContent = title;
  el.statusDetail.textContent = detail ? " " + detail : "";
}

/**
 * Asks the content script in the active tab what it is doing. No reply means
 * there is no content script on that page, which is itself the answer.
 */
function queryActiveTab() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tab = tabs && tabs[0];
    if (!tab || tab.id == null) {
      setStatus("off", "No active tab.");
      return;
    }
    chrome.tabs.sendMessage(tab.id, { type: "jbu-query-status" }, (response) => {
      if (chrome.runtime.lastError || !response) {
        setStatus("off", "Not a Jira page.", "Open a Jira board to use this.");
        return;
      }
      if (!response.enabled) {
        setStatus("off", "Turned off.", "Flip the switch below to turn it on.");
        return;
      }
      if (!response.isBoardUrl) {
        setStatus("off", "Not a board page.", "This does nothing here.");
        return;
      }
      if (response.active) {
        setStatus("good", "Active on this board.");
        return;
      }
      if (response.missing && response.missing.length) {
        setStatus(
          "bad",
          "Jira's layout changed.",
          "These no longer match: " + response.missing.join(", ") + ". See Options to patch them."
        );
        return;
      }
      setStatus(
        "warn",
        "No new-style board here.",
        "Either it is still loading, or this is an old-style board, which this extension leaves alone."
      );
    });
  });
}

chrome.storage.sync.get(DEFAULTS, (stored) => {
  const settings = { ...DEFAULTS, ...stored };
  el.enabled.checked = !!settings.enabled;
  el.stickyHeaders.checked = !!settings.stickyHeaders;
});

["enabled", "stickyHeaders"].forEach((key) => {
  el[key].addEventListener("change", () => {
    chrome.storage.sync.set({ [key]: el[key].checked }, () => {
      // Give the content script a moment to re-apply before re-reading status.
      setTimeout(queryActiveTab, 120);
    });
  });
});

queryActiveTab();
