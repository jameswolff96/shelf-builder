# Warehouse Label Editor

A self-contained, interactive tool for designing, labeling, and exporting shelf layouts in a warehouse setting. Built with vanilla HTML, CSS, and JavaScript. Designed for use in-browser or packaged as a standalone Electron app.

---

## Features

- 🛠 **Dynamic Shelf & Spot Creation**  
  Add, remove, and reorder shelves and labeled spots interactively.

- 🎨 **Customizable Spot Sizes & Colors**  
  Configure spot widths (in inches) and assign visual color cues.

- 🌓 **Dark Mode Support**  
  Toggle between light and dark themes.

- 💾 **Persistent State**  
  All layout and configuration data is saved to `localStorage` and restored automatically.

- 📦 **Import/Export JSON**  
  Export current bin layout to a JSON file. Reimport to restore exact state.

- 🖨 **Print-Ready Output**  
  Optimized for printing on 8.5"x11" paper. Automatically switches to light theme.

- 🔄 **Drag-and-Drop Spot Reordering**  
  Move spots between shelves; spot numbering updates automatically.

- 🧰 **Electron-Ready**  
  Can be built into a standalone `.exe` using Electron and Docker.

---

## Getting Started

### 🖥 In Browser (local HTML)
1. Clone the repository.
2. Open `index.html` in any modern browser.

### 💻 As a Desktop App (Electron)
1. Install dependencies:
```bash
npm install
```
2. Run the app:
```bash
npm start
```
3. To build a portable `.exe`:
```bash
npm run build
```
_You can build on Linux using Docker (see below)._

---

## JSON Format

```json
{
  "version": 1,
  "aisle": "A",
  "bin": "5",
  "theme": "dark",
  "shelfWidthFt": 4,
  "spotSizeConfig": [
    { "size": 12, "color": "#e0f7fa" },
    { "size": 18, "color": "#ffe082" }
  ],
  "shelves": [
    {
      "name": "A",
      "spots": [
        { "item": "Item A", "size": 12 },
        { "item": "Item B", "size": 18 }
      ]
    }
  ]
}
```

---

## Building with Docker

To build a portable `.exe` from Linux run `build-win.sh`

---

## Credits
- Font Awesome for icons
- Electron for app packaging
- Docker for cross-platform build tooling

---

## License
MIT License

