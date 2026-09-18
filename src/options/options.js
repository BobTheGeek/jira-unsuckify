/** Jira Unsuckify — options page. */

const { SELECTORS, SELECTORS_VERSION } = globalThis.JBU_SELECTORS;

const DEFAULTS = {
  enabled: true,
  stickyHeaders: true,
  contentVisibility: false,
  debug: false,
  customDomains: [],
  selectorOverrides: {},
};

const TOGGLES = ["enabled", "stickyHeaders", "contentVisibility", "debug"];

const el = (id) => document.getElementById(id);

el("version").textContent = "selectors " + SELECTORS_VERSION;

/* ------------------------------------------------------------------ *
 * Toggles
 * ------------------------------------------------------------------ */

chrome.storage.sync.get(DEFAULTS, (stored) => {
  const settings = { ...DEFAULTS, ...stored };
  TOGGLES.forEach((key) => {
    el(key).checked = !!settings[key];
  });
  renderDomains(settings.customDomains);
  el("overrides").value = Object.keys(settings.selectorOverrides || {}).length
    ? JSON.stringify(settings.selectorOverrides, null, 2)
    : "";
});

TOGGLES.forEach((key) => {
  el(key).addEventListener("change", () => {
    chrome.storage.sync.set({ [key]: el(key).checked });
  });
});

/* ------------------------------------------------------------------ *
 * Custom domains
 * ------------------------------------------------------------------ */

function note(id, message, tone) {
  const node = el(id);
  node.textContent = message || "";
  if (tone) node.dataset.tone = tone;
  else delete node.dataset.tone;
}

function renderDomains(domains) {
  const list = el("domain-list");
  list.textContent = "";
  if (!domains.length) {
    const li = document.createElement("li");
    li.className = "jbu-row-hint";
    li.textContent = "None. atlassian.net works without adding anything.";
    list.appendChild(li);
    return;
  }
  domains.forEach((host) => {
    const li = document.createElement("li");
    const code = document.createElement("code");
    code.textContent = host;
    const remove = document.createElement("button");
    remove.className = "jbu-danger";
    remove.textContent = "Remove";
    remove.addEventListener("click", () => removeDomain(host));
    li.append(code, remove);
    list.appendChild(li);
  });
}

/** Accepts a bare host. Rejects anything with a scheme, path, or whitespace. */
function normaliseHost(raw) {
  const value = raw.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/\/.*$/, "");
  if (!value) return null;
  if (!/^[a-z0-9.*-]+\.[a-z]{2,}$/.test(value)) return null;
  return value;
}

el("domain-add").addEventListener("click", () => {
  const host = normaliseHost(el("domain-input").value);
  if (!host) {
    note("domain-note", "That does not look like a host name. Try jira.example.com.", "bad");
    return;
  }
  const origin = `https://${host}/*`;
  chrome.permissions.request({ origins: [origin] }, (granted) => {
    if (!granted) {
      note("domain-note", "Chrome did not grant access to " + host + ".", "bad");
      return;
    }
    chrome.storage.sync.get({ customDomains: [] }, ({ customDomains }) => {
      if (customDomains.includes(host)) {
        note("domain-note", host + " was already on the list.");
        return;
      }
      const next = [...customDomains, host];
      chrome.storage.sync.set({ customDomains: next }, () => {
        el("domain-input").value = "";
        renderDomains(next);
        note("domain-note", "Added " + host + ". Reload any open tab on it.", "good");
      });
    });
  });
});

function removeDomain(host) {
  chrome.storage.sync.get({ customDomains: [] }, ({ customDomains }) => {
    const next = customDomains.filter((entry) => entry !== host);
    chrome.storage.sync.set({ customDomains: next }, () => {
      renderDomains(next);
      chrome.permissions.remove({ origins: [`https://${host}/*`] }, () => {
        note("domain-note", "Removed " + host + ".");
      });
    });
  });
}

/* ------------------------------------------------------------------ *
 * Selector overrides
 * ------------------------------------------------------------------ */

el("overrides-defaults").addEventListener("click", () => {
  el("overrides").value = JSON.stringify(SELECTORS, null, 2);
  note("overrides-note", "Shipped defaults loaded. Edit, then save.");
});

el("overrides-clear").addEventListener("click", () => {
  el("overrides").value = "";
  chrome.storage.sync.set({ selectorOverrides: {} }, () => {
    note("overrides-note", "Overrides cleared. Back to the shipped selectors.", "good");
  });
});

el("overrides-save").addEventListener("click", () => {
  const raw = el("overrides").value.trim();
  if (!raw) {
    chrome.storage.sync.set({ selectorOverrides: {} }, () => {
      note("overrides-note", "Empty, so the shipped selectors are used.", "good");
    });
    return;
  }

  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (error) {
    note("overrides-note", "That is not valid JSON: " + error.message, "bad");
    return;
  }
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    note("overrides-note", "Expected a JSON object of name to CSS selector.", "bad");
    return;
  }

  const known = Object.keys(SELECTORS);
  const unknown = Object.keys(parsed).filter((key) => !known.includes(key));
  if (unknown.length) {
    note(
      "overrides-note",
      "Unknown selector names: " + unknown.join(", ") + ". Valid names: " + known.join(", "),
      "bad"
    );
    return;
  }

  // Every value must be a CSS selector the browser can actually parse,
  // otherwise the generated stylesheet would silently drop whole rules.
  for (const [key, value] of Object.entries(parsed)) {
    if (typeof value !== "string" || !value.trim()) {
      note("overrides-note", `"${key}" must be a non-empty string.`, "bad");
      return;
    }
    try {
      document.querySelector(value);
    } catch (_) {
      note("overrides-note", `"${key}" is not a valid CSS selector: ${value}`, "bad");
      return;
    }
  }

  chrome.storage.sync.set({ selectorOverrides: parsed }, () => {
    note("overrides-note", "Saved. Reload your Jira tab.", "good");
  });
});
