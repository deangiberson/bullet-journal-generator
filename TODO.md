# TODO

- Frontend polish
  - Render real widget visuals per `docs/WIDGET_SPEC_TODO.md` (not just titles); ensure each variant uses grid-based sizing only.
  - Add schema validation for JSON import/export; surface toast on schema/parse error without mutating state.
  - Improve PDF export fidelity: embed chosen font, lock scaling, and sanity-check html2canvas/jsPDF output against the 816×1056 canvas.
  - Make drag ghost honor zoom (if zoom is extended) and refine invalid/blocked feedback.
  - Add optional grid toggle state indicator in UI status line.

- Application logic
  - Flesh out widget catalog defaults/presets and enforce min sizes per spec.
  - Implement history limits and no-op detection across all actions; add visual undo/redo disabled states.
  - Validate import payload versioning for forward compatibility.

- Testing
  - Implement Behave step definitions in `features/steps/step_stubs.py`.
  - Add unit/integration tests for grid math, placement blocking, history (depth 50), import/export validation, and PDF hook invocation.

- Documentation
  - Update `AGENTS.md` and `docs/PROJECT_OVERVIEW.md` to reflect current UI, drag-and-drop ghost behavior, and PDF stack.
  - Fill remaining widget questions in `docs/WIDGET_SPEC_TODO.md` (min sizes already seeded).

- Packaging/ops
  - Confirm dev workflow (`uv run flask --app app run --debug`) and document default port.
