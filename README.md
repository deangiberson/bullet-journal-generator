# Bullet Journal Generator

A minimal web app for designing printable bullet journal templates with a grid-based, drag-and-drop interface. Create custom page layouts using fixed-size widgets and export them as print-ready PDFs.

## Overview

Bullet Journal Generator helps you design custom bullet journal pages by placing pre-styled widgets (calendars, trackers, notes, etc.) on a grid canvas. The interface uses hard snap placement to ensure everything aligns perfectly, and exports directly to PDF with pixel-perfect fidelity to what you see on screen.

**Key Philosophy:**
- Simplicity first: minimal controls, clear visual feedback
- Grid-based design: everything snaps to a 24px grid
- Print-ready output: PDF export matches on-screen layout exactly
- Client-heavy architecture: rendering and PDF generation happen in the browser

## Features

- **Grid-Based Canvas**: US Letter portrait layout (816×1056px) with 30×40 grid (24px cells)
- **13 Widget Types**: Current Date, Month Calendar, 3-Month Calendar, Notes, Todo, Daily Schedule, Habit Tracker, Mood Tracker, Gratitude Log, Goal Tracker, Pomodoro Tracker, Time Tracker
- **Drag & Drop**: Drag widgets from palette or reposition existing ones
- **Smart Placement**: Visual snap preview (blue = valid, red = blocked)
- **Collision Detection**: Prevents overlapping widgets and overflow
- **Undo/Redo**: Full history of layout changes
- **PDF Export**: Client-side export with embedded fonts via html2canvas + jsPDF
- **Import/Export**: Save and share layouts as JSON
- **Local Persistence**: Automatic save to browser storage

## Tech Stack

**Frontend:**
- Vanilla JavaScript (drag-and-drop, grid logic, history management)
- HTML5 Canvas for rendering
- CSS with Inter font (400/500/600/700 weights)
- html2canvas + jsPDF for PDF export

**Backend:**
- Flask 3.0+ (minimal server for static delivery)
- Python 3.12+

**Development:**
- uv for package management
- Behave for BDD testing
- Git with conventional commits

## Getting Started

### Prerequisites

- Python 3.12 or higher
- [uv](https://github.com/astral-sh/uv) package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd bullet-journal-generator
```

2. Install dependencies:
```bash
uv sync
```

### Running the Application

Start the development server:

```bash
uv run flask --app app run --debug
```

The app will be available at `http://localhost:5000`

### Building for GitHub Pages

To build the static site for GitHub Pages deployment:

```bash
uv run python build.py
```

This will:
- Convert the Flask template to static HTML
- Copy all assets to the `/docs` folder
- Create a `.nojekyll` file for GitHub Pages

After building, commit the `/docs` folder and configure your GitHub repository:
1. Go to Settings → Pages
2. Set Source to "Deploy from a branch"
3. Select your main branch and `/docs` folder
4. Save and wait for deployment

## Usage

### Creating a Layout

1. **Add Widgets**: Drag widgets from the palette on the left onto the canvas
2. **Position**: Widgets snap to the grid automatically
   - Blue ghost = valid placement
   - Red ghost = blocked (overlapping or out of bounds)
3. **Remove**: Click the "×" button on any widget to remove it
4. **Undo/Redo**: Use the toolbar buttons to step through changes

### Exporting

- **PDF**: Click "Export PDF" to generate a print-ready file
- **JSON**: Click "Export Layout" to save your design as JSON
- **Import**: Click "Import Layout" to load a previously saved JSON

### Grid Reference

- **Canvas**: 816×1056px with 48px padding on all sides
- **Usable Area**: 720×960px (30 columns × 40 rows)
- **Cell Size**: 24px × 24px
- **No Gutters**: Cells are edge-to-edge

## Project Structure

```
bullet-journal-generator/
├── app.py                  # Flask application
├── static/
│   ├── app.js             # Client-side logic (grid, drag-drop, history)
│   └── styles.css         # Styling and layout
├── templates/
│   └── index.html         # Main application template
├── docs/
│   ├── AGENTS.md          # Project mission and context
│   ├── PROJECT_OVERVIEW.md # Architecture and design decisions
│   ├── WIDGET_SPEC_TODO.md # Widget specifications
│   └── WIREFRAME.md       # UI wireframes
├── features/              # Behave feature files
│   └── steps/            # Step definitions
├── pyproject.toml        # Python dependencies
└── README.md             # This file
```

## Development

### Architecture

- **Client-Heavy**: All rendering, PDF generation, and layout logic runs in the browser
- **Server-Thin**: Flask serves static files only; no server-side rendering or state
- **Flat Layout**: Widgets have no z-order; later additions don't overlap earlier ones
- **Grid Model**: All positions and sizes expressed in 24px grid cells
- **Dual Deployment**: Flask app for local development, static build for GitHub Pages (via `build.py`)

### Widget Specifications

All widgets are defined in `docs/WIDGET_SPEC_TODO.md` with:
- Minimum width/height in grid cells
- Visual variants (compact, medium, large)
- Field structure and presets
- Styling constraints

See the spec file for complete details on all 13 widget types.

### Code Organization

- `app.js:1-100` - Grid utilities and placement logic
- `app.js:101-300` - Drag-and-drop handlers
- `app.js:301-400` - History management (undo/redo)
- `app.js:401-500` - Widget rendering
- `app.js:501+` - Export/import and persistence

## Testing

Run BDD tests with Behave:

```bash
uv run behave
```

Current feature coverage:
- Widget placement and snapping
- Collision detection and blocking
- Widget removal
- Undo/redo operations
- Layout persistence (save/reload)
- JSON import/export validation
- PDF export fidelity

## Design System

**Colors:**
- Accent: Electric blue (#3b6df6) or cyan (#32c1ff)
- Dark theme: bg #0f1115, panels #161921, text #e9edf5
- Light theme: bg #f7f8fb, panels #ffffff, text #1b1f2a

**Typography:**
- Font: Inter (locally bundled)
- Weights: 400 (regular), 500 (medium), 600 (semi-bold), 700 (bold)

**Spacing:**
- 8px base scale
- 8-10px border radius
- 1px borders/dividers

**Motion:**
- 150-200ms transitions
- Subtle fades and scale effects
- Minimal animation

## Roadmap

See `TODO.md` and `.beads/issues.jsonl` for current task tracking.

**Upcoming:**
- Widget resizing and configuration
- Additional widget variants
- Multi-page layouts
- Keyboard shortcuts (deferred)
- Theme switcher

## Contributing

This project follows:
- BDD with Behave for feature development
- TDD for unit/integration tests
- Conventional commit messages
- No pre-commit hook skipping

See `AGENTS.md` for detailed project context and development guidelines.

## License

[Add your license information here]

## Links

- **Project Documentation**: See `docs/` directory
- **Widget Specs**: `docs/WIDGET_SPEC_TODO.md`
- **Architecture**: `docs/PROJECT_OVERVIEW.md`
- **Wireframes**: `docs/WIREFRAME.md`

---

For detailed project mission, design decisions, and development context, see `AGENTS.md`.
