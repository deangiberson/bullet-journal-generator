# Widget Spec TODOs (fill in per widget)

Global guidance from answers so far:
- Calendars bind to current date/month by default (can expand later).
- Widgets are decorative; no state persistence inside the widget itself.
- Size limits: max width = full document width; max height = full document height. Min width/height must be decided per widget.
- All variants must map explicitly to grid cell sizes (no freeform sizing).
- Grid reference: 30 cols × 40 rows of 24 px cells (720×960 px usable). Variant sizes below are expressed as width×height in grid cells and should snap exactly to that grid.

For each widget below, please fill in:
- Min width (in grid cells)
- Min height (in grid cells)
- Fields/structure (even if decorative)
- Presets/default labels (if any)
- Interactivity (if any; currently decorative)
- Visual variants (e.g., small/large layouts)
- Styling constraints (colors/lines/fonts if special)

## Current Date
- Min width: 6 cells (room for full date string)
- Min height: 2 cells
- Fields/structure: today’s date (e.g., weekday, month name, day number, year) displayed; no editable fields.
- Presets/defaults: formats like “Mon • Jan 15, 2025” (weekday + dot + month abbrev + day + year).
- Interactivity: none (decorative).
- Visual variants: compact (6×2) and large (8×3) allowing larger typography and stacked lines if desired.
- Styling constraints: centered text; accent color for weekday/day number; neutral background with thin border.

## Month Calendar
- Min width: 14 cells (two cells per weekday column for legibility)
- Min height: 8 cells (header + weekday labels + up to 6 weeks)
- Fields/structure: current month name/year header; 7-column week grid showing dates; weekday labels row above the grid.
- Presets/defaults: starts on Monday (decide if Sunday needed later); uses current month automatically.
- Interactivity: none (decorative).
- Visual variants: compact (14×8) and roomy (16×9) to give breathing room for labels and day numbers.
- Styling constraints: clean grid lines; header with accent text; muted day labels; dates aligned center in cells.

## 3-Month Calendar
- Min width: 22 cells (three month blocks across with shared weekday labels)
- Min height: 8 cells
- Fields/structure: three month headers (current, next, following) each with a compact 7-column grid; single row of weekday labels shared across the top of the three grids.
- Presets/defaults: auto-populates current + next two months; Monday start (can add Sunday later).
- Interactivity: none (decorative).
- Visual variants: compact (22×8) showing three tight grids; roomy (24×9) for more readable cells and spacing between months.
- Styling constraints: condensed grids with thin lines; headers in accent; muted weekday labels; tight spacing to keep three months legible.

## Notes
- Min width: 10 cells
- Min height: 8 cells
- Fields/structure: blank lined or dotted area for notes; optional header label “Notes.”
- Presets/defaults: dotted background or faint lines; header on by default.
- Interactivity: none (decorative).
- Visual variants: compact (10×8) and expanded (14×12) to allow more space for writing.
- Styling constraints: light dotted/ruled pattern; thin border; header in accent if present.

## Todo
- Min width: 9 cells
- Min height: 8 cells
- Fields/structure: list area with checkbox markers and text lines; optional header “Todo.”
- Presets/defaults: show 5–7 lines with empty checkboxes; header on by default.
- Interactivity: none (decorative).
- Visual variants: compact (9×8) with ~7 lines; medium (12×12) with ~10–12 lines.
- Styling constraints: muted checkbox outlines; thin border; header in accent; lines spaced evenly.

## Daily Schedule
- Min width: 12 cells (time column + text area)
- Min height: 12 cells
- Fields/structure: time slots list (e.g., hourly) with space for brief text; optional header “Schedule.”
- Presets/defaults: hours 8a–6p by default (hourly slots); header on.
- Interactivity: none (decorative).
- Visual variants: compact (12×12) with condensed hours; roomy (14×16) with extended hours and more spacing.
- Styling constraints: alternating row shading or subtle dividers; thin border; header in accent; aligned time column on the left.

## Habit Tracker (multi-item, configurable labels; includes presets)
- Min width: 14 cells (labels column + 7 day columns)
- Min height: 6 cells
- Fields/structure: habit labels column + day columns (e.g., Mon–Sun) with check/circle boxes; optional header “Habits.”
- Presets/defaults: 5 habits with labels; week view Mon–Sun.
- Interactivity: none (decorative).
- Visual variants: compact (14×6) for up to ~5 habits; medium (16×8) for up to ~8 habits; could offer 2-week variant later.
- Styling constraints: light grid with muted day labels; accent for header; consistent cell size.

## Mood Tracker
- Min width: 10 cells (month grid + legend)
- Min height: 8 cells
- Fields/structure: grid of days with mood markers (icons or color swatches) and a legend for mood labels; optional header “Mood.”
- Presets/defaults: current month days laid out in a simple grid; 4 mood labels in legend.
- Interactivity: none (decorative).
- Visual variants: compact (10×8) with compact markers; medium (12×10) with larger markers and legend space.
- Styling constraints: consistent marker size; legend uses accent for labels; keep overall palette minimal to avoid clutter.

## Gratitude Log
- Min width: 8 cells
- Min height: 5 cells
- Fields/structure: list of short lines or bullets; optional header “Gratitude.”
- Presets/defaults: 5 lines with bullets; header on.
- Interactivity: none (decorative).
- Visual variants: compact (8×5) and medium (10×8) for more lines (~8–10).
- Styling constraints: simple bullets or dashes; thin border; header in accent.

## Goal Tracker
- Min width: 9 cells
- Min height: 6 cells
- Fields/structure: list of goals with progress indicators (e.g., small bars or checkboxes); optional header “Goals.”
- Presets/defaults: 3–5 goal slots with empty progress bars/boxes; header on.
- Interactivity: none (decorative).
- Visual variants: compact (9×6) with compact bars; medium (12×8) with more breathing room and longer bars.
- Styling constraints: thin progress outlines; accent for bar fill or check markers; thin border; header in accent.

## Pomodoro Tracker
- Min width: 8 cells
- Min height: 4 cells
- Fields/structure: visual representation of pomodoro sessions (e.g., 4 circles per set) with a header “Pomodoro.”
- Presets/defaults: 2 sets shown, each with 4 empty circles; header on.
- Interactivity: none (decorative).
- Visual variants: compact (8×4) with two sets; medium (10×6) allowing three sets/spacing.
- Styling constraints: circles outlined; fill accent for completed; thin border; header in accent.

## Time Tracker (basic time blocks)
- Min width: 12 cells
- Min height: 5 cells
- Fields/structure: horizontal or vertical blocks representing chunks of time; optional header “Time Blocks.”
- Presets/defaults: 3–4 generic blocks spanning the row; header on.
- Interactivity: none (decorative).
- Visual variants: compact (12×5) with horizontal blocks; medium (14×7) to allow labels per block and a small legend.
- Styling constraints: outlined blocks with accent fill portion; thin border; header in accent.
