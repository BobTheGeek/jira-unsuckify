/**
 * Single source of truth for every DOM selector this extension uses.
 *
 * All of these were read off a live modernised Jira Cloud board. See
 * docs/dom-notes.md for where each one came from and what it looked like.
 *
 * If Jira changes its DOM, this is the only file that should need editing.
 * Bump SELECTORS_VERSION whenever a selector is re-validated or changed.
 */
(function (global) {
  "use strict";

  const SELECTORS_VERSION = "2026-09-18";

  const SELECTORS = {
    /**
     * The board root. Also the horizontal scroll container, and — after this
     * extension runs — the single vertical scroll container for the board.
     * Required: its absence means "not a modern board page".
     */
    boardWrapper: '[data-testid="board.content.board-wrapper"]',

    /**
     * One column. A 3-row grid: header / card scroller / create-button footer.
     */
    cell: '[data-testid="board.content.cell"]',

    /**
     * The per-column scroll container we are getting rid of.
     */
    cellScroller: '[data-testid="board.content.cell.scroll-container"]',

    /**
     * The column header. A sibling of cellScroller, so it can be made sticky.
     */
    columnHeader: '[data-testid="board.content.cell.column-header"]',

    /**
     * The per-swimlane scroll container. Only present when grouping is on.
     * Optional: a board with no grouping has none.
     */
    swimlaneScroller: '[data-testid="board.content.swimlane.scroll-container"]',

    /**
     * A single work item card. Used for the debug overlay and for the
     * content-visibility performance mitigation.
     */
    card: '[data-testid="board.content.cell.card"]',
  };

  /**
   * Selectors that must each match at least one element before the extension
   * is allowed to activate. If any of these miss, we stay completely inert
   * rather than half-applying a layout change.
   */
  const REQUIRED = ["boardWrapper", "cell", "cellScroller"];

  /**
   * Cheap first filter, applied to location.pathname before we touch the DOM.
   *
   * Matches:
   *   /jira/software/projects/HG/boards/72
   *   /jira/software/c/projects/M1M/boards/889
   *   /jira/software/projects/AIL/boards/612
   *
   * Rejects anything with a further path segment, which is how backlog,
   * timeline, reports, list and summary views are excluded.
   *
   * This is deliberately loose. The real decision is the DOM health check,
   * because legacy and modern boards share this URL shape.
   */
  const BOARD_PATH_RE =
    /^\/jira\/software\/(?:c\/)?projects\/[^/]+\/boards\/\d+\/?$/;

  /**
   * Hosts the content script is registered for without any extra permission.
   * Other hosts are added by the user on the options page.
   */
  const DEFAULT_HOST_MATCH = "https://*.atlassian.net/*";

  global.JBU_SELECTORS = {
    SELECTORS_VERSION,
    SELECTORS,
    REQUIRED,
    BOARD_PATH_RE,
    DEFAULT_HOST_MATCH,
  };
})(typeof globalThis !== "undefined" ? globalThis : window);
