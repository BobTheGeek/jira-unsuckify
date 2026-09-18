<p align="center">
  <img src="icons/logo-full.png" alt="Jira Unsuckify" width="380">
</p>

# Jira Unsuckify

A Manifest V3 Chrome extension that gives you back the old Jira board scrolling.

Jira's new board makes **every column its own little scroll box**. You get one
tiny scrollbar per column, you cannot see a whole column at once, and dragging a
card to a column further down means scrolling two things at the same time.
Atlassian has no setting to turn this off.

This extension turns it off.

- Every column grows to its full height.
- The board gets **one** scrollbar instead of one per column.
- Column headers stay on screen while you scroll.
- Horizontal scrolling still works.
- Jira's top bar, sidebar and project tabs stay where they are.

## What it does not touch

Backlog, timeline, reports, list and summary pages. Old-style boards. Anything
that is not the new board. On those pages the extension does nothing at all.

## Install

Either install it from the Chrome Web Store link your admin shared with you, or
load it unpacked, below.

To publish it yourself as an **unlisted** store listing — not in search, install
by link, auto-updating — everything is ready in
[`store/SUBMISSION.md`](store/SUBMISSION.md) and
[`store/listing.md`](store/listing.md).

### Install unpacked

1. Clone or download this folder.
2. Open `chrome://extensions`.
3. Turn on **Developer mode** (top right).
4. Click **Load unpacked** and pick this folder.
5. Open a Jira board. The toolbar icon will say "Active on this board".

No build step. No dependencies. No network requests. No analytics.

## Controls

Click the toolbar icon:

- **Unscroll boards** — the main on/off switch. Turning it off restores the
  original layout straight away. No reload needed.
- **Sticky column headers** — keep the column names on screen while you scroll.

The options page adds:

- **Skip drawing off-screen cards** — a performance switch for very large
  boards. Off by default, because it costs an accurate scrollbar size and the
  browser's find-on-page can miss cards.
- **Debug mode** — outlines every element the extension matched and logs to the
  console.
- **Custom Jira domains** — for Jira sites that are not on `atlassian.net`.
  Chrome asks you to approve each one.
- **Selector overrides** — see below.

## When Jira changes its DOM

This is the thing that will break the extension one day. Jira is a React app and
its class names are generated, so the extension keys off `data-testid`
attributes instead. Those are stable, but they are not a contract.

The extension is built so that this fails loudly and safely:

- Before it does anything, it checks that every required selector matches at
  least one element. If any of them misses, it **stays inert** rather than
  leaving your board half-styled.
- The toolbar badge turns into a red `!`, and its tooltip names the selector
  that stopped matching.

### Fixing it yourself, without waiting for a release

1. Open a board, right click a column, **Inspect**.
2. Find the new `data-testid` for the element the badge named.
3. Open the extension's options page, scroll to **Selector overrides**.
4. Click **Load shipped defaults**, edit the one line that is wrong, **Save**.
5. Reload your Jira tab.

### Fixing it properly

Edit [`src/selectors.js`](src/selectors.js). That file is the **only** place
selectors live — `src/content.css` deliberately contains none of them, because
the stylesheet is generated at runtime so that user overrides are honoured.

Bump `SELECTORS_VERSION` to today's date whenever you re-validate or change
them. That date is shown on the options page, so it is always obvious when the
selectors were last known to be correct.

## How it works

Three facts, measured on a live board and written up in
[`docs/dom-notes.md`](docs/dom-notes.md):

1. The column scroller is `[data-testid="board.content.cell.scroll-container"]`,
   sized by a flex/grid chain rather than by `max-height`. Its overflow comes
   from a stylesheet, not an inline style, so `!important` wins.
2. `[data-testid="board.content.board-wrapper"]` already owns the board's
   horizontal scrolling. Releasing the columns turns it into the board's single
   vertical scroller too.
3. The cards are **paginated, not virtualized**. Each column starts with 8 cards
   and an IntersectionObserver sentinel at the bottom. Once the columns stop
   being scroll boxes, the sentinel's observer falls back to the board wrapper,
   so scrolling the board loads the rest for free. No code was needed for this.

One detail is easy to get wrong. Jira sizes the board through grid rows declared
as `minmax(0, 1fr)`. Setting `height: auto` on those wrappers collapses the rows
to zero and the board disappears into a 32px strip. The fix uses
`min-height: max-content` on wrappers instead.

## Privacy

No network requests. No analytics. No remote code. No data collected. The only
thing stored is your own on/off settings, in Chrome's extension storage. Full
text in [`PRIVACY.md`](PRIVACY.md).

## Known limitations

- **Very large boards render every card.** A 62-card column is about 16,000px
  tall. Scrolling stayed smooth in testing, but if yours does not, turn on
  "Skip drawing off-screen cards" in the options.
- **Old-style boards are not supported.** They use a genuinely virtualized list
  (`fast-virtual-list`), which is a different and much harder problem. The
  extension leaves them alone on purpose.
- **Drag and drop is not automatically tested.** Every drag on a real board
  moves a real work item, so it is verified by hand. It was confirmed working
  on 2026-09-18, including dragging to a column below the fold — see
  [`test/manual-checklist.md`](test/manual-checklist.md).

## Repo layout

```
manifest.json
src/
  selectors.js        every DOM selector, in one file
  content.css         selector-free styles: variables and debug colours
  content.js          activation, health check, generated stylesheet
  background.js       toolbar badge, custom-domain registration
  shared.css          popup and options styling
  popup/              on/off switches and current status
  options/            domains, selector overrides, debug
icons/                extension icons
PRIVACY.md            privacy policy (text)
store/
  listing.md          store copy, permission justifications, privacy answers
  SUBMISSION.md       step-by-step publishing guide
  privacy-policy.html privacy policy as a ready-to-host web page
  screenshots/        1280x800 listing screenshots
  *.png               promo tiles
docs/dom-notes.md     what was measured on the live board
test/manual-checklist.md
```

## Status

Verified on 2026-09-18 against `<your-site>.atlassian.net`, Chrome, on:

- a company-managed scrum board with 8 columns and 200+ cards
- the same board grouped by assignee (5 swimlanes, 40 cells)
- two team-managed boards
- an old-style board, a timeline and a backlog, all correctly untouched
