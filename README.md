# Shelf Builder

A self-contained, interactive tool for designing, and printing shelf layouts in a warehouse setting. Built with HTML, CSS, and JavaScript.

---

## Features

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

## Credits
- Font Awesome for icons
- Electron for app packaging
- Docker for cross-platform build tooling

---

## License
MIT License

