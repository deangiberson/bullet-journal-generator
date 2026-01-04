(function () {
  const GRID = {
    cell: 24,
    padding: 48,
    usableWidth: 720,
    usableHeight: 960,
    totalWidth: 816,
    totalHeight: 1056,
    get cols() {
      return this.usableWidth / this.cell;
    },
    get rows() {
      return this.usableHeight / this.cell;
    },
  };

  const PDF_EXPORT_SCALE = 2;
  const WIDGETS = [
    { id: "current-date", name: "Current Date", defaultSize: [6, 2] },
    { id: "month-calendar", name: "Month Calendar", defaultSize: [14, 8] },
    { id: "three-month-calendar", name: "3-Month Calendar", defaultSize: [22, 8] },
    { id: "notes", name: "Notes", defaultSize: [10, 8] },
    { id: "todo", name: "Todo", defaultSize: [9, 8] },
    { id: "daily-schedule", name: "Daily Schedule", defaultSize: [12, 12] },
    { id: "habit-tracker", name: "Habit Tracker", defaultSize: [14, 6] },
    { id: "mood-tracker", name: "Mood Tracker", defaultSize: [10, 8] },
    { id: "gratitude-log", name: "Gratitude Log", defaultSize: [8, 5] },
    { id: "goal-tracker", name: "Goal Tracker", defaultSize: [9, 6] },
    { id: "pomodoro-tracker", name: "Pomodoro Tracker", defaultSize: [8, 4] },
    { id: "time-tracker", name: "Time Tracker", defaultSize: [12, 5] },
  ];

  const WIDGET_LABELS = {
    notes: "Notes",
    todo: "Todo",
    "daily-schedule": "Schedule",
    "habit-tracker": "Habits",
    "mood-tracker": "Mood",
    "gratitude-log": "Gratitude",
    "goal-tracker": "Goals",
    "pomodoro-tracker": "Pomodoro",
    "time-tracker": "Time Blocks",
  };

  const TITLELESS_WIDGETS = new Set(["current-date", "month-calendar", "three-month-calendar"]);
  const WEEKDAY_LABELS = ["M", "T", "W", "T", "F", "S", "S"];

  const CATEGORIES = [
    { name: "Essentials", ids: ["current-date", "notes", "todo", "daily-schedule"] },
    { name: "Trackers", ids: ["habit-tracker", "mood-tracker", "gratitude-log", "pomodoro-tracker", "time-tracker", "goal-tracker"] },
    { name: "Calendars", ids: ["month-calendar", "three-month-calendar"] },
  ];
  const PALETTE_WIDGET_IDS = Array.from(new Set(CATEGORIES.flatMap((c) => c.ids)));

  const STORAGE_KEY = "bjg-layout-v1";
  const pageInner = document.getElementById("page-inner");
  const categoriesEl = document.getElementById("widget-categories");
  const toastContainer = document.getElementById("toast-container");
  const statusLine = document.getElementById("status-line");
  let ghostEl = null;

  const fontsReady = loadInterFonts();

  const state = {
    widgets: [],
    history: [],
    future: [],
    showGrid: true,
    zoom: 1,
    selectedId: null,
    drag: null,
  };

  function loadInterFonts() {
    if (!(document.fonts?.load)) {
      return Promise.resolve();
    }
    const weights = [400, 500, 600, 700];
    const requests = weights.map((weight) => document.fonts.load(`${weight} 1em "Inter"`));
    return Promise.allSettled(requests).then(() => document.fonts.ready);
  }

  function cloneWidgets(list = state.widgets) {
    return list.map((w) => ({ ...w }));
  }

  function getWidgetDef(id) {
    return WIDGETS.find((w) => w.id === id);
  }

  function formatHourLabel(hour) {
    const period = hour >= 12 ? "p" : "a";
    const normalized = hour % 12 === 0 ? 12 : hour % 12;
    return `${normalized}${period}`;
  }

  function getMonthMeta(date) {
    const year = date.getFullYear();
    const month = date.getMonth();
    const first = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const offset = (first.getDay() + 6) % 7;
    return { year, month, daysInMonth, offset };
  }

  function buildMonthCalendar(date, variant = "full") {
    const wrapper = document.createElement("div");
    wrapper.className = variant === "mini" ? "calendar mini" : "calendar";

    const header = document.createElement("div");
    header.className = "calendar-header";
    header.textContent = date.toLocaleDateString("en-US", {
      month: variant === "mini" ? "short" : "long",
      year: "numeric",
    });
    wrapper.appendChild(header);

    const labels = document.createElement("div");
    labels.className = "calendar-labels";
    WEEKDAY_LABELS.forEach((label) => {
      const cell = document.createElement("div");
      cell.className = "calendar-label";
      cell.textContent = label;
      labels.appendChild(cell);
    });
    wrapper.appendChild(labels);

    const grid = document.createElement("div");
    grid.className = "calendar-grid";
    const { daysInMonth, offset } = getMonthMeta(date);
    const totalCells = 42;
    for (let i = 0; i < totalCells; i += 1) {
      const cell = document.createElement("div");
      cell.className = "calendar-cell";
      const day = i - offset + 1;
      if (day < 1 || day > daysInMonth) {
        cell.classList.add("empty");
      } else {
        cell.textContent = String(day);
      }
      grid.appendChild(cell);
    }
    wrapper.appendChild(grid);
    return wrapper;
  }

  function buildCurrentDate(widget) {
    const body = document.createElement("div");
    body.className = "date-display";
    const now = new Date();
    const weekday = now.toLocaleDateString("en-US", { weekday: "short" });
    const month = now.toLocaleDateString("en-US", { month: "short" });
    const day = now.getDate();
    const year = now.getFullYear();

    if (widget.height <= 2) {
      const single = document.createElement("div");
      single.className = "date-single";
      single.textContent = `${weekday} ${month} ${day}, ${year}`;
      body.appendChild(single);
      return body;
    }

    const weekdayEl = document.createElement("div");
    weekdayEl.className = "date-weekday";
    weekdayEl.textContent = weekday;

    const main = document.createElement("div");
    main.className = "date-main";
    const monthSpan = document.createElement("span");
    monthSpan.textContent = month;
    const daySpan = document.createElement("span");
    daySpan.className = "date-day";
    daySpan.textContent = String(day);
    const yearSpan = document.createElement("span");
    yearSpan.textContent = String(year);
    main.append(monthSpan, " ", daySpan, ", ", yearSpan);

    body.append(weekdayEl, main);
    return body;
  }

  function buildNotesSurface() {
    const surface = document.createElement("div");
    surface.className = "notes-surface";
    return surface;
  }

  function buildTodoList(lineCount) {
    const list = document.createElement("div");
    list.className = "todo-list";
    for (let i = 0; i < lineCount; i += 1) {
      const row = document.createElement("div");
      row.className = "todo-row";
      const box = document.createElement("span");
      box.className = "todo-box";
      const line = document.createElement("span");
      line.className = "todo-line";
      row.append(box, line);
      list.appendChild(row);
    }
    return list;
  }

  function buildSchedule(lines) {
    const schedule = document.createElement("div");
    schedule.className = "schedule-list";
    const startHour = 8;
    for (let i = 0; i < lines; i += 1) {
      const hour = startHour + i;
      const row = document.createElement("div");
      row.className = "schedule-row";
      const time = document.createElement("span");
      time.className = "schedule-time";
      time.textContent = formatHourLabel(hour);
      const slot = document.createElement("span");
      slot.className = "schedule-line";
      row.append(time, slot);
      schedule.appendChild(row);
    }
    return schedule;
  }

  function buildHabitTracker(rows) {
    const table = document.createElement("div");
    table.className = "habit-table";
    const empty = document.createElement("div");
    empty.className = "habit-head";
    table.appendChild(empty);
    WEEKDAY_LABELS.forEach((label) => {
      const head = document.createElement("div");
      head.className = "habit-head";
      head.textContent = label;
      table.appendChild(head);
    });
    for (let i = 0; i < rows; i += 1) {
      const label = document.createElement("div");
      label.className = "habit-label";
      label.textContent = `Habit ${i + 1}`;
      table.appendChild(label);
      for (let j = 0; j < 7; j += 1) {
        const cell = document.createElement("div");
        cell.className = "habit-cell";
        table.appendChild(cell);
      }
    }
    return table;
  }

  function buildMoodTracker() {
    const container = document.createElement("div");
    container.className = "mood-tracker";
    const grid = document.createElement("div");
    grid.className = "mood-grid";
    const { daysInMonth, offset } = getMonthMeta(new Date());
    const totalCells = 42;
    for (let i = 0; i < totalCells; i += 1) {
      const day = i - offset + 1;
      const cell = document.createElement("div");
      cell.className = "mood-cell";
      if (day < 1 || day > daysInMonth) {
        cell.classList.add("empty");
      } else {
        const number = document.createElement("span");
        number.className = "mood-day";
        number.textContent = String(day);
        const dot = document.createElement("span");
        dot.className = `mood-dot mood-${(day % 4) + 1}`;
        cell.append(number, dot);
      }
      grid.appendChild(cell);
    }

    const legend = document.createElement("div");
    legend.className = "mood-legend";
    [
      { label: "Great", mood: "mood-1" },
      { label: "Good", mood: "mood-2" },
      { label: "Okay", mood: "mood-3" },
      { label: "Low", mood: "mood-4" },
    ].forEach((item) => {
      const entry = document.createElement("div");
      entry.className = "legend-item";
      const swatch = document.createElement("span");
      swatch.className = `legend-dot ${item.mood}`;
      const text = document.createElement("span");
      text.textContent = item.label;
      entry.append(swatch, text);
      legend.appendChild(entry);
    });

    container.append(grid, legend);
    return container;
  }

  function buildGratitudeList(lineCount) {
    const list = document.createElement("div");
    list.className = "gratitude-list";
    for (let i = 0; i < lineCount; i += 1) {
      const row = document.createElement("div");
      row.className = "gratitude-row";
      const bullet = document.createElement("span");
      bullet.className = "gratitude-bullet";
      const line = document.createElement("span");
      line.className = "gratitude-line";
      row.append(bullet, line);
      list.appendChild(row);
    }
    return list;
  }

  function buildGoalList(count) {
    const list = document.createElement("div");
    list.className = "goal-list";
    for (let i = 0; i < count; i += 1) {
      const row = document.createElement("div");
      row.className = "goal-row";
      const label = document.createElement("span");
      label.className = "goal-label";
      label.textContent = `Goal ${i + 1}`;
      const bar = document.createElement("span");
      bar.className = "goal-bar";
      const fill = document.createElement("span");
      fill.className = "goal-fill";
      bar.appendChild(fill);
      row.append(label, bar);
      list.appendChild(row);
    }
    return list;
  }

  function buildPomodoroTracker() {
    const container = document.createElement("div");
    container.className = "pomodoro-sets";
    for (let i = 0; i < 2; i += 1) {
      const row = document.createElement("div");
      row.className = "pomodoro-row";
      for (let j = 0; j < 4; j += 1) {
        const circle = document.createElement("span");
        circle.className = "pomodoro-dot";
        row.appendChild(circle);
      }
      container.appendChild(row);
    }
    return container;
  }

  function buildTimeBlocks(count) {
    const container = document.createElement("div");
    container.className = "time-blocks";
    for (let i = 0; i < count; i += 1) {
      const block = document.createElement("div");
      block.className = "time-block";
      const label = document.createElement("span");
      label.className = "time-label";
      label.textContent = `Block ${i + 1}`;
      block.appendChild(label);
      container.appendChild(block);
    }
    return container;
  }

  function fillWidgetBody(body, widget) {
    body.replaceChildren();
    switch (widget.type) {
      case "current-date":
        body.appendChild(buildCurrentDate(widget));
        break;
      case "month-calendar":
        body.appendChild(buildMonthCalendar(new Date(), "full"));
        break;
      case "three-month-calendar": {
        const container = document.createElement("div");
        container.className = "three-months";
        const base = new Date();
        for (let i = 0; i < 3; i += 1) {
          const monthDate = new Date(base.getFullYear(), base.getMonth() + i, 1);
          container.appendChild(buildMonthCalendar(monthDate, "mini"));
        }
        body.appendChild(container);
        break;
      }
      case "notes":
        body.appendChild(buildNotesSurface());
        break;
      case "todo": {
        const lines = widget.height <= 8 ? 7 : 11;
        body.appendChild(buildTodoList(lines));
        break;
      }
      case "daily-schedule":
        body.appendChild(buildSchedule(widget.height <= 12 ? 11 : 14));
        break;
      case "habit-tracker": {
        const rows = widget.height <= 6 ? 5 : 8;
        body.appendChild(buildHabitTracker(rows));
        break;
      }
      case "mood-tracker":
        body.appendChild(buildMoodTracker());
        break;
      case "gratitude-log":
        body.appendChild(buildGratitudeList(widget.height <= 5 ? 5 : 9));
        break;
      case "goal-tracker": {
        const goals = widget.height <= 6 ? 5 : 6;
        body.appendChild(buildGoalList(goals));
        break;
      }
      case "pomodoro-tracker":
        body.appendChild(buildPomodoroTracker());
        break;
      case "time-tracker": {
        const blocks = widget.width <= 12 ? 4 : 5;
        body.appendChild(buildTimeBlocks(blocks));
        break;
      }
      default:
        body.textContent = "";
        break;
    }
  }

  function renderPalette(filter = "") {
    categoriesEl.innerHTML = "";
    const term = filter.trim().toLowerCase();
    CATEGORIES.forEach((category) => {
      const container = document.createElement("div");
      container.className = "category";
      const header = document.createElement("h3");
      header.textContent = category.name;
      container.appendChild(header);

      const list = document.createElement("div");
      list.className = "widget-list";
      category.ids
        .map((id) => getWidgetDef(id))
        .filter((def) => !term || def.name.toLowerCase().includes(term) || def.id.includes(term))
        .forEach((def) => {
          const item = document.createElement("div");
          item.className = "widget-item";
          const label = document.createElement("span");
          label.textContent = def.name;
          const add = document.createElement("button");
          add.className = "add";
          add.type = "button";
          add.textContent = "+";
          add.setAttribute("aria-label", `Add ${def.name}`);
          add.addEventListener("click", () => addWidget(def.id));

          item.dataset.widgetId = def.id;
          item.appendChild(label);
          item.appendChild(add);
          list.appendChild(item);
        });
      container.appendChild(list);
      categoriesEl.appendChild(container);
    });
  }

  function createWidgetElement(widget) {
    const template = document.getElementById("widget-template");
    const el = template.content.firstElementChild.cloneNode(true);
    const def = getWidgetDef(widget.type);

    const top = GRID.padding + widget.row * GRID.cell;
    const left = GRID.padding + widget.col * GRID.cell;
    const width = widget.width * GRID.cell;
    const height = widget.height * GRID.cell;

    el.style.top = `${top}px`;
    el.style.left = `${left}px`;
    el.style.width = `${width}px`;
    el.style.height = `${height}px`;
    el.style.setProperty("--widget-cols", widget.width);
    el.style.setProperty("--widget-rows", widget.height);
    const widgetPad = widget.height <= 1 ? 4 : widget.height <= 2 ? 6 : 8;
    const controlSize = widget.height <= 1 ? 16 : widget.height <= 2 ? 18 : 22;
    el.style.setProperty("--widget-pad", `${widgetPad}px`);
    el.style.setProperty("--widget-control", `${controlSize}px`);

    el.dataset.widgetId = widget.id;
    el.dataset.widgetType = widget.type;
    el.classList.add(`widget-${widget.type}`);
    const title = el.querySelector(".widget-title");
    const label = WIDGET_LABELS[widget.type] || def?.name || widget.type;
    if (TITLELESS_WIDGETS.has(widget.type)) {
      el.classList.add("no-title");
      title.textContent = "";
    } else {
      title.textContent = label;
    }
    const body = el.querySelector(".widget-body");
    if (body) {
      fillWidgetBody(body, widget);
    }

    const remove = el.querySelector(".remove");
    remove.addEventListener("click", (e) => {
      e.stopPropagation();
      removeWidget(widget.id);
    });

    el.addEventListener("click", () => {
      state.selectedId = widget.id;
      renderSelection();
    });

    attachDrag(el, widget);

    return el;
  }

  function attachDrag(el, widget) {
    el.addEventListener("pointerdown", (event) => {
      event.preventDefault();
      const zoom = getZoomScale();
      const rect = el.getBoundingClientRect();
      const offsetX = (event.clientX - rect.left) / zoom;
      const offsetY = (event.clientY - rect.top) / zoom;
      startDrag({
        pointerId: event.pointerId,
        mode: "existing",
        widgetId: widget.id,
        widgetType: widget.type,
        width: widget.width,
        height: widget.height,
        offsetX,
        offsetY,
      });
    });
  }

  function renderWidgets() {
    pageInner.innerHTML = "";
    state.widgets.forEach((widget) => {
      const el = createWidgetElement(widget);
      pageInner.appendChild(el);
    });
    renderSelection();
  }

  function renderSelection() {
    document.querySelectorAll(".widget-instance").forEach((el) => {
      if (el.dataset.widgetId === state.selectedId) {
        el.classList.add("selected");
        el.setAttribute("aria-selected", "true");
      } else {
        el.classList.remove("selected");
        el.removeAttribute("aria-selected");
      }
    });
  }

  function fitsWithin(row, col, width, height) {
    return row >= 0 && col >= 0 && row + height <= GRID.rows && col + width <= GRID.cols;
  }

  function overlaps(widget, row, col, width, height) {
    const wRowEnd = widget.row + widget.height;
    const wColEnd = widget.col + widget.width;
    const rowEnd = row + height;
    const colEnd = col + width;
    return !(rowEnd <= widget.row || wRowEnd <= row || colEnd <= widget.col || wColEnd <= col);
  }

  function areaFree(row, col, width, height, ignoreId = null) {
    if (!fitsWithin(row, col, width, height)) return false;
    return !state.widgets.some((w) => (ignoreId && w.id === ignoreId ? false : overlaps(w, row, col, width, height)));
  }

  function findFirstAvailable(width, height) {
    for (let r = 0; r <= GRID.rows - height; r += 1) {
      for (let c = 0; c <= GRID.cols - width; c += 1) {
        if (areaFree(r, c, width, height)) {
          return { row: r, col: c };
        }
      }
    }
    return null;
  }

  function addWidget(widgetType, atRow = null, atCol = null) {
    const def = getWidgetDef(widgetType);
    if (!def) {
      showToast(`Unknown widget: ${widgetType}`);
      return false;
    }
    const [width, height] = def.defaultSize;
    let position = null;
    if (Number.isInteger(atRow) && Number.isInteger(atCol)) {
      if (!areaFree(atRow, atCol, width, height)) {
        showToast("Placement blocked or out of bounds.");
        return false;
      }
      position = { row: atRow, col: atCol };
    } else {
      position = findFirstAvailable(width, height);
    }
    if (!position) {
      showToast("No space available for this widget.");
      return false;
    }
    const before = cloneWidgets();
    const id = crypto.randomUUID();
    state.widgets.push({
      id,
      type: widgetType,
      row: position.row,
      col: position.col,
      width,
      height,
    });
    state.selectedId = id;
    recordHistory(before);
    persist();
    render();
    return true;
  }

  function removeWidget(id) {
    const before = cloneWidgets();
    const next = state.widgets.filter((w) => w.id !== id);
    if (next.length === state.widgets.length) return;
    state.widgets = next;
    state.selectedId = null;
    recordHistory(before);
    persist();
    render();
  }

  function moveWidget(id, newRow, newCol) {
    const widget = state.widgets.find((w) => w.id === id);
    if (!widget) return false;
    if (widget.row === newRow && widget.col === newCol) {
      return true;
    }
    if (!areaFree(newRow, newCol, widget.width, widget.height, id)) {
      return false;
    }
    const before = cloneWidgets();
    widget.row = newRow;
    widget.col = newCol;
    recordHistory(before);
    persist();
    render();
    return true;
  }

  function recordHistory(previousSnapshot) {
    state.history.push(previousSnapshot);
    if (state.history.length > 50) state.history.shift();
    state.future = [];
  }

  function undo() {
    if (!state.history.length) {
      showToast("Nothing to undo.");
      return;
    }
    const current = cloneWidgets();
    const previous = state.history.pop();
    state.future.push(current);
    state.widgets = previous;
    state.selectedId = null;
    render();
    persist();
  }

  function redo() {
    if (!state.future.length) {
      showToast("Nothing to redo.");
      return;
    }
    const current = cloneWidgets();
    const next = state.future.pop();
    state.history.push(current);
    state.widgets = next;
    state.selectedId = null;
    render();
    persist();
  }

  function buildLayoutPayload(widgets = state.widgets) {
    return {
      widgets: widgets.map((w) => ({
        id: w.id,
        type: w.type,
        row: w.row,
        col: w.col,
        width: w.width,
        height: w.height,
      })),
    };
  }

  function validateLayoutPayload(payload) {
    if (!payload || typeof payload !== "object") {
      return { ok: false, error: "Layout JSON must be an object." };
    }
    if (!Array.isArray(payload.widgets)) {
      return { ok: false, error: "Layout JSON must include a widgets array." };
    }

    const seenIds = new Set();
    const widgets = [];
    for (let i = 0; i < payload.widgets.length; i += 1) {
      const raw = payload.widgets[i];
      if (!raw || typeof raw !== "object") {
        return { ok: false, error: `Widget #${i + 1} is not an object.` };
      }
      const { id, type, row, col, width, height } = raw;
      if (!id || typeof id !== "string") {
        return { ok: false, error: "Each widget must include an id string." };
      }
      if (seenIds.has(id)) {
        return { ok: false, error: `Duplicate widget id: ${id}` };
      }
      seenIds.add(id);
      if (!type || typeof type !== "string") {
        return { ok: false, error: `Widget ${id} is missing a type.` };
      }
      const def = getWidgetDef(type);
      if (!def) {
        return { ok: false, error: `Unknown widget type: ${type}` };
      }
      if (![row, col, width, height].every(Number.isInteger)) {
        return { ok: false, error: `Widget ${id} has non-integer position or size.` };
      }
      if (width <= 0 || height <= 0) {
        return { ok: false, error: `Widget ${id} must have a positive size.` };
      }
      const [defWidth, defHeight] = def.defaultSize;
      if (width !== defWidth || height !== defHeight) {
        return { ok: false, error: `Widget ${id} size is invalid for ${type}.` };
      }
      if (!fitsWithin(row, col, width, height)) {
        return { ok: false, error: `Widget ${id} placement is out of bounds.` };
      }
      const collision = widgets.some((existing) => overlaps(existing, row, col, width, height));
      if (collision) {
        return { ok: false, error: "Widgets overlap in the provided layout." };
      }
      widgets.push({ id, type, row, col, width, height });
    }
    return { ok: true, widgets };
  }

  function persist() {
    const payload = buildLayoutPayload();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }

  function hydrate() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw);
      const validation = validateLayoutPayload(parsed);
      if (!validation.ok) {
        showToast(validation.error);
        return;
      }
      state.widgets = validation.widgets;
    } catch (err) {
      showToast("Stored layout could not be loaded.");
    }
  }

  function exportLayout() {
    const payload = buildLayoutPayload();
    const validation = validateLayoutPayload(payload);
    if (!validation.ok) {
      showToast(validation.error || "Layout could not be exported.");
      return;
    }
    const payloadJson = JSON.stringify({ widgets: validation.widgets }, null, 2);
    const blob = new Blob([payloadJson], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "layout.json";
    a.click();
    URL.revokeObjectURL(url);
    showToast("Exported layout to JSON.");
  }

  function importLayoutFile() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json";
    input.addEventListener("change", () => {
      const file = input.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        const text = typeof reader.result === "string" ? reader.result : "";
        try {
          const parsed = JSON.parse(text);
          const validation = validateLayoutPayload(parsed);
          if (!validation.ok) {
            showToast(validation.error);
            return;
          }
          const before = cloneWidgets();
          state.widgets = validation.widgets;
          state.selectedId = null;
          recordHistory(before);
          persist();
          render();
          showToast("Imported layout.");
        } catch (err) {
          showToast("Invalid JSON format.");
        }
      };
      reader.readAsText(file);
    });
    input.click();
  }

  async function exportPdf() {
    if (!(window.html2canvas && window.jspdf?.jsPDF)) {
      showToast("PDF export requires html2canvas and jsPDF on the page.");
      return;
    }
    try {
      await ensureFontsReadyForPdf();
      const { imgData, width, height } = await renderPageToImage();
      const { jsPDF } = window.jspdf;
      const pdf = new jsPDF({
        orientation: "p",
        unit: "px",
        format: [width, height],
        compress: true,
      });
      pdf.addImage(imgData, "PNG", 0, 0, width, height, undefined, "FAST");
      pdf.save("bullet-journal.pdf");
    } catch (err) {
      console.error("PDF export failed", err);
      showToast("PDF export failed. Please try again.");
    }
  }

  async function ensureFontsReadyForPdf() {
    // Ensure embedded fonts are loaded before capturing for PDF parity.
    if (fontsReady) {
      await fontsReady.catch(() => {});
    } else if (document.fonts?.ready) {
      await document.fonts.ready;
    }
  }

  async function renderPageToImage() {
    const style = window.getComputedStyle(pageInner);
    const exportWidth = Math.round(Number.parseFloat(style.width)) || GRID.totalWidth;
    const exportHeight = Math.round(Number.parseFloat(style.height)) || GRID.totalHeight;
    const canvas = await window.html2canvas(pageInner, {
      backgroundColor: "#ffffff",
      scale: PDF_EXPORT_SCALE,
      width: exportWidth,
      height: exportHeight,
      windowWidth: exportWidth,
      windowHeight: exportHeight,
      useCORS: true,
      onclone: (doc) => {
        const clonePage = doc.getElementById("page-inner");
        if (clonePage) {
          // Always capture the un-zoomed canvas for predictable PDF sizing.
          clonePage.style.transform = "scale(1)";
          clonePage.style.transformOrigin = "top left";
        }
      },
    });
    return { imgData: canvas.toDataURL("image/png"), width: exportWidth, height: exportHeight };
  }

  function updateStatusLine() {
    if (statusLine) {
      const gridStatus = state.showGrid ? "Grid on" : "Grid off";
      statusLine.textContent = `US Letter · Portrait · ${gridStatus}`;
    }
  }

  function toggleGrid() {
    state.showGrid = !state.showGrid;
    pageInner.classList.toggle("hide-grid", !state.showGrid);
    updateStatusLine();
  }

  function setZoom(value) {
    const next = Math.min(Math.max(value, 0.5), 1.5);
    state.zoom = next;
    pageInner.style.transform = `scale(${next})`;
    pageInner.style.transformOrigin = "top left";
  }

  function resetPage() {
    state.widgets = [];
    state.history = [];
    state.future = [];
    state.selectedId = null;
    persist();
    render();
  }

  function handleHeaderAction(action) {
    switch (action) {
      case "new-page":
        resetPage();
        break;
      case "undo":
        undo();
        break;
      case "redo":
        redo();
        break;
      case "import-json":
        importLayoutFile();
        break;
      case "export-json":
        exportLayout();
        break;
      case "export-pdf":
        exportPdf();
        break;
      case "toggle-grid":
        toggleGrid();
        break;
      case "zoom-in":
        setZoom(state.zoom + 0.1);
        break;
      case "zoom-out":
        setZoom(state.zoom - 0.1);
        break;
      default:
        break;
    }
  }

  function handleSearch(event) {
    renderPalette(event.target.value);
  }

  function showToast(message) {
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = message;
    toastContainer.appendChild(toast);
    setTimeout(() => toast.classList.add("fade"), 2800);
    setTimeout(() => toast.remove(), 3200);
  }

  function ensureGhost() {
    if (!ghostEl) {
      ghostEl = document.createElement("div");
      ghostEl.className = "widget-ghost";
      pageInner.appendChild(ghostEl);
    }
    return ghostEl;
  }

  function clearGhost() {
    if (ghostEl) {
      ghostEl.remove();
      ghostEl = null;
    }
  }

  function startDrag({ pointerId, mode, widgetId, widgetType, width, height, offsetX, offsetY }) {
    if (state.drag) return;
    state.drag = {
      pointerId,
      mode,
      widgetId,
      widgetType,
      width,
      height,
      offsetX,
      offsetY,
      valid: false,
      targetRow: null,
      targetCol: null,
    };
    document.addEventListener("pointermove", handlePointerMove);
    document.addEventListener("pointerup", handlePointerUp);
    document.addEventListener("pointercancel", handlePointerCancel);
    ensureGhost();
  }

  function handlePointerMove(event) {
    if (!state.drag || state.drag.pointerId !== event.pointerId) return;
    const zoom = getZoomScale();
    const rect = pageInner.getBoundingClientRect();
    const x = (event.clientX - rect.left) / zoom - state.drag.offsetX;
    const y = (event.clientY - rect.top) / zoom - state.drag.offsetY;
    const col = Math.round((x - GRID.padding) / GRID.cell);
    const row = Math.round((y - GRID.padding) / GRID.cell);
    if (!Number.isFinite(row) || !Number.isFinite(col)) return;
    const valid =
      row >= 0 &&
      col >= 0 &&
      row + state.drag.height <= GRID.rows &&
      col + state.drag.width <= GRID.cols &&
      areaFree(row, col, state.drag.width, state.drag.height, state.drag.mode === "existing" ? state.drag.widgetId : null);
    state.drag.valid = valid;
    state.drag.targetRow = row;
    state.drag.targetCol = col;

    const ghost = ensureGhost();
    ghost.style.width = `${state.drag.width * GRID.cell}px`;
    ghost.style.height = `${state.drag.height * GRID.cell}px`;
    ghost.style.left = `${GRID.padding + col * GRID.cell}px`;
    ghost.style.top = `${GRID.padding + row * GRID.cell}px`;
    ghost.classList.toggle("invalid", !valid);
  }

  function finishDrag(apply) {
    if (!state.drag) return;
    const drag = state.drag;
    if (apply) {
      if (drag.valid && Number.isInteger(drag.targetRow) && Number.isInteger(drag.targetCol)) {
        if (drag.mode === "existing") {
          const moved = moveWidget(drag.widgetId, drag.targetRow, drag.targetCol);
          if (!moved) showToast("Cannot move: blocked or out of bounds.");
        } else if (drag.mode === "palette") {
          const placed = addWidget(drag.widgetType, drag.targetRow, drag.targetCol);
          if (!placed) showToast("Cannot place widget here.");
        }
      } else if (drag.mode === "existing") {
        showToast("Cannot move: blocked or out of bounds.");
      } else {
        showToast("Cannot place widget here.");
      }
    }
    clearGhost();
    state.drag = null;
    document.removeEventListener("pointermove", handlePointerMove);
    document.removeEventListener("pointerup", handlePointerUp);
    document.removeEventListener("pointercancel", handlePointerCancel);
  }

  function getZoomScale() {
    const rect = pageInner.getBoundingClientRect();
    const unscaledWidth = pageInner.offsetWidth || GRID.totalWidth;
    const scale = rect.width / unscaledWidth;
    return Number.isFinite(scale) && scale > 0 ? scale : 1;
  }

  function handlePointerUp(event) {
    if (!state.drag || state.drag.pointerId !== event.pointerId) return;
    finishDrag(true);
  }

  function handlePointerCancel(event) {
    if (!state.drag || state.drag.pointerId !== event.pointerId) return;
    finishDrag(false);
  }

  function render() {
    renderPalette();
    renderWidgets();
  }

  function wireEvents() {
    document.querySelectorAll("[data-action]").forEach((btn) => {
      btn.addEventListener("click", () => handleHeaderAction(btn.dataset.action));
    });
    document.querySelector(".search").addEventListener("input", handleSearch);
    pageInner.addEventListener("click", (event) => {
      if (event.target === pageInner) {
        state.selectedId = null;
        renderSelection();
      }
    });

    categoriesEl.addEventListener("pointerdown", (event) => {
      if (event.button !== 0) return;
      const target = event.target.closest(".widget-item");
      if (!target) return;
      if (event.target.closest(".add")) return;
      const widgetId = target.dataset.widgetId;
      const def = getWidgetDef(widgetId);
      if (!def) return;
      event.preventDefault();
      startDrag({
        pointerId: event.pointerId,
        mode: "palette",
        widgetType: widgetId,
        width: def.defaultSize[0],
        height: def.defaultSize[1],
        offsetX: def.defaultSize[0] * GRID.cell * 0.5,
        offsetY: def.defaultSize[1] * GRID.cell * 0.5,
      });
    });
  }

  async function init() {
    await fontsReady.catch(() => {});
    hydrate();
    render();
    setZoom(state.zoom);
    updateStatusLine();
    wireEvents();
  }

  init();
})();
