# Phase 0 — DOM notes

Recorded against the live **modernised** Jira Cloud board on
`https://<your-site>.atlassian.net`, 2026-09-18, Chrome, viewport 1440 x 800.

Boards inspected:

| Board | URL shape | Type | Modern board? | Cells | Cards in DOM |
|---|---|---|---|---|---|
| Board A (the main test board) | `/jira/software/projects/<KEY>/boards/<id>` | company-managed scrum | **yes** | 8 (no grouping) / 40 (grouped) | 54 initially |
| Board B | `/jira/software/projects/<KEY>/boards/<id>` | company-managed scrum | **yes** | 40 | 132 |
| Board C | `/jira/software/projects/<KEY>/boards/<id>` | team-managed | **yes** | 3 | 6 |
| Board D | `/jira/software/projects/<KEY>/boards/<id>` | team-managed | **yes** | 5 | 1 |
| Board E | `/jira/software/c/projects/<KEY>/boards/<id>` | company-managed kanban | **no** (legacy) | — | — |

Important: the modernised board is **already live on company-managed boards**
on this site, and the legacy board still exists on other company-managed
boards. So the URL alone cannot tell the two apart — a DOM check is required.

---

## Answers to the Phase 0 questions

### What element is the board root?

`div[data-testid="board.content.board-wrapper"]` — exactly one per board page.

This element is also the **horizontal scroll container**
(`overflow: auto`, `scrollWidth` 1784 vs `clientWidth` 1105 on Board A) and
the vertical scroll container for the swimlane layout.

Its computed layout at rest: `display: grid`,
`grid-template-columns: <board width> 40px` (the 40px column is the
"add column" rail), `grid-template-rows: <viewport-derived px>`.

### What is the scroll container for each column?

`div[data-testid="board.content.cell.scroll-container"]`, `role="list"`.

- `overflow-x: hidden; overflow-y: auto` — set by **stylesheet**, not inline.
- Height comes from a **flex/grid chain**, not from `max-height`.
  Measured `max-height: none`, `height: 447px`, `scrollHeight: 2300`.
- `style` attribute is `null`. No inline styles anywhere on the chain except
  two cosmetic background declarations, and **none use `!important`**, so a
  stylesheet rule with `!important` wins everywhere.

### What is the scroll container for each swimlane?

`div[data-testid="board.content.swimlane.scroll-container"]` — one per
swimlane, present only when grouping is on (`?groupBy=assignee`, `groupBy=custom`).

Observed with `overflow-y: visible` in the grouped view on this site (the
board wrapper was doing the scrolling), but it is treated defensively in the
CSS because Jira sizes it from the same flex chain.

### Virtualized or paginated?

**Paginated. Not virtualized.** Evidence:

- Cards are `position: relative`, `transform: none`, no inline `style`,
  no absolute positioning, no spacer element.
- Each scroll container holds exactly **8 cards** on first paint, then
  two trailing siblings: a **40px** div (loading strip) and a **0px** div
  (the IntersectionObserver sentinel).
- After the fix was applied, card count rose 54 → 180 → 205 without any
  synthetic scroll events. The sentinel's IntersectionObserver root falls
  back to the nearest scrollport, which is now the board wrapper, so
  pagination fires for free as the board scrolls.

This is **Phase 2 Case A**, and it needed no code.

### How is "load more" triggered?

IntersectionObserver on the 0px sentinel div at the end of each
`board.content.cell.scroll-container`. There is no visible "Show more" button
and no scroll listener that needed nudging.

### Which ancestors constrain height?

Chain from the column scroll container up to `<html>` on Board A
(no grouping, 1440 x 800 viewport):

| # | Element | overflow x/y | height | notes |
|---|---|---|---|---|
| 0 | `board.content.cell.scroll-container` | hidden / auto | 447px | **the column scroller** |
| 1 | `board.content.cell` | visible | 533px | `display: grid`, `grid-template-rows: 44px 453px 36px`, `max-height: 100%` |
| 2 | (unnamed div) | visible | 533px | `display: flex` |
| 3 | (unnamed div) | visible | 533px | `display: flex`, holds all columns in a row |
| 4 | `board.content.board-wrapper` | **auto / auto** | 580px | owns horizontal **and** vertical scroll |
| 5–10 | (unnamed divs) | visible | — | grid/flex/block wrappers, rows sized `minmax(0, 1fr)` |
| 11 | `page-layout.main` | auto / auto | 752px | `position: sticky` |
| 12 | `page-layout.root` | visible | 800px | `display: grid`, `min-height: 100vh`, rows `0px 48px 752px` |
| 14 | `body` | hidden / auto | 800px | — |
| 15 | `html` | visible | 800px | — |

The height is handed down through `minmax(0, 1fr)` grid rows. That detail
matters: setting `height: auto` on those grid ancestors makes the `1fr` rows
collapse to **0**, because an `fr` track with a `0` minimum has no base size
when the container has no definite height. This is why the fix uses
`min-height: max-content` rather than `height: auto` on wrapper elements.

### Is the column header a separate sibling from the card list?

**Yes.** `board.content.cell` is a 3-row grid:

1. `board.content.cell.column-header` (44px)
2. `board.content.cell.scroll-container` (flexible)
3. an unnamed footer div with the "Create" button (36px)

So the header can be made `position: sticky` without touching the card list.

### Does horizontal scroll live on the board root?

Yes — on `board.content.board-wrapper` itself. Nothing else on the chain
scrolls horizontally, so that element must keep `overflow-x: auto`.

### Is there a stable way to tell a board page from other pages?

URL is **not** sufficient on its own (company-managed modern boards and
company-managed legacy boards share the `/jira/software/projects/.../boards/<id>`
shape, and `/c/` appears on some legacy boards).

The reliable test is the presence of `[data-testid="board.content.board-wrapper"]`
**plus** at least one `[data-testid="board.content.cell.scroll-container"]`.
The URL pattern is used only as a cheap first filter to avoid running the DOM
check on obviously wrong pages.

Confirmed no-ops (no `board-wrapper` in the DOM):

- Backlog
- Timeline
- Legacy board (`platform-board-kit.*` / `software-board.*` test ids, and a
  `fast-virtual-list` — that board **is** virtualized, another reason not to
  touch it)

---

## The fix that was validated live

Board-area scrolling: the column scrollers are released and
`board.content.board-wrapper` becomes the single scroll container for the
board. Jira's top bar, left sidebar and project tabs stay in place.

Measured on Board A after applying it:

- Inner column scrollbars: **8 → 0**
- Cards in DOM: **54 → 205** (all 62 "To Do" items loaded by scrolling)
- Board wrapper: `scrollHeight` 16710, `clientHeight` 565 — one scrollbar
- Horizontal scroll: still present (`scrollWidth` 1784 vs `clientWidth` 1105)
- Sticky column headers: working

**Drag and drop: confirmed working by hand on 2026-09-18**, including dragging
to a column below the fold. Pragmatic drag and drop auto-scrolls the nearest
scroll container, which is now `board.content.board-wrapper`, so no custom
auto-scroll code was needed.

## What is still unverified

- **Swimlane overflow under load.** The grouped view on this site had only
  2–3 cards per cell, so no swimlane actually overflowed. The swimlane rule is
  defensive.
- **Team-managed boards with many cards.** Both team-managed boards here are
  nearly empty. The selectors are identical to the company-managed modern
  board, so the risk is low.
