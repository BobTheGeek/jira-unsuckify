# Manual test checklist

Run on a **new-style** board with at least 3 columns and more cards than fit on
screen. If the toolbar badge shows a red `!`, stop — a selector is broken and
nothing below will pass.

Legend: `[x]` = verified by automation on 2026-09-18 against
a company-managed board with 8 columns and 200+ cards.
`[ ]` = still needs a human.

## Layout

- [x] No inner vertical scrollbars in columns (no grouping) — 8 scrollers, 0 scrolling
- [x] No inner vertical scrollbars in swimlanes (Group by Assignee) — 5 swimlanes, 0 scrolling
- [x] The board scrolls vertically as one — wrapper `scrollHeight` 16710 vs `clientHeight` 565
- [x] Horizontal board scroll still works — wrapper `scrollWidth` 1784 vs `clientWidth` 1105
- [ ] Column headers stay visible while scrolling (sticky on)
- [ ] Column headers scroll away normally when sticky is turned off
- [ ] Nothing shows through behind a sticky header

## Loading

- [x] A column with 60+ cards fully loads while scrolling the board — 54 cards at first paint, 205 after
- [ ] Scrolling to the bottom of a 200-card board feels smooth
- [ ] If it does not, "Skip drawing off-screen cards" in Options makes it smooth

## Interaction — needs a human

Each of these moves or edits a real work item, so none of them are automated.

**Drag and drop was confirmed working by hand on 2026-09-18.** No custom
auto-scroll code was needed: Pragmatic drag and drop follows the nearest scroll
container, which is now `board.content.board-wrapper`.

- [x] Drag a card between two adjacent columns
- [x] Drag a card to a column that is below the fold — the board auto-scrolls during the drag
- [ ] Drag a card to a different swimlane (not separately confirmed)
- [ ] Inline edit assignee on a card
- [ ] Inline edit priority on a card
- [ ] Click a card, detail opens (sidebar mode)
- [ ] Click a card, detail opens (modal mode)
- [ ] Expand and collapse the subtask summary on a card
- [ ] Collapse and expand a single column
- [ ] Collapse and expand all swimlanes with the `-` key
- [ ] Keyboard shortcuts still work

## Activation

- [x] Turning the extension off restores the original layout with no reload — inner scrollbars returned, wrapper back to 565px
- [x] Turning it back on re-applies cleanly
- [x] Board → Backlog via in-app nav deactivates it
- [x] Backlog → Board via in-app nav reactivates it
- [x] Timeline page is untouched
- [x] Old-style board is untouched
- [ ] Backlog, list, reports and summary pages look normal
- [ ] Full-screen board mode works
- [ ] Works on a second Jira site or a custom domain added in Options

## Failure handling

- [x] A selector that matches nothing makes the extension refuse to activate — reported `selector-broken`, board left in its original state
- [ ] The toolbar badge shows a red `!` in that case, and the tooltip names the selector
- [ ] The popup explains what broke and points at Options

## How the automated rows were checked

`src/selectors.js` and `src/content.js` were loaded verbatim into a live board
with a shimmed `chrome` API, then the resulting layout was measured. The scripts
are in the session scratchpad; re-running them needs a logged-in Jira session.
