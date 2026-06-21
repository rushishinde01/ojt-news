# Conventions

## Branching

- Never commit directly to `main`
- Branch format: `type/short-description`
  - Types: `feat`, `fix`, `style`, `chore`, `refactor`, `docs`

## Commits

- Format: `type: short description` (present tense, no trailing period)
- One feature per commit

## Tech Stack

- Pure HTML, CSS, JavaScript — no frameworks, no libraries, no CDN links
- ES modules (`import`/`export`) — not `<script>` tags with globals
- `index.html` must open directly in a browser, no server needed

## File Structure

```
ojt-kanban/
├── index.html
├── style.css
├── README.md
├── CONVENTIONS.md
└── js/
    ├── main.js        # Entry point — wires all modules, binds events
    ├── state.js       # Single source of truth — all board data
    ├── render.js      # DOM updates only — reads state, writes to DOM
    ├── storage.js     # localStorage helpers only
    └── dragdrop.js    # All HTML5 Drag and Drop event handlers only
```

Do not add or remove any files from this structure.

## JavaScript Rules

- Use `const` and `let` only — never `var`
- Use `async/await` — never `.then()`
- Use `textContent` — never `innerHTML` for user-generated content
- Call `localStorage` only through `storage.js` helpers — never directly

## Module Responsibilities

### state.js
- Exports: `const state` and `function setState(newState)`
- `setState` merges updates and calls `saveBoard(state)`
- Never imports from any other project module
- Nobody mutates `state` directly — always call `setState()`

### render.js
- Exports: `function renderBoard()`
- Reads from `state` only, writes to DOM only
- Never calls `setState`, never touches `localStorage`

### storage.js
- Exports: `function saveBoard(state)` and `function loadBoard()`
- `saveBoard`: `localStorage.setItem('ojt-kanban', JSON.stringify(state))`
- `loadBoard`: `JSON.parse(localStorage.getItem('ojt-kanban'))`, return `null` if empty or parse fails
- Never called from `render.js` — only from `main.js` and `state.js`

### dragdrop.js
- Exports: `function initDragDrop()`
- Handles: `dragstart`, `dragover`, `dragenter`, `dragleave`, `drop`, `dragend`
- On `dragstart`: `setState({ draggedCardId, dragSourceColumnId })`
- On `drop`: move card between columns via `setState()`
- On `dragend`: `setState({ draggedCardId: null, dragSourceColumnId: null })`
- Always calls `renderBoard()` after a successful drop

### main.js
- Imports from all four other modules
- On `DOMContentLoaded`: loadBoard → setState (if saved) → renderBoard → initDragDrop
- Binds all add/edit/delete card event listeners

## Design Tokens

| Token | Value |
|---|---|
| Accent colour | `#534AB7` |
| Column background | `#f4f4f6` |
| Card background | `#ffffff` |
| Card border | `1px solid #e5e7eb` |
| Card shadow | `0 1px 3px rgba(0,0,0,0.06)` |
| Card border-radius | `8px` |
| Column border-radius | `12px` |
| Font | `system-ui, -apple-system, sans-serif` |
| Drag-over border | `3px solid #534AB7` (left only) |
| Drag-over background | `#f0effd` |

No gradients.

## Pull Requests

- Open every PR against `main`
- Request review from `rushishinde01`
- Do not start the next step until the current PR is approved and merged
