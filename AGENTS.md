# AGENTS README (work in progress)

- Root plan: see `docs/PROJECT_OVERVIEW.md` for full specs (grid sizing, accessibility model, PDF path) and `docs/WIDGET_SPEC_TODO.md` for per-widget sizing. Visual mock at `docs/wireframe.html`.

- Build a minimal web application that lets users create printable bullet journal pages on a grid template with drag-and-drop widgets and ultimately export to PDF.
- Favor client-side rendering/interaction for the page builder unless there is a clear reason it cannot meet requirements (performance, security, or PDF fidelity).

## Stack & Tooling
- Backend: Python Flask for serving the app and any required APIs.
- Package management: `uv`.
- Testing: test-driven development; behavior-driven development with `behave`.

## Product Notes
- Core experience: grid-based canvas with fixed-size widgets (think iPhone widget variants), hard snap, and blocked drops if a widget does not fit; flat plane with no z-order. Drag from the palette or move existing widgets shows a snap preview ghost (blue for valid, red for blocked) before dropping.
- Accessible by simplicity: minimal controls, clear focus/keyboard paths, simple add/remove (big X), and undo/redo for layout edits. Keyboard palette opens with “/”; select with “s”; codes scan left→right/top→bottom; row/col placement is prompted today.
- Reusable widgets (e.g., text, checklist, habit tracker), drag-and-drop placement, and page layout persistence for printable templates (widgets are decorative).
- Output goal: generate a PDF of the composed page(s) that matches the on-screen layout (parity preferred; relax if needed). Rendering/export choice: HTML box model + html2canvas + jsPDF with embedded fonts and fixed sizing (scripts loaded in the page).
- Client-heavy by default for rendering and PDF; server only if later proven necessary.
- Default paper size: US Letter, portrait (changeable later).

## Engineering Approach
- Begin with high-level behaviors (behave features) describing user flows for creating and exporting pages, then drive implementation with TDD at the unit/integration level.
- Keep Flask thin: static asset delivery + minimal APIs to support persistence/export only if the client cannot cover the need.

## Initial Decisions
- No authentication; local/device storage only for now.
- Import/export is JSON: dump/load the working layout model.
- Grid layout: fixed-size widget variants; hard snap; drops rejected if they overlap or do not fit; no z-order; undo/redo required; removal via explicit control.
- PDF generation is client-side via html2canvas + jsPDF; server PDF only if later proven necessary.
- Starter widget set (can expand): current date; month calendar; 3-month calendar; notes; todo; daily schedule; habit trackers (single, multi, water, exercise, sleep, reading, no-zero-days); shopping list; goal tracker; time tracker; pomodoro tracker; project planner; morning/evening/ideal-day routines; year-at-a-glance; food tracker; calorie tracker; mood tracker; mental health tracker; sleep + sleep quality; gratitude log; medication tracker; budget planner; bill payment schedule; chore chart; cleaning routine; home + vehicle maintenance; gift list; birthday reminder; pet health; reading/TV/movie tracker; creative prompts; bucket list; dream log; lettering practice; affirmations; positive quotes; reflection + review; journal prompts; mind-map.

## Outstanding Items
- Finalize per-widget specs (min sizes, structure/presets) in `docs/WIDGET_SPEC_TODO.md`.
- Lock font choice and embed for screen/PDF alignment.

## Recommended Initial Widget Set (v1)
- Current date
- Month calendar
- Notes
- Todo
- Daily schedule
- Habit tracker (multi-item, configurable labels; includes water/exercise/sleep/reading/no-zero-days presets)
- Mood tracker
- Gratitude log
- Goal tracker
- Pomodoro tracker
- Time tracker (basic time blocks)

## Next Behave Targets
- Create an empty page and place widgets on the grid (snap/block on overlap).
- Remove a widget and verify it disappears.
- Undo/redo placement/removal.
- Save layout to local storage and reload it.
- Export the current layout to PDF with on-screen parity.
- Behave specs live in `features/*.feature`; step stubs in `features/steps/step_stubs.py`.
