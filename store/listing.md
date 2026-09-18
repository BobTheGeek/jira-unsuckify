# Chrome Web Store listing — copy and paste

Everything the Web Store form asks for, in the order it asks for it.
Version 1.0.0. Package: `dist/jira-unsuckify-1.0.0.zip`.

---

## Store listing tab

### Extension name

```
Jira Unsuckify
```

### Short description

Max 132 characters. This one is 123.

```
Restores classic Jira board scrolling. Columns show every card at full height and the board scrolls as one, not per column.
```

### Detailed description

```
Jira's new board turns every column into its own little scroll box.

You get one tiny scrollbar per column. You cannot see a whole column at once. Dragging a card to a column further down means scrolling two things at the same time. There is no Jira setting to turn this off.

Jira Unsuckify turns it off.

WHAT IT DOES

• Every column grows to its full height
• The board gets ONE scrollbar instead of one per column
• Column headers stay on screen while you scroll
• Horizontal scrolling still works
• Jira's top bar, sidebar and project tabs stay exactly where they are
• Works with swimlanes: group by assignee, epic, subtask, anything

Cards keep loading as you scroll, the same way they always did. Drag and drop still works, including dragging to a column below the fold.

WHAT IT DOES NOT TOUCH

Backlog, timeline, reports, list and summary pages. Old-style boards. Anything that is not the new board. On those pages the extension does nothing at all.

BUILT TO FAIL SAFELY

Jira is a React app and it changes. Before this extension restyles anything, it checks that every element it needs is actually there. If Jira has moved something, the extension stays completely inactive rather than leaving your board half broken, and the toolbar badge turns into a red "!" that names exactly what changed.

You do not have to wait for an update to fix it either. The options page lets you paste a corrected selector and carry on.

PRIVACY

This extension makes no network requests. It collects nothing, sends nothing, and stores nothing beyond your own on/off preference. It contains no remote code, no analytics and no trackers. All it does is add a stylesheet to Jira board pages.

CONTROLS

In the popup:
• Unscroll boards — the main on/off switch. Turning it off restores the original layout straight away, with no reload.
• Sticky column headers — keep the column names on screen while you scroll.

In options:
• Custom Jira domains, for Jira sites that are not on atlassian.net
• Skip drawing off-screen cards, a performance switch for very large boards
• Debug mode
• Selector overrides

KNOWN LIMITATIONS

• Very large boards render every card. A 62-card column is roughly 16,000 pixels tall. Scrolling stayed smooth in testing, but if yours does not, turn on "Skip drawing off-screen cards" in the options.
• Old-style Jira boards are not supported. They use a genuinely virtualized card list, which is a different problem. The extension leaves them alone on purpose.
```

### Category

```
Workflow & Planning
```

Second choice if that one is unavailable: **Developer Tools**.

### Language

```
English (United States)
```

---

## Graphics

| Field | File | Size |
|---|---|---|
| Store icon | `icons/icon128.png` | 128 x 128 |
| Screenshot 1 | `store/screenshots/01-before.png` | 1280 x 800 |
| Screenshot 2 | `store/screenshots/02-after.png` | 1280 x 800 |
| Screenshot 3 | `store/screenshots/03-sticky-headers.png` | 1280 x 800 |
| Screenshot 4 | `store/screenshots/04-controls.png` | 1280 x 800 |
| Small promo tile | `store/small-promo-tile-440x280.png` | 440 x 280 |
| Marquee promo tile | `store/marquee-promo-tile-1400x560.png` | 1400 x 560 |

Upload the screenshots in that order. Screenshot 1 is the problem, screenshot 2
is the fix, so the pair reads correctly in the carousel.

All four screenshots were taken on a real Jira board. Every work item title,
issue key, person and project name in them was replaced with demo content before
the screenshot was taken, so no company data is in the listing.

`store/hero-1280x800.png` is a spare. It is not needed.

---

## Privacy tab

### Single purpose description

```
Jira Unsuckify has one purpose: to change the layout of Jira board pages so that each column renders at its full content height and the whole board scrolls as a single area, instead of each column being an independent scroll box. It does this by adding a stylesheet to Jira board pages. It does nothing on any other page.
```

### Permission justifications

**storage**

```
Used to remember the user's own settings: whether the extension is on, whether sticky column headers are on, and any selector overrides they have entered. Nothing else is stored, and nothing is ever sent anywhere.
```

**scripting**

```
Used only to register the content script on additional Jira domains that the user adds themselves on the options page. Many organisations self-host Jira on their own domain rather than atlassian.net. No script is registered for any domain the user has not explicitly added and approved.
```

**Host permission: https://*.atlassian.net/***

```
The extension has to read the board page's DOM to confirm it is on a Jira board, and then apply a stylesheet to it. Jira Cloud is served from atlassian.net, so this is the minimum host access required to do anything at all. No page content is read for any other reason, and none of it leaves the browser.
```

**Optional host permission: https://*/***

```
This is never requested at install time. It is requested at runtime, one domain at a time, only when a user types their own self-hosted Jira domain into the options page and clicks Add. Chrome shows the user its own approval prompt for each domain. The pattern is broad only because a self-hosted Jira can be at any hostname, and there is no way to know in advance which one a given user has.
```

### Remote code

```
No, I am not using remote code
```

Correct. Every file is in the package. Nothing is fetched, evaluated or injected
from a server.

### Data usage

Tick **nothing** in the data collection list, then tick all three certification
boxes:

- [x] I do not sell or transfer user data to third parties, outside of the approved use cases
- [x] I do not use or transfer user data for purposes that are unrelated to my item's single purpose
- [x] I do not use or transfer user data to determine creditworthiness or for lending purposes

### Privacy policy URL

**Required.** Chrome asks for one whenever an extension requests broad host
permissions, which this one does for self-hosted Jira domains.

The policy is written and ready in two formats:

- `PRIVACY.md` — the text, for a repo or a gist
- `store/privacy-policy.html` — a finished, self-contained web page

Host one of them and paste the URL here. See `SUBMISSION.md`, step 4, for the
two quickest ways to host it.

Paste the resulting URL into both places the console asks for it:

- **Privacy tab → Privacy policy URL**
- **Account → Privacy policy URL** (the account-wide default, if it is blank)

---

## Distribution tab

| Field | Value |
|---|---|
| Visibility | **Unlisted** |
| Distribution | All regions |
| Pricing | Free |

**Unlisted** means the extension does not appear in Web Store search or
category browsing. Anyone with the direct link can install it. That link is what
you send your team.
