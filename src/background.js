/**
 * Jira Unsuckify — service worker.
 *
 * Two jobs:
 *
 * 1. Show the toolbar badge. A "!" badge means a required selector matched
 *    nothing on a page that really is a modern board — the primary signal
 *    that Jira has changed its DOM.
 * 2. Register and unregister the content script on custom Jira domains the
 *    user adds on the options page.
 */

const BADGE = {
  active: { text: "", title: "Jira Unsuckify — active on this board" },
  disabled: { text: "off", color: "#6B778C", title: "Jira Unsuckify — turned off" },
  "not-a-board": { text: "", title: "Jira Unsuckify — not a board page" },
  waiting: { text: "", title: "Jira Unsuckify — waiting for the board to render" },
  "selector-broken": {
    text: "!",
    color: "#DE350B",
    title: "Jira Unsuckify — a selector no longer matches. Jira's DOM has changed.",
  },
};

chrome.runtime.onMessage.addListener((message, sender) => {
  if (!message || message.type !== "jbu-status") return;
  const tabId = sender.tab && sender.tab.id;
  if (tabId == null) return;

  const spec = BADGE[message.status] || BADGE["not-a-board"];
  const title =
    message.status === "selector-broken" && message.missing.length
      ? `${spec.title}\nMissing: ${message.missing.join(", ")}\nSelectors version: ${message.selectorsVersion}`
      : spec.title;

  chrome.action.setBadgeText({ tabId, text: spec.text });
  if (spec.color) chrome.action.setBadgeBackgroundColor({ tabId, color: spec.color });
  chrome.action.setTitle({ tabId, title });
});

/* ------------------------------------------------------------------ *
 * Custom domains
 * ------------------------------------------------------------------ */

const SCRIPT_ID = "jbu-custom-domains";

/**
 * Re-registers the content script for whatever custom origins the user has
 * granted. Called on install, on startup, and whenever the domain list or the
 * granted permissions change.
 */
async function syncCustomDomainScript() {
  const { customDomains = [] } = await chrome.storage.sync.get({ customDomains: [] });
  const patterns = customDomains
    .map((host) => `https://${host}/*`)
    .filter((pattern) => pattern !== "https://*.atlassian.net/*");

  const existing = await chrome.scripting.getRegisteredContentScripts({ ids: [SCRIPT_ID] });
  const granted = [];
  for (const pattern of patterns) {
    if (await chrome.permissions.contains({ origins: [pattern] })) granted.push(pattern);
  }

  if (existing.length) {
    await chrome.scripting.unregisterContentScripts({ ids: [SCRIPT_ID] });
  }
  if (!granted.length) return;

  await chrome.scripting.registerContentScripts([
    {
      id: SCRIPT_ID,
      matches: granted,
      runAt: "document_start",
      css: ["src/content.css"],
      js: ["src/selectors.js", "src/content.js"],
      persistAcrossSessions: true,
    },
  ]);
}

chrome.runtime.onInstalled.addListener(syncCustomDomainScript);
chrome.runtime.onStartup.addListener(syncCustomDomainScript);
chrome.permissions.onAdded.addListener(syncCustomDomainScript);
chrome.permissions.onRemoved.addListener(syncCustomDomainScript);
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "sync" && changes.customDomains) syncCustomDomainScript();
});
