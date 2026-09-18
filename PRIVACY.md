# Privacy Policy — Jira Unsuckify

**Last updated: 18 September 2026**

## The short version

Jira Unsuckify does not collect anything, does not send anything anywhere, and
makes no network requests of any kind.

It is a stylesheet. It changes how Jira board columns are laid out in your
browser. That is all it does.

## What the extension collects

Nothing.

There is no analytics, no telemetry, no crash reporting, no tracking, no
advertising identifier, and no account of any kind. The developer has no server
and receives no data from this extension.

## What the extension stores

Only your own settings:

- Whether the extension is switched on
- Whether sticky column headers are switched on
- Whether "skip drawing off-screen cards" is switched on
- Whether debug mode is switched on
- Any custom Jira domains you have added
- Any CSS selector overrides you have typed in

These are stored using Chrome's own extension settings storage
(`chrome.storage.sync`). If you have Chrome Sync turned on, Chrome copies those
settings between your own signed-in Chrome browsers, the same way it syncs your
bookmarks. That transfer is between you and Google under
[Google's privacy policy](https://policies.google.com/privacy). The developer of
this extension has no access to it and receives no copy of it.

Uninstalling the extension removes these settings.

## What the extension reads

On a Jira board page, the extension reads the structure of the page — it checks
which elements are present so it knows it is really looking at a board, and
measures the board's background colour so sticky headers are not see-through.

It does not read, copy, store or transmit the contents of your work items,
comments, project names, or anything else on the page. Everything it reads stays
in your browser for the fraction of a second it takes to decide whether to apply
a stylesheet.

On any page that is not a Jira board, the extension does nothing at all.

## Permissions, and why each one exists

| Permission | Why |
|---|---|
| `storage` | To remember your settings, listed above. |
| `scripting` | To switch the extension on for self-hosted Jira domains that you add yourself in options. Nothing is registered for a domain you have not added and approved. |
| `https://*.atlassian.net/*` | Jira Cloud is served from this domain. The extension needs to see the board page in order to restyle it. |
| `https://*/*` (optional) | Never requested at install. Requested one domain at a time, only when you type your own self-hosted Jira address into the options page and click Add. Chrome asks you to approve each one. |

## Remote code

There is none. Every line of code ships inside the extension package. Nothing is
downloaded, fetched or evaluated from a server at runtime.

## Third parties

None. No data is shared, sold or transferred to anyone, because none is
collected.

## Children

The extension collects no data from anyone, including children.

## Changes to this policy

If this policy changes, the date at the top will change with it. Any version
that starts collecting data would be a different product, and would say so
loudly.

## Contact

Questions about this policy: **bgibilaro@moxielabs.co**
