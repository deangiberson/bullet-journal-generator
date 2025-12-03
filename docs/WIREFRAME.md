# UI Wireframe (Textual)

```
┌───────────────────────────────────────────────────────────────┐
│ Header                                                        │
│ ├─ Logo/Title: Bullet Journal Builder                         │
│ ├─ Actions: [New Page] [Undo] [Redo] [Import JSON] [Export JSON] [Export PDF] │
│ └─ Status: “US Letter · Portrait · Grid on”                   │
├───────────────────────────────────────────────────────────────┤
│ Left Panel: Widget Palette                                    │
│ ├─ Search/Filter                                              │
│ ├─ Categories:                                                │
│ │   · Essentials: Current Date, Notes, Todo, Daily Schedule   │
│ │   · Trackers: Habit, Mood, Gratitude, Pomodoro, Time        │
│ │   · Calendars: Month, 3-Month                               │
│ └─ Add control per item (keyboard focusable; Enter/Space adds)│
├───────────────────────────────────────────────────────────────┤
│ Main Area: Page Canvas (US Letter, portrait, grid visible)    │
│ ┌───────────────────────────────────────────────────────────┐ │
│ │                                                           │ │
│ │  [Grid cells; widgets snap; blocked drops show outline]   │ │
│ │                                                           │ │
│ │  Widget chrome (example):                                 │ │
│ │   ┌─────────────┐                                         │ │
│ │   │ Notes       │  ⓧ Remove (big X)                       │ │
│ │   └─────────────┘                                         │ │
│ │  Keyboard: tab/arrow to focus widgets; Delete activates X │ │
│ └───────────────────────────────────────────────────────────┘ │
├───────────────────────────────────────────────────────────────┤
│ Bottom Bar (optional)                                        │
│ ├─ Grid controls: [Show/Hide Grid] [Zoom +/–]                │
│ └─ Hints: “Tab to navigate widgets. Space to place. Del to remove.” │
└───────────────────────────────────────────────────────────────┘
```

## Notes
- Fixed-size widget variants (pre-sized blocks). No z-order; drop blocked if overlap/out-of-bounds.
- Hard snap to grid; rejected drop shows feedback and leaves layout unchanged.
- Undo/redo for add/remove moves.
- Import/Export: JSON of the layout model; PDF export should match canvas layout.
- Accessibility by simplicity: all controls reachable via keyboard; clear focus states; removal via visible “X”; predictable focus after actions.
