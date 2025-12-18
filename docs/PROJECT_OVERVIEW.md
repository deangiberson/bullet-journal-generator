# Bullet Journal Generator — Project Overview

## Goal
- Minimal web app to design printable bullet journal templates on a grid with fixed-size widgets (iPhone-style variants), drag/drop, hard snap, and blocked placement on overlap/overflow. Export to PDF that matches the on-screen layout (parity preferred; relax if needed).
- Accessibility by simplicity: clear keyboard/focus paths, minimal controls, explicit remove (big X), undo/redo for layout edits.
- Client-heavy by default; server kept thin for static delivery. PDF is client-side unless later proven infeasible.

## Layout Model
- Canvas: US Letter, portrait; working area 816×1056 px at ~96 dpi with 48 px padding on all sides → usable grid area 720×960 px.
- Grid: 24 px cells, no gutter. This yields 30 columns × 40 rows in the usable area.
- Widget sizes (v1): fixed variants snapping to the grid; allowed sizes: 1×1, 2×1, 2×2, 3×2, 3×3, 4×3, 4×4 (expand later if needed). All variants must be defined in grid cells.
- Hard snap; drop rejected on overlap or overflow. Flat plane; no z-order.
- Drag-and-drop: drag from palette or existing widgets; snap-preview ghost shows placement (blue = valid, red = blocked) before drop.
- Removal via explicit control. Undo/redo required for placement and removal.
- Import/export: JSON serialization of the layout model; load JSON to restore layout.
- Local storage only for persistence in v1.

- Catalog (expandable): current date; month calendar; 3-month calendar; notes; todo; daily schedule; habit trackers (single, multi, water, exercise, sleep, reading, no-zero-days); shopping list; goal tracker; time tracker; pomodoro tracker; project planner; morning/evening/ideal-day routines; year-at-a-glance; food tracker; calorie tracker; mood tracker; mental health tracker; sleep + sleep quality; gratitude log; medication tracker; budget planner; bill payment schedule; chore chart; cleaning routine; home + vehicle maintenance; gift list; birthday reminder; pet health; reading/TV/movie tracker; creative prompts; bucket list; dream log; lettering practice; affirmations; positive quotes; reflection + review; journal prompts; mind-map.
- Recommended v1 subset: current date; month calendar; notes; todo; daily schedule; habit tracker (multi-item, configurable labels; includes presets); mood tracker; gratitude log; goal tracker; pomodoro tracker; time tracker.

- Client-side generation targeting visual parity with the on-screen layout. Fonts, sizing, and positioning should match grid placement; parity can be relaxed if needed.
- Default paper size: US Letter, portrait.
- Stack: HTML box model (chosen) with html2canvas to rasterize the fixed-size page container and jsPDF to place the image on a US Letter PDF at 1:1 scale. Embed chosen fonts in CSS to keep screen/PDF aligned. Scripts are currently loaded from CDN in the page.

## Rendering & Export Options (evaluated)
- Pure SVG Surface: render page as SVG; export by converting SVG to PDF. Precise and scalable; needs HTML overlays for inputs/focus.
- Canvas Painter: render on canvas; export captured canvas into PDF. Simple, but text fidelity/accessibility weaker.
- HTML Box Model (chosen): use fixed-size HTML/CSS grid container with widgets in grid cells; export via DOM-to-PDF using html2canvas + jsPDF. Simple to build; parity acceptable with fixed sizes/fonts.
- Hybrid HTML/SVG: mix HTML shell with SVG for precise elements; export composite. Flexible but more complex.
- CSS Grid Snapshot: rely on CSS Grid and DOM-to-image/PDF; parity depends on capture quality.
- WebGL Scene: high performance but overkill and weak for text/accessibility.

## Architecture & Stack
- Backend: Python Flask (thin) for serving assets/minimal APIs if later needed.
- Frontend: client-side grid/layout logic and PDF generation.
- Package management: `uv`.
- Persistence: browser local storage; JSON import/export.

## JSON Import/Export
- Schema-driven JSON for layouts; include a version field for compatibility.
- On invalid JSON or schema mismatch, surface a toast with a clear error message; layout remains unchanged.

## Undo/Redo Policy
- Track add, remove, and move actions only (no resize; no content edits).
- History depth: last 50 actions.
- Undo/redo operates on the layout model; re-render reflects the state.

## Testing Approach
- BDD with `behave`: feature files cover placement, snapping/blocking, removal, undo/redo, save/reload, import/export JSON, PDF parity, keyboard/focus accessibility.
- TDD for implementation at unit/integration levels aligned to Behave steps.

## Behave Feature Coverage (current)
- Layout creation: place widgets, snap to grid, block overlaps.
- Widget removal: explicit removal control.
- Undo/redo: placement and removal.
- Persistence: save/reload via local storage; export/import JSON.
- PDF export: on-screen parity for positioned widgets.
- Accessibility: keyboard-based add/select/remove with predictable focus.

- Keyboard-first command palette triggered by `/`; `Esc` cancels any mode, `Enter` confirms, `Tab` cycles normally.
- Selection mode: press `s` after `/` to enter select; one/two-letter codes shown in the top-left of selectable items (new and existing). Codes stay stable relative to on-screen order/positions, scanning left-to-right, top-to-bottom by grid lines.
- Placement: after picking a widget, choose row then column via inline palette inputs (no prompts). Snap enforced; blocked placements show an error toast and do not change layout.
- Removal: select an existing widget via codes and press `Delete` to remove.
- Error handling: invalid row/col or blocked placement shows a toast with the error and returns to root (idle) mode.
- Focus and hints: palette and widget codes remain keyboard-addressable; clear focus states after each action; hints persist so shortcuts are discoverable.

## Known Limitations (accepted for now)
- Widgets are decorative templates only (no text entry/checks), making this a printable template tool rather than an interactive planner.
- Calendars are Monday-start only.
- PDF parity may vary slightly; font embedding and fixed sizing aim to keep it close.

## Reference Mock
- A simple structural mock lives at `docs/wireframe.html` showing header actions (new/undo/redo/import/export/PDF), widget palette on the left, US Letter portrait grid canvas with sample widgets, and hints/footer controls.

## Visual Design (guidance)
- Typeface: Inter (locked); bundled locally (woff2/woff) at 400/500/600/700 and preloaded so screen/PDF stay aligned.
- Color system: cool neutrals with a single accent (e.g., electric blue #3b6df6 or cyan #32c1ff). Dark shell option: bg #0f1115, panels #161921, borders #1f2430, text #e9edf5, muted #9aa3b5. Light option: bg #f7f8fb, panels #ffffff, borders #d8dde6, text #1b1f2a, muted #6b7280.
- Layout/shape: 8 px spacing scale, 8–10 px corner radius, 1 px borders/dividers, subtle shadows on widgets.
- Components: compact header with pill buttons; primary action in accent. Palette with minimal outlines and subtle hover/focus glow. Canvas grid crisp; widgets with thin border, soft shadow; code badges top-right with accent text on muted background. Toasts bottom-right/center with short text and accent edge.
- Motion: light transitions (150–200 ms fades/scale), avoid heavy animation. Line icons, no skeuomorphism.
